"use client";

import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/src/components/ui/progress";
import type { SavingsGoal } from "@/src/domains/savings-goals/savings.types";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

function formatFrequency(frequency: string) {
  switch (frequency) {
    case "WEEKLY":
      return "Weekly Payments";
    case "BIWEEKLY":
      return "Bi-Weekly Payments";
    case "MONTHLY":
      return "Monthly Payments";
    case "FLEXIBLE":
      return "Flexible Payments";
    default:
      return frequency;
  }
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function SavingsGoalCard({ goal }: SavingsGoalCardProps) {
  const href = goal.category === "CONTRIBUTION"
    ? `/contributors/${goal.id}`
    : `/goals/${goal.id}`;

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
        {/* Top section: Image + Info */}
        <div className="flex gap-4 mb-4">
          {/* Product Image */}
          <div className="relative w-[80px] h-[80px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            {goal.product.images[0] ? (
              <Image
                src={goal.product.images[0]}
                alt={goal.product.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
            )}
          </div>

          {/* Name + Frequency */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {goal.product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatFrequency(goal.frequency)}
            </p>
          </div>
        </div>

        {/* Progress section */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-gray-700">
              {goal.progress}%
            </span>
          </div>
          <Progress value={goal.progress} className="h-2 bg-gray-200" />
        </div>

        {/* Saved + Target */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs text-gray-500">Saved</p>
            <p className="text-base font-bold text-gray-900">
              GH¢ {goal.currentAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Target</p>
            <p className="text-base font-bold text-gray-900">
              GH¢ {goal.targetAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Next Payment bar */}
        <div className="bg-[#eef0ff] rounded-lg px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-[11px] text-gray-500">Next Payment</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(goal.nextPaymentDate)}
            </p>
          </div>
          <p className="text-sm font-bold text-[#2d3369]">
            GH¢ {(goal.nextPaymentAmount ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
