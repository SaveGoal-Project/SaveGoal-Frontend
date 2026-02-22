"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { Bell, CheckCheck, AlertTriangle, Info, UserPlus, CreditCard } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "alert" | "info" | "user" | "payment";
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "High-Risk Activity Detected", description: "Unusual login pattern detected for user Kwame Asante from a new IP address", time: "2 mins ago", read: false, type: "alert" },
  { id: "n2", title: "New Merchant Registration", description: "LuxGadgets GH has submitted a merchant application for review", time: "15 mins ago", read: false, type: "user" },
  { id: "n3", title: "Payment Gateway Update", description: "Paystack API version update completed successfully. No downtime recorded.", time: "1 hour ago", read: false, type: "payment" },
  { id: "n4", title: "Dispute Escalated", description: "Dispute DIS-2003 has been escalated to admin review – user Kofi Mensah vs GadgetWorld", time: "2 hours ago", read: true, type: "alert" },
  { id: "n5", title: "Weekly Report Available", description: "Your weekly platform performance report is ready to download", time: "3 hours ago", read: true, type: "info" },
  { id: "n6", title: "New User Signup Milestone", description: "Platform has reached 12,500 registered users. Growth target of Q1 met!", time: "5 hours ago", read: true, type: "user" },
  { id: "n7", title: "Failed Payment Alert", description: "Transaction TXN-2005 failed for user Ama Darko – Card authentication error", time: "6 hours ago", read: true, type: "payment" },
  { id: "n8", title: "System Maintenance Reminder", description: "Scheduled maintenance window in 48 hours. All services will be briefly unavailable.", time: "1 day ago", read: true, type: "info" },
];

const typeIcons: Record<string, typeof Bell> = {
  alert: AlertTriangle,
  info: Info,
  user: UserPlus,
  payment: CreditCard,
};

const typeStyles: Record<string, string> = {
  alert: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600",
  user: "bg-green-50 text-green-600",
  payment: "bg-purple-50 text-purple-600",
};

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const filtered = filter === "unread" ? MOCK_NOTIFICATIONS.filter((n) => !n.read) : MOCK_NOTIFICATIONS;
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with platform alerts, events, and system notifications
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <CheckCheck className="h-4 w-4" />
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            filter === "all" ? "bg-[#0754FF] text-white" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          All ({MOCK_NOTIFICATIONS.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            filter === "unread" ? "bg-[#0754FF] text-white" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        {filtered.map((notif) => {
          const Icon = typeIcons[notif.type];
          return (
            <div
              key={notif.id}
              className={cn(
                "p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer",
                !notif.read && "bg-blue-50/30"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", typeStyles[notif.type])}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">{notif.title}</h4>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-[#0754FF]" />}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{notif.description}</p>
                <p className="text-xs text-gray-400 mt-1.5">{notif.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
