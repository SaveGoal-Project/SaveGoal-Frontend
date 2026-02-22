"use client";

import { useUserProfile } from "@/src/domains/user-profile/users.hooks";
import { useUserStats } from "@/src/domains/user-profile/users.hooks";

export function UserSummaryCard() {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { stats, isLoading: statsLoading } = useUserStats();

  if (profileLoading || statsLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gray-200 rounded-full" />
          <div>
            <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 text-center">
              <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1" />
              <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getInitials = () => {
    const first = profile?.firstName?.[0] || "";
    const last = profile?.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#1e2a4a] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
          {getInitials()}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {profile?.firstName} {profile?.lastName}
          </h3>
          <p className="text-sm text-gray-500">
            {profile?.email || profile?.phone}
          </p>
        </div>
      </div>

      {/* Stats boxes */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-gray-200 rounded-lg py-3 px-2 text-center">
          <p className="text-xl font-bold text-[#1e2a4a]">
            {stats?.activeGoals ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Active Goals</p>
        </div>
        <div className="border border-gray-200 rounded-lg py-3 px-2 text-center">
          <p className="text-lg font-bold text-green-600">
            GHS {(stats?.totalSaved ?? 0).toLocaleString()}.00
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Total Saved</p>
        </div>
        <div className="border border-gray-200 rounded-lg py-3 px-2 text-center">
          <p className="text-xl font-bold text-[#1e2a4a]">
            {stats?.completedGoals ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Completed</p>
        </div>
      </div>
    </div>
  );
}
