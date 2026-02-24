"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AdminSidebar } from "@/src/components/layouts/admin/AdminSidebar";
import { AdminHeader } from "@/src/components/layouts/admin/AdminHeader";

const TITLE_MAP: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Users",
  "/admin/merchants": "Merchants",
  "/admin/plans": "Plans",
  "/admin/payments": "Payments",
  "/admin/disputes": "Disputes",
  "/admin/risk": "Risk and Compliance",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Platform Settings",
  "/admin/settings/system-health": "System Health",
  "/admin/roles": "Roles and Permissions",
  "/admin/audit": "Audit",
  "/admin/notifications": "Notifications",
};

function getPageTitle(pathname: string): string {
  for (const [path, title] of Object.entries(TITLE_MAP)) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      return title;
    }
  }
  return "Admin";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isLoginPage) return;
    if (isLoading) return;

    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/admin/login");
    }
  }, [isLoginPage, isAuthenticated, user?.role, isLoading, router]);

  // Login page: render without shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading or not authenticated
  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C3466]" />
      </div>
    );
  }

  const adminName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email ?? "Admin User";

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        adminName={adminName}
        adminEmail={user?.email}
        adminRole="Super Admin"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <AdminHeader
          title={getPageTitle(pathname)}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
