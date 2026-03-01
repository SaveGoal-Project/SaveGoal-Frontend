"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    Upload,
    DollarSign,
    TrendingUp,
    CircleDollarSign,
    Calendar,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";
import { useAdminPlanDetail } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState, AdminToast } from "@/src/components/admin/AdminFeedback";

export default function AdminPlanDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: plan, isLoading, error, refetch } = useAdminPlanDetail(id);
    const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

    const showTodo = (label: string) => setToast({ message: `${label} — feature coming soon`, type: "info" });

    if (isLoading) return <AdminLoadingSkeleton />;
    if (error || !plan) return <AdminErrorState message={error || "Plan not found"} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1e2a4a]">
                        Plan Details: {plan.planId}
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Complete savings plan information and transaction history
                    </p>
                    <Link
                        href="/admin/plans"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors mt-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Plans List
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => showTodo("Import CSV")}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Upload className="h-4 w-4" />
                        Import CSV
                    </button>
                    <span className={cn(
                        "px-5 py-2 rounded-full text-sm font-bold text-white",
                        plan.status === "Active" ? "bg-[#0754FF]" : plan.status === "Completed" ? "bg-green-600" : "bg-gray-500"
                    )}>
                        {plan.status}
                    </span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Target Amount</p>
                            <p className="text-xl font-bold text-gray-900">{plan.targetAmount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Amount Saved</p>
                            <p className="text-xl font-bold text-gray-900">{plan.amountSaved}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <CircleDollarSign className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Remaining</p>
                            <p className="text-xl font-bold text-gray-900">{plan.remaining}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Next Payment</p>
                            <p className="text-xl font-bold text-gray-900">{plan.nextPayment}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column (3/5) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Savings Progress */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-[#0754FF] pb-2 border-b border-gray-200 mb-5">
                            Savings Progress
                        </h3>

                        <div className="flex items-baseline justify-between mb-3">
                            <p className="text-2xl font-bold text-gray-900">{plan.amountSaved}</p>
                            <p className="text-sm text-gray-500">of {plan.targetAmount}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-[#0754FF] rounded-full transition-all"
                                style={{ width: `${plan.progressPercent}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-medium text-[#0754FF]">
                                {plan.progressPercent}% complete
                            </span>
                            <span className="text-sm text-gray-500">
                                Expected: {plan.expectedDate}
                            </span>
                        </div>

                        {/* Monthly Contribution & Start Date */}
                        <div className="border-t border-gray-200 pt-5 grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Monthly Contribution</p>
                                <p className="text-xl font-bold text-gray-900">{plan.monthlyContribution}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
                                <p className="text-xl font-bold text-gray-900">{plan.startDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5">
                            Payment History
                        </h3>
                        <div className="overflow-x-auto">
                            {plan.paymentHistory.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-6">No payment history yet</p>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Date</th>
                                            <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Amount</th>
                                            <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Method</th>
                                            <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plan.paymentHistory.map((payment, i) => (
                                            <tr key={i} className="border-b border-gray-100 last:border-0">
                                                <td className="py-3.5 text-sm text-gray-600">{payment.date}</td>
                                                <td className="py-3.5 text-sm font-bold text-gray-900">{payment.amount}</td>
                                                <td className="py-3.5 text-sm text-gray-600">{payment.method}</td>
                                                <td className="py-3.5">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1 text-sm font-medium",
                                                        payment.status === "Completed" ? "text-green-600" : payment.status === "Failed" ? "text-red-500" : "text-gray-500"
                                                    )}>
                                                        {payment.status === "Completed" && <CheckCircle2 className="h-4 w-4" />}
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            User Information
                        </h3>
                        <div className="grid grid-cols-2 gap-y-5">
                            {Object.entries(plan.user).map(([key, value]) => (
                                <div key={key} className={key === "Email" ? "col-span-2" : ""}>
                                    <p className="text-xs text-gray-400 mb-1">{key}</p>
                                    <p className="text-sm font-bold text-gray-900">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Product Details
                        </h3>
                        <p className="text-sm font-bold text-gray-900">{plan.product.Name || plan.product.name || "—"}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{plan.product.Merchant || plan.product.merchant || "—"}</p>
                        <div className="mt-4">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Product Price</p>
                            <p className="text-xl font-bold text-gray-900">{plan.product.Price || plan.product.price || plan.targetAmount}</p>
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Risk Assessment
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Risk Level</span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                    {plan.riskScore}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Payment Timeliness</span>
                                <span className="text-sm font-semibold text-green-600">
                                    {plan.paymentHistory.length > 0 ? "On Track" : "No Payments Yet"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Verification</span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Actions
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => showTodo("Send Reminder")}
                                className="w-full py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Send Reminder
                            </button>
                            <button
                                onClick={() => showTodo("Adjust Plan")}
                                className="w-full py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Adjust Plan
                            </button>
                            <button
                                onClick={() => showTodo("Suspend Plan")}
                                className="w-full py-2.5 border border-gray-300 text-red-500 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Suspend Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
