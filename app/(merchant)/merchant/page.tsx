'use client';

import {
    TrendingUp,
    Package,
    ShoppingCart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Eye,
    Star,
    Clock,
} from 'lucide-react';
import { useMerchantDashboard } from '@/src/domains/merchant/merchant.hooks';
import { Skeleton } from '@/src/components/ui/skeleton';

// --- Stat Card ---
function StatCard({
    label,
    value,
    change,
    changeLabel,
    icon: Icon,
    iconBg,
    positive,
}: {
    label: string;
    value: string;
    change: string;
    changeLabel: string;
    icon: React.ElementType;
    iconBg: string;
    positive: boolean;
}) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
            <p className="text-sm text-slate-500 mb-3">{label}</p>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{change}</span>
                <span className="text-slate-400 font-normal">{changeLabel}</span>
            </div>
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <Skeleton className="w-7 h-7 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}

// --- Sales Chart ---
function SalesChart({ data }: { data: number[] }) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const max = Math.max(...data);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-base font-bold text-slate-900">Sales Overview</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Monthly revenue performance</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">2025</span>
                </div>
            </div>
            <div className="flex items-end gap-2 h-48">
                {data.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full relative group">
                            <div
                                className="w-full rounded-t-lg bg-gradient-to-t from-[#1A53C8] to-[#306CFE] hover:from-[#306CFE] hover:to-[#8AABEE] transition-all duration-300 cursor-pointer"
                                style={{ height: `${(v / max) * 160}px` }}
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                GH¢{(v * 1000).toLocaleString()}
                            </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">{months[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Order Status Chart ---
function OrderStatusChart({ data }: { data: { label: string; value: number; color: string }[] }) {
    // Build conic gradient
    let cumulative = 0;
    const gradientStops = data.map(({ value, color }) => {
        const start = cumulative;
        cumulative += value;
        return `${color} ${start}% ${cumulative}%`;
    }).join(', ');

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 col-span-1">
            <div className="mb-6">
                <h2 className="text-base font-bold text-slate-900">Order Status</h2>
                <p className="text-xs text-slate-500 mt-0.5">Distribution by status</p>
            </div>
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div
                        className="w-36 h-36 rounded-full"
                        style={{ background: `conic-gradient(${gradientStops})` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-inner">
                            <div className="text-center">
                                <p className="text-xl font-bold text-slate-900">324</p>
                                <p className="text-[9px] text-slate-400 font-medium">Total</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full space-y-2">
                    {data.map(({ label, value, color }) => (
                        <div key={label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                                <span className="text-xs text-slate-600">{label}</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-900">{value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- Recent Orders (Kept local for now until Phase 2) ---
const recentOrdersData = [
    { id: '#ORD-0091', product: 'Apple MacBook Pro', customer: 'Kwame Adu', amount: 'GH¢10,000', status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-700' },
    { id: '#ORD-0090', product: 'Sony PlayStation 5', customer: 'Ama Owusu', amount: 'GH¢7,000', status: 'Processing', statusColor: 'bg-blue-100 text-blue-700' },
    { id: '#ORD-0089', product: 'Adidas Sneakers', customer: 'Kofi Mensah', amount: 'GH¢800', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700' },
    { id: '#ORD-0088', product: 'Canon EOS R5', customer: 'Abena Sarpong', amount: 'GH¢35,000', status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-700' },
    { id: '#ORD-0087', product: 'Nike Air Force', customer: 'Yaw Boateng', amount: 'GH¢1,200', status: 'Cancelled', statusColor: 'bg-red-100 text-red-600' },
];

function RecentOrders() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                    <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Latest customer orders</p>
                </div>
                <a href="/merchant/orders" className="text-xs font-semibold text-[#1A53C8] hover:text-[#306CFE] flex items-center gap-1 transition-colors">
                    View all <Eye className="w-3.5 h-3.5" />
                </a>
            </div>
            <div className="divide-y divide-slate-50">
                {recentOrdersData.map(order => (
                    <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="w-4 h-4 text-[#1A53C8]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{order.product}</p>
                            <p className="text-xs text-slate-400 truncate">{order.customer} · {order.id}</p>
                        </div>
                        <p className="text-sm font-bold text-slate-900 flex-shrink-0">{order.amount}</p>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${order.statusColor}`}>
                            {order.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Top Products ---
function TopProducts({ products }: { products: any[] }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 col-span-1">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                    <h2 className="text-base font-bold text-slate-900">Top Products</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Best performers this month</p>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="divide-y divide-slate-50">
                {products.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-[10px] text-slate-400 font-medium">{p.rating}</span>
                                <span className="text-[10px] text-slate-400">· {p.sales} sold</span>
                            </div>
                        </div>
                        <p className="text-xs font-bold text-emerald-600">{p.revenue}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Quick Activity Feed ---
function ActivityFeed({ activities }: { activities: any[] }) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'order': return 'bg-blue-100 text-blue-600';
            case 'product': return 'bg-emerald-100 text-emerald-600';
            case 'payment': return 'bg-purple-100 text-purple-600';
            case 'shipping': return 'bg-amber-100 text-amber-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 col-span-1">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                <p className="text-xs text-slate-500 mt-0.5">What's happening in your store</p>
            </div>
            <div className="divide-y divide-slate-50">
                {activities.map(({ id, text, time, type }, i) => (
                    <div key={id} className="flex items-start gap-4 px-6 py-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeStyles(type)}`}>
                            {type === 'order' && <ShoppingCart className="w-4 h-4" />}
                            {type === 'product' && <Package className="w-4 h-4" />}
                            {type === 'payment' && <DollarSign className="w-4 h-4" />}
                            {type === 'shipping' && <Clock className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="text-sm text-slate-700 font-medium leading-tight">{text}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Error Helper ---
function XCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
    );
}

// --- Main Page ---
export default function MerchantDashboard() {
    const { data, isLoading, error } = useMerchantDashboard();

    if (error) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-red-100">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Failed to load dashboard</h3>
                <p className="text-slate-500 text-center max-w-xs mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#1A53C8] text-white rounded-lg font-semibold hover:bg-[#1542a1] transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="relative bg-gradient-to-r from-[#212D67] to-[#1A53C8] rounded-2xl p-6 overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                    <p className="text-blue-300 text-sm font-medium mb-1">Good afternoon,</p>
                    <h2 className="text-2xl font-bold text-white mb-1">Welcome back, My Store 👋</h2>
                    <p className="text-blue-200 text-sm">Here's what's happening with your store today.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard
                            label="Total Revenue"
                            value={data!.stats.totalRevenue}
                            change={data!.stats.revenueChange}
                            changeLabel="vs last month"
                            icon={DollarSign}
                            iconBg="bg-gradient-to-br from-[#1A53C8] to-[#306CFE]"
                            positive
                        />
                        <StatCard
                            label="Total Orders"
                            value={data!.stats.totalOrders.toString()}
                            change={data!.stats.ordersChange}
                            changeLabel="vs last month"
                            icon={ShoppingCart}
                            iconBg="bg-gradient-to-br from-emerald-400 to-emerald-600"
                            positive
                        />
                        <StatCard
                            label="Active Products"
                            value={data!.stats.activeProducts.toString()}
                            change={data!.stats.productsChange}
                            changeLabel="this week"
                            icon={Package}
                            iconBg="bg-gradient-to-br from-purple-400 to-purple-600"
                            positive
                        />
                        <StatCard
                            label="Avg. Order Value"
                            value={data!.stats.avgOrderValue}
                            change={data!.stats.avgOrderValueChange}
                            changeLabel="vs last month"
                            icon={TrendingUp}
                            iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
                            positive={data!.stats.avgOrderValueChange.startsWith('+')}
                        />
                    </>
                )}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-72 col-span-1 lg:col-span-2 rounded-2xl" />
                        <Skeleton className="h-72 rounded-2xl" />
                    </>
                ) : (
                    <>
                        <SalesChart data={data!.stats.recentRevenue} />
                        <OrderStatusChart data={data!.stats.orderStatusDistribution} />
                    </>
                )}
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2">
                    {isLoading ? <Skeleton className="h-[400px] rounded-2xl" /> : <RecentOrders />}
                </div>
                <div className="flex flex-col gap-6">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-64 rounded-2xl" />
                            <Skeleton className="h-64 rounded-2xl" />
                        </>
                    ) : (
                        <>
                            <TopProducts products={data!.topProducts} />
                            <ActivityFeed activities={data!.recentActivities} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
