"use client";

import type { LucideIcon } from "lucide-react";

interface SummaryStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export function SummaryStatCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
}: SummaryStatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBgColor || "#eef0ff" }}
      >
        <Icon className="h-5 w-5" style={{ color: iconColor || "#2d3369" }} />
      </div>
    </div>
  );
}
