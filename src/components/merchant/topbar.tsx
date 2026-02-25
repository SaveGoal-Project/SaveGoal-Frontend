'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Bell,
    Search,
    ChevronDown,
    LogOut,
    User,
    Settings,
    Store,
    CreditCard,
    Menu,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

interface MerchantTopbarProps {
    title: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

export function MerchantTopbar({ title, subtitle, onMenuClick }: MerchantTopbarProps) {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const notifications = [
        {
            id: 1,
            title: 'New Order Received',
            message: 'Order #ORD-0091 from Kwame Adu',
            time: '2 min ago',
            read: false,
            type: 'order'
        },
        {
            id: 2,
            title: 'Low Stock Alert',
            message: 'Sony PlayStation 5 is running low (5 left)',
            time: '1 hour ago',
            read: false,
            type: 'alert'
        },
        {
            id: 3,
            title: 'Payout Processed',
            message: 'GH¢ 12,000.00 has been sent to your account',
            time: 'Yesterday',
            read: true,
            type: 'info'
        }
    ];

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-xl lg:hidden transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Title */}
                <div className="min-w-0">
                    <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight truncate">{title}</h1>
                    {subtitle && <p className="text-[10px] md:text-xs text-slate-500 truncate">{subtitle}</p>}
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 md:gap-3">
                {/* Search - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-56 focus-within:ring-2 focus-within:ring-[#1A53C8]/20 focus-within:border-[#1A53C8] transition-all">
                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
                    />
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={cn(
                            "relative flex items-center justify-center w-9 h-9 rounded-xl border transition-colors",
                            isNotificationsOpen
                                ? "bg-slate-100 border-slate-300"
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        <Bell className="w-4 h-4 text-slate-600" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1A53C8] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">3</span>
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900">Notifications</h3>
                                <button className="text-xs text-[#1A53C8] hover:underline">Mark all read</button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className={cn(
                                        "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3",
                                        !notif.read && "bg-blue-50/30"
                                    )}>
                                        <div className={cn(
                                            "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                                            notif.read ? "bg-slate-200" : "bg-[#1A53C8]"
                                        )} />
                                        <div>
                                            <p className={cn("text-sm text-slate-900", !notif.read && "font-semibold")}>{notif.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                            <p className="text-[10px] text-slate-400 mt-1.5">{notif.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={cn(
                            "flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-xl border transition-colors",
                            isProfileOpen
                                ? "bg-slate-100 border-slate-300"
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0">
                            M
                        </div>
                        <span className="text-sm font-medium text-slate-700 hidden sm:block">My Store</span>
                        <ChevronDown className={cn(
                            "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
                            isProfileOpen && "rotate-180"
                        )} />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-slate-100">
                                <p className="font-semibold text-slate-900 text-sm">My Store</p>
                                <p className="text-[10px] text-slate-500 truncate">merchant@unique-store.com</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <Link href="/merchant/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                    <User className="w-4 h-4 text-slate-400" />
                                    Profile
                                </Link>
                                <Link href="/merchant/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                    <Store className="w-4 h-4 text-slate-400" />
                                    Store Settings
                                </Link>
                                <Link href="/merchant/payments" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                    <CreditCard className="w-4 h-4 text-slate-400" />
                                    Billing
                                </Link>
                            </div>
                            <div className="p-2 border-t border-slate-100">
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
