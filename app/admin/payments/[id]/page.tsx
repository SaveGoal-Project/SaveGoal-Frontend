"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Upload,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    AlertTriangle,
    Info,
    ShieldCheck,
} from "lucide-react";

const MOCK_TXN = {
    txnId: "TXN-2001",
    status: "Completed" as const,
    amount: "GH₵ 5,000",
    fee: "GH₵ 2",
    nextAmount: "GH₵ 500",
    userInfo: {
        fullName: "Amina Okoro",
        userId: "USR-01",
        memberSince: "Jan 12, 2026",
        phoneNumber: "020000654",
        email: "amina@example.com",
    },
    paymentDetails: {
        method: "Momo",
        provider: "MTN Momo",
        accountNumber: "020000654",
        reference: "Momo-2026-10-14035",
        ipAddress: "197.210.70.45",
        location: "Accra, Ghana",
        device: "iPhone 12, iOS",
    },
    associatedPlan: {
        planId: "SNBL-1240",
        product: "Iphone 15 Pro",
        targetAmount: "GH₵ 5,000",
    },
    riskAnalysis: {
        riskScore: 15,
        checks: [
            { name: "IP Verification", status: "Passed" },
            { name: "Device Fingerprint", status: "Passed" },
            { name: "Velocity Check", status: "Passed" },
            { name: "AML Screening", status: "Passed" },
        ],
    },
    timeline: [
        { status: "Payment Completed", time: "14-30-2026", icon: "check", color: "green" },
        { status: "Processing Payment", time: "14-30-2026", icon: "alert", color: "green" },
        { status: "Risk Check Passed", time: "14-30-2026", icon: "info", color: "blue" },
        { status: "Payment Initiated", time: "14-30-2026", icon: "info", color: "blue" },
    ],
};

export default function AdminTransactionDetailPage() {
    const txn = MOCK_TXN;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1e2a4a]">Transaction Details</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Complete payment information and verification details
                    </p>
                    <Link
                        href="/admin/payments"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors mt-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Plans List
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Upload className="h-4 w-4" />
                        Receipt
                    </button>
                    <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold bg-green-600 text-white">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                    </span>
                </div>
            </div>

            {/* Blue Transaction ID Card */}
            <div className="bg-[#0754FF] rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-blue-200 mb-1">Transaction ID</p>
                        <p className="text-2xl font-bold">{txn.txnId}</p>
                    </div>
                    <button className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Copy className="h-4 w-4" />
                    </button>
                </div>
                {/* Blue divider */}
                <div className="w-full h-0.5 bg-blue-400 rounded-full my-4" />
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs text-blue-200 mb-1">Amount</p>
                        <p className="text-xl font-bold">{txn.amount}</p>
                    </div>
                    <div>
                        <p className="text-xs text-blue-200 mb-1">Fee</p>
                        <p className="text-xl font-bold">{txn.fee}</p>
                    </div>
                    <div>
                        <p className="text-xs text-blue-200 mb-1">Next Amount</p>
                        <p className="text-xl font-bold">{txn.nextAmount}</p>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column (3/5) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* User Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            User Information
                        </h3>
                        <div className="grid grid-cols-3 gap-y-5">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Full Name</p>
                                <p className="text-sm font-bold text-gray-900">{txn.userInfo.fullName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">User ID</p>
                                <p className="text-sm font-bold text-gray-900">{txn.userInfo.userId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Member Since</p>
                                <p className="text-sm font-bold text-gray-900">{txn.userInfo.memberSince}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                                <p className="text-sm font-bold text-gray-900">{txn.userInfo.phoneNumber}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-400 mb-1">Email Address</p>
                                <p className="text-sm font-bold text-gray-900">{txn.userInfo.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Payment Details
                        </h3>
                        <div className="grid grid-cols-2 gap-y-5">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                                <p className="text-sm font-bold text-[#0754FF]">{txn.paymentDetails.method}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Provider</p>
                                <p className="text-sm font-bold text-gray-900">{txn.paymentDetails.provider}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Account Number</p>
                                <p className="text-sm font-bold text-gray-900">{txn.paymentDetails.accountNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Reference</p>
                                <p className="text-sm font-bold text-gray-900">{txn.paymentDetails.reference}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">IP Address</p>
                                <p className="text-sm font-bold text-gray-900">{txn.paymentDetails.ipAddress}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Location</p>
                                <p className="text-sm font-bold text-gray-900">{txn.paymentDetails.location}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Device</p>
                                <p className="text-sm font-bold text-gray-900">{txn.paymentDetails.device}</p>
                            </div>
                        </div>
                    </div>

                    {/* Associated Savings Plan */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Associated Savings Plan
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Plan ID</p>
                                <Link href="/admin/plans/p1" className="text-sm font-bold text-[#0754FF] hover:underline">
                                    {txn.associatedPlan.planId}
                                </Link>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Product</p>
                                <p className="text-sm font-medium text-gray-900">{txn.associatedPlan.product}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Target Amount</p>
                                <p className="text-sm font-bold text-gray-900">{txn.associatedPlan.targetAmount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Risk Analysis */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-5">
                            <h3 className="text-base font-bold text-gray-900 italic">Risk Analysis</h3>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                Risk Score: {txn.riskAnalysis.riskScore}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {txn.riskAnalysis.checks.map((check, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                    <span className="text-sm text-gray-600">{check.name}</span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {check.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Transaction Timeline */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 mb-5">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <h3 className="text-base font-bold text-gray-900 italic">Transaction Timeline</h3>
                        </div>
                        <div className="space-y-0">
                            {txn.timeline.map((step, i) => {
                                const isLast = i === txn.timeline.length - 1;
                                let iconEl;
                                if (step.icon === "check") {
                                    iconEl = (
                                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        </div>
                                    );
                                } else if (step.icon === "alert") {
                                    iconEl = (
                                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <AlertTriangle className="h-4 w-4 text-green-600" />
                                        </div>
                                    );
                                } else {
                                    iconEl = (
                                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Info className="h-4 w-4 text-blue-600" />
                                        </div>
                                    );
                                }

                                return (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="flex flex-col items-center">
                                            {iconEl}
                                            {!isLast && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
                                        </div>
                                        <div className="pt-0.5">
                                            <p className="text-sm font-semibold text-gray-900">{step.status}</p>
                                            <p className="text-xs text-gray-500">{step.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 text-center">
                            Actions
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors">
                                Download Receipt
                            </button>
                            <button className="w-full py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                Initiate Refund
                            </button>
                            <button className="w-full py-2.5 border border-gray-300 text-red-500 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors italic">
                                Flag as Suspicious
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
