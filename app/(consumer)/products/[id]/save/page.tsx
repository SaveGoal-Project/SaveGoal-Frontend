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
    const [frequency, setFrequency] = useState<Frequency>("weekly");
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
                periods = 5;
                perPayment = Math.ceil(product.price / periods);
                frequencyLabel = "Monthly";
                completionDate = new Date(now);
                completionDate.setMonth(completionDate.getMonth() + periods);
                break;
        }

        const completionMonth = completionDate.toLocaleString("en-US", {
            month: "long",
        });
        const completionYear = completionDate.getFullYear();
        const completionFull = completionDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        return {
            periods,
            perPayment,
            frequencyLabel,
            completionMonth: `${completionMonth} ${completionYear}`,
            completionFull,
        };
    }, [product, frequency]);

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

            await create({
                productId: product.id,
                targetAmount: product.price,
                frequency: apiFrequency,
                isRecurring: true,
                monthlyAmount: automatedMonthlyAmount,
                savingsDay: savingsDay
            });

            router.push("/dashboard");
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
                                {(
                                    [
                                        { key: "weekly", label: "Weekly" },
                                        { key: "biweekly", label: "Bi-Weekly" },
                                        { key: "monthly", label: "Monthly" },
                                    ] as const
                                ).map((option) => (
                                    <button
                                        key={option.key}
                                        onClick={() => setFrequency(option.key)}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${frequency === option.key
                                            ? "border-[#3d4a99] bg-[#3d4a99]/5 text-[#3d4a99]"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

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
                                You can pause, resume, or adjust your savings plan anytime from
                                your dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
