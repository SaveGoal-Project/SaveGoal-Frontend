'use client';

import { useState } from 'react';
import {
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Plus,
    Building2,
    Calendar,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    Info,
    Loader2,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { useWalletBalance, useTransactions, useBankDetails, usePayoutRequest } from '@/src/domains/payments/settlements.hooks';
import { cn } from '@/src/lib/utils';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Badge } from '@/src/components/ui/badge';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 font-medium whitespace-nowrap">Completed</Badge>;
        case 'Pending':
            return <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 font-medium whitespace-nowrap">Pending</Badge>;
        case 'Scheduled':
            return <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 font-medium whitespace-nowrap">Scheduled</Badge>;
        case 'Failed':
            return <Badge className="bg-red-50 text-red-700 border-red-100 hover:bg-red-50 font-medium whitespace-nowrap">Failed</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

const getTransactionIcon = (type: string) => {
    switch (type) {
        case 'Sale':
            return <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Plus className="w-5 h-5" /></div>;
        case 'Payout':
            return <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><ArrowUpRight className="w-5 h-5" /></div>;
        case 'Refund':
            return <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0"><ArrowDownRight className="w-5 h-5" /></div>;
        case 'Fee':
            return <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0"><Info className="w-5 h-5" /></div>;
        default:
            return <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0"><DollarSign className="w-5 h-5" /></div>;
    }
};

export default function MerchantPaymentsPage() {
    const { balance, isLoading: isBalanceLoading } = useWalletBalance();
    const { transactions, isLoading: isTransactionsLoading } = useTransactions();
    const { bankDetails, isLoading: isBankLoading } = useBankDetails();
    const { request: requestPayout, isSubmitting } = usePayoutRequest();

    const [searchTerm, setSearchTerm] = useState('');

    const handlePayout = async () => {
        if (!balance) return;
        try {
            const amount = parseFloat(balance.availableForPayout.replace(/[^0-9.]/g, ''));
            await requestPayout(amount);
            console.log("Payout request submitted successfully");
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Failed to create product")
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payments & Settlements</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your funds and payout history</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <Button variant="outline" className="gap-2 h-10 md:h-11 rounded-xl flex-1 sm:flex-none">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export Statements</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                    <Button
                        className="bg-[#1A53C8] hover:bg-[#1542a1] text-white gap-2 h-10 md:h-11 px-4 md:px-6 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex-1 sm:flex-none"
                        onClick={handlePayout}
                        disabled={isSubmitting || (!!balance && parseFloat(balance.availableForPayout.replace(/[^0-9.]/g, '')) === 0)}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                        Request Payout
                    </Button>
                </div>
            </div>

            {/* Wallet Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="lg:col-span-2 bg-[#212D67] rounded-2xl p-8 relative overflow-hidden text-white shadow-xl">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-2">
                                <Building2 className="w-4 h-4" />
                                Current Wallet Balance
                            </div>
                            {isBalanceLoading ? (
                                <Skeleton className="h-12 w-48 bg-white/10" />
                            ) : (
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{balance?.currentBalance}</h2>
                            )}
                        </div>

                        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                            <div className="bg-white/10 p-3 rounded-xl lg:bg-transparent lg:p-0">
                                <p className="text-blue-300 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Available for Payout</p>
                                {isBalanceLoading ? (
                                    <Skeleton className="h-6 w-24 bg-white/10" />
                                ) : (
                                    <p className="text-lg md:text-xl font-bold">{balance?.availableForPayout}</p>
                                )}
                            </div>
                            <div className="bg-white/10 p-3 rounded-xl lg:bg-transparent lg:p-0">
                                <p className="text-blue-300 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Pending Settlement</p>
                                {isBalanceLoading ? (
                                    <Skeleton className="h-6 w-24 bg-white/10" />
                                ) : (
                                    <p className="text-lg md:text-xl font-bold text-blue-100">{balance?.pendingSettlement}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Details Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900">Settlement Info</h3>
                        {bankDetails?.isVerified === true && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-none hover:bg-emerald-50"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>
                        )}
                    </div>

                    {isBankLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Bank Name</p>
                                <p className="text-sm font-bold text-slate-900">{bankDetails?.bankName}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Account Number</p>
                                <p className="text-sm font-bold text-slate-900">{bankDetails?.accountNumber}</p>
                            </div>
                            <Button variant="ghost" className="w-full text-[#1A53C8] hover:bg-blue-50 text-xs font-bold rounded-lg h-9">
                                Change Bank Details
                            </Button>
                        </div>
                    )}

                    <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <Info className="w-4 h-4 text-[#1A53C8] mt-0.5 shrink-0" />
                        <p className="text-[11px] text-[#1A53C8] font-medium leading-relaxed">
                            Settlements are processed every Thursday. Next scheduled settlement is Oct 30, 2025.
                        </p>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="font-bold text-lg text-slate-900">Recent Transactions</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#1A53C8]/10 focus:outline-none w-full sm:w-40 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold gap-1.5 shrink-0">
                            <Filter className="w-3 h-3" />
                            Filters
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {isTransactionsLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-10 h-10 rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            ))
                        ) : transactions.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No transactions found.</div>
                        ) : (
                            transactions.map((tx) => (
                                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors gap-3">
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                        {getTransactionIcon(tx.type)}
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 text-xs md:text-sm truncate">{tx.description}</p>
                                            <div className="flex flex-wrap items-center gap-x-2 text-[10px] md:text-[11px] text-slate-500 mt-0.5 font-medium">
                                                <span>{tx.date}</span>
                                                {tx.reference && (
                                                    <span className="text-[#1A53C8] font-bold truncate">Ref: {tx.reference}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className={cn(
                                            "font-bold text-xs md:text-sm",
                                            tx.amount.startsWith('+') ? "text-emerald-600" : "text-slate-900"
                                        )}>
                                            {tx.amount}
                                        </p>
                                        <div className="mt-1">
                                            {getStatusBadge(tx.status)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Page 1 of 4</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 rounded-lg px-4 text-xs font-bold" disabled>Prev</Button>
                            <Button variant="outline" size="sm" className="h-8 rounded-lg px-4 text-xs font-bold">Next</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
