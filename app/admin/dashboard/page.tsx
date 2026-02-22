"use client";

import { Progress } from "@/src/components/ui/progress";
import {
  Users,
  Leaf,
  TrendingUp,
  CircleAlert,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import {
  useAdminDashboard,
  useAdminRecentActivity,
  useAdminRiskAlerts,
} from "@/src/domains/admin/admin.hooks";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

/* ── Mini sparkline SVG ─────────────────────────────────────── */
function MiniSparkline({
  data,
  positive = true,
}: {
  data: number[];
  positive?: boolean;
}) {
  const width = 100;
  const height = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 2;
  const points = data
    .map((v, i) => {
      const x =
        padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
      const y =
        height - padding - ((v - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={positive ? "#22c55e" : "#ef4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

/* ── Chart data ─────────────────────────────────────────────── */
const DEPOSITS_DATA = [3500, 4200, 5500, 8500, 7200, 6000, 5000];
const WITHDRAWALS_DATA = [3000, 5000, 7000, 10500, 8200, 5500, 7000];

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboard();
  const { activities, isLoading: activityLoading } = useAdminRecentActivity();
  const { alerts, isLoading: alertsLoading } = useAdminRiskAlerts();

  const formatFunds = (n: number) =>
    n >= 1_000_000
      ? `GHS ${(n / 1_000_000).toFixed(0)}M`
      : `GHS ${n.toLocaleString()}`;

  const statCards = [
    {
      title: "Total Users",
      value: (stats?.totalUsers ?? 0).toLocaleString(),
      change: "12%",
      changeType: "positive" as const,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      sparkData: [30, 45, 35, 55, 60, 50, 70],
    },
    {
      title: "Active Savings Plans",
      value: (stats?.activeSavingsPlans ?? 0).toLocaleString(),
      change: "12%",
      changeType: "positive" as const,
      icon: Leaf,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      sparkData: [40, 35, 50, 45, 60, 55, 65],
    },
    {
      title: "Total Funds Saved Users",
      value: formatFunds(stats?.totalFundsSaved ?? 0),
      change: "12%",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      sparkData: [20, 35, 25, 50, 45, 60, 70],
    },
    {
      title: "Pending Refunds",
      value: (stats?.pendingRefunds ?? 0).toLocaleString(),
      change: "12%",
      changeType: "negative" as const,
      icon: CircleAlert,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      sparkData: [70, 60, 65, 50, 45, 55, 40],
    },
  ];

  const statusStyles: Record<string, string> = {
    Success: "bg-green-50 text-green-700 border border-green-200",
    Warning: "bg-amber-50 text-amber-700 border border-amber-200",
    Error: "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </div>
          ))
          : statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200"
            >
              {/* Top row: icon + change badge */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    stat.iconBg
                  )}
                >
                  <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-semibold",
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-500"
                  )}
                >
                  {stat.change}
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                </div>
              </div>

              {/* Label */}
              <p className="text-xs font-medium text-gray-500 mb-1">
                {stat.title}
              </p>

              {/* Value */}
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {stat.value}
              </p>

              {/* Sparkline */}
              <div className="mt-2">
                <MiniSparkline
                  data={stat.sparkData}
                  positive={stat.changeType === "positive"}
                />
              </div>
            </div>
          ))}
      </div>

      {/* ── Savings Growth + Risk Alerts ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Savings Growth Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Savings Growth
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Total deposits vs withdrawals this year
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Last 30 days
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-72 mt-4">
            <svg
              viewBox="0 0 500 240"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Y-axis labels */}
              {[0, 3500, 5000, 7500, 10000].map((v, i) => (
                <text
                  key={v}
                  x="32"
                  y={210 - i * 45}
                  textAnchor="end"
                  className="text-[11px] fill-gray-400"
                  style={{ fontFamily: "inherit" }}
                >
                  {v === 0 ? "0" : v.toLocaleString()}
                </text>
              ))
              }
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="45"
                  y1={210 - i * 45}
                  x2="480"
                  y2={210 - i * 45}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              ))}
              {/* Week labels */}
              {["Week 1", "Week 2", "Week 3", "Week 4"].map((label, i) => (
                <text
                  key={label}
                  x={100 + i * 115}
                  y="232"
                  textAnchor="middle"
                  className="text-[11px] fill-gray-400"
                  style={{ fontFamily: "inherit" }}
                >
                  {label}
                </text>
              ))}
              {/* Deposits line (blue solid) */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={DEPOSITS_DATA.map(
                  (v, i) =>
                    `${55 + (i / (DEPOSITS_DATA.length - 1)) * 425},${210 - (v / 10500) * 180}`
                ).join(" ")}
              />
              {/* Withdrawals line (red dashed) */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={WITHDRAWALS_DATA.map(
                  (v, i) =>
                    `${55 + (i / (WITHDRAWALS_DATA.length - 1)) * 425},${210 - (v / 10500) * 180}`
                ).join(" ")}
              />
            </svg>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-bold text-gray-900">Risk Alerts</h3>
          </div>
          {alertsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {alert.message}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-3 ml-6">
                  <button className="text-sm font-semibold text-[#2C3466] hover:underline">
                    Review account
                  </button>
                  <button className="text-sm font-semibold text-[#2C3466] hover:underline">
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Recent Activity + System Health ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">
              Recent Activity
            </h3>
            <Link
              href="/admin/audit"
              className="text-sm font-semibold text-[#2C3466] hover:underline"
            >
              View All
            </Link>
          </div>

          {activityLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm shrink-0">
                    {item.userInitial}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.timestamp}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={cn(
                      "shrink-0 px-3 py-1 rounded-full text-xs font-medium",
                      statusStyles[item.status]
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="bg-[#1e2439] rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold">System Health</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-sm text-gray-300">
              All systems operational
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {/* API Response Time */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">API Response Time</span>
                <span className="text-white font-medium">130ms</span>
              </div>
              <Progress
                value={80}
                className="h-2 bg-white/15"
                indicatorClassName="bg-blue-400"
              />
            </div>

            {/* DB Load */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">DB Load</span>
                <span className="text-white font-medium">30%</span>
              </div>
              <Progress
                value={30}
                className="h-2 bg-white/15"
                indicatorClassName="bg-green-400"
              />
            </div>
          </div>

          <button className="w-full mt-6 border border-white/30 text-white text-sm font-medium rounded-full h-10 hover:bg-white/10 transition-colors">
            View server logs
          </button>
        </div>
      </div>
    </div>
  );
}
