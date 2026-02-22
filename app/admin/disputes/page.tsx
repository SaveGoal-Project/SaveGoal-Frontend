"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import {
  Search,
  Eye,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { useAdminDisputes } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";

const statusStyles: Record<string, string> = {
  Escalated: "bg-red-50 text-red-600 border border-red-200",
  Resolved: "bg-green-50 text-green-700 border border-green-200",
  "In Review": "bg-blue-50 text-blue-700 border border-blue-200",
  Rejected: "bg-gray-100 text-gray-600 border border-gray-200",
};

const priorityStyles: Record<string, string> = {
  High: "bg-red-50 text-red-600 border border-red-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Low: "bg-blue-50 text-blue-700 border border-blue-200",
};

const STATUS_TABS = ["Open", "In Review", "Escalated", "Resolved", "Rejected"] as const;

export default function AdminDisputesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>("Open");
  const [searchQuery, setSearchQuery] = useState("");

  const params = useMemo(
    () => ({ page: currentPage, pageSize: 7, search: searchQuery, status: activeFilter }),
    [currentPage, searchQuery, activeFilter]
  );
  const { data, isLoading, error, refetch } = useAdminDisputes(params);

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;

  const disputes = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e2a4a]">Disputes and Refunds</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review disputes, process refunds, and manage conflict resolution.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Upload className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">Open Disputes</p>
          <p className="text-3xl font-bold text-red-500">40</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">In Review</p>
          <p className="text-3xl font-bold text-gray-900">10</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">Escalated</p>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">Resolved</p>
          <p className="text-3xl font-bold text-green-600">12</p>
        </div>
      </div>

      {/* Search + Status Tabs + Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        {/* Search & Status Tabs */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by ID, User, or merchant..."
                className="w-72 h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] focus:bg-white transition-colors"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-600 mr-2">Status:</span>
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                    activeFilter === tab
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
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Dispute ID</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">User</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Merchant</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Amount</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Reason</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Priority</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute, idx) => (
                <tr key={dispute.id + idx} className="border-b border-gray-100 last:border-0">
                  <td className="py-4">
                    <Link href={`/admin/disputes/${dispute.id}`} className="text-sm font-semibold text-[#0754FF] hover:underline">
                      {dispute.disputeId}
                    </Link>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{dispute.user}</td>
                  <td className="py-4 text-sm font-medium text-gray-900">{dispute.merchant}</td>
                  <td className="py-4 text-sm font-bold text-gray-900">{dispute.amount}</td>
                  <td className="py-4 text-sm text-gray-500">{dispute.reason}</td>
                  <td className="py-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusStyles[dispute.status])}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", priorityStyles[dispute.priority])}>
                      {dispute.priority}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/admin/disputes/${dispute.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {disputes.length} of {total.toLocaleString()} disputes</p>
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
