"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { Save } from "lucide-react";

const TABS = ["General", "Payment Gateway", "Notifications", "Security", "Fees & Limits"];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure platform-wide settings, payment gateways, and system preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center gap-1 px-6 border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === tab ? "text-[#0754FF]" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0754FF] rounded-full" />}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "General" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform Name</label>
                <input defaultValue="SaveGoal" className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
                <input defaultValue="support@savegoal.com" className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Currency</label>
                <select defaultValue="GHS" className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm">
                  <option value="GHS">GHS - Ghana Cedi</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Language</label>
                <select defaultValue="en" className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm">
                  <option value="en">English</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Temporarily disable the platform for maintenance</p>
                </div>
                <button className="relative w-11 h-6 rounded-full bg-gray-300 transition-colors">
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0754FF] text-white text-sm font-medium rounded-lg hover:bg-[#0643cc] transition-colors">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "Payment Gateway" && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 rounded-xl bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">P</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Paystack</p>
                    <p className="text-xs text-gray-500">Primary payment gateway</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Connected</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm">M</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">MTN MoMo API</p>
                    <p className="text-xs text-gray-500">Mobile money integration</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Connected</span>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="space-y-4 max-w-2xl">
              {[
                { label: "Email notifications for new users", enabled: true },
                { label: "SMS alerts for failed payments", enabled: true },
                { label: "Push notifications for disputes", enabled: false },
                { label: "Weekly summary reports", enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  <button className={cn("relative w-11 h-6 rounded-full transition-colors", item.enabled ? "bg-[#0754FF]" : "bg-gray-300")}>
                    <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform", item.enabled ? "left-[22px]" : "left-0.5")} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Security" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Timeout (minutes)</label>
                <input type="number" defaultValue={30} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF]" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Require 2FA for all admin accounts</p>
                </div>
                <button className="relative w-11 h-6 rounded-full bg-[#0754FF] transition-colors">
                  <span className="absolute left-[22px] top-0.5 w-5 h-5 rounded-full bg-white" />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">IP Whitelisting</p>
                  <p className="text-xs text-gray-500">Restrict admin access to specific IPs</p>
                </div>
                <button className="relative w-11 h-6 rounded-full bg-gray-300 transition-colors">
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "Fees & Limits" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Transaction Fee (%)</label>
                <input type="number" defaultValue={1.5} step={0.1} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Savings Amount (GHS)</label>
                <input type="number" defaultValue={50} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Maximum Withdrawal Limit (GHS)</label>
                <input type="number" defaultValue={50000} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF]" />
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0754FF] text-white text-sm font-medium rounded-lg hover:bg-[#0643cc] transition-colors">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
