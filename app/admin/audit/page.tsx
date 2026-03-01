"use client";

import { useState, useMemo } from "react";
import { cn } from "@/src/lib/utils";
import {
  Search,
  Upload,
  FileText,
  Info,
  X as XIcon,
  Users,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { useAdminAuditLogs } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";
import type { AdminAuditLog } from "@/src/domains/admin/admin.types";

export default function AdminAuditPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingEntry, setViewingEntry] = useState<AdminAuditLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const params = useMemo(
    () => ({ page: currentPage, pageSize: 6, search: searchQuery, status: statusFilter || undefined }),
    [currentPage, searchQuery, statusFilter]
  );
  const { data, isLoading, error, refetch } = useAdminAuditLogs(params);

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;

  const audits = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e2a4a]">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all administrative actions and system changes for compliance and security.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Upload className="h-4 w-4" />
          Export Logs
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-gray-500">Total Events Today</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">1,500</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <p className="text-xs font-medium text-gray-500">Critical Actions</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">10</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <XIcon className="h-4 w-4 text-gray-600" />
            <p className="text-xs font-medium text-gray-500">Failed Operations</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">10</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-gray-500">Active Admins</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">10</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by Name, Email, or phone..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-500"
            >
              <option>All Statuses</option>
              <option>Success</option>
              <option>Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border-2 border-[#0754FF] p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Target</th>
                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((entry, idx) => (
                <tr key={entry.id + idx} className="border-b border-gray-100 last:border-0">
                  <td className="py-4">
                    {entry.timestamp.split("\n").map((line, i) => (
                      <p key={i} className="text-xs text-gray-500">{line}</p>
                    ))}
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-bold text-gray-900">{entry.adminName}</p>
                    <p className="text-xs text-gray-500">{entry.adminRole}</p>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-semibold text-[#0754FF]">{entry.action}</span>
                  </td>
                  <td className="py-4">
                    {entry.target.split("\n").map((line, i) => (
                      <p key={i} className="text-xs text-gray-500">{line}</p>
                    ))}
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      entry.severity === "High score"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    )}>
                      {entry.severity}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => setViewingEntry(entry)}
                      className="text-sm font-semibold text-[#0754FF] hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(() => {
          const totalPages = Math.max(1, Math.ceil(total / 6));
          return (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Showing {audits.length} of {total.toLocaleString()} logs</p>
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

      {/* View Details Modal */}
      {viewingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Audit Log Details</h2>
              <button
                onClick={() => setViewingEntry(null)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-8 mb-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Timestamp</p>
                <p className="text-sm font-bold text-gray-900">{viewingEntry.timestamp.replace("\n", " ")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-50 border border-green-200 w-fit">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{viewingEntry.status}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Admin User</p>
                <p className="text-sm font-bold text-gray-900">{viewingEntry.adminName}</p>
                <p className="text-xs text-gray-500">{viewingEntry.adminRole}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Severity</p>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  viewingEntry.severity === "High score"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                )}>
                  {viewingEntry.severity}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Action Performed</p>
                <span className="text-sm font-semibold text-[#0754FF]">{viewingEntry.action}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Target</p>
                <p className="text-sm font-bold text-gray-900">{viewingEntry.target.replace("\n", " ")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">IP Address</p>
                <p className="text-sm font-bold text-gray-900">{viewingEntry.ip}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Session ID</p>
                <p className="text-sm font-bold text-gray-900">{viewingEntry.sessionId}</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Additional Details</p>
              <p className="text-sm text-gray-600 leading-relaxed">{viewingEntry.details}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setViewingEntry(null)}
              className="w-full py-3 bg-[#0754FF] text-white text-sm font-bold rounded-lg hover:bg-[#0643cc] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
