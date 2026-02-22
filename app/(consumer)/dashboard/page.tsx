"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { useSavingsGoals, useDashboardStats } from "@/src/domains/savings-goals/savings.hooks";
import { useRecentActivity } from "@/src/domains/payments/payment.hooks";
import { SummaryStatCard } from "@/src/components/dashboard/SummaryStatCard";
import { SavingsGoalCard } from "@/src/components/shared/SavingsGoalCard";
import { RecentActivityList } from "@/src/components/dashboard/RecentActivityList";
import { Wallet, Target, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { goals, isLoading: goalsLoading } = useSavingsGoals();
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { activities, isLoading: activityLoading } = useRecentActivity();

  const formatNextPaymentDate = (dateString: string | null) => {
    if (!dateString) return "No upcoming";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome Back, {user?.firstName || "User"}!
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s your savings progress</p>
      </div>

      {/* Summary Stat Cards - 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {statsLoading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 px-5 py-5 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
                  <div className="h-7 bg-gray-200 rounded w-28" />
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          <>
            <SummaryStatCard
              title="Total Saved"
              value={`GH¢ ${(stats?.totalSaved ?? 0).toLocaleString()}`}
              icon={Wallet}
              iconBgColor="#eef0ff"
              iconColor="#2d3369"
            />
            <SummaryStatCard
              title="Active Goals"
              value={String(stats?.activeGoals ?? 0)}
              icon={Target}
              iconBgColor="#f0fdf4"
              iconColor="#16a34a"
            />
            <SummaryStatCard
              title="Next Payment"
              value={formatNextPaymentDate(stats?.nextPaymentDate ?? null)}
              icon={Clock}
              iconBgColor="#fef2f2"
              iconColor="#dc2626"
            />
          </>
        )}
      </div>

      {/* Active Savings Goals */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Active Savings Goals
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center px-5 py-2.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Add New Goal +
          </Link>
        </div>

        {goalsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-[80px] h-[80px] bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded w-full mb-3" />
                <div className="flex justify-between mb-3">
                  <div className="h-5 bg-gray-200 rounded w-20" />
                  <div className="h-5 bg-gray-200 rounded w-20" />
                </div>
                <div className="h-12 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No savings goals yet
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Start saving for the things you want!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#2d3369] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3d4a99] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Recent Activity
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <RecentActivityList
            activities={activities}
            isLoading={activityLoading}
          />
        </div>
      </div>
    </div>
  );
}
