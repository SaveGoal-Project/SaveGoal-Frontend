"use client";

import { useParams, useRouter } from "next/navigation";
import { useSavingsGoalDetail, useCancelSavingsGoal, usePauseSavingsGoal } from "@/src/domains/savings-goals/savings.hooks";
import { Progress } from "@/src/components/ui/progress";
import { ArrowLeft, Plus, Pause, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateLong(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return `GH¢ ${amount.toLocaleString()}`;
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

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.goalId as string;
  const { goal, isLoading, error, refetch } = useSavingsGoalDetail(goalId);
  const { cancel, isLoading: isCanceling } = useCancelSavingsGoal();
  const { pause, isLoading: isPausing } = usePauseSavingsGoal();

  const handlePause = async () => {
    if (confirm("Are you sure you want to pause this savings goal?")) {
      try {
        await pause(goalId);
        refetch();
      } catch (err) {
        console.error("Failed to pause goal:", err);
      }
    }
  };

  const handleCancel = async () => {
    if (confirm("Are you sure you want to completely cancel this goal? It will be removed from your active goals.")) {
      try {
        await cancel(goalId);
        router.push("/dashboard");
      } catch (err) {
        console.error("Failed to cancel goal:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-36 mb-6" />
          <div className="h-8 bg-gray-200 rounded w-52 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 h-[360px]" />
              <div className="bg-white rounded-xl border border-gray-200 p-6 h-[300px]" />
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 h-[220px]" />
              <div className="bg-white rounded-xl border border-gray-200 p-6 h-[120px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
        <p className="text-red-600 text-lg">{error || "Goal not found"}</p>
        <button
          className="mt-4 text-sm text-[#2d3369] underline"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back to Dashboard */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[#3b5bdb] text-sm font-medium mb-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Saving Goal Details
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left Column ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goal Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Product header */}
            <div className="flex gap-4 mb-6">
              <div className="relative w-[100px] h-[80px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {goal.product.images[0] ? (
                  <Image
                    src={goal.product.images[0]}
                    alt={goal.product.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900">
                  {goal.product.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {formatFrequency(goal.frequency)}
                </p>
                <span
                  className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${goal.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : goal.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : goal.status === "PAUSED"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                >
                  {goal.status.charAt(0) + goal.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm font-bold text-gray-900">
                  {goal.progress}%
                </span>
              </div>
              <Progress value={goal.progress} className="h-3 bg-gray-200" />
            </div>

            {/* Saved / Remaining / Target */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Saved</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(goal.currentAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Remaining</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(remaining)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Target</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(goal.targetAmount)}
                </p>
              </div>
            </div>

            {/* Next Payment Due */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">
                  Next Payment Due
                </p>
                <p className="text-base font-bold text-gray-900">
                  {goal.nextPaymentDate
                    ? formatDateLong(goal.nextPaymentDate)
                    : "No upcoming"}
                </p>
              </div>
              <p className="text-lg font-bold text-[#3b5bdb]">
                {formatCurrency(goal.nextPaymentAmount ?? 0)}
              </p>
            </div>
          </div>

          {/* Payment History Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Payment History
            </h3>
            {goal.deposits.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No payments yet. Make your first deposit!
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {goal.deposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex items-center justify-between py-3.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(deposit.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {deposit.method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        + {formatCurrency(deposit.amount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {deposit.status.charAt(0) +
                          deposit.status.slice(1).toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Column ─── */}
        <div className="space-y-6">
          {/* Actions Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/goals/${goalId}/deposit`}
                className="flex items-center justify-center gap-2 w-full bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-lg py-3 text-sm font-semibold transition-colors"
              >
                <Plus className="h-4 w-4" />
                Make Deposit
              </Link>
              <button
                onClick={handlePause}
                disabled={isPausing || goal.status !== "ACTIVE"}
                className={`flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 rounded-lg py-3 text-sm font-semibold transition-colors
                  ${goal.status !== "ACTIVE" ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Pause className="h-4 w-4" />
                {isPausing ? "Pausing..." : goal.status === "PAUSED" ? "Paused" : "Pause Savings"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isCanceling}
                className="flex items-center justify-center gap-2 w-full border border-red-300 text-red-600 hover:bg-red-50 rounded-lg py-3 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {isCanceling ? "Canceling..." : "Cancel Goal"}
              </button>
            </div>
          </div>

          {/* Goal Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Goal Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Started</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(goal.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Est. Completion</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(goal.estimatedCompletionDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
