"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  PiggyBank,
  CreditCard,
  AlertTriangle,
  Shield,
  BarChart3,
  Settings,
  Activity,
  UsersRound,
  ClipboardList,
  Bell,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/merchants", label: "Merchants", icon: Building2 },
  { href: "/admin/plans", label: "SNBL Plans", icon: PiggyBank },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
  { href: "/admin/risk", label: "Risk and Compliance", icon: Shield },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Platform Settings", icon: Settings },
  { href: "/admin/settings/system-health", label: "System Health", icon: Activity },
  { href: "/admin/roles", label: "Roles and Permissions", icon: UsersRound },
  { href: "/admin/audit", label: "Audit Logs", icon: ClipboardList },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
] as const;

interface AdminSidebarProps {
  adminName?: string;
  adminEmail?: string;
  adminRole?: string;
}

export function AdminSidebar({
  adminName = "Admin User",
  adminRole = "Super Admin",
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo / Brand */}
      <div className="px-6 py-5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#0754FF]">SaveGoal Admin</h1>
        <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/admin/dashboard" && href !== "/admin/settings" && pathname.startsWith(href)) ||
              (href === "/admin/settings" && pathname === "/admin/settings");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#E0EAFE] text-[#0754FF] shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full bg-[#2C3466] flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {(adminName || "A")[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{adminName}</p>
            <p className="text-xs text-gray-500 truncate">{adminRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
