"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, FileText } from "lucide-react";

const MOCK_DISPUTE = {
    disputeId: "DIS-2001",
    disputeInfo: {
        filedBy: "Pearl Grey",
        againstMerchant: "TechHub",
        savingsPlan: "SNBL-1240",
        disputedAmount: "GH₵ 5,000",
        reason: "Product not received",
    },
    userComplaint:
        "I ordered a laptop from TechHub Store and completed my SNBL plan on time. However, I never received the product. I've tried contacting the merchant multiple times without any response. I am requesting a full refund of $120.00.",
    merchantResponse:
        "The product was shipped on the expected date. We have tracking information showing delivery to the customer's address. This appears to be a case of customer error or potential fraud.",
    disputeStatus: {
        current: "Open",
        priority: "High",
        lastUpdated: "Two hours ago",
    },
    attachedDocuments: [
        { name: "receipt_001.pdf" },
        { name: "receipt_001.pdf" },
    ],
};

export default function AdminDisputeDetailPage() {
    const [notes, setNotes] = useState("");
    const dispute = MOCK_DISPUTE;

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link
                href="/admin/disputes"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Disputes List
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1e2a4a]">Disputes Details</h1>
                    <p className="text-sm font-medium text-[#0754FF] mt-0.5">{dispute.disputeId}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-colors">
                        Approve
                    </button>
                    <button className="px-5 py-2 bg-red-500 text-white text-sm font-bold rounded-full hover:bg-red-600 transition-colors">
                        Reject
                    </button>
                    <button className="px-5 py-2 bg-amber-500 text-white text-sm font-bold rounded-full hover:bg-amber-600 transition-colors">
                        Escalate
                    </button>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column (3/5) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Dispute Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 border-l-4 border-l-[#0754FF]">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Dispute Information
                        </h3>
                        <div className="grid grid-cols-2 gap-y-5">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Filed By</p>
                                <p className="text-sm font-bold text-gray-900">{dispute.disputeInfo.filedBy}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Against Merchant</p>
                                <p className="text-sm font-bold text-gray-900">{dispute.disputeInfo.againstMerchant}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Savings Plan</p>
                                <Link href="/admin/plans/p1" className="text-sm font-bold text-[#0754FF] hover:underline">
                                    {dispute.disputeInfo.savingsPlan}
                                </Link>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Disputed Amount</p>
                                <p className="text-sm font-bold text-gray-900">{dispute.disputeInfo.disputedAmount}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-400 mb-1">Reason</p>
                                <p className="text-sm font-bold text-gray-900">{dispute.disputeInfo.reason}</p>
                            </div>
                        </div>
                    </div>

                    {/* User Complaint */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 border-l-4 border-l-amber-400">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-4 italic">
                            User Complaint
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{dispute.userComplaint}</p>
                    </div>

                    {/* Merchant Response */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 border-l-4 border-l-amber-400">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-4 italic">
                            Merchant Response
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{dispute.merchantResponse}</p>
                    </div>

                    {/* Internal Admin Notes */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 border-l-4 border-l-[#0754FF]">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-4 italic">
                            Internal Admin Notes
                        </h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add internal notes about the dispute..."
                            className="w-full h-28 p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] focus:bg-white resize-none transition-colors"
                        />
                        <button className="mt-4 px-6 py-2.5 bg-[#0754FF] text-white text-sm font-bold rounded-lg hover:bg-[#0643cc] transition-colors">
                            Save Notes
                        </button>
                    </div>
                </div>

                {/* Right Column (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Dispute Status */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Dispute Status
                        </h3>
                        <div className="space-y-3">
                            {/* Open Status Badge */}
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <span className="text-sm font-semibold text-amber-700">
                                    {dispute.disputeStatus.current}
                                </span>
                            </div>
                            {/* Priority Badge */}
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-red-600 border border-amber-200">
                                {dispute.disputeStatus.priority}
                            </span>
                            {/* Last Updated */}
                            <p className="text-sm text-gray-500 pt-2">
                                Last updated: {dispute.disputeStatus.lastUpdated}
                            </p>
                        </div>
                    </div>

                    {/* Attached Documents */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Attached Documents
                        </h3>
                        <div className="space-y-3">
                            {dispute.attachedDocuments.map((doc, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <a href="#" className="text-sm font-medium text-[#0754FF] hover:underline">
                                        {doc.name}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
