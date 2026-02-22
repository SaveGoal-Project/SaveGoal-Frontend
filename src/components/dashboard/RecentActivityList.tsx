"use client";

import type { RecentActivity } from "@/src/domains/payments/payment.types";

interface RecentActivityListProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RecentActivityList({
  activities,
  isLoading,
}: RecentActivityListProps) {
  if (isLoading) {
    return (
      <div className="space-y-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between animate-pulse">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">
        No recent activity
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {activity.description}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(activity.date)}
            </p>
          </div>
          {activity.amount != null && (
            <span className="text-sm font-semibold text-green-600 flex-shrink-0 ml-4">
              + GH¢ {activity.amount.toLocaleString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
