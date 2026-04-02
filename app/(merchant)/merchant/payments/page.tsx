'use client';

import { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, Building2, Loader2, Wallet } from 'lucide-react';
import { useBankDetails, usePayoutRequest, useTransactions, useWalletBalance } from '@/src/domains/payments/settlements.hooks';
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
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

function StatusPill({ value }: { value: string }) {
    const tone = value === 'COMPLETED'
        ? 'bg-emerald-50 text-emerald-700'
        : value === 'FAILED'
            ? 'bg-red-50 text-red-700'
            : 'bg-amber-50 text-amber-700';

    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
}

export default function MerchantPaymentsPage() {
    const { balance, isLoading: balanceLoading, error: balanceError, refetch: refetchBalance } = useWalletBalance();
    const { transactions, isLoading: transactionsLoading, error: transactionsError, refetch: refetchTransactions } = useTransactions();
    const { bankDetails, isLoading: bankLoading, error: bankError } = useBankDetails();
    const { request, isSubmitting, error: payoutError } = usePayoutRequest();

    const canRequestPayout = Boolean(
        bankDetails?.bankName &&
        bankDetails.accountNumber &&
        bankDetails.accountName &&
        (balance?.availableForPayout || 0) > 0
    );

    const latestTransactions = useMemo(() => transactions.slice(0, 12), [transactions]);

    const handleRequestPayout = async () => {
        if (!balance || balance.availableForPayout <= 0) {
            return;
        }

        await request(balance.availableForPayout);
        await Promise.all([refetchBalance(), refetchTransactions()]);
    };

    if (balanceError || transactionsError || bankError) {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-bold text-slate-900">Payments unavailable</h1>
                <p className="mt-2 text-sm text-slate-500">{balanceError || transactionsError || bankError}</p>
                <Button
                    className="mt-4 bg-[#1A53C8] text-white hover:bg-[#1542a1]"
                    onClick={() => {
                        refetchBalance();
                        refetchTransactions();
                    }}
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payments & Payouts</h1>
                    <p className="text-sm text-slate-500">Live merchant balance, payout readiness, and transaction activity.</p>
                </div>
                <Button
                    className="bg-[#1A53C8] text-white hover:bg-[#1542a1]"
                    disabled={!canRequestPayout || isSubmitting}
                    onClick={handleRequestPayout}
                >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Request Full Payout
                </Button>
            </div>

            {payoutError ? (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                    {payoutError}
                </div>
            ) : null}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr,1fr]">
                <div className="rounded-3xl bg-gradient-to-r from-[#1B2559] to-[#1A53C8] p-6 text-white shadow-xl">
                    <div className="flex items-center gap-3 text-blue-100">
                        <Wallet className="h-5 w-5" />
                        <p className="text-sm font-medium">Merchant Balance</p>
                    </div>
                    {balanceLoading || !balance ? (
                        <Skeleton className="mt-6 h-12 w-56 bg-white/10" />
                    ) : (
                        <>
                            <p className="mt-6 text-4xl font-bold">{formatCurrency(balance.currentBalance)}</p>
                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-white/10 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Available For Payout</p>
                                    <p className="mt-2 text-xl font-bold">{formatCurrency(balance.availableForPayout)}</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Pending Payout Amount</p>
                                    <p className="mt-2 text-xl font-bold">{formatCurrency(balance.pendingPayoutAmount || 0)}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-bold text-slate-900">Payout Account</h2>
                    </div>
                    {bankLoading || !bankDetails ? (
                        <div className="mt-4 space-y-3">
                            <Skeleton className="h-16 rounded-2xl" />
                            <Skeleton className="h-16 rounded-2xl" />
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">
                            <div className="rounded-2xl border border-slate-100 p-4">
                                <p className="text-sm text-slate-500">Bank Name</p>
                                <p className="mt-1 font-semibold text-slate-900">{bankDetails.bankName || 'Not set'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 p-4">
                                <p className="text-sm text-slate-500">Account Number</p>
                                <p className="mt-1 font-semibold text-slate-900">{bankDetails.accountNumber || 'Not set'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 p-4">
                                <p className="text-sm text-slate-500">Account Name</p>
                                <p className="mt-1 font-semibold text-slate-900">{bankDetails.accountName || 'Not set'}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                {canRequestPayout
                                    ? 'Your payout account is ready. Requesting a payout will move your available merchant balance into a pending payout request.'
                                    : 'Add payout bank details in merchant settings before requesting a payout.'}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-900">Financial Activity</h2>
                    <p className="text-sm text-slate-500">Sales credits and payout requests tied to your merchant account</p>
                </div>

                {transactionsLoading ? (
                    <div className="space-y-3 p-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-20 rounded-2xl" />
                        ))}
                    </div>
                ) : latestTransactions.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        No financial activity yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {latestTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`rounded-2xl p-3 ${transaction.direction === 'credit' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                                        {transaction.direction === 'credit'
                                            ? <ArrowDownRight className="h-5 w-5" />
                                            : <ArrowUpRight className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{transaction.description}</p>
                                        <p className="text-sm text-slate-500">{formatDate(transaction.createdAt)}</p>
                                        <p className="text-xs text-slate-400">{transaction.reference || transaction.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 lg:min-w-[220px]">
                                    <div className="text-right">
                                        <p className={`font-bold ${transaction.direction === 'credit' ? 'text-emerald-700' : 'text-slate-900'}`}>
                                            {transaction.direction === 'credit' ? '+' : '-'}
                                            {formatCurrency(transaction.amount, transaction.currency)}
                                        </p>
                                    </div>
                                    <StatusPill value={transaction.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
