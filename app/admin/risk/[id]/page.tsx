"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import {
    ArrowLeft,
    AlertTriangle,
    TrendingUp,
    FileText,
    Info,
    Clock,
} from "lucide-react";
import { useAdminRiskDetail } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";

const TABS = ["Overview", "Activity Log", "Associated Plans", "Investigation Notes"];

export default function AdminRiskDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [activeTab, setActiveTab] = useState("Overview");
    const { data: entity, isLoading, error, refetch } = useAdminRiskDetail(id);

    if (isLoading) return <AdminLoadingSkeleton />;
    if (error || !entity) return <AdminErrorState message={error || "Entity not found"} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link
                href="/admin/risk"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Risk & Compliance
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1e2a4a]">Risk Investigation</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Complete analysis and action dashboard for flagged entity
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Assigned to: <span className="font-semibold">{entity.assignedTo}</span></span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                        {entity.reviewStatus}
                    </span>
                </div>
            </div>

            {/* Red Investigation Banner */}
            <div className="rounded-2xl overflow-hidden bg-red">
                {/* Top section - user info */}
                <div className="bg-gradient-to-r from-red-500 to-red-400 p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-red-200 mb-1">User Under Investigation</p>
                            <h2 className="text-2xl font-bold text-white">{entity.name}</h2>
                            <p className="text-sm text-red-200 mt-0.5">Flagged on {entity.flaggedOn}</p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center">
                            <span className="text-xl font-bold text-red-500">{entity.riskScore}</span>
                            <span className="text-[9px] text-red-400 font-medium">{entity.riskLevel}</span>
                        </div>
                    </div>
                </div>
                {/* Bottom stats strip */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 grid grid-cols-4 gap-4">
                    <div className="flex flex-col items-center text-white">
                        <AlertTriangle className="h-4 w-4 mb-1 text-red-200" />
                        <span className="text-xl font-bold">{entity.flags}</span>
                        <span className="text-[10px] uppercase tracking-wider text-red-200">FLAGS</span>
                    </div>
                    <div className="flex flex-col items-center text-white">
                        <TrendingUp className="h-4 w-4 mb-1 text-red-200" />
                        <span className="text-xl font-bold">{entity.activity}</span>
                        <span className="text-[10px] uppercase tracking-wider text-red-200">ACTIVITY</span>
                    </div>
                    <div className="flex flex-col items-center text-white">
                        <FileText className="h-4 w-4 mb-1 text-red-200" />
                        <span className="text-xl font-bold">{entity.plans}</span>
                        <span className="text-[10px] uppercase tracking-wider text-red-200">PLANS</span>
                    </div>
                    <div className="flex flex-col items-center text-white">
                        <Info className="h-4 w-4 mb-1 text-red-200" />
                        <span className="text-xl font-bold">{entity.status}</span>
                        <span className="text-[10px] uppercase tracking-wider text-red-200">STATUS</span>
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

            {/* Overview Tab Content */}
            {activeTab === "Overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left Column (2/5) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 border-l-4 border-l-red-400">
                            <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                                Profile Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Email Address</p>
                                    <p className="text-sm font-bold text-gray-900">{entity.profile.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                                    <p className="text-sm font-bold text-gray-900">{entity.profile.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Member Since</p>
                                    <p className="text-sm font-bold text-gray-900">{entity.profile.memberSince}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Location</p>
                                    <p className="text-sm font-bold text-gray-900">{entity.profile.location}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">Verification Status</span>
                                    <span className="text-sm font-semibold text-green-600">✓ {entity.profile.verificationStatus}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 border-l-4 border-l-gray-300">
                            <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5">
                                Actions
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full py-2.5 bg-[#0754FF] text-white text-sm font-bold rounded-lg hover:bg-[#0643cc] transition-colors">
                                    Contact User
                                </button>
                                <button className="w-full py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors">
                                    Clear and Approve
                                </button>
                                <button className="w-full py-2.5 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 transition-colors">
                                    Suspend Account
                                </button>
                                <button className="w-full py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors">
                                    Block Permanently
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (3/5) - Risk Factors */}
                    <div className="lg:col-span-3">
                        <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-200 mb-5 italic">
                            Risk Factors Detected
                        </h3>
                        <div className="space-y-4">
                            {entity.riskFactors.map((factor, i) => {
                                const isHigh = factor.severity === "High";
                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "rounded-xl p-5 border-l-4",
                                            isHigh
                                                ? "bg-red-50 border-l-red-500 border border-red-100"
                                                : "bg-orange-50 border-l-amber-400 border border-amber-100"
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className={cn("h-4 w-4 mt-0.5 flex-shrink-0", isHigh ? "text-red-500" : "text-amber-500")} />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{factor.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                                        <Clock className="h-3 w-3" />
                                                        {factor.date}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "text-xs font-semibold flex-shrink-0",
                                                isHigh ? "text-red-500" : "text-amber-600"
                                            )}>
                                                {factor.severity}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Other tabs placeholders */}
            {activeTab === "Activity Log" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500 text-sm">Activity log will be displayed here</p>
                </div>
            )}
            {activeTab === "Associated Plans" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500 text-sm">Associated plans will be displayed here</p>
                </div>
            )}
            {activeTab === "Investigation Notes" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500 text-sm">Investigation notes will be displayed here</p>
                </div>
            )}
        </div>
    );
}
