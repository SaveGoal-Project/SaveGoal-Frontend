"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminUsers } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";

const statusStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
  Suspended: "bg-red-50 text-red-600",
  Pending: "bg-amber-50 text-amber-700",
};

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const params = useMemo(
    () => ({ page: currentPage, pageSize: 8, search: searchQuery, status: statusFilter }),
    [currentPage, searchQuery, statusFilter]
  );

  const { data, isLoading, error, refetch } = useAdminUsers(params);

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;

  const users = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / (data?.pageSize || 8));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage platform users, verify identity, and track user data and activities
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0754FF] text-white text-sm font-medium rounded-lg hover:bg-[#0643cc] transition-colors">
          <Download className="h-4 w-4" />
          Export Users
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] focus:bg-white transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-600"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>
          <select className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-600">
            <option>Country</option>
            <option>Ghana</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account/Contact</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plans</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Saved</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">KYC</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5">
                      <Link href={`/admin/users/${user.id}`} className="group">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-[#0754FF] transition-colors">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </Link>
                    </td>
                    <td className="py-3.5 text-sm text-gray-700">{user.plans}</td>
                    <td className="py-3.5 text-sm font-medium text-gray-900">{user.savedAmount}</td>
                    <td className="py-3.5">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusStyles[user.status])}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        user.kycStatus === "Verified" ? "bg-green-50 text-green-700" : user.kycStatus === "Rejected" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                      )}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-sm text-gray-500">{user.joined}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {users.length} of {total.toLocaleString()} users
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  currentPage === page ? "bg-[#0754FF] text-white" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
