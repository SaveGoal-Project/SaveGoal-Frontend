"use client";

import { useState } from "react";
import { RegisterForm } from "@/src/components/forms/RegisterForm";
import { MerchantRegisterForm } from "@/src/components/forms/MerchantRegisterForm";
import { AuthSidebar } from "@/src/components/layouts/AuthSidebar";
import { Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

type AccountType = "buyer" | "merchant";

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>("buyer");

  const features = [
    "Secure mobile money payments",
    "Track progress in real time",
    "Zero interest on savings",
    "No credit checks required",
  ];

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Fixed Left Sidebar */}
      <AuthSidebar
        title="Join SaveGoal Today"
        description="Join thousands of Ghanaians who are saving smarter and owning what they love."
      >
        <div className="flex flex-col space-y-6 mt-8 w-full max-w-md">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-[50px] w-[50px] rounded-full border-2 border-white flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-normal text-white">{feature}</span>
            </div>
          ))}
        </div>
      </AuthSidebar>

      {/* Scrollable Right Side - offset by sidebar width on large screens */}
      <div className="lg:ml-[50%] min-h-screen bg-white overflow-y-auto">
        {/* Back to home link */}
        <div className="sticky top-0 pt-8 pb-4 px-8 lg:px-12 bg-white z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="flex justify-center items-start px-6 lg:px-12 pb-12">
          {accountType === "buyer" ? (
            <RegisterForm
              accountType={accountType}
              onAccountTypeChange={handleAccountTypeChange}
            />
          ) : (
            <MerchantRegisterForm
              accountType={accountType}
              onAccountTypeChange={handleAccountTypeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
