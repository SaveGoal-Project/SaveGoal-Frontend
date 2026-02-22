"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import {
  Search,
  Building2,
  ShieldCheck,
  Clock,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminMerchants } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";

const statusStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-700 border border-green-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Suspended: "bg-red-50 text-red-600 border border-red-200",
  Flagged: "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function AdminMerchantsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const params = useMemo(
    () => ({ page: currentPage, pageSize: 10, search: searchQuery }),
    [currentPage, searchQuery]
  );
  const { data, isLoading, error, refetch } = useAdminMerchants(params);

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;

  const merchants = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merchant Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage merchant accounts, verify businesses, and manage store listings
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0754FF] text-white text-sm font-medium rounded-lg hover:bg-[#0643cc] transition-colors">
          Onboard Merchant
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Merchants</p>
              <p className="text-2xl font-bold text-gray-900">12,000</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Verified Requests</p>
              <p className="text-2xl font-bold text-gray-900">800</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">150</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search merchants..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] focus:bg-white transition-colors"
            />
          </div>
          <select className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-600">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
            <option>Flagged</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Business Name</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Owner</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Revenue</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Total Orders</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Products</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Rating</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m, idx) => (
                <tr key={m.id + idx} className="border-b border-gray-100 last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm", m.initialColor)}>
                        {m.initial}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{m.businessName}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{m.owner}</td>
                  <td className="py-4 text-sm font-semibold text-gray-900">{m.revenue}</td>
                  <td className="py-4 text-sm text-gray-600">{m.totalOrders}</td>
                  <td className="py-4 text-sm text-gray-500">{m.products}</td>
                  <td className="py-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusStyles[m.status])}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-gray-700">{m.rating}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/admin/merchants/${m.id}`}
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
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {merchants.length} of {total.toLocaleString()} merchants</p>
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
