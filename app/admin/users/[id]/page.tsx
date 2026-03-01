"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { ArrowLeft, ShieldAlert, ShieldCheck } from "lucide-react";
import { useAdminUserDetail, useUpdateUserStatus } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState, AdminToast, AdminConfirmDialog } from "@/src/components/admin/AdminFeedback";

const TABS = [
    "Risk Level",
    "Password Resets",
    "Savings Plans",
    "Risk Assessments",
    "Objects",
    "Activity Log",
];

const planStatusStyles: Record<string, string> = {
    "On Track": "text-green-600",
    "Behind": "text-red-500",
    "Completed": "text-blue-600",
};

export default function AdminUserDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [activeTab, setActiveTab] = useState("Savings Plans");
    const { data: user, isLoading, error, refetch } = useAdminUserDetail(id);
    const { mutate: updateStatus, isLoading: suspendLoading } = useUpdateUserStatus();
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const isSuspended = user?.status === "Suspended";

    const handleSuspendToggle = async () => {
        const newStatus = isSuspended ? "Active" : "Suspended";
        const result = await updateStatus(id, newStatus);
        setShowConfirm(false);
        if (result !== undefined) {
            setToast({ message: `User ${newStatus === "Suspended" ? "suspended" : "reactivated"} successfully`, type: "success" });
            refetch();
        } else {
            setToast({ message: "Failed to update user status", type: "error" });
        }
    };

    if (isLoading) return <AdminLoadingSkeleton />;
    if (error || !user) return <AdminErrorState message={error || "User not found"} onRetry={refetch} />;

    const SAVINGS_PLANS = user.savingsPlans || [];

    return (
        <div className="space-y-6">
            {toast && <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {showConfirm && (
                <AdminConfirmDialog
                    title={isSuspended ? "Reactivate User" : "Suspend User"}
                    message={isSuspended ? `Are you sure you want to reactivate ${user.name}?` : `Are you sure you want to suspend ${user.name}? They will lose access to their account.`}
                    confirmLabel={isSuspended ? "Reactivate" : "Suspend"}
                    confirmVariant={isSuspended ? "primary" : "danger"}
                    isLoading={suspendLoading}
                    onConfirm={handleSuspendToggle}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
            {/* Back Link */}
            <Link
                href="/admin/users"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                back to User List
            </Link>

            {/* User Profile Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                            {user.initial}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                    {user.status}
                                </span>
                                {user.kycVerified && (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                        KYC Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors",
                            isSuspended ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                        )}
                    >
                        {isSuspended ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                        {isSuspended ? "Unsuspend" : "Suspend"}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mt-6 border-b border-gray-100">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2.5 text-sm font-medium transition-colors relative",
                                activeTab === tab
                                    ? "text-[#0754FF]"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0754FF] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === "Savings Plans" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-5">Active SNBL Plans</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Goal</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Saved</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {SAVINGS_PLANS.map((plan) => (
                                    <tr key={plan.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 text-sm font-medium text-gray-900">{plan.product}</td>
                                        <td className="py-3.5 text-sm text-gray-700">{plan.target}</td>
                                        <td className="py-3.5 text-sm text-gray-700">{plan.goal}</td>
                                        <td className="py-3.5 text-sm text-gray-600">{plan.with}</td>
                                        <td className="py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-20 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full", plan.progress >= 70 ? "bg-green-500" : plan.progress >= 40 ? "bg-blue-500" : "bg-red-400")}
                                                        style={{ width: `${plan.progress}%` }}
                                                    />
                                                </div>
                                                <span className={cn("text-xs font-medium", planStatusStyles[plan.status])}>
                                                    {plan.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "Risk Level" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Full Name</span>
                                <span className="text-sm font-medium text-gray-900">{user.personal.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Phone</span>
                                <span className="text-sm font-medium text-gray-900">{user.personal.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Joined</span>
                                <span className="text-sm font-medium text-gray-900">{user.personal.joinDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Email</span>
                                <span className="text-sm font-medium text-gray-900">{user.personal.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Status */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Funds</span>
                                <span className="text-sm font-medium text-gray-900">{user.financial.funds}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Status</span>
                                <span className="text-sm font-medium text-green-600">{user.financial.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Joined</span>
                                <span className="text-sm font-medium text-gray-900">{user.financial.joinDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Total Savings</span>
                                <span className="text-sm font-medium text-gray-900">{user.financial.totalSavings}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Password Resets" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500 text-sm">No password reset history available</p>
                </div>
            )}

            {activeTab === "Risk Assessments" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500 text-sm">No risk assessments recorded</p>
                </div>
            )}

            {activeTab === "Objects" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500 text-sm">No objects associated with this user</p>
                </div>
            )}

            {activeTab === "Activity Log" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Log</h3>
                    <div className="space-y-3">
                        {[
                            { action: "Logged in", time: "Today at 2:30 PM", ip: "192.168.1.1" },
                            { action: "Updated profile photo", time: "Yesterday at 11:00 AM", ip: "192.168.1.1" },
                            { action: "Made payment of GHS 500", time: "Feb 18, 2026 at 3:15 PM", ip: "10.0.0.5" },
                            { action: "Created savings plan", time: "Feb 15, 2026 at 9:00 AM", ip: "10.0.0.5" },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                                    <p className="text-xs text-gray-500">{log.time}</p>
                                </div>
                                <span className="text-xs text-gray-400">{log.ip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
