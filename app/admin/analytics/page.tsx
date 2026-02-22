"use client";

import { cn } from "@/src/lib/utils";
import {
  DollarSign,
  Users,
  Store,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useAdminAnalytics } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";

/* ── Chart Data ────────────────────── */
const REVENUE_LINE_DATA = [
  { month: "Jan", savings: 5000, revenue: 7500 },
  { month: "Feb", savings: 4800, revenue: 5200 },
  { month: "Mar", savings: 3500, revenue: 5000 },
  { month: "Apr", savings: 4200, revenue: 6200 },
  { month: "May", savings: 4000, revenue: 5800 },
  { month: "Jun", savings: 3500, revenue: 5000 },
];

const BAR_DATA = [
  { month: "Jan", merchants: 200, users: 2500 },
  { month: "Feb", merchants: 250, users: 4000 },
  { month: "Mar", merchants: 300, users: 6500 },
  { month: "Apr", merchants: 350, users: 7500 },
  { month: "May", merchants: 400, users: 9500 },
];

const FUNNEL_DATA = [
  { label: "Visitors", value: 10000, percentage: 100.0 },
  { label: "Signups", value: 3500, percentage: 35.0 },
  { label: "Verified", value: 2800, percentage: 28.0 },
  { label: "Plans Created", value: 2100, percentage: 21.0 },
  { label: "Active Savers", value: 1850, percentage: 18.5 },
];

const PIE_SEGMENTS = [
  { label: "Active Plans", percentage: 66, color: "#22c55e" },
  { label: "Completed Plans", percentage: 25, color: "#3b82f6" },
  { label: "Defaulted", percentage: 7, color: "#ef4444" },
  { label: "Cancelled", percentage: 2, color: "#9ca3af" },
];

// Helper: generate smooth cubic bezier path from points
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function AdminAnalyticsPage() {
  const { isLoading, error, refetch } = useAdminAnalytics();

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;
  const maxBar = 10000;
  const lineChartMax = 10000;
  const chartWidth = 900;
  const chartHeight = 260;
  const padding = { left: 55, right: 30, top: 15, bottom: 35 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Generate line paths with smooth curves
  const getX = (i: number) => padding.left + (i / (REVENUE_LINE_DATA.length - 1)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - (val / lineChartMax) * plotHeight;

  const savingsPoints = REVENUE_LINE_DATA.map((d, i) => ({ x: getX(i), y: getY(d.savings) }));
  const revenuePoints = REVENUE_LINE_DATA.map((d, i) => ({ x: getX(i), y: getY(d.revenue) }));
  const savingsPath = smoothPath(savingsPoints);
  const revenuePath = smoothPath(revenuePoints);

  // Bar chart dimensions
  const barChartWidth = 600;
  const barChartHeight = 260;
  const barPadding = { left: 50, right: 20, top: 15, bottom: 35 };
  const barPlotWidth = barChartWidth - barPadding.left - barPadding.right;
  const barPlotHeight = barChartHeight - barPadding.top - barPadding.bottom;
  const barGroupWidth = barPlotWidth / BAR_DATA.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e2a4a]">Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Comprehensive insights into platform performance and growth metrics.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">Total Revenue</p>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-xl font-bold text-gray-900">GH₵ 5M</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">Total Users</p>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-xl font-bold text-gray-900">20,000</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Store className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">Active Merchants</p>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-xl font-bold text-gray-900">500</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">Total Saved</p>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-xl font-bold text-gray-900">GH₵ 3M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Savings Growth - Line Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Revenue & Savings Growth</h3>
            <p className="text-xs text-gray-500 mt-0.5">Monthly breakdown of revenue, savings, and refunds</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-600">
              <option>Last 6 Months</option>
            </select>
            <button className="px-4 py-2 bg-[#0754FF] text-white text-sm font-semibold rounded-lg hover:bg-[#0643cc] transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="w-full">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64" preserveAspectRatio="none">
            {/* Y-axis grid lines & labels */}
            {[0, 3500, 5000, 7500, 10000].map((v) => {
              const y = getY(v);
              return (
                <g key={v}>
                  <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#f0f0f0" strokeWidth="0.5" />
                  <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[8px] fill-gray-400">{v.toLocaleString()}</text>
                </g>
              );
            })}
            {/* X-axis labels */}
            {REVENUE_LINE_DATA.map((d, i) => (
              <text key={i} x={getX(i)} y={chartHeight - 5} textAnchor="middle" className="text-[9px] fill-gray-400">{d.month}</text>
            ))}
            {/* Savings line (green) */}
            <path d={savingsPath} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Revenue line (blue) */}
            <path d={revenuePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-gray-600">Savings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-gray-600">Revenue</span>
          </div>
        </div>
      </div>

      {/* User & Merchant Growth + Savings Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart (3/5) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-bold text-gray-900">User & Merchant Growth</h3>
            <select className="h-8 px-3 rounded-lg border border-gray-200 bg-white text-xs text-gray-600">
              <option>Last 30 days</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mb-4">Total deposits vs withdrawals this year</p>

          <div className="w-full">
            <svg viewBox={`0 0 ${barChartWidth} ${barChartHeight}`} className="w-full h-56" preserveAspectRatio="none">
              {/* Y-axis grid lines */}
              {[0, 2500, 5000, 7500, 10000].map((v) => {
                const y = barPadding.top + barPlotHeight - (v / maxBar) * barPlotHeight;
                return (
                  <g key={v}>
                    <line x1={barPadding.left} y1={y} x2={barChartWidth - barPadding.right} y2={y} stroke="#f0f0f0" strokeWidth="0.5" />
                    <text x={barPadding.left - 5} y={y + 3} textAnchor="end" className="text-[7px] fill-gray-400">{v.toLocaleString()}</text>
                  </g>
                );
              })}
              {/* Merchant baseline (thin amber line at bottom) */}
              <line
                x1={barPadding.left}
                y1={barPadding.top + barPlotHeight - 2}
                x2={barChartWidth - barPadding.right}
                y2={barPadding.top + barPlotHeight - 2}
                stroke="#f59e0b"
                strokeWidth="3"
              />
              {/* Bars */}
              {BAR_DATA.map((d, i) => {
                const groupX = barPadding.left + i * barGroupWidth;
                const barWidth = barGroupWidth * 0.45;
                const userHeight = (d.users / maxBar) * barPlotHeight;
                return (
                  <g key={i}>
                    {/* User bar (blue) */}
                    <rect
                      x={groupX + (barGroupWidth - barWidth) / 2}
                      y={barPadding.top + barPlotHeight - userHeight}
                      width={barWidth}
                      height={userHeight}
                      fill="#3b82f6"
                      rx="3"
                    />
                    {/* Month label */}
                    <text x={groupX + barGroupWidth / 2} y={barChartHeight - 8} textAnchor="middle" className="text-[8px] fill-gray-400">{d.month}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-gray-600">Merchants</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-gray-600">Users</span>
            </div>
          </div>
        </div>

        {/* Pie Chart (2/5) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 italic">Savings Plan Status Distribution</h3>
          {/* Legend on top */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
            {PIE_SEGMENTS.map((seg, i) => (
              <span key={i} style={{ color: seg.color }} className="font-semibold">{seg.label}: {seg.percentage}%</span>
            ))}
          </div>
          {/* Pie */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-44 h-44">
              {(() => {
                let offset = 0;
                return PIE_SEGMENTS.map((seg, i) => {
                  const radius = 40;
                  const circumference = 2 * Math.PI * radius;
                  const dashArray = (seg.percentage / 100) * circumference;
                  const dashOffset = -(offset / 100) * circumference;
                  offset += seg.percentage;
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="28"
                      strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                      strokeDashoffset={dashOffset}
                      transform="rotate(-90 50 50)"
                    />
                  );
                });
              })()}
            </svg>
          </div>
          {/* Active Plans label below pie */}
          <div className="flex items-center justify-center mt-4">
            <span className="text-sm font-semibold text-green-500">Active Plans: 66%</span>
          </div>
        </div>
      </div>

      {/* User Conversion Funnel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">User Conversion Funnel</h3>
        <div className="space-y-4">
          {FUNNEL_DATA.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">
                  {item.value.toLocaleString()} ({item.percentage}%)
                </p>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0754FF] rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-2">Average Savings Plan Value</p>
          <p className="text-3xl font-bold text-[#1e2a4a]">GH₵ 5M</p>
          <p className="text-xs font-semibold text-green-500 mt-1">+6.3% vs last month</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-2">Default Rate</p>
          <p className="text-3xl font-bold text-[#1e2a4a]">7.5%</p>
          <p className="text-xs font-semibold text-red-500 mt-1">+1.2% vs last month</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-2">Refund Ratio</p>
          <p className="text-3xl font-bold text-[#1e2a4a]">8.5%</p>
          <p className="text-xs font-semibold text-gray-400 mt-1">2.1% vs last month</p>
        </div>
      </div>
    </div>
  );
}
