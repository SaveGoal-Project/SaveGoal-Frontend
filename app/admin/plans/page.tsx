"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { Search, Eye, SlidersHorizontal } from "lucide-react";
import { useAdminPlans } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";

const statusStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-700 border border-green-200",
  Completed: "bg-blue-50 text-blue-700 border border-blue-200",
  Defaulted: "bg-red-50 text-red-600 border border-red-200",
};

const STATUS_TABS = ["All", "Active", "Completed", "Defaulted"] as const;

export default function AdminPlansPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatusTab, setActiveStatusTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const params = useMemo(
    () => ({ page: currentPage, pageSize: 7, search: searchQuery, status: activeStatusTab }),
    [currentPage, searchQuery, activeStatusTab]
  );
  const { data, isLoading, error, refetch } = useAdminPlans(params);

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;

  const filteredPlans = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SNBL Savings Plans</h1>
        <p className="text-sm text-gray-500 mt-1">Active SNBL Plans</p>
      </div>

      {/* Search + Status Tabs + Filter Icon */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Filter Plans..."
                className="w-72 h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] focus:bg-white transition-colors"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-600 mr-2">Status:</span>
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveStatusTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                    activeStatusTab === tab
                      ? "bg-[#0754FF] text-white border-[#0754FF]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Icon */}
          <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Plan ID</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">User</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Product</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Progress</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Next Payment</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Type</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan, idx) => {
                const barColor = plan.progressPercent === 100 ? "bg-green-500" : "bg-[#0754FF]";
                const percentColor = plan.progressPercent === 100 ? "text-green-600" : "text-[#0754FF]";

                return (
                  <tr key={plan.id + idx} className="border-b border-gray-100 last:border-0">
                    <td className="py-4">
                      <Link href={`/admin/plans/${plan.id}`} className="text-sm font-semibold text-[#0754FF] hover:underline">
                        {plan.planId}
                      </Link>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{plan.user}</td>
                    <td className="py-4 text-sm font-semibold text-gray-900">{plan.product}</td>
                    <td className="py-4">
                      <div className="w-36">
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("text-xs font-bold", percentColor)}>{plan.progressPercent}%</span>
                          <span className="text-xs text-gray-400">{plan.progressCurrent}/{plan.progressTotal}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", barColor)}
                            style={{ width: `${plan.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-500">{plan.nextPayment}</td>
                    <td className="py-4">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusStyles[plan.status])}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{plan.type}</td>
                    <td className="py-4">
                      <Link
                        href={`/admin/plans/${plan.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing 7 of 12,000 plans</p>
          <div className="flex items-center gap-1">
            <button className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  currentPage === page ? "bg-[#0754FF] text-white" : "text-gray-600 border border-gray-200 hover:bg-gray-50"
                )}
              >
                {page}
              </button>
            ))}
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#0754FF] rounded-lg hover:bg-[#0643cc] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
