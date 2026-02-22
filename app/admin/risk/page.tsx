"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useAdminRiskEntities } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";

/* ── Risk Score Distribution Data ──────────────────────── */
const RISK_CATEGORIES = [
  { label: "Low Risk", color: "#22c55e", percentage: 60 },
  { label: "Medium Risk", color: "#f59e0b", percentage: 70 },
  { label: "High Risk", color: "#ef4444", percentage: 80 },
];

const statusStyles: Record<string, string> = {
  "In Review": "bg-blue-50 text-blue-700 border border-blue-200",
  Blocked: "bg-red-50 text-red-600 border border-red-200",
};

export default function AdminRiskPage() {
  const { data: entities, isLoading, error, refetch } = useAdminRiskEntities();

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;

  const HIGH_RISK_ENTITIES = entities || [];
  // SVG pie chart segments
  const segments = [
    { color: "#22c55e", start: 0, size: 60 },      // Low Risk - green large
    { color: "#f59e0b", start: 60, size: 30 },     // Medium Risk - orange/amber
    { color: "#ef4444", start: 90, size: 10 },      // High Risk - red small
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e2a4a]">Risk & Compliance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor system security, AML compliance, and fraudulent patterns
          </p>
        </div>
        <button className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
          Manual Freeze All
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Risk Score Distribution</h3>
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-56 h-56">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {segments.map((seg, i) => {
                  const radius = 40;
                  const circumference = 2 * Math.PI * radius;
                  const dashArray = (seg.size / 100) * circumference;
                  const dashOffset = -(seg.start / 100) * circumference;
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="30"
                      strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                      strokeDashoffset={dashOffset}
                      transform="rotate(-90 50 50)"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-2">
            {RISK_CATEGORIES.map((cat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-sm font-medium text-gray-900">{cat.label}</span>
                <span className="text-sm text-gray-500 ml-auto">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Flagged Entities */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 italic">High Risk Flagged Entities</h3>
            <Link href="/admin/audit" className="text-sm font-semibold text-[#0754FF] hover:underline">
              View Audit Log
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-2.5 px-3 text-xs font-semibold text-gray-500 tracking-wider">Entity</th>
                  <th className="py-2.5 px-3 text-xs font-semibold text-gray-500 tracking-wider">Detection Reason</th>
                  <th className="py-2.5 px-3 text-xs font-semibold text-gray-500 tracking-wider">Score</th>
                  <th className="py-2.5 px-3 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                  <th className="py-2.5 px-3 text-xs font-semibold text-gray-500 tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {HIGH_RISK_ENTITIES.map((entity, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="py-3.5 px-3 text-sm font-bold text-gray-900">{entity.name}</td>
                    <td className="py-3.5 px-3 text-xs text-gray-500">{entity.reason}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-sm font-bold text-green-700">
                        {entity.score}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusStyles[entity.status])}>
                        {entity.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <Link
                        href={`/admin/risk/r${i + 1}`}
                        className="text-sm font-semibold text-[#0754FF] hover:underline"
                      >
                        Investigate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-2">AML Check Status</p>
          <p className="text-3xl font-bold text-green-500">92.8%</p>
          <p className="text-xs text-gray-400 mt-1">Verified Entities</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-2">Blocked Payments</p>
          <p className="text-3xl font-bold text-red-500">1,400</p>
          <p className="text-xs text-gray-400 mt-1">Verified Entities</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-2">Active Sessions</p>
          <p className="text-3xl font-bold text-[#1e2a4a]">1,200</p>
          <p className="text-xs text-gray-400 mt-1">Nationwide</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-2">Manual Overrides</p>
          <p className="text-3xl font-bold text-[#1e2a4a]">100</p>
          <p className="text-xs text-gray-400 mt-1">Admin Actions</p>
        </div>
      </div>
    </div>
  );
}
