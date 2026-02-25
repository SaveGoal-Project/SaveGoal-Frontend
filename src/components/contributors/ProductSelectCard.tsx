import React from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { GoalProduct } from "@/src/domains/savings-goals/savings.types";

interface ProductSelectCardProps {
    product: GoalProduct;
    isSelected: boolean;
    onSelect: (product: GoalProduct) => void;
}

export function ProductSelectCard({
    product,
    isSelected,
    onSelect,
}: ProductSelectCardProps) {
    // Use first image or a placeholder
    const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1579621970588-a3f5ce5ca1b1?w=800&q=80";
    // The design usually shows a generic brand name like "Telefonica", we'll mock it if not present
    const brandName = product.merchant?.businessName || "Telefonica";

    return (
        <div
            onClick={() => onSelect(product)}
            className={cn(
                "flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all bg-white",
                isSelected
                    ? "border-[#1a53c8] ring-1 ring-[#1a53c8]"
                    : "border-gray-200 hover:border-blue-300"
            )}
        >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] text-[#1a53c8] font-medium uppercase tracking-wider truncate mb-0.5">
                    {brandName}
                </span>
                <span className="text-sm font-semibold text-gray-900 truncate">
                    {product.name}
                </span>
                <span className="text-xs font-medium text-[#1a53c8] mt-0.5">
                    {product.currency} {product.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>
    );
}
