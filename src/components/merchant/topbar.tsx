'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Search,
    ChevronDown,
    LogOut,
    User,
    Store,
    CreditCard,
    Menu,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/contexts/AuthContext';
import { NotificationBell } from '@/src/components/shared/NotificationBell';
import type { MerchantUser, User as AuthUser } from '@/src/domains/auth/auth.types';

interface MerchantTopbarProps {
    title: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

function getInitials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || 'M';
}

function isMerchantUser(user: AuthUser | MerchantUser | null): user is MerchantUser {
    return Boolean(user && user.role === "MERCHANT");
}

export function MerchantTopbar({ title, subtitle, onMenuClick }: MerchantTopbarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const merchantUser = isMerchantUser(user) ? user : null;
    const storeName = merchantUser?.storeName || "My Store";
    const ownerName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || "Merchant User";
    const userEmail = user?.email || "";
    const initials = getInitials(storeName);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-4 shadow-sm md:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="rounded-xl p-2 -ml-2 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="min-w-0">
                    <h1 className="truncate text-base font-bold leading-tight text-slate-900 md:text-lg">{title}</h1>
                    {subtitle ? <p className="truncate text-[10px] text-slate-500 md:text-xs">{subtitle}</p> : null}
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-all focus-within:border-[#1A53C8] focus-within:ring-2 focus-within:ring-[#1A53C8]/20 lg:flex">
                    <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                </div>

                <NotificationBell variant="merchant" />

                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={cn(
                            "flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-colors md:px-3 md:py-2",
                            isProfileOpen
                                ? "border-slate-300 bg-slate-100"
                                : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                        )}
                    >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-[10px] font-bold text-white shadow-sm">
                            {initials}
                        </div>
                        <span className="hidden text-sm font-medium text-slate-700 sm:block">{storeName}</span>
                        <ChevronDown
                            className={cn(
                                "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                                isProfileOpen && "rotate-180"
                            )}
                        />
                    </button>

                    {isProfileOpen ? (
                        <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                            <div className="border-b border-slate-100 p-4">
                                <p className="text-sm font-semibold text-slate-900">{storeName}</p>
                                <p className="mt-0.5 text-[10px] text-slate-500">{ownerName}</p>
                                {userEmail ? <p className="truncate text-[10px] text-slate-500">{userEmail}</p> : null}
                            </div>
                            <div className="space-y-1 p-2">
                                <Link href="/merchant/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                                    <User className="h-4 w-4 text-slate-400" />
                                    Profile
                                </Link>
                                <Link href="/merchant/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                                    <Store className="h-4 w-4 text-slate-400" />
                                    Store Settings
                                </Link>
                                <Link href="/merchant/payments" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                    Billing
                                </Link>
                            </div>
                            <div className="border-t border-slate-100 p-2">
                                <button
                                    onClick={() => void logout()}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
