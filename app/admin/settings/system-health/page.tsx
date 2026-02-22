"use client";

import { TrendingUp, Activity, Settings2, CheckCircle2 } from "lucide-react";
import { useAdminSystemHealth } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState } from "@/src/components/admin/AdminFeedback";

/* ── Chart Data ──────────────────────── */
// API Response Time wave data (ms) - wavy sine-like pattern
const API_RESPONSE_DATA = [
  100, 110, 120, 140, 180, 220, 250, 260, 240, 200, 160, 120,
  90, 70, 60, 50, 70, 100, 140, 180, 220, 260, 280, 260,
  220, 180, 150, 140,
];

// Server Resource Usage data (%) - two lines
const CPU_LOAD_DATA = [
  70, 65, 55, 45, 40, 42, 50, 55, 58, 55, 52, 55, 58, 55, 55, 58, 55, 55, 52, 55,
];
const RAM_USAGE_DATA = [
  35, 30, 32, 40, 50, 55, 58, 60, 65, 75, 80, 78, 65, 50, 30, 15, 25, 40, 50, 48,
];

// Background jobs
const BACKGROUND_JOBS = [
  {
    title: "KYC Process",
    items: [
      { label: "Pending", value: 5, color: "text-blue-600" },
      { label: "Processing", value: 12, color: "text-green-600" },
      { label: "Failed", value: 0, color: "text-red-500" },
    ],
  },
  {
    title: "Email Notifications",
    items: [
      { label: "Pending", value: 140, color: "text-blue-600" },
      { label: "Processing", value: 10, color: "text-green-600" },
      { label: "Failed", value: 0, color: "text-red-500" },
    ],
  },
  {
    title: "Payout Processing",
    items: [
      { label: "Pending", value: 10, color: "text-blue-600" },
      { label: "Processing", value: 11, color: "text-green-600" },
      { label: "Failed", value: 0, color: "text-red-500" },
    ],
  },
];

// Helper: smooth bezier path
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

export default function AdminSystemHealthPage() {
  const { isLoading, error, refetch } = useAdminSystemHealth();

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;
  // API Response chart
  const apiW = 500;
  const apiH = 220;
  const apiPad = { left: 45, right: 15, top: 10, bottom: 30 };
  const apiPlotW = apiW - apiPad.left - apiPad.right;
  const apiPlotH = apiH - apiPad.top - apiPad.bottom;
  const apiMax = 280;

  const apiPoints = API_RESPONSE_DATA.map((v, i) => ({
    x: apiPad.left + (i / (API_RESPONSE_DATA.length - 1)) * apiPlotW,
    y: apiPad.top + apiPlotH - (v / apiMax) * apiPlotH,
  }));
  const apiPath = smoothPath(apiPoints);

  // Server Resource chart
  const srvW = 500;
  const srvH = 220;
  const srvPad = { left: 45, right: 15, top: 10, bottom: 30 };
  const srvPlotW = srvW - srvPad.left - srvPad.right;
  const srvPlotH = srvH - srvPad.top - srvPad.bottom;
  const srvMax = 80;

  const cpuPoints = CPU_LOAD_DATA.map((v, i) => ({
    x: srvPad.left + (i / (CPU_LOAD_DATA.length - 1)) * srvPlotW,
    y: srvPad.top + srvPlotH - (v / srvMax) * srvPlotH,
  }));
  const ramPoints = RAM_USAGE_DATA.map((v, i) => ({
    x: srvPad.left + (i / (RAM_USAGE_DATA.length - 1)) * srvPlotW,
    y: srvPad.top + srvPlotH - (v / srvMax) * srvPlotH,
  }));
  const cpuPath = smoothPath(cpuPoints);
  const ramPath = smoothPath(ramPoints);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e2a4a]">System Health & Performance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time monitoring of platform infrastructure and background services.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">All Systems Operational</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium text-gray-500">API Availability</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">99.99%</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
            Healthy
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium text-gray-500">DB Connection</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">8ms</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
            Healthy
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium text-gray-500">Payment Gateway</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">Active</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
            Healthy
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium text-gray-500">Sync Latency</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">1.2S</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
            Optimal
          </span>
        </div>
      </div>

      {/* Two Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Response Time (ms) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-gray-900">API Response Time (ms)</h3>
          </div>
          <svg viewBox={`0 0 ${apiW} ${apiH}`} className="w-full h-60" preserveAspectRatio="none">
            {/* Y-axis grid lines & labels */}
            {[0, 70, 140, 210, 280].map((v) => {
              const y = apiPad.top + apiPlotH - (v / apiMax) * apiPlotH;
              return (
                <g key={v}>
                  <line x1={apiPad.left} y1={y} x2={apiW - apiPad.right} y2={y} stroke="#f0f0f0" strokeWidth="0.5" />
                  <text x={apiPad.left - 8} y={y + 3} textAnchor="end" className="text-[8px] fill-gray-400">{v}</text>
                </g>
              );
            })}
            {/* X-axis labels */}
            <text x={apiPad.left} y={apiH - 5} textAnchor="middle" className="text-[8px] fill-gray-400">10:00</text>
            <text x={apiPad.left + apiPlotW / 2} y={apiH - 5} textAnchor="middle" className="text-[8px] fill-gray-400">10:05</text>
            <text x={apiW - apiPad.right} y={apiH - 5} textAnchor="middle" className="text-[8px] fill-gray-400">10:10</text>
            {/* Line */}
            <path d={apiPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Server Resource Usage (%) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="h-5 w-5 text-gray-600" />
            <h3 className="text-base font-bold text-gray-900">Server Resource Usage (%)</h3>
          </div>
          <svg viewBox={`0 0 ${srvW} ${srvH}`} className="w-full h-60" preserveAspectRatio="none">
            {/* Y-axis grid lines & labels */}
            {[0, 20, 40, 60, 80].map((v) => {
              const y = srvPad.top + srvPlotH - (v / srvMax) * srvPlotH;
              return (
                <g key={v}>
                  <line x1={srvPad.left} y1={y} x2={srvW - srvPad.right} y2={y} stroke="#f0f0f0" strokeWidth="0.5" />
                  <text x={srvPad.left - 8} y={y + 3} textAnchor="end" className="text-[8px] fill-gray-400">{v}</text>
                </g>
              );
            })}
            {/* X-axis labels */}
            <text x={srvPad.left} y={srvH - 5} textAnchor="middle" className="text-[8px] fill-gray-400">10:00</text>
            <text x={srvPad.left + srvPlotW / 2} y={srvH - 5} textAnchor="middle" className="text-[8px] fill-gray-400">10:05</text>
            <text x={srvW - srvPad.right} y={srvH - 5} textAnchor="middle" className="text-[8px] fill-gray-400">10:10</text>
            {/* CPU Load (green) */}
            <path d={cpuPath} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Ram Usage (blue) */}
            <path d={ramPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-gray-600">CPU Load</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-gray-600">Ram Usage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Jobs Queue */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-200 mb-5">
          Background Jobs Queue
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BACKGROUND_JOBS.map((job, i) => (
            <div key={i}>
              <h4 className="text-sm font-bold text-gray-900 mb-3">{job.title}</h4>
              <div className="space-y-2">
                {job.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
