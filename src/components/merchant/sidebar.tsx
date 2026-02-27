'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    CreditCard,
    Settings,
    Store,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';

const navItems = [
    { label: 'Overview', href: '/merchant', icon: LayoutDashboard },
    { label: 'Products', href: '/merchant/products', icon: Package },
    { label: 'Orders', href: '/merchant/orders', icon: ShoppingCart },
    { label: 'Payments', href: '/merchant/payments', icon: CreditCard },
    { label: 'Settings', href: '/merchant/settings', icon: Settings },
];

interface MerchantSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function MerchantSidebar({ isOpen, onClose }: MerchantSidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Close mobile menu when pathname changes
    useEffect(() => {
        if (isOpen && onClose) {
            onClose();
        }
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col bg-[#212D67] text-white transition-all duration-300 ease-in-out min-h-screen lg:static lg:translate-x-0',
                    collapsed ? 'w-fit lg:w-[72px]' : 'w-64',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                    !isOpen && 'lg:flex hidden'
                )}
            >
                {/* Logo & Close Button */}
                <div className={cn('flex items-center justify-between gap-3 px-4 py-5 border-b border-white/10', collapsed && 'justify-center')}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#306CFE] flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        {!collapsed && (
                            <div>
                                <p className="font-bold text-white text-sm leading-tight">SaveGoal</p>
                                <p className="text-[10px] text-blue-300 font-medium">Merchant Portal</p>
                            </div>
                        )}
                    </div>
                    {isOpen && (
                        <button
                            onClick={onClose}
                            className="p-2 text-blue-300 hover:text-white lg:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-2 space-y-1">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href || (href !== '/merchant' && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                title={collapsed ? label : undefined}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                                    isActive
                                        ? 'bg-[#306CFE] text-white shadow-md shadow-blue-900/30'
                                        : 'text-blue-200 hover:bg-white/10 hover:text-white',
                                    collapsed && 'justify-center'
                                )}
                            >
                                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-blue-300 group-hover:text-white')} />
                                {!collapsed && <span>{label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="border-t border-white/10 p-3 space-y-1">
                    {!collapsed && (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                M
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">My Store</p>
                                <p className="text-[10px] text-blue-300 truncate">merchant@store.com</p>
                            </div>
                            <Bell className="w-4 h-4 text-blue-300 flex-shrink-0" />
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn(
                            'hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium',
                            collapsed && 'justify-center'
                        )}
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5" /><span>Collapse Sidebar</span></>}
                    </button>
                    <button className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200 text-sm font-medium', collapsed && 'justify-center')}>
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
