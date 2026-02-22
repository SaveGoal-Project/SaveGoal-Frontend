"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UserSummaryCard } from "@/src/components/settings/UserSummaryCard";
import {
  SettingsSidebar,
  type SettingsTab,
} from "@/src/components/settings/SettingsSidebar";
import { ProfileTab } from "@/src/components/settings/ProfileTab";
import { PaymentMethodsTab } from "@/src/components/settings/PaymentMethodsTab";
import { TransactionHistoryTab } from "@/src/components/settings/TransactionHistoryTab";
import { NextOfKinTab } from "@/src/components/settings/NextOfKinTab";
import { SecurityTab } from "@/src/components/settings/SecurityTab";
import { NotificationsTab } from "@/src/components/settings/NotificationsTab";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const validTabs: SettingsTab[] = [
  "profile",
  "payment-methods",
  "transactions",
  "next-of-kin",
  "security",
  "notifications",
];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") as SettingsTab | null;
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    tabParam && validTabs.includes(tabParam) ? tabParam : "profile"
  );

  // Sync tab from URL on mount and changes
  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    router.push(`/settings?tab=${tab}`, { scroll: false });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "payment-methods":
        return <PaymentMethodsTab />;
      case "transactions":
        return <TransactionHistoryTab />;
      case "next-of-kin":
        return <NextOfKinTab />;
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Page heading */}
      <h1 className="text-2xl font-bold text-[#1e2a4a] mb-1">
        Account Settings
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Manage your account and preferences
      </p>

      {/* User Summary Card (full width) */}
      <div className="mb-6">
        <UserSummaryCard />
      </div>

      {/* Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <SettingsSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
