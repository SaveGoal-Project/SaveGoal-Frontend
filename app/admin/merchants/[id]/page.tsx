"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { ArrowLeft, Mail, Ban, ShieldCheck } from "lucide-react";
import { useAdminMerchantDetail, useUpdateMerchantStatus, useVerifyKyc } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState, AdminToast, AdminConfirmDialog } from "@/src/components/admin/AdminFeedback";

const TABS = [
    "Store Information",
    "KYC Status",
    "Payment Methods",
    "Risk Assesments",
    "Disputes",
    "Activity Log",
];

export default function AdminMerchantDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [activeTab, setActiveTab] = useState("Store Information");
    const { data: merchant, isLoading, error, refetch } = useAdminMerchantDetail(id);
    const { mutate: updateStatus, isLoading: statusLoading } = useUpdateMerchantStatus();
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    
    // KYC Approval State
    const { mutate: verifyKyc, isLoading: isVerifyingKyc } = useVerifyKyc();
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const showTodo = (label: string) => setToast({ message: `${label} — feature coming soon`, type: "info" });
    const isSuspended = merchant?.status === "Suspended";

    const handleSuspendToggle = async () => {
        if (!merchant) return;
        const newStatus = isSuspended ? "Active" : "Suspended";
        try {
            await updateStatus(merchant.userId, newStatus);
            setToast({ message: `Merchant ${newStatus === "Suspended" ? "suspended" : "reactivated"} successfully`, type: "success" });
            refetch();
        } catch (err: any) {
            setToast({ message: err.message || "Failed to update merchant status", type: "error" });
        }
        setShowConfirm(false);
    };

    const handleApproveKyc = async () => {
        if (!merchant) return;
        try {
            await verifyKyc({ userId: merchant.userId, status: "VERIFIED" });
            setToast({ message: "Merchant KYC approved successfully", type: "success" });
            setShowApproveModal(false);
            refetch();
        } catch (err: any) {
            setToast({ message: err.message || "Failed to approve KYC", type: "error" });
        }
    };

    const handleRejectKyc = async () => {
        if (!merchant) return;
        if (!rejectReason.trim()) {
            setToast({ message: "Please provide a reason for rejection", type: "error" });
            return;
        }
        try {
            await verifyKyc({ userId: merchant.userId, status: "FAILED", note: rejectReason });
            setToast({ message: "Merchant KYC rejected successfully", type: "success" });
            setShowRejectModal(false);
            setRejectReason("");
            refetch();
        } catch (err: any) {
            setToast({ message: err.message || "Failed to reject KYC", type: "error" });
        }
    };

    if (isLoading) return <AdminLoadingSkeleton />;
    if (error || !merchant) return <AdminErrorState message={error || "Merchant not found"} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {showConfirm && (
                <AdminConfirmDialog
                    title={isSuspended ? "Reactivate Merchant" : "Suspend Merchant"}
                    message={isSuspended ? `Are you sure you want to reactivate ${merchant.name}?` : `Are you sure you want to suspend ${merchant.name}?`}
                    confirmLabel={isSuspended ? "Reactivate" : "Suspend"}
                    confirmVariant={isSuspended ? "primary" : "danger"}
                    isLoading={statusLoading}
                    onConfirm={handleSuspendToggle}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
            {showApproveModal && (
                <AdminConfirmDialog
                    title="Approve Merchant KYC"
                    message={`Are you sure you want to approve KYC for ${merchant.name}? This will grant them full access to the platform.`}
                    confirmLabel="Approve KYC"
                    confirmVariant="primary"
                    isLoading={isVerifyingKyc}
                    onConfirm={handleApproveKyc}
                    onCancel={() => setShowApproveModal(false)}
                />
            )}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Merchant KYC</h3>
                        <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting the KYC documents. The merchant will see this note.</p>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0754FF] focus:border-transparent outline-none mb-6 resize-none"
                            placeholder="e.g. ID image is blurry, Selfie doesn't match ID..."
                            rows={3}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                                disabled={isVerifyingKyc}
                                className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectKyc}
                                disabled={isVerifyingKyc}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isVerifyingKyc ? "Processing..." : "Reject KYC"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Back Link */}
            <Link
                href="/admin/merchants"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Merchants
            </Link>

            {/* Merchant Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-full bg-[#0754FF] flex items-center justify-center text-white font-bold text-xl">
                            {merchant.initial}
                        </div>
                        {/* Info */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{merchant.name}</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-sm text-gray-500">{merchant.email}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{merchant.phone}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0754FF] text-white">
                                    {merchant.status}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                    {merchant.kycStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => showTodo("Notify Merchant")}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Mail className="h-4 w-4" />
                            Notify
                        </button>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors",
                                isSuspended ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                            )}
                        >
                            {isSuspended ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                            {isSuspended ? "Unsuspend" : "Suspend"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex items-center gap-8">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-3 text-sm font-medium transition-colors relative",
                                activeTab === tab
                                    ? "text-[#0754FF]"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0754FF]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content: Store Information */}
            {activeTab === "Store Information" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Store Information Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-200 mb-6">
                                Store Information
                            </h3>
                            <div className="grid grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Business Name</p>
                                    <p className="text-sm font-semibold text-gray-900">{merchant.storeInfo.businessName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Address</p>
                                    <p className="text-sm font-semibold text-gray-900">{merchant.storeInfo.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Full Name</p>
                                    <p className="text-sm font-semibold text-gray-900">{merchant.storeInfo.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Landmark</p>
                                    <p className="text-sm font-semibold text-gray-900">{merchant.storeInfo.landmark}</p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Status Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-200 mb-6">
                                Financial Status
                            </h3>
                            <div className="grid grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Total Earned</p>
                                    <p className="text-sm font-semibold text-gray-900">{merchant.financialStatus.totalEarned}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Last Payout Date</p>
                                    <p className="text-sm font-semibold text-gray-900">{merchant.financialStatus.lastPayoutDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Total Withdrawn</p>
                                    <p className="text-sm font-semibold text-gray-900">{merchant.financialStatus.totalWithdrawn}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Status</p>
                                    <p className="text-sm font-semibold text-gray-900">{merchant.financialStatus.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Content: KYC Status */}
            {activeTab === "KYC Status" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                    {merchant.kycIdentity && (
                        <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50/80 p-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Identity &amp; bank (submitted)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {merchant.kycIdentity.idType && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">ID type</p>
                                        <p className="font-medium text-gray-900">{merchant.kycIdentity.idType}</p>
                                    </div>
                                )}
                                {merchant.kycIdentity.idNumber && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">ID number</p>
                                        <p className="font-medium text-gray-900 break-all">{merchant.kycIdentity.idNumber}</p>
                                    </div>
                                )}
                                {merchant.kycIdentity.bankName && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Bank name</p>
                                        <p className="font-medium text-gray-900">{merchant.kycIdentity.bankName}</p>
                                    </div>
                                )}
                                {(merchant.kycIdentity.bankAccountNo || merchant.kycIdentity.bankAccountName) && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Bank account</p>
                                        <p className="font-medium text-gray-900">
                                            {merchant.kycIdentity.bankAccountName}
                                            {merchant.kycIdentity.bankAccountNo
                                                ? ` · ${merchant.kycIdentity.bankAccountNo}`
                                                : null}
                                        </p>
                                    </div>
                                )}
                                {merchant.kycIdentity.kycNote && (
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-gray-400 mb-0.5">Last note</p>
                                        <p className="text-gray-800">{merchant.kycIdentity.kycNote}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Submitted Documents</h3>
                        {merchant.kycStatusRaw === "PENDING" && (
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setShowApproveModal(true)}
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Approve KYC
                                </button>
                                <button 
                                    onClick={() => setShowRejectModal(true)}
                                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Reject KYC
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {merchant.kycDocuments.length === 0 ? (
                            <p className="text-sm text-gray-500 col-span-full text-center py-8">
                                No KYC documents submitted yet.
                            </p>
                        ) : (
                            merchant.kycDocuments.map((doc, i) => (
                                <div key={`${doc.name}-${i}`} className="border border-gray-200 rounded-xl p-4">
                                    <h4 className="text-sm font-bold text-gray-900 mb-3">{doc.name}</h4>
                                    <div className="w-full h-44 rounded-lg bg-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                                        {doc.previewUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={doc.previewUrl}
                                                alt={doc.name}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-400 px-2 text-center">No preview</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                            {doc.status}
                                        </span>
                                        <span className="text-sm text-gray-500">{doc.date}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Tab Content: Payment Methods */}
            {activeTab === "Payment Methods" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Connected Payment Methods</h3>
                    <div className="space-y-3">
                        {[
                            { method: "MTN Mobile Money", account: "024 XXX XXXX", status: "Active" },
                            { method: "Bank Transfer - GCB", account: "XXXX-XXXX-1234", status: "Active" },
                        ].map((pm, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{pm.method}</p>
                                    <p className="text-xs text-gray-500">{pm.account}</p>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                    {pm.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab Content: Risk Assessments */}
            {activeTab === "Risk Assesments" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500 text-sm">No risk assessments recorded for this merchant</p>
                </div>
            )}

            {/* Tab Content: Disputes */}
            {activeTab === "Disputes" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500 text-sm">No disputes filed against this merchant</p>
                </div>
            )}

            {/* Tab Content: Activity Log */}
            {activeTab === "Activity Log" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Log</h3>
                    <div className="space-y-3">
                        {[
                            { action: "Product listed: iPhone 15 Pro Max", time: "Today at 10:30 AM" },
                            { action: "Payment received: GHS 5,000", time: "Yesterday at 3:00 PM" },
                            { action: "Updated store description", time: "Feb 18, 2026 at 11:45 AM" },
                            { action: "KYC documents renewed", time: "Feb 10, 2026 at 9:00 AM" },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                                    <p className="text-xs text-gray-500">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
