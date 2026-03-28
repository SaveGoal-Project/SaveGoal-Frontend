"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays, Info } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useProduct } from "@/src/domains/products/products.hooks";
import { useCreateSavingsGoal } from "@/src/domains/savings-goals/savings.hooks";
import { SavingsFrequency } from "@/src/domains/savings-goals/savings.types";

type Frequency = "weekly" | "biweekly" | "monthly";

export default function CreateSavingsPlanPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const { product, isLoading } = useProduct(productId);
    const [frequency, setFrequency] = useState<Frequency>("monthly");
    const [selectedMonths, setSelectedMonths] = useState(3);
    const [isConfirming, setIsConfirming] = useState(false);

    const { create } = useCreateSavingsGoal();

    const planDetails = useMemo(() => {
        if (!product) return null;

        const now = new Date();
        let periods: number;
        let perPayment: number;
        let frequencyLabel: string;
        let completionDate: Date;

        switch (frequency) {
            case "weekly":
                periods = 20;
                perPayment = Math.ceil(product.price / periods);
                frequencyLabel = "Weekly";
                completionDate = new Date(
                    now.getTime() + periods * 7 * 24 * 60 * 60 * 1000
                );
                break;
            case "biweekly":
                periods = 10;
                perPayment = Math.ceil(product.price / periods);
                frequencyLabel = "Bi-Weekly";
                completionDate = new Date(
                    now.getTime() + periods * 14 * 24 * 60 * 60 * 1000
                );
                break;
            case "monthly":
                periods = selectedMonths;
                perPayment = Math.ceil(product.price / periods);
                frequencyLabel = `Monthly · ${periods} month${periods > 1 ? "s" : ""}`;
                completionDate = new Date(now);
                completionDate.setMonth(completionDate.getMonth() + periods);
                break;
        }

        const startFull = now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        const completionFull = completionDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        const completionMonth = `${completionDate.toLocaleString("en-US", { month: "long" })} ${completionDate.getFullYear()}`;

        return {
            periods,
            perPayment,
            frequencyLabel,
            startFull,
            completionFull,
            completionMonth,
        };
    }, [product, frequency, selectedMonths]);

    const handleConfirm = async () => {
        if (!product || !planDetails) return;
        setIsConfirming(true);
        try {
            let apiFrequency: SavingsFrequency = "WEEKLY";
            if (frequency === "biweekly") apiFrequency = "BIWEEKLY";
            if (frequency === "monthly") apiFrequency = "MONTHLY";

            let automatedMonthlyAmount = planDetails.perPayment;
            if (frequency === "weekly") {
                automatedMonthlyAmount = planDetails.perPayment * 4;
            } else if (frequency === "biweekly") {
                automatedMonthlyAmount = planDetails.perPayment * 2;
            }

            const today = new Date().getDate();
            const savingsDay = today > 28 ? 28 : today;

            const goal = await create({
                name: product.name,
                productId: product.id,
                targetAmount: product.price,
                frequency: apiFrequency,
                isRecurring: true,
                monthlyAmount: automatedMonthlyAmount,
                savingsDay: savingsDay
            });

            if (goal?.id) {
                router.push(`/goals/${goal.id}`);
            } else {
                router.push("/products");
            }
        } catch (error) {
            console.error("Failed to create savings plan:", error);
        } finally {
            setIsConfirming(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f7f8fc]">
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse space-y-8">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-10 bg-gray-200 rounded w-80" />
                        <div className="h-4 bg-gray-200 rounded w-64" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="h-[400px] bg-gray-200 rounded-2xl" />
                            <div className="h-[400px] bg-gray-200 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product || !planDetails) {
        return (
            <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Product Not Found
                    </h2>
                    <Button
                        onClick={() => router.push("/products")}
                        className="bg-[#3d4a99] hover:bg-[#2d3369] text-white rounded-xl px-6"
                    >
                        Browse Products
                    </Button>
                </div>
            </div>
        );
    }

    const monthOptions = [1, 2, 3, 4, 5];

    return (
        <div className="min-h-screen bg-[#f7f8fc]">
            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Back Link */}
                <Link
                    href={`/products/${productId}`}
                    className="inline-flex items-center gap-2 text-[#3d4a99] hover:text-[#2d3369] text-sm font-medium mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Product
                </Link>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
                        Create Your Savings Plan
                    </h1>
                    <p className="text-sm text-gray-400">
                        Set up your payment schedule and start saving
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left Card — Plan Configuration */}
                    <div className="bg-white rounded-2xl border border-[#3d4a99]/30 p-6 md:p-8 space-y-8">
                        {/* Product Info Row */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-[80px] h-[60px] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-black">
                                    {product.name}
                                </h3>
                                <p className="text-sm font-bold text-[#3d4a99]">
                                    {product.formattedPrice || `GH¢${product.price.toLocaleString()}`}
                                </p>
                            </div>
                        </div>

                        {/* Frequency Selection */}
                        <div className="space-y-4">
                            <p className="text-sm text-gray-400">
                                How often would you like to save?
                            </p>
                            <div className="flex gap-3">
                                {/* Monthly — Recommended / Primary */}
                                <button
                                    onClick={() => setFrequency("monthly")}
                                    className={`relative flex-[1.3] py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${frequency === "monthly"
                                        ? "border-[#3d4a99] bg-[#3d4a99]/10 text-[#3d4a99] shadow-sm"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    Monthly
                                </button>
                                {/* Weekly */}
                                <button
                                    onClick={() => setFrequency("weekly")}
                                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${frequency === "weekly"
                                        ? "border-[#3d4a99] bg-[#3d4a99]/5 text-[#3d4a99]"
                                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                        }`}
                                >
                                    Weekly
                                </button>
                                {/* Bi-Weekly */}
                                <button
                                    onClick={() => setFrequency("biweekly")}
                                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${frequency === "biweekly"
                                        ? "border-[#3d4a99] bg-[#3d4a99]/5 text-[#3d4a99]"
                                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                        }`}
                                >
                                    Bi-Weekly
                                </button>
                            </div>
                        </div>

                        {/* Month Duration Selector — shown only when Monthly is selected */}
                        {frequency === "monthly" && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-400">
                                    How many months do you want to spread payments over?
                                </p>
                                <div className="grid grid-cols-5 gap-2">
                                    {monthOptions.map((m) => {
                                        const perMonth = Math.ceil(product.price / m);
                                        const isSelected = selectedMonths === m;
                                        return (
                                            <button
                                                key={m}
                                                onClick={() => setSelectedMonths(m)}
                                                className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                    ? "border-[#3d4a99] bg-[#3d4a99]/10 shadow-sm"
                                                    : "border-gray-200 bg-white hover:border-gray-300"
                                                    }`}
                                            >
                                                <span className={`text-lg font-bold ${isSelected ? "text-[#3d4a99]" : "text-gray-900"}`}>
                                                    {m}
                                                </span>
                                                <span className={`text-[10px] font-medium ${isSelected ? "text-[#3d4a99]" : "text-gray-400"}`}>
                                                    {m === 1 ? "month" : "months"}
                                                </span>
                                                <span className={`text-xs font-bold mt-1 ${isSelected ? "text-[#3d4a99]" : "text-gray-600"}`}>
                                                    GH¢{perMonth.toLocaleString()}
                                                </span>
                                                <span className="text-[9px] text-gray-400">/month</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Per Payment Display */}
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">Per Payment</span>
                                <span className="text-xl font-bold text-[#3d4a99]">
                                    GH¢ {planDetails.perPayment.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-[#3d4a99]" />
                                    <div>
                                        <p className="text-[11px] text-gray-400">Total Payments</p>
                                        <p className="text-sm font-semibold text-black">
                                            {planDetails.periods} Payments
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-[#3d4a99]" />
                                    <div>
                                        <p className="text-[11px] text-gray-400">Goal Date</p>
                                        <p className="text-sm font-semibold text-black">
                                            {planDetails.completionFull}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <Button
                            onClick={handleConfirm}
                            disabled={isConfirming}
                            className="w-full h-12 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-70"
                        >
                            {isConfirming ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Plan...
                                </span>
                            ) : (
                                "Confirm Saving Plan"
                            )}
                        </Button>
                    </div>

                    {/* Right Card — Summary */}
                    <div className="bg-white rounded-2xl border border-[#3d4a99]/30 p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-black mb-6">
                            Summary
                        </h2>

                        <div className="space-y-5">
                            {/* Product Price */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Product Price</span>
                                <span className="text-sm font-bold text-black">
                                    {product.formattedPrice || `GH¢${product.price.toLocaleString()}`}
                                </span>
                            </div>

                            {/* Payment Frequency */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Payment Frequency</span>
                                <span className="text-sm font-bold text-black">
                                    {planDetails.frequencyLabel}
                                </span>
                            </div>

                            {/* Per Payment */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Per Payment</span>
                                <span className="text-sm font-bold text-black">
                                    GH¢ {planDetails.perPayment.toLocaleString()}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 my-2" />

                            {/* Total Payments */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Total Payments</span>
                                <span className="text-sm font-bold text-black">
                                    {planDetails.periods}
                                </span>
                            </div>

                            {/* Start Date */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Start Date</span>
                                <span className="text-sm font-bold text-black">
                                    {planDetails.startFull}
                                </span>
                            </div>

                            {/* Completion */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Completion</span>
                                <span className="text-sm font-bold text-black">
                                    {planDetails.completionMonth}
                                </span>
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className="mt-8 flex items-start gap-2.5">
                            <Info className="h-4 w-4 text-[#3d4a99] mt-0.5 shrink-0" />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                You can adjust your savings plan anytime from
                                your dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
