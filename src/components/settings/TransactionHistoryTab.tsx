"use client";

import { useState, useMemo } from "react";
import { usePaymentHistory } from "@/src/domains/payments/payment.hooks";
import { Clock, Search, Download } from "lucide-react";
import { Button } from "@/src/components/ui/button";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "SUCCESS":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Completed
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Pending
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Failed
        </span>
      );
    case "REFUNDED":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Refunded
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
          {status}
        </span>
      );
  }
}

function getMethodLabel(method: string) {
  switch (method) {
    case "MOMO_MTN":
      return "MTN Momo";
    case "MOMO_TELECEL":
      return "T Cash";
    case "MOMO_AT":
      return "AT Money";
    case "CARD":
      return "Bank";
    default:
      return method;
  }
}

type StatusFilter = "all" | "SUCCESS" | "PENDING" | "FAILED";
type TimeFilter = "all" | "today" | "this-month";

export function TransactionHistoryTab() {
  const { payments, isLoading } = usePaymentHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesProduct = payment.productName?.toLowerCase().includes(query);
        const matchesId = payment.id.toLowerCase().includes(query);
        const matchesRef = payment.externalReference?.toLowerCase().includes(query);
        if (!matchesProduct && !matchesId && !matchesRef) return false;
      }

      // Status filter
      if (statusFilter !== "all" && payment.status !== statusFilter) return false;

      // Time filter
      if (timeFilter !== "all") {
        const paymentDate = new Date(payment.createdAt);
        const now = new Date();
        if (timeFilter === "today") {
          const isToday = paymentDate.toDateString() === now.toDateString();
          if (!isToday) return false;
        }
        if (timeFilter === "this-month") {
          const isSameMonth =
            paymentDate.getMonth() === now.getMonth() &&
            paymentDate.getFullYear() === now.getFullYear();
          if (!isSameMonth) return false;
        }
      }

      return true;
    });
  }, [payments, searchQuery, statusFilter, timeFilter]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded-xl" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-900">
          Transactions
        </h3>
        <Button
          variant="outline"
          className="border-[#1e2a4a] bg-[#1e2a4a] text-white hover:bg-[#2d3369] hover:text-white rounded-lg px-4 py-2 text-sm gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        View all your payment transactions
      </p>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d3369] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d3369]"
        >
          <option value="all">All Statuses</option>
          <option value="SUCCESS">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d3369]"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="this-month">This Month</option>
        </select>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-500">No transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Transaction ID
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Description
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Method
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {payment.externalReference?.split("-").pop()?.toUpperCase() ||
                      payment.id.toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-gray-900 font-medium">
                        Payment for {payment.productName || "Savings"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.productName || "Savings Deposit"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {getMethodLabel(payment.method)}
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    GHS {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-[#2d3369] font-medium hover:underline">
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
