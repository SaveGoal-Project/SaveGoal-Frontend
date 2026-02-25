import React from "react";
import { Lock } from "lucide-react";

export function GroupSavingsRules() {
    return (
        <div className="bg-[#fff9e6] rounded-xl border border-[#ffe082] p-6 mb-8 mt-4">
            <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-gray-900 text-base">Group Savings Rules</h3>
            </div>
            <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-500">
                        Only the group admin can change the product or cancel the group
                    </span>
                </li>
                <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-500">
                        Funds are locked until the target is reached or group is cancelled
                    </span>
                </li>
                <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-500">
                        No partial withdrawals are allowed
                    </span>
                </li>
            </ul>
        </div>
    );
}
