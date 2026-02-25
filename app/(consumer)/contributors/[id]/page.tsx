"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, Target, UserPlus, Settings, XCircle, Copy, Loader2, CheckCircle, Share2, MessageCircle, Link2, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { GroupDashboardHeader } from "@/src/components/contributors/GroupDashboardHeader";
import { cn } from "@/src/lib/utils";

// Mock Activity Data
const RECENT_ACTIVITY = [
    {
        id: 1,
        type: "contribution",
        title: "Kofi Asante contributed GH₵10,000",
        date: "Jan 25, 2025",
        amount: "+GH₵10,000",
        icon: Wallet,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        id: 2,
        type: "milestone",
        title: "Group reached 35% of target! 🎉",
        date: "Jan 24, 2025",
        amount: null,
        icon: Target,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
    },
    {
        id: 3,
        type: "join",
        title: "Yaw Frimpong joined the group",
        date: "Jan 10, 2025",
        amount: null,
        icon: UserPlus,
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
    },
    {
        id: 4,
        type: "contribution",
        title: "Ama Mensah contributed GH₵5,000",
        date: "Jan 24, 2025",
        amount: "+GH₵5,000",
        icon: Wallet,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
];

type TabType = "Activity" | "Members" | "Contributions";
type ContributeStep = "amount" | "method" | "processing" | "success";

export default function GroupDashboardPage() {
    const [activeTab, setActiveTab] = useState<TabType>("Activity");

    // Modal States
    const [isContributeOpen, setIsContributeOpen] = useState(false);
    const [contributeStep, setContributeStep] = useState<ContributeStep>("amount");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const TABS: TabType[] = ["Activity", "Members", "Contributions"];

    const handleContinueToPayment = () => {
        if (!amount) return;
        setContributeStep("method");
    };

    const handleConfirmPayment = () => {
        if (!paymentMethod) return;
        setContributeStep("processing");
        // Simulate API delay
        setTimeout(() => {
            setContributeStep("success");
        }, 2000);
    };

    const resetContributeFlow = () => {
        setContributeStep("amount");
        setAmount("");
        setPaymentMethod("");
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">

                {/* Back Link */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a53c8] hover:text-[#1442a3] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <GroupDashboardHeader />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                    {/* LEFT COLUMN: Tabs & Feed */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Custom Tabs */}
                        <div className="flex items-center bg-[#f1f5fb] p-1.5 rounded-xl border border-gray-100 overflow-x-auto hide-scrollbar">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
                                        activeTab === tab
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Panel */}
                        <div className="bg-white border text-gray-900 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[400px]">
                            {activeTab === "Activity" && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-8">Recent Activity</h2>
                                    <div className="space-y-8 relative">
                                        {/* Vertical line connecting timeline items */}
                                        <div className="absolute left-6 top-10 bottom-0 w-px bg-gray-100" />

                                        {RECENT_ACTIVITY.map((activity) => (
                                            <div key={activity.id} className="flex items-start gap-4 relative z-10">
                                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-white", activity.iconBg, activity.iconColor)}>
                                                    <activity.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {activity.type === "contribution" || activity.type === "join" ? (
                                                                <>
                                                                    <span className="font-extrabold">{activity.title.split(" ")[0]} {activity.title.split(" ")[1]}</span>{" "}
                                                                    <span className="font-medium text-gray-700">{activity.title.split(" ").slice(2).join(" ")}</span>
                                                                </>
                                                            ) : (
                                                                activity.title
                                                            )}
                                                        </p>
                                                        <p className="text-xs font-semibold text-gray-400 mt-0.5">{activity.date}</p>
                                                    </div>
                                                    {activity.amount && (
                                                        <span className="text-sm font-bold text-green-600">
                                                            {activity.amount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "Members" && (
                                <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400 font-medium">
                                    Members coming soon
                                </div>
                            )}

                            {activeTab === "Contributions" && (
                                <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400 font-medium">
                                    Contribution history coming soon
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar Cards */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* My Contribution Card */}
                        <div className="bg-[#5761c9] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-white/90 font-medium text-sm mb-4">
                                    <Wallet className="w-4 h-4" />
                                    My Contribution
                                </div>
                                <div className="text-4xl font-extrabold tracking-tight mb-2">
                                    GH₵25,000
                                </div>
                                <div className="text-sm font-medium text-blue-100">
                                    28.6% of group total
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-6">Quick Actions</h3>
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={() => {
                                        resetContributeFlow();
                                        setIsContributeOpen(true);
                                    }}
                                    className="w-full h-12 bg-[#5761c9] hover:bg-[#4851a6] text-white font-bold rounded-xl"
                                >
                                    <Wallet className="w-4 h-4 mr-2" />
                                    Contribute
                                </Button>
                                <Button
                                    onClick={() => setIsInviteOpen(true)}
                                    variant="outline"
                                    className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl"
                                >
                                    <UserPlus className="w-4 h-4 text-gray-500 mr-2" />
                                    Invite Members
                                </Button>
                            </div>

                            <div className="h-px bg-gray-100 my-6" />

                            <div className="flex flex-col gap-4">
                                <button className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors w-full">
                                    <Settings className="w-4 h-4" />
                                    Group Settings
                                </button>
                                <button className="flex items-center justify-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors w-full">
                                    <XCircle className="w-4 h-4" />
                                    Cancel Group
                                </button>
                            </div>
                        </div>

                        {/* Group Details Summary Sheet */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-6">Group Details</h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-medium">Created</span>
                                    <span className="font-bold text-gray-900">Jan 1, 2026</span>
                                </div>
                                <div className="h-px bg-gray-100" />
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-medium">Contribution</span>
                                    <span className="font-bold text-gray-900">Flexible</span>
                                </div>
                                <div className="h-px bg-gray-100" />
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-medium">Target Date</span>
                                    <span className="font-bold text-gray-900">Dec 15, 2026</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* CONTRIBUTE MODAL */}
            <Dialog open={isContributeOpen} onOpenChange={setIsContributeOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden hide-close-button border-0 shadow-2xl bg-white" aria-describedby={undefined}>
                    <div className="p-8 pb-10 flex flex-col items-center relative">

                        {/* Hidden close button replacement to match shadcn API requirements */}
                        <DialogTitle className="sr-only">Contribute Modal</DialogTitle>

                        {contributeStep === "amount" && (
                            <div className="w-full flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#1a53c8] mb-4">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 text-center mb-6">
                                    Contribute to Kusi and Friends
                                </h2>

                                <div className="bg-[#f8faff] rounded-xl p-6 w-full text-center border border-blue-50 mb-6">
                                    <p className="text-[10px] text-[#1a53c8] font-semibold uppercase tracking-wider mb-2">
                                        Group Target Remaining
                                    </p>
                                    <p className="text-3xl font-extrabold text-[#1a53c8] tracking-tight mb-1">GH₵ 165,000</p>
                                    <p className="text-xs font-semibold text-[#1a53c8]/60">Toyota Hiace Bus</p>
                                </div>

                                <div className="w-full text-left space-y-2 mb-8">
                                    <label className="text-sm font-extrabold text-gray-900">
                                        Contribution Amount
                                    </label>
                                    <div className="relative flex items-center h-14 border-2 border-gray-200 rounded-xl focus-within:border-[#1a53c8] focus-within:ring-1 focus-within:ring-[#1a53c8] transition-all bg-white px-4">
                                        <span className="text-gray-900 font-extrabold border-r border-gray-200 pr-3 mr-3">
                                            GH₵
                                        </span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="flex-1 bg-transparent border-none outline-none font-bold text-lg text-gray-900"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleContinueToPayment}
                                    disabled={!amount || parseFloat(amount) <= 0}
                                    className="w-full h-12 bg-[#1a53c8] hover:bg-[#1442a3] text-white font-bold rounded-xl"
                                >
                                    Continue to Payment →
                                </Button>
                            </div>
                        )}

                        {contributeStep === "method" && (
                            <div className="w-full flex flex-col items-center">
                                <h2 className="text-xl font-extrabold text-gray-900 text-center">
                                    Contribute to Kusi and Friends
                                </h2>
                                <p className="text-sm font-bold text-[#1a53c8] mb-8">
                                    Contributing ₵{amount} to Class of 2024 Bus Fund
                                </p>

                                <div className="w-full space-y-3 mb-8">
                                    {[
                                        // We'll use colored rounded boxes and letters since we don't have the explicit PNG assets
                                        { id: "mtn", name: "MTN Mobile Money", widget: <div className="w-8 h-8 rounded-md bg-yellow-400 flex items-center justify-center font-extrabold text-blue-900 text-xs shadow-sm">MTN</div> },
                                        { id: "telecel", name: "Telecel Cash", widget: <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center font-extrabold text-white text-xs shadow-sm">TFC</div> },
                                        { id: "at", name: "AT Money", widget: <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center font-extrabold text-white text-xs shadow-sm"><span className="text-orange-500">A</span>T</div> },
                                        { id: "card", name: "Bank Cards", widget: <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm"><Wallet className="w-4 h-4 text-blue-800" /></div> }
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? "border-[#1a53c8] bg-blue-50/20 ring-1 ring-[#1a53c8]" : "border-gray-200 hover:border-gray-300"}`}
                                        >
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 bg-white relative">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    className="peer sr-only"
                                                    checked={paymentMethod === method.id}
                                                    onChange={() => setPaymentMethod(method.id)}
                                                />
                                                {paymentMethod === method.id && (
                                                    <div className="w-3 h-3 rounded-full bg-[#1a53c8] absolute" />
                                                )}
                                            </div>
                                            <div className="flex-shrink-0">
                                                {method.widget}
                                            </div>
                                            <span className="font-extrabold text-gray-900">{method.name}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="w-full flex gap-3">
                                    <Button
                                        onClick={() => setContributeStep("amount")}
                                        variant="outline"
                                        className="flex-1 h-12 border-2 border-gray-200 text-[#1a53c8] font-extrabold rounded-xl hover:bg-gray-50 hover:text-[#1442a3] transition-colors"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleConfirmPayment}
                                        disabled={!paymentMethod}
                                        className="flex-[2] h-12 bg-[#1a53c8] hover:bg-[#1442a3] text-white font-extrabold rounded-xl shadow-md transition-all"
                                    >
                                        Confirm Payment
                                    </Button>
                                </div>
                            </div>
                        )}

                        {contributeStep === "processing" && (
                            <div className="w-full flex flex-col items-center py-12">
                                <Loader2 className="w-12 h-12 animate-spin text-[#1a53c8] mb-6" />
                                <h2 className="text-xl font-extrabold text-gray-900 text-center mb-2">
                                    Processing Payment
                                </h2>
                                <p className="text-sm font-bold text-[#1a53c8]">
                                    Please wait while we process your contribution
                                </p>
                            </div>
                        )}

                        {contributeStep === "success" && (
                            <div className="w-full flex flex-col items-center py-12">
                                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/30">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 text-center mb-2">
                                    Contribution Successful!
                                </h2>
                                <p className="text-sm font-bold text-[#1a53c8] text-center mb-8">
                                    You've contributed ₵{amount} to Class of 2024 Bus Fund
                                </p>
                                {/* Auto close or manual close */}
                                <Button
                                    onClick={() => setIsContributeOpen(false)}
                                    className="w-full max-w-[200px] h-12 bg-[#1a53c8] text-white font-extrabold rounded-xl hover:bg-[#1442a3]"
                                >
                                    Done
                                </Button>
                            </div>
                        )}

                    </div>
                </DialogContent>
            </Dialog>

            {/* INVITE MODAL */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden hide-close-button border-0 shadow-2xl bg-white" aria-describedby={undefined}>
                    <div className="p-8 pb-10 flex flex-col items-center text-center relative">

                        <DialogTitle className="sr-only">Invite Members Modal</DialogTitle>

                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#1a53c8] mb-4">
                            <Users className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900 mb-2">
                            Invite Members
                        </h2>
                        <p className="text-sm text-[#1a53c8] font-semibold mb-8 max-w-[280px]">
                            Share the link below to invite friends and family to join your group goal
                        </p>

                        <div className="w-full text-left space-y-1 mb-4">
                            <span className="text-xs font-bold text-gray-900 ml-1">Invite Code</span>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center bg-[#f1f5fb] border border-gray-200 rounded-xl px-3 h-11">
                                    <Link2 className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                                    <span className="text-sm text-gray-500 font-medium truncate">
                                        https://id-preview--fa2dafec-af71-44...
                                    </span>
                                </div>
                                <Button variant="outline" className="w-11 h-11 p-0 rounded-xl border-2 border-[#1a53c8] bg-white text-[#1a53c8] hover:bg-blue-50/50 hover:text-[#1a53c8]">
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="w-full bg-[#f8faff] border border-blue-50 rounded-xl py-6 mb-8 mt-2">
                            <p className="text-[10px] font-bold text-[#1a53c8] uppercase tracking-widest mb-2">
                                Invite Code
                            </p>
                            <p className="text-3xl font-extrabold text-[#1a53c8] tracking-widest">
                                CLASS2024BUS
                            </p>
                        </div>

                        <div className="w-full space-y-3 mb-6">
                            <Button className="w-full h-12 bg-[#1a53c8] hover:bg-[#1442a3] text-white font-extrabold rounded-xl transition-all shadow-sm">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Share via Whatsapp
                            </Button>
                            <Button variant="outline" className="w-full h-12 border-2 border-[#1a53c8] text-[#1a53c8] bg-white hover:bg-blue-50/50 hover:text-[#1a53c8] font-extrabold rounded-xl transition-all">
                                <Share2 className="w-5 h-5 mr-2" />
                                More Share Options
                            </Button>
                        </div>

                        <p className="text-[11px] text-[#1a53c8] font-bold opacity-80 max-w-[300px] leading-relaxed">
                            Anyone with this link can request to join your group. You'll receive a notification when someone joins.
                        </p>

                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
