'use client';

import {
    DollarSign,
    Download,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Wallet,
    Building2,
    Calendar,
    Search
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export default function MerchantPaymentsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your earrings and payouts</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Statement
                    </Button>
                    <Button className="gap-2 bg-[#1A53C8] hover:bg-[#1542a1] text-white">
                        <ArrowUpRight className="w-4 h-4" />
                        Request Payout
                    </Button>
                </div>
            </div>

            {/* Balance Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Balance */}
                <div className="bg-gradient-to-br from-[#1A53C8] to-[#306CFE] rounded-2xl p-6 text-white shadow-lg lg:col-span-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
                        <h2 className="text-3xl font-bold mb-6">GH¢ 45,200.00</h2>

                        <div className="flex items-center gap-4 text-sm mb-8">
                            <div>
                                <p className="text-blue-200 text-xs">Pending Clearing</p>
                                <p className="font-semibold">GH¢ 2,450.00</p>
                            </div>
                            <div className="w-px h-8 bg-white/20"></div>
                            <div>
                                <p className="text-blue-200 text-xs">Last Payout</p>
                                <p className="font-semibold">GH¢ 12,000.00</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs text-blue-100">
                                <span>**** **** **** 4829</span>
                                <span>Ecobank Ghana</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <ArrowDownLeft className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Earnings</p>
                                <p className="text-xl font-bold text-slate-900">GH¢ 1.2M</p>
                            </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[75%]" />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">+12% from last month</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Bank Account</p>
                                <p className="text-xl font-bold text-slate-900">Ecobank</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">Manage Account</Button>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Recent Transactions</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#1A53C8]"
                            />
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {i % 2 === 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{i % 2 === 0 ? 'Order Payment #ORD-8292' : 'Payout to Bank **** 4829'}</p>
                                    <p className="text-xs text-slate-500">Oct 24, 2025 at 2:30 PM</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${i % 2 === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                    {i % 2 === 0 ? '+' : '-'} GH¢ {i % 2 === 0 ? '450.00' : '1,200.00'}
                                </p>
                                <p className="text-xs text-slate-400">{i % 2 === 0 ? 'Completed' : 'Processing'}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-100 text-center">
                    <Button variant="ghost" size="sm" className="text-[#1A53C8]">View All Transactions</Button>
                </div>
            </div>
        </div>
    );
}
