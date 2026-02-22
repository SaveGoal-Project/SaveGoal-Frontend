"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useUserProfile } from "@/src/domains/user-profile/users.hooks";
import { User, Phone, Mail, MapPin } from "lucide-react";

export function ProfileTab() {
  const { profile, isLoading, update } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(`${profile.firstName || ""} ${profile.lastName || ""}`.trim());
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    try {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      await update({ firstName, lastName, email, address });
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      // Error handled by hook
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-[#2d3369] mb-6">
        Profile Information
      </h3>

      {successMessage && (
        <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
          {successMessage}
        </div>
      )}

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
            <User className="h-4 w-4" />
            Full Name
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Pearl Grey"
            className="rounded-lg border-gray-300"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </label>
          <Input
            value={phone}
            disabled
            placeholder="0200000000"
            className="rounded-lg border-gray-300 bg-gray-50"
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
            <Mail className="h-4 w-4" />
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="rounded-lg border-gray-300"
          />
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
            <MapPin className="h-4 w-4" />
            Address
          </label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="C4600 swellview east street"
            className="rounded-lg border-gray-300"
          />
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-lg px-8 py-2.5"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
