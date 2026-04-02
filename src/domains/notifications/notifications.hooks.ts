"use client";

import { useCallback, useEffect, useState } from "react";
import {
    fetchNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "./notifications.api";
import type { AppNotification } from "./notifications.types";

export function useNotifications(limit = 8) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = useCallback(async () => {
        setError(null);

        try {
            const result = await fetchNotifications({ limit });
            setNotifications(result.notifications);
            setUnreadCount(result.unreadCount);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load notifications");
        } finally {
            setIsLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                loadNotifications();
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [loadNotifications]);

    const markAsRead = useCallback(
        async (notificationId: string) => {
            const target = notifications.find((notification) => notification.id === notificationId);
            if (!target || target.isRead) {
                return;
            }

            setNotifications((current) =>
                current.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
            setUnreadCount((current) => Math.max(0, current - 1));

            try {
                await markNotificationRead(notificationId);
            } catch (err) {
                setNotifications((current) =>
                    current.map((notification) =>
                        notification.id === notificationId
                            ? { ...notification, isRead: false }
                            : notification
                    )
                );
                setUnreadCount((current) => current + 1);
                setError(err instanceof Error ? err.message : "Failed to update notification");
            }
        },
        [notifications]
    );

    const markAllAsRead = useCallback(async () => {
        if (unreadCount === 0) {
            return;
        }

        const previousNotifications = notifications;
        const previousUnreadCount = unreadCount;

        setNotifications((current) =>
            current.map((notification) => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);

        try {
            await markAllNotificationsRead();
        } catch (err) {
            setNotifications(previousNotifications);
            setUnreadCount(previousUnreadCount);
            setError(err instanceof Error ? err.message : "Failed to update notifications");
        }
    }, [notifications, unreadCount]);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        refetch: loadNotifications,
        markAsRead,
        markAllAsRead,
    };
}
