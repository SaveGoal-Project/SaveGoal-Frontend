"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useChangePassword } from "@/src/domains/user-profile/users.hooks";
import { Eye, EyeOff } from "lucide-react";

export function SecurityTab() {
  const { change, isLoading, error, success } = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async () => {
    setLocalError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      setLocalError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await change({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900">Change Password</h3>
        <p className="text-sm text-gray-500 mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
          Password changed successfully!
        </div>
      )}

      {(error || localError) && (
        <div className="bg-red-50 text-red-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
          {localError || error}
        </div>
      )}

      <div className="space-y-4 max-w-md">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Current Password
          </Label>
          <div className="relative mt-1.5">
            <Input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">
            New Password
          </Label>
          <div className="relative mt-1.5">
            <Input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">
            Confirm New Password
          </Label>
          <div className="relative mt-1.5">
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-xl px-8"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}

