"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

export default function AdminRootPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, user?.role, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C3466]" />
    </div>
  );
}
