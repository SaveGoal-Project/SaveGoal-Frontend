"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    Copy,
    Download,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    ShieldCheck,
} from "lucide-react";
import { useAdminPaymentDetail } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState, AdminToast } from "@/src/components/admin/AdminFeedback";

const statusStyles: Record<string, string> = {
    Completed: "bg-green-50 text-green-700 border-green-200",
    Failed: "bg-red-50 text-red-600 border-red-200",
    Refunded: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function AdminPaymentDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: txn, isLoading, error, refetch } = useAdminPaymentDetail(id);
    const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

    const showTodo = (label: string) => setToast({ message: `${label} — feature coming soon`, type: "info" });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setToast({ message: "Copied to clipboard", type: "success" });
        }).catch(() => {
            setToast({ message: "Failed to copy", type: "error" });
        });
    };

    if (isLoading) return <AdminLoadingSkeleton />;
    if (error || !txn) return <AdminErrorState message={error || "Transaction not found"} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1e2a4a]">
                        Transaction Details
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Complete transaction breakdown and audit trail
                    </p>
                    <Link
                        href="/admin/payments"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors mt-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Payments
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm font-mono text-gray-700">{txn.transactionId}</span>
                        <button onClick={() => copyToClipboard(txn.transactionId)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                    <button
                        onClick={() => showTodo("Download Receipt")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0754FF] text-white rounded-lg text-sm font-medium hover:bg-[#0643cc] transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Receipt
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 mb-1">Amount</p>
                    <p className="text-xl font-bold text-gray-900">{txn.amount}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 mb-1">Fee</p>
                    <p className="text-xl font-bold text-gray-900">{txn.fee}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 mb-1">Net Amount</p>
                    <p className="text-xl font-bold text-gray-900">{txn.nextAmount}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                    <span className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border",
                        statusStyles[txn.status] || "bg-gray-50 text-gray-700 border-gray-200"
                    )}>
                        {txn.status === "Completed" && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {txn.status === "Failed" && <XCircle className="h-3.5 w-3.5" />}
                        {txn.status}
                    </span>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column (3/5) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* User Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            User Information
                        </h3>
                        <div className="grid grid-cols-2 gap-y-5">
                            {Object.entries(txn.userInfo).map(([key, value]) => (
                                <div key={key} className={key === "Email" ? "col-span-2" : ""}>
                                    <p className="text-xs text-gray-400 mb-1">{key}</p>
                                    <p className="text-sm font-bold text-gray-900">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Payment Details
                        </h3>
                        <div className="grid grid-cols-2 gap-y-5">
                            {Object.entries(txn.paymentDetails).map(([key, value]) => (
                                <div key={key}>
                                    <p className="text-xs text-gray-400 mb-1">{key}</p>
                                    <p className="text-sm font-bold text-gray-900">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Associated Savings Plan */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Associated Savings Plan
                        </h3>
                        <div className="grid grid-cols-2 gap-y-5">
                            {Object.entries(txn.savingsPlan).map(([key, value]) => (
                                <div key={key}>
                                    <p className="text-xs text-gray-400 mb-1">{key}</p>
                                    <p className="text-sm font-bold text-gray-900">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Risk Analysis */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Risk Analysis
                        </h3>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500">Risk Score</span>
                            <span className="text-xl font-bold text-green-600">{txn.riskAnalysis.score}</span>
                        </div>
                        <div className="space-y-2.5">
                            {txn.riskAnalysis.checks.map((check, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5">
                                    <span className="text-sm text-gray-600">{check.label}</span>
                                    <span className={cn(
                                        "inline-flex items-center gap-1 text-xs font-semibold",
                                        check.status === "Passed" || check.status === "Valid" ? "text-green-600" : "text-amber-600"
                                    )}>
                                        {(check.status === "Passed" || check.status === "Valid") ? (
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                        ) : (
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                        )}
                                        {check.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transaction Timeline */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Transaction Timeline
                        </h3>
                        <div className="space-y-0">
                            {txn.timeline.map((step, i) => (
                                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full mt-1",
                                            step.status === "done" ? "bg-green-500" : step.status === "current" ? "bg-blue-500" : "bg-gray-300"
                                        )} />
                                        {i < txn.timeline.length - 1 && (
                                            <div className="w-px flex-1 bg-gray-200 mt-1" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pb-2">
                                        <p className="text-sm font-medium text-gray-900">{step.label}</p>
                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {step.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Actions
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => showTodo("Download Receipt")}
                                className="w-full py-2.5 bg-[#0754FF] text-white text-sm font-bold rounded-lg hover:bg-[#0643cc] transition-colors"
                            >
                                Download Receipt
                            </button>
                            <button
                                onClick={() => showTodo("Initiate Refund")}
                                className="w-full py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Initiate Refund
                            </button>
                            <button
                                onClick={() => showTodo("Flag as Suspicious")}
                                className="w-full py-2.5 border border-gray-300 text-red-500 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Flag as Suspicious
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
