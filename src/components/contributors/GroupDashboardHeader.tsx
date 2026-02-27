import React from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import { Progress } from "@/src/components/ui/progress";

export interface GroupDashboardHeaderProps {
    name: string;
    description?: string;
    status: string;
    image?: string | null;
    merchantName?: string;
    productName?: string;
    currentAmount: number;
    targetAmount: number;
    contributorsCount: number;
    isOwner?: boolean;
}

function formatCurrency(amount: number) {
    return `GH₵${amount.toLocaleString()}`;
}

export function GroupDashboardHeader({
    name,
    description,
    status,
    image,
    merchantName,
    productName,
    currentAmount,
    targetAmount,
    contributorsCount,
    isOwner = true,
}: GroupDashboardHeaderProps) {
    const remaining = Math.max(0, targetAmount - currentAmount);
    const progress = targetAmount > 0 ? Math.round((currentAmount / targetAmount) * 100) : 0;

    return (
        <div className="bg-white border text-gray-900 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm w-full relative">

            {/* Top Right Status Badge */}
            <div className="absolute top-6 right-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${status === "ACTIVE" ? "bg-green-100 text-green-700"
                        : status === "COMPLETED" ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                    }`}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-8 mt-2">
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    {image ? (
                        <Image
                            src={image}
                            alt={productName || name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                </div>

                {/* Group Details */}
                <div className="flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {name}
                        </h1>
                        {isOwner && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff5d6] text-[#b8860b] border border-[#ffe082]">
                                <Crown className="w-3.5 h-3.5" />
                                Admin
                            </span>
                        )}
                    </div>

                    {description && (
                        <p className="text-gray-500 font-medium text-sm sm:text-base mb-2">
                            {description}
                        </p>
                    )}

                    {(merchantName || productName) && (
                        <p className="text-[#1a53c8] font-medium text-sm">
                            {merchantName && <>{merchantName} <span className="text-gray-400 mx-1">•</span></>}
                            {productName}
                        </p>
                    )}
                </div>
            </div>

            {/* Progress Bar Section */}
            <div className="w-full mb-8">
                <div className="flex justify-between items-center text-sm font-bold text-gray-700 mb-2">
                    <span>Group Progress</span>
                    <span className="text-gray-900">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-gray-100" />
            </div>

            <div className="h-px bg-gray-100 w-full mb-8" />

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Total Saved
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-green-600">
                        {formatCurrency(currentAmount)}
                    </span>
                </div>

                <div className="flex flex-col gap-1 md:border-l border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Target
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        {formatCurrency(targetAmount)}
                    </span>
                </div>

                <div className="flex flex-col gap-1 md:border-l border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Remaining
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-green-600">
                        {formatCurrency(remaining)}
                    </span>
                </div>

                <div className="flex flex-col gap-1 md:border-l border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Contributors
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        {contributorsCount}
                    </span>
                </div>
            </div>

        </div>
    );
}
