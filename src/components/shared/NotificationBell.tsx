"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useNotifications } from "@/src/domains/notifications/notifications.hooks";
import { cn } from "@/src/lib/utils";

type NotificationBellVariant = "consumer" | "merchant" | "admin";

interface NotificationBellProps {
    variant?: NotificationBellVariant;
    limit?: number;
    viewAllHref?: string;
}

function formatRelativeTime(value: string): string {
    const date = new Date(value);
    const diffMs = date.getTime() - Date.now();
    const diffMinutes = Math.round(diffMs / 60000);
    const absMinutes = Math.abs(diffMinutes);

    if (absMinutes < 1) return "Just now";
    if (absMinutes < 60) {
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(diffMinutes, "minute");
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(diffHours, "hour");
    }

    const diffDays = Math.round(diffHours / 24);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(diffDays, "day");
}

export function NotificationBell({
    variant = "consumer",
    limit = 8,
    viewAllHref,
}: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const {
        notifications,
        unreadCount,
        isLoading,
        error,
        refetch,
        markAsRead,
        markAllAsRead,
    } = useNotifications(limit);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            refetch();
        }
    }, [isOpen, refetch]);

    const styles = useMemo(() => {
        if (variant === "merchant") {
            return {
                button: cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
                    isOpen
                        ? "bg-slate-100 border-slate-300"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                ),
                icon: "h-4 w-4 text-slate-600",
                badge: "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1A53C8] px-1 text-[9px] font-bold text-white shadow-sm",
                panel: "absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl md:w-80",
                title: "text-slate-900",
                subtitle: "text-slate-500",
                item: "hover:bg-slate-50",
                unreadItem: "bg-blue-50/30",
                dotRead: "bg-slate-200",
                dotUnread: "bg-[#1A53C8]",
            };
        }

        if (variant === "admin") {
            return {
                button: "relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100",
                icon: "h-5 w-5",
                badge: "absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#0754FF] px-1 text-[10px] font-bold text-white",
                panel: "absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl",
                title: "text-gray-900",
                subtitle: "text-gray-500",
                item: "hover:bg-gray-50",
                unreadItem: "bg-blue-50/40",
                dotRead: "bg-gray-200",
                dotUnread: "bg-[#0754FF]",
            };
        }

        return {
            button: "relative p-2 text-gray-600 transition-colors hover:text-[#1a53c8]",
            icon: "h-5 w-5",
            badge: "absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#3d4a99] px-1 text-[10px] font-bold text-white leading-none",
            panel: "absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white py-3 shadow-lg md:w-80",
            title: "text-gray-900",
            subtitle: "text-gray-500",
            item: "hover:bg-gray-50",
            unreadItem: "bg-blue-50/40",
            dotRead: "bg-gray-200",
            dotUnread: "bg-[#3d4a99]",
        };
    }, [isOpen, variant]);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen((current) => !current)}
                className={styles.button}
                aria-label="Notifications"
            >
                <Bell className={styles.icon} />
                {unreadCount > 0 ? <span className={styles.badge}>{unreadCount > 99 ? "99+" : unreadCount}</span> : null}
            </button>

            {isOpen ? (
                <div className={styles.panel}>
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-3 pt-4">
                        <div>
                            <p className={cn("text-sm font-semibold", styles.title)}>Notifications</p>
                            <p className={cn("text-xs", styles.subtitle)}>
                                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {viewAllHref ? (
                                <Link
                                    href={viewAllHref}
                                    className="text-xs font-medium text-[#1A53C8] hover:underline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    View all
                                </Link>
                            ) : null}
                            <button
                                onClick={() => void markAllAsRead()}
                                className="text-xs font-medium text-[#1A53C8] hover:underline disabled:text-slate-400"
                                disabled={unreadCount === 0}
                            >
                                Mark all read
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-slate-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading notifications...
                        </div>
                    ) : error ? (
                        <div className="px-4 py-6 text-sm text-red-600">{error}</div>
                    ) : notifications.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                            <Bell className="mx-auto mb-2 h-8 w-8 text-gray-200" />
                            <p className={cn("text-sm", styles.subtitle)}>No notifications yet</p>
                        </div>
                    ) : (
                        <div className="max-h-[320px] overflow-y-auto">
                            {notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => void markAsRead(notification.id)}
                                    className={cn(
                                        "flex w-full gap-3 border-b border-slate-50 px-4 py-4 text-left transition-colors last:border-b-0",
                                        styles.item,
                                        !notification.isRead && styles.unreadItem
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "mt-1.5 h-2 w-2 flex-shrink-0 rounded-full",
                                            notification.isRead ? styles.dotRead : styles.dotUnread
                                        )}
                                    />
                                    <div className="min-w-0">
                                        <p className={cn("text-sm text-slate-900", !notification.isRead && "font-semibold")}>
                                            {notification.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                            {notification.message}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wide text-slate-400">
                                            <span>{notification.category.replace("_", " ")}</span>
                                            <span>&bull;</span>
                                            <span>{formatRelativeTime(notification.createdAt)}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {!isLoading && notifications.length > 0 ? (
                        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <CheckCheck className="h-3.5 w-3.5" />
                                Click any item to mark it as read
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
