'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { useOrders, useOrderStats } from '@/src/domains/orders/orders.hooks';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Button } from '@/src/components/ui/button';

function formatCurrency(amount: number, currency = 'GHS') {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-GH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}

function StatusPill({ value }: { value: string }) {
    const tone = value === 'FULFILLED'
        ? 'bg-emerald-50 text-emerald-700'
        : value === 'CANCELLED'
            ? 'bg-red-50 text-red-700'
            : 'bg-amber-50 text-amber-700';

    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
}

export default function MerchantOrdersPage() {
    const { orders, isLoading, error, refetch } = useOrders();
    const { stats, isLoading: statsLoading } = useOrderStats();
    const [query, setQuery] = useState('');

    const filteredOrders = useMemo(() => {
        const search = query.trim().toLowerCase();
        if (!search) {
            return orders;
        }

        return orders.filter((order) =>
            order.customerName.toLowerCase().includes(search) ||
            order.productName.toLowerCase().includes(search) ||
            order.id.toLowerCase().includes(search) ||
            (order.reference || '').toLowerCase().includes(search)
        );
    }, [orders, query]);

    if (error) {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-bold text-slate-900">Orders unavailable</h1>
                <p className="mt-2 text-sm text-slate-500">{error}</p>
                <Button className="mt-4 bg-[#1A53C8] text-white hover:bg-[#1542a1]" onClick={refetch}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Merchant Orders</h1>
                    <p className="text-sm text-slate-500">Every row here comes from a real redeemed merchant goal.</p>
                </div>
                <div className="relative w-full lg:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by customer, product, reference..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-[#1A53C8]"
                    />
                </div>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statsLoading || !stats ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-28 rounded-2xl" />
                    ))
                ) : (
                    <>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total Orders</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Processing</p>
                            <p className="mt-2 text-3xl font-bold text-amber-700">{stats.processing}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Fulfilled</p>
                            <p className="mt-2 text-3xl font-bold text-emerald-700">{stats.fulfilled}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Cancelled</p>
                            <p className="mt-2 text-3xl font-bold text-red-700">{stats.cancelled}</p>
                        </div>
                    </>
                )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-900">Order Feed</h2>
                    <p className="text-sm text-slate-500">Latest redemption-backed merchant orders</p>
                </div>

                {isLoading ? (
                    <div className="space-y-3 p-6">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} className="h-20 rounded-2xl" />
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        No orders match your search yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/merchant/orders/${order.id}`}
                                className="flex flex-col gap-4 p-6 transition-colors hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div className="min-w-0 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-slate-900">{order.productName}</p>
                                        <StatusPill value={order.orderStatus} />
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {order.customerName} • {order.reference || order.id}
                                    </p>
                                    <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="flex items-center justify-between gap-4 lg:min-w-[220px]">
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{formatCurrency(order.amount, order.currency)}</p>
                                        <p className="text-sm text-slate-500">{order.paymentStatus}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
