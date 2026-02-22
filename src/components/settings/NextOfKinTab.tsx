"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useNextOfKin } from "@/src/domains/user-profile/users.hooks";
import { User, Users, Mail, Phone } from "lucide-react";

const relationships = [
  "Parent",
  "Sibling",
  "Spouse",
  "Child",
  "Uncle",
  "Aunt",
  "Cousin",
  "Friend",
  "Brother-in-law",
  "Sister-in-law",
  "Other",
];

export function NextOfKinTab() {
  const { nextOfKin, isLoading, update } = useNextOfKin();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (nextOfKin) {
      setFullName(nextOfKin.fullName || "");
      setRelationship(nextOfKin.relationship || "");
      setEmail(nextOfKin.email || "");
      setPhone(nextOfKin.phone || "");
    }
  }, [nextOfKin]);

  const handleUpdate = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    try {
      await update({ fullName, relationship, email, phone });
      setSuccessMessage("Next of kin updated successfully!");
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
            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-[#2d3369] mb-1">
        Next of Kin
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Choose who you trust so we know who to reach out to when it becomes necessary
      </p>

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
            Full name of Next of Kin
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Pearl Grey"
            className="rounded-lg border-gray-300"
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
            <Users className="h-4 w-4" />
            What is the Relationship
          </label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2d3369] focus:border-transparent"
          >
            <option value="">Select relationship</option>
            {relationships.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
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

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0200000000"
            className="rounded-lg border-gray-300"
          />
        </div>

        {/* Update Button */}
        <div className="pt-2">
          <Button
            onClick={handleUpdate}
            disabled={isSaving}
            className="w-full bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-lg py-2.5"
          >
            {isSaving ? "Updating..." : "Update next of kin"}
          </Button>
        </div>
      </div>
    </div>
  );
}

