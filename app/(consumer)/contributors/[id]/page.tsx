"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wallet, Target, UserPlus, Settings, XCircle, Copy, Loader2, CheckCircle, Share2, MessageCircle, Link2, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { GroupDashboardHeader } from "@/src/components/contributors/GroupDashboardHeader";
import { cn } from "@/src/lib/utils";
import { useSavingsGoalDetail } from "@/src/domains/savings-goals/savings.hooks";
import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { Skeleton } from "@/src/components/ui/skeleton";

// Contribution from the public API
interface Contribution {
    id: string;
    contributorName: string;
    message?: string;
    amount: number;
    createdAt: string;
}

type TabType = "Activity" | "Members" | "Contributions";
type ContributeStep = "amount" | "method" | "processing" | "success";

function formatCurrency(amount: number) {
    return `GH₵${Number(amount).toLocaleString()}`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function GroupDashboardPage() {
    const params = useParams();
    const goalId = params.id as string;

    const { goal, isLoading, error } = useSavingsGoalDetail(goalId);

    // Contributions from the public API
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [isLoadingContributions, setIsLoadingContributions] = useState(true);

    const fetchContributions = useCallback(async () => {
        try {
            setIsLoadingContributions(true);
            const res = await apiClient.get<Contribution[] | { data: Contribution[] }>(
                API_ENDPOINTS.PUBLIC_GOALS.CONTRIBUTIONS(goalId),
                { skipAuth: true }
            );
            const items = Array.isArray(res) ? res : (res as unknown as Record<string, unknown>).data as Contribution[] || [];
            setContributions(items);
        } catch {
            // Contributions endpoint may not be available yet
            setContributions([]);
        } finally {
            setIsLoadingContributions(false);
        }
    }, [goalId]);

    useEffect(() => {
        if (goalId) fetchContributions();
    }, [goalId, fetchContributions]);

    const [activeTab, setActiveTab] = useState<TabType>("Activity");

    // Modal States
    const [isContributeOpen, setIsContributeOpen] = useState(false);
    const [contributeStep, setContributeStep] = useState<ContributeStep>("amount");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentDetails, setPaymentDetails] = useState("");
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // Card-specific state
    const [cardType, setCardType] = useState<"visa" | "mastercard" | "">("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardName, setCardName] = useState("");

    const TABS: TabType[] = ["Activity", "Members", "Contributions"];

    const handleContinueToPayment = () => {
        if (!amount) return;
        setContributeStep("method");
    };

    const handleConfirmPayment = () => {
        if (!paymentMethod) return;
        if (paymentMethod === "card") {
            if (!cardType || cardNumber.replace(/\s/g, "").length < 16 || cardExpiry.length < 5 || cardCvv.length < 3 || !cardName.trim()) return;
        } else {
            if (!paymentDetails.trim()) return;
        }
        setContributeStep("processing");
        setTimeout(() => {
            setContributeStep("success");
        }, 2000);
    };

    const resetContributeFlow = () => {
        setContributeStep("amount");
        setAmount("");
        setPaymentMethod("");
        setPaymentDetails("");
        setCardType("");
        setCardNumber("");
        setCardExpiry("");
        setCardCvv("");
        setCardName("");
    };

    // Phone number label for mobile money methods
    const getMomoLabel = () => {
        switch (paymentMethod) {
            case "mtn": return "MTN Mobile Money Number";
            case "telecel": return "Telecel Cash Number";
            case "at": return "AT Money Number";
            default: return "Phone Number";
        }
    };

    // Format card number with spaces every 4 digits
    const handleCardNumberChange = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
        setCardNumber(formatted);
    };

    // Format expiry as MM/YY
    const handleExpiryChange = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 3) {
            setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
        } else {
            setCardExpiry(digits);
        }
    };

    // Card form validity check
    const isCardFormValid = cardType && cardNumber.replace(/\s/g, "").length === 16 && cardExpiry.length === 5 && cardCvv.length >= 3 && cardName.trim().length > 0;
    const isPaymentValid = paymentMethod === "card" ? isCardFormValid : paymentDetails.trim().length > 0;

    // Derive share URL
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/contributors/${goalId}` : "";

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
        } catch { /* noop */ }
    };

    // Loading & error states
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <Skeleton className="h-4 w-36 mb-6" />
                    <Skeleton className="h-[280px] rounded-2xl mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Skeleton className="h-[400px] rounded-2xl" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-[150px] rounded-2xl" />
                            <Skeleton className="h-[200px] rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !goal) {
        return (
            <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto text-center pt-20">
                    <p className="text-red-600 font-medium text-lg">{error || "Goal not found"}</p>
                    <Link href="/dashboard" className="text-[#1a53c8] underline text-sm mt-4 inline-block">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    const remaining = Number(goal.targetAmount) - Number(goal.currentAmount);
    const goalName = goal.name || goal.product?.name || "Group Savings";
    const productName = goal.product?.name;
    const merchantName = goal.product?.merchant?.businessName;
    const productImage = goal.product?.images?.[0];

    // Build activity feed from contributions
    const activityItems = contributions.map((c) => ({
        id: c.id,
        type: "contribution" as const,
        title: `${c.contributorName} contributed ${formatCurrency(Number(c.amount))}`,
        date: formatDate(c.createdAt),
        amount: `+${formatCurrency(Number(c.amount))}`,
        icon: Wallet,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    }));

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

                <GroupDashboardHeader
                    name={goalName}
                    description={goal.product?.name ? `Saving together for ${goal.product.name}` : undefined}
                    status={goal.status}
                    image={productImage}
                    merchantName={merchantName}
                    productName={productName}
                    currentAmount={Number(goal.currentAmount)}
                    targetAmount={Number(goal.targetAmount)}
                    contributorsCount={contributions.length}
                />

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
                                    {isLoadingContributions ? (
                                        <div className="space-y-6">
                                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                                        </div>
                                    ) : activityItems.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <Target className="w-12 h-12 mb-4 opacity-50" />
                                            <p className="font-medium">No activity yet</p>
                                            <p className="text-sm">Share this goal to start receiving contributions</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 relative">
                                            <div className="absolute left-6 top-10 bottom-0 w-px bg-gray-100" />
                                            {activityItems.map((activity) => (
                                                <div key={activity.id} className="flex items-start gap-4 relative z-10">
                                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-white", activity.iconBg, activity.iconColor)}>
                                                        <activity.icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                                                            <p className="text-xs font-semibold text-gray-400 mt-0.5">{activity.date}</p>
                                                        </div>
                                                        <span className="text-sm font-bold text-green-600">{activity.amount}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "Members" && (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400">
                                    <Users className="w-12 h-12 mb-4 opacity-50" />
                                    <p className="font-medium">Members coming soon</p>
                                </div>
                            )}

                            {activeTab === "Contributions" && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">All Contributions</h2>
                                    {isLoadingContributions ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                                        </div>
                                    ) : contributions.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <Wallet className="w-12 h-12 mb-4 opacity-50" />
                                            <p className="font-medium">No contributions yet</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {contributions.map((c) => (
                                                <div key={c.id} className="flex items-center justify-between py-4">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{c.contributorName}</p>
                                                        {c.message && <p className="text-xs text-gray-500 mt-0.5 italic">&quot;{c.message}&quot;</p>}
                                                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(c.createdAt)}</p>
                                                    </div>
                                                    <span className="text-sm font-bold text-green-600">+{formatCurrency(Number(c.amount))}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                    {formatCurrency(Number(goal.currentAmount))}
                                </div>
                                <div className="text-sm font-medium text-blue-100">
                                    {Number(goal.targetAmount) > 0
                                        ? `${Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100)}% of group total`
                                        : "0% of group total"
                                    }
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

                        {/* Group Details Summary */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-6">Group Details</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-medium">Created</span>
                                    <span className="font-bold text-gray-900">{formatDate(goal.createdAt)}</span>
                                </div>
                                <div className="h-px bg-gray-100" />
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-medium">Contribution</span>
                                    <span className="font-bold text-gray-900">Flexible</span>
                                </div>
                                {goal.estimatedCompletionDate && (
                                    <>
                                        <div className="h-px bg-gray-100" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500 font-medium">Target Date</span>
                                            <span className="font-bold text-gray-900">{formatDate(goal.estimatedCompletionDate)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* CONTRIBUTE MODAL */}
            <Dialog open={isContributeOpen} onOpenChange={setIsContributeOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden hide-close-button border-0 shadow-2xl bg-white" aria-describedby={undefined}>
                    <div className="p-8 pb-10 flex flex-col items-center relative">
                        <DialogTitle className="sr-only">Contribute Modal</DialogTitle>

                        {contributeStep === "amount" && (
                            <div className="w-full flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#1a53c8] mb-4">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 text-center mb-6">
                                    Contribute to {goalName}
                                </h2>

                                <div className="bg-[#f8faff] rounded-xl p-6 w-full text-center border border-blue-50 mb-6">
                                    <p className="text-[10px] text-[#1a53c8] font-semibold uppercase tracking-wider mb-2">
                                        Group Target Remaining
                                    </p>
                                    <p className="text-3xl font-extrabold text-[#1a53c8] tracking-tight mb-1">{formatCurrency(remaining)}</p>
                                    {productName && <p className="text-xs font-semibold text-[#1a53c8]/60">{productName}</p>}
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
                                    Contribute to {goalName}
                                </h2>
                                <p className="text-sm font-bold text-[#1a53c8] mb-8">
                                    Contributing ₵{amount} to {goalName}
                                </p>

                                <div className="w-full space-y-3 mb-8">
                                    {[
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
                                                <input type="radio" name="payment_method" className="peer sr-only" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} />
                                                {paymentMethod === method.id && <div className="w-3 h-3 rounded-full bg-[#1a53c8] absolute" />}
                                            </div>
                                            <div className="flex-shrink-0">{method.widget}</div>
                                            <span className="font-extrabold text-gray-900">{method.name}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Mobile Money: Phone Number Input */}
                                {paymentMethod && paymentMethod !== "card" && (
                                    <div className="w-full text-left space-y-2 mb-8">
                                        <label className="text-sm font-extrabold text-gray-900">
                                            {getMomoLabel()}
                                        </label>
                                        <div className="relative flex items-center h-14 border-2 border-gray-200 rounded-xl focus-within:border-[#1a53c8] focus-within:ring-1 focus-within:ring-[#1a53c8] transition-all bg-white px-4">
                                            <input
                                                type="tel"
                                                value={paymentDetails}
                                                onChange={(e) => setPaymentDetails(e.target.value)}
                                                placeholder="e.g. 024 XXX XXXX"
                                                className="flex-1 bg-transparent border-none outline-none font-bold text-lg text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Bank Cards: Visa / Mastercard sub-selection + card form */}
                                {paymentMethod === "card" && (
                                    <div className="w-full space-y-5 mb-8">
                                        {/* Card Type Sub-selector */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-900">Select Card Type</label>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => { setCardType("visa"); setCardNumber(""); }}
                                                    className={`flex-1 flex items-center justify-center gap-2.5 p-3.5 border-2 rounded-xl transition-all ${cardType === "visa"
                                                            ? "border-[#1a53c8] bg-blue-50/30 ring-1 ring-[#1a53c8]"
                                                            : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <div className="w-10 h-7 rounded bg-[#1a1f71] flex items-center justify-center">
                                                        <span className="text-white font-extrabold text-[10px] italic tracking-wide">VISA</span>
                                                    </div>
                                                    <span className="font-bold text-sm text-gray-900">Visa</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setCardType("mastercard"); setCardNumber(""); }}
                                                    className={`flex-1 flex items-center justify-center gap-2.5 p-3.5 border-2 rounded-xl transition-all ${cardType === "mastercard"
                                                            ? "border-[#1a53c8] bg-blue-50/30 ring-1 ring-[#1a53c8]"
                                                            : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <div className="w-10 h-7 rounded bg-gradient-to-r from-[#eb001b] to-[#f79e1b] flex items-center justify-center relative overflow-hidden">
                                                        <div className="absolute w-4 h-4 rounded-full bg-[#eb001b] opacity-90 -left-0.5" />
                                                        <div className="absolute w-4 h-4 rounded-full bg-[#f79e1b] opacity-90 left-2" />
                                                    </div>
                                                    <span className="font-bold text-sm text-gray-900">Mastercard</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Form — appears after selecting card type */}
                                        {cardType && (
                                            <div className="space-y-4 animate-in fade-in duration-200">
                                                {/* Cardholder Name */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Cardholder Name</label>
                                                    <div className="flex items-center h-12 border-2 border-gray-200 rounded-xl focus-within:border-[#1a53c8] focus-within:ring-1 focus-within:ring-[#1a53c8] transition-all bg-white px-4">
                                                        <input
                                                            type="text"
                                                            value={cardName}
                                                            onChange={(e) => setCardName(e.target.value)}
                                                            placeholder="Name on card"
                                                            className="flex-1 bg-transparent border-none outline-none font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Card Number */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Card Number</label>
                                                    <div className="flex items-center h-12 border-2 border-gray-200 rounded-xl focus-within:border-[#1a53c8] focus-within:ring-1 focus-within:ring-[#1a53c8] transition-all bg-white px-4">
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            value={cardNumber}
                                                            onChange={(e) => handleCardNumberChange(e.target.value)}
                                                            placeholder={cardType === "visa" ? "4XXX XXXX XXXX XXXX" : "5XXX XXXX XXXX XXXX"}
                                                            className="flex-1 bg-transparent border-none outline-none font-mono font-semibold text-gray-900 tracking-wider placeholder:text-gray-300 placeholder:font-medium placeholder:tracking-wider"
                                                        />
                                                        {/* Card brand indicator */}
                                                        <div className="flex-shrink-0 ml-2">
                                                            {cardType === "visa" ? (
                                                                <div className="w-8 h-5 rounded bg-[#1a1f71] flex items-center justify-center">
                                                                    <span className="text-white font-extrabold text-[7px] italic tracking-wide">VISA</span>
                                                                </div>
                                                            ) : (
                                                                <div className="w-8 h-5 rounded bg-gradient-to-r from-[#eb001b] to-[#f79e1b] flex items-center justify-center relative overflow-hidden">
                                                                    <div className="absolute w-3 h-3 rounded-full bg-[#eb001b] opacity-90 -left-0.5" />
                                                                    <div className="absolute w-3 h-3 rounded-full bg-[#f79e1b] opacity-90 left-1.5" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Expiry + CVV row */}
                                                <div className="flex gap-3">
                                                    <div className="flex-1 space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Expiry Date</label>
                                                        <div className="flex items-center h-12 border-2 border-gray-200 rounded-xl focus-within:border-[#1a53c8] focus-within:ring-1 focus-within:ring-[#1a53c8] transition-all bg-white px-4">
                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={cardExpiry}
                                                                onChange={(e) => handleExpiryChange(e.target.value)}
                                                                placeholder="MM/YY"
                                                                maxLength={5}
                                                                className="flex-1 bg-transparent border-none outline-none font-mono font-semibold text-gray-900 text-center tracking-widest placeholder:text-gray-300 placeholder:font-medium"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">CVV</label>
                                                        <div className="flex items-center h-12 border-2 border-gray-200 rounded-xl focus-within:border-[#1a53c8] focus-within:ring-1 focus-within:ring-[#1a53c8] transition-all bg-white px-4">
                                                            <input
                                                                type="password"
                                                                inputMode="numeric"
                                                                value={cardCvv}
                                                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                                placeholder="•••"
                                                                maxLength={4}
                                                                className="flex-1 bg-transparent border-none outline-none font-mono font-semibold text-gray-900 text-center tracking-[0.3em] placeholder:text-gray-300"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="w-full flex gap-3">
                                    <Button onClick={() => setContributeStep("amount")} variant="outline" className="flex-1 h-12 border-2 border-gray-200 text-[#1a53c8] font-extrabold rounded-xl hover:bg-gray-50 hover:text-[#1442a3] transition-colors">
                                        Back
                                    </Button>
                                    <Button onClick={handleConfirmPayment} disabled={!paymentMethod || !isPaymentValid} className="flex-[2] h-12 bg-[#1a53c8] hover:bg-[#1442a3] text-white font-extrabold rounded-xl shadow-md transition-all">
                                        Confirm Payment
                                    </Button>
                                </div>
                            </div>
                        )}

                        {contributeStep === "processing" && (
                            <div className="w-full flex flex-col items-center py-12">
                                <Loader2 className="w-12 h-12 animate-spin text-[#1a53c8] mb-6" />
                                <h2 className="text-xl font-extrabold text-gray-900 text-center mb-2">Processing Payment</h2>
                                <p className="text-sm font-bold text-[#1a53c8]">Please wait while we process your contribution</p>
                            </div>
                        )}

                        {contributeStep === "success" && (
                            <div className="w-full flex flex-col items-center py-12">
                                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/30">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 text-center mb-2">Contribution Successful!</h2>
                                <p className="text-sm font-bold text-[#1a53c8] text-center mb-8">
                                    You&apos;ve contributed ₵{amount} to {goalName}
                                </p>
                                <Button onClick={() => setIsContributeOpen(false)} className="w-full max-w-[200px] h-12 bg-[#1a53c8] text-white font-extrabold rounded-xl hover:bg-[#1442a3]">
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
                        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Invite Members</h2>
                        <p className="text-sm text-[#1a53c8] font-semibold mb-8 max-w-[280px]">
                            Share the link below to invite friends and family to contribute to your group goal
                        </p>

                        <div className="w-full text-left space-y-1 mb-4">
                            <span className="text-xs font-bold text-gray-900 ml-1">Share Link</span>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center bg-[#f1f5fb] border border-gray-200 rounded-xl px-3 h-11">
                                    <Link2 className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                                    <span className="text-sm text-gray-500 font-medium truncate">
                                        {shareUrl || "Loading..."}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleCopyLink}
                                    variant="outline"
                                    className="w-11 h-11 p-0 rounded-xl border-2 border-[#1a53c8] bg-white text-[#1a53c8] hover:bg-blue-50/50 hover:text-[#1a53c8]"
                                >
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="w-full space-y-3 mb-6 mt-4">
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
                            Anyone with this link can view and contribute to your goal.
                        </p>

                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
