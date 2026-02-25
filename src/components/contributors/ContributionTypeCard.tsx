import React from "react";
import { cn } from "@/src/lib/utils";

interface ContributionTypeCardProps {
    id: string;
    title: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
}

export function ContributionTypeCard({
    id,
    title,
    description,
    isSelected,
    onSelect,
}: ContributionTypeCardProps) {
    return (
        <label
            htmlFor={id}
            className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white w-full",
                isSelected
                    ? "border-[#1a53c8] ring-1 ring-[#1a53c8] bg-blue-50/10"
                    : "border-gray-200 hover:border-blue-200"
            )}
        >
            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 bg-white relative">
                <input
                    type="radio"
                    id={id}
                    name="contributionType"
                    checked={isSelected}
                    onChange={onSelect}
                    className="peer sr-only"
                />
                {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-[#1a53c8] absolute" />
                )}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{title}</span>
                <span className="text-xs text-gray-500 mt-0.5">{description}</span>
            </div>
        </label>
    );
}
