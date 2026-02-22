"use client";

import { useState } from "react";
import { useNotificationPreferences } from "@/src/domains/user-profile/users.hooks";
import { Button } from "@/src/components/ui/button";
import type { NotificationPreferences } from "@/src/domains/user-profile/users.types";

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function ToggleSwitch({ checked, onCheckedChange }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-[#2d3369]" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function NotificationsTab() {
  const { preferences, isLoading, update } = useNotificationPreferences();
  const [successMessage, setSuccessMessage] = useState("");

  const handleToggle = async (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    try {
      await update({ [key]: value });
      setSuccessMessage("Preferences updated!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch {
      // handled by hook
    }
  };

  if (isLoading || !preferences) {
    return (
      <div className="animate-pulse space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-56" />
            </div>
            <div className="w-11 h-6 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const notificationSettings: {
    key: keyof NotificationPreferences;
    label: string;
    description: string;
  }[] = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive notifications via email",
    },
    {
      key: "smsNotifications",
      label: "SMS Notifications",
      description: "Receive notifications via SMS",
    },
    {
      key: "paymentReminders",
      label: "Payment Reminders",
      description: "Get reminders when payments are due",
    },
    {
      key: "goalUpdates",
      label: "Goal Updates",
      description: "Notifications about your savings goal progress",
    },
    {
      key: "promotions",
      label: "Promotions & Offers",
      description: "Receive promotional offers and deals",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900">
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose how and when you want to be notified
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
          {successMessage}
        </div>
      )}

      <div className="space-y-6">
        {notificationSettings.map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between py-2"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {setting.label}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {setting.description}
              </p>
            </div>
            <ToggleSwitch
              checked={preferences[setting.key]}
              onCheckedChange={(checked) => handleToggle(setting.key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

