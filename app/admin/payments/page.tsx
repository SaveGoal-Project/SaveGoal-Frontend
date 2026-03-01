"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Eye,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { useAdminPayments } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";

const txnStatusStyles: Record<string, string> = {
  Completed: "bg-green-50 text-green-700 border border-green-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Failed: "bg-red-50 text-red-600 border border-red-200",
  Refunded: "bg-blue-50 text-blue-700 border border-blue-200",
};

const STATUS_TABS = ["All", "Completed", "Refunded", "Failed"] as const;

export default function AdminPaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const params = useMemo(
    () => ({ page: currentPage, pageSize: 7, search: searchQuery, status: activeFilter }),
    [currentPage, searchQuery, activeFilter]
  );
  const { data, isLoading, error, refetch } = useAdminPayments(params);

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;

  const filteredTransactions = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e2a4a]">Payments Managements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all transactions, process refunds, and flag suspicious activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4" />
            Export Report
          </button>
          <button className="px-5 py-2 bg-[#0754FF] text-white text-sm font-bold rounded-lg hover:bg-[#0643cc] transition-colors">
            Manual Entry
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Transaction Today */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-500">Total Transaction Today</p>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">GH₵ 5,000</p>
            <span className="text-xs font-semibold text-green-500">12.5%</span>
          </div>
        </div>
        {/* Total Volume */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-500">Total Volume</p>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">GH₵ 3,000</p>
            <span className="text-xs font-semibold text-green-500">12.5%</span>
          </div>
        </div>
        {/* Failed Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-500">Failed Transactions</p>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-red-500">100</p>
            <span className="text-xs font-semibold text-red-500">-4.2%</span>
          </div>
        </div>
        {/* Pending Refunds */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-500">Pending Refunds</p>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-green-600">100</p>
            <span className="text-xs font-semibold text-green-500">12.5%</span>
          </div>
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
                placeholder="Filter Transactions..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-64 h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] focus:bg-white transition-colors"
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
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Transaction ID</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">User</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Plan</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Amount</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Date</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Method</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn, idx) => (
                <tr key={txn.id + idx} className="border-b border-gray-100 last:border-0">
                  <td className="py-4">
                    <Link href={`/admin/payments/${txn.id}`} className="text-sm font-semibold text-[#0754FF] hover:underline">
                      {txn.transactionId}
                    </Link>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{txn.user}</td>
                  <td className="py-4 text-sm text-gray-600">{txn.plan}</td>
                  <td className="py-4 text-sm font-bold text-gray-900">{txn.amount}</td>
                  <td className="py-4 text-sm text-gray-500">{txn.date}</td>
                  <td className="py-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", txnStatusStyles[txn.status])}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{txn.method}</td>
                  <td className="py-4">
                    <Link
                      href={`/admin/payments/${txn.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(() => {
          const totalPages = Math.max(1, Math.ceil(total / 7));
          return (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Showing {filteredTransactions.length} of {total.toLocaleString()} transactions</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
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
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0754FF] rounded-lg hover:bg-[#0643cc] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
