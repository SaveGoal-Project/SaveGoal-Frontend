import React from "react";
import Image from "next/image";
import { Crown } from "lucide-react";

export function GroupDashboardHeader() {
    return (
        <div className="bg-white border text-gray-900 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm w-full relative">

            {/* Top Right Active Badge */}
            <div className="absolute top-6 right-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    Active
                </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-8 mt-2">
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    <Image
                        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"
                        alt="Bus"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Group Details */}
                <div className="flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Class of 2024 Bus Fund
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff5d6] text-[#b8860b] border border-[#ffe082]">
                            <Crown className="w-3.5 h-3.5" />
                            Admin
                        </span>
                    </div>

                    <p className="text-gray-500 font-medium text-sm sm:text-base mb-2">
                        Saving together for our graduation trip transportation
                    </p>

                    <p className="text-[#1a53c8] font-medium text-sm">
                        AutoMart Ghana <span className="text-gray-400 mx-1">•</span> Toyota Hiace Bus
                    </p>
                </div>
            </div>

            {/* Progress Bar Section */}
            <div className="w-full mb-8">
                <div className="flex justify-between items-center text-sm font-bold text-gray-700 mb-2">
                    <span>Group Progress</span>
                    <span className="text-gray-900">35%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a53c8] rounded-full w-[35%]" />
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full mb-8" />

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Total Saved
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-green-600">
                        GH₵87,500
                    </span>
                </div>

                <div className="flex flex-col gap-1 md:border-l border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Target
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        GH₵250,000
                    </span>
                </div>

                <div className="flex flex-col gap-1 md:border-l border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Remaining
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-green-600">
                        GH₵162,500
                    </span>
                </div>

                <div className="flex flex-col gap-1 md:border-l border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Members
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        5
                    </span>
                </div>
            </div>

        </div>
    );
}
