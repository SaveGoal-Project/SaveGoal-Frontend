"use client";

import {
  User,
  CreditCard,
  FileText,
  Users,
  Shield,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";

export type SettingsTab =
  | "profile"
  | "payment-methods"
  | "transactions"
  | "next-of-kin"
  | "security"
  | "notifications";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  {
    id: "payment-methods",
    label: "Payment Methods",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "transactions",
    label: "Transaction History",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "next-of-kin",
    label: "Next of Kin",
    icon: <Users className="h-4 w-4" />,
  },
  { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="h-4 w-4" />,
  },
];

export function SettingsSidebar({
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  const { logout } = useAuth();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3">
      <nav className="space-y-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#eef0ff] text-[#2d3369]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        {/* Logout button */}
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </nav>
    </div>
  );
}
