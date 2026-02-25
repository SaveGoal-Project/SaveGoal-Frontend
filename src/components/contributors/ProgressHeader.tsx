import React from "react";
import { cn } from "@/src/lib/utils";

interface ProgressHeaderProps {
    currentStep: 1 | 2;
}

export function ProgressHeader({ currentStep }: ProgressHeaderProps) {
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between text-sm text-[#1a53c8] mb-2 font-medium">
                <span>Step {currentStep} of 2</span>
                <span>{currentStep === 1 ? "Group Details" : "Review and Create"}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div
                    className={cn(
                        "h-full bg-[#1a53c8] rounded-full transition-all duration-300 ease-in-out",
                        currentStep === 1 ? "w-1/2" : "w-full"
                    )}
                />
            </div>
        </div>
    );
}
