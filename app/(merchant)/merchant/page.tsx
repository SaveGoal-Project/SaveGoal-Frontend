'use client';

import type { ElementType } from 'react';
import Link from 'next/link';
import { ArrowRight, CreditCard, Package, ShoppingBag, Wallet } from 'lucide-react';
import { useMerchantDashboard, useMerchantProfile } from '@/src/domains/merchant/merchant.hooks';
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

function StatCard({
    title,
    value,
    hint,
    icon: Icon,
}: {
    title: string;
    value: string;
    hint: string;
    icon: ElementType;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                    <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-slate-500">{hint}</p>
            </div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
    );
}

function RevenueChart({ points }: { points: Array<{ label: string; amount: number }> }) {
    const max = Math.max(...points.map((point) => point.amount), 1);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Revenue Trend</h2>
                    <p className="text-sm text-slate-500">Last 6 months of redeemed merchant sales</p>
                </div>
                <Link href="/merchant/orders" className="text-sm font-semibold text-[#1A53C8]">
                    View orders
                </Link>
            </div>
            <div className="flex h-64 items-end gap-3">
                {points.map((point) => (
                    <div key={point.label} className="flex flex-1 flex-col items-center gap-3">
                        <div className="flex h-full w-full items-end">
                            <div
                                className="w-full rounded-t-xl bg-gradient-to-t from-[#1A53C8] to-[#5C87F5]"
                                style={{ height: `${Math.max((point.amount / max) * 100, point.amount > 0 ? 12 : 4)}%` }}
                                title={`${point.label}: ${formatCurrency(point.amount)}`}
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-semibold text-slate-700">{point.label}</p>
                            <p className="text-[11px] text-slate-400">{formatCurrency(point.amount)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MerchantDashboardPage() {
    const { data, isLoading, error, refetch } = useMerchantDashboard();
    const { profile } = useMerchantProfile();

    if (error) {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-bold text-slate-900">Merchant dashboard unavailable</h1>
                <p className="mt-2 text-sm text-slate-500">{error}</p>
                <Button className="mt-4 bg-[#1A53C8] text-white hover:bg-[#1542a1]" onClick={refetch}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section className="rounded-3xl bg-gradient-to-r from-[#1B2559] to-[#1A53C8] p-6 text-white shadow-xl">
                <p className="text-sm font-medium text-blue-100">Merchant workspace</p>
                <h1 className="mt-2 text-3xl font-bold">
                    {profile?.storeName || 'Your store'}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-blue-100">
                    This dashboard is now driven by your live products, redemptions, and payout requests.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="bg-white text-[#1A53C8] hover:bg-slate-100">
                        <Link href="/merchant/products">Manage products</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                        <Link href="/merchant/payments">Open payouts</Link>
                    </Button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {isLoading || !data ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-36 rounded-2xl" />
                    ))
                ) : (
                    <>
                        <StatCard
                            title="Available Balance"
                            value={formatCurrency(data.summary.availableBalance)}
                            hint={`${data.summary.pendingPayouts} pending payout${data.summary.pendingPayouts === 1 ? '' : 's'}`}
                            icon={Wallet}
                        />
                        <StatCard
                            title="Total Revenue"
                            value={formatCurrency(data.summary.totalRevenue)}
                            hint="Completed merchant redemptions"
                            icon={CreditCard}
                        />
                        <StatCard
                            title="Orders"
                            value={data.summary.totalOrders.toString()}
                            hint="Redemption-backed orders"
                            icon={ShoppingBag}
                        />
                        <StatCard
                            title="Active Products"
                            value={data.summary.activeProducts.toString()}
                            hint={`${formatCurrency(data.summary.avgOrderValue)} avg order`}
                            icon={Package}
                        />
                    </>
                )}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr,1fr]">
                {isLoading || !data ? (
                    <>
                        <Skeleton className="h-96 rounded-2xl" />
                        <Skeleton className="h-96 rounded-2xl" />
                    </>
                ) : (
                    <>
                        <RevenueChart points={data.monthlyRevenue} />
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Top Products</h2>
                                    <p className="text-sm text-slate-500">Ranked by redeemed revenue</p>
                                </div>
                                <Link href="/merchant/products" className="text-sm font-semibold text-[#1A53C8]">
                                    Catalog
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {data.topProducts.length === 0 ? (
                                    <p className="text-sm text-slate-500">No product revenue yet. Once customers redeem goals, your top products will appear here.</p>
                                ) : (
                                    data.topProducts.map((product, index) => (
                                        <div key={`${product.name}-${index}`} className="rounded-xl border border-slate-100 p-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{product.name}</p>
                                                    <p className="text-sm text-slate-500">{product.orders} redemption{product.orders === 1 ? '' : 's'}</p>
                                                </div>
                                                <p className="font-bold text-[#1A53C8]">{formatCurrency(product.revenue)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr,1fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Latest Orders</h2>
                            <p className="text-sm text-slate-500">Newest customer redemptions</p>
                        </div>
                        <Link href="/merchant/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A53C8]">
                            All orders <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    {isLoading || !data ? (
                        <Skeleton className="h-64 rounded-2xl" />
                    ) : data.latestOrders.length === 0 ? (
                        <p className="text-sm text-slate-500">No merchant orders yet. Orders appear when customers redeem a completed Save Now Buy Later goal.</p>
                    ) : (
                        <div className="space-y-3">
                            {data.latestOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/merchant/orders/${order.id}`}
                                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-900">{order.productName}</p>
                                        <p className="truncate text-sm text-slate-500">
                                            {order.customerName} • {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{formatCurrency(order.amount, order.currency)}</p>
                                        <p className="text-xs font-medium text-slate-500">{order.orderStatus}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                        <p className="text-sm text-slate-500">Live merchant events from products, orders, and payouts</p>
                    </div>
                    {isLoading || !data ? (
                        <Skeleton className="h-64 rounded-2xl" />
                    ) : data.recentActivity.length === 0 ? (
                        <p className="text-sm text-slate-500">No recent activity yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {data.recentActivity.map((activity) => (
                                <div key={activity.id} className="rounded-xl border border-slate-100 p-4">
                                    <p className="font-medium text-slate-900">{activity.message}</p>
                                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                                        {activity.type} • {activity.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
