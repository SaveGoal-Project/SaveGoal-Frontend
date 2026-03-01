"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    AlertTriangle,
    FileText,
} from "lucide-react";
import { useAdminDisputeDetail } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState, AdminToast } from "@/src/components/admin/AdminFeedback";

const priorityStyles: Record<string, string> = {
    High: "bg-red-50 text-red-700 border-red-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-green-50 text-green-700 border-green-200",
};

export default function AdminDisputeDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: dispute, isLoading, error, refetch } = useAdminDisputeDetail(id);
    const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
    const [notes, setNotes] = useState("");

    const showTodo = (label: string) => setToast({ message: `${label} — feature coming soon`, type: "info" });

    if (isLoading) return <AdminLoadingSkeleton />;
    if (error || !dispute) return <AdminErrorState message={error || "Dispute not found"} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Back Link */}
            <Link
                href="/admin/disputes"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Disputes
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1e2a4a]">Dispute: {dispute.disputeId}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Full dispute investigation and resolution dashboard
                    </p>
                </div>
                <span className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold border",
                    priorityStyles[dispute.disputeStatus.priority] || "bg-gray-50 text-gray-700 border-gray-200"
                )}>
                    {dispute.disputeStatus.priority} Priority
                </span>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column (3/5) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Dispute Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Dispute Information
                        </h3>
                        <div className="grid grid-cols-2 gap-y-5">
                            {Object.entries(dispute.disputeInfo).map(([key, value]) => (
                                <div key={key}>
                                    <p className="text-xs text-gray-400 mb-1">{key}</p>
                                    <p className="text-sm font-bold text-gray-900">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Complaint */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            User Complaint
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{dispute.userComplaint}</p>
                    </div>

                    {/* Merchant Response */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Merchant Response
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{dispute.merchantResponse}</p>
                    </div>

                    {/* Internal Notes */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Internal Admin Notes
                        </h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add investigation notes here..."
                            className="w-full h-28 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] transition-colors"
                        />
                        <button
                            onClick={() => showTodo("Save Notes")}
                            className="mt-3 px-5 py-2 bg-[#0754FF] text-white text-sm font-medium rounded-lg hover:bg-[#0643cc] transition-colors"
                        >
                            Save Notes
                        </button>
                    </div>
                </div>

                {/* Right Column (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Dispute Status */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Current Status</span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                    {dispute.disputeStatus.current}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Priority</span>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-semibold border",
                                    priorityStyles[dispute.disputeStatus.priority] || ""
                                )}>
                                    {dispute.disputeStatus.priority}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Last Updated</span>
                                <span className="text-sm font-medium text-gray-700">{dispute.disputeStatus.lastUpdated}</span>
                            </div>
                        </div>
                    </div>

                    {/* Attached Documents */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Attached Documents
                        </h3>
                        {dispute.attachedDocuments.length === 0 ? (
                            <p className="text-sm text-gray-500">No documents attached</p>
                        ) : (
                            <div className="space-y-2">
                                {dispute.attachedDocuments.map((doc, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => showTodo("View Document")}
                                    >
                                        <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                        <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Resolution Actions
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => showTodo("Approve Dispute")}
                                className="w-full py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => showTodo("Reject Dispute")}
                                className="w-full py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => showTodo("Escalate Dispute")}
                                className="w-full py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <AlertTriangle className="h-4 w-4" />
                                Escalate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
