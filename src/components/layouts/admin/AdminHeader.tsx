"use client";

import { Button } from "@/src/components/ui/button";
import { Bell, Plus, Search, Users2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAuth } from "@/src/contexts/AuthContext";

interface AdminHeaderProps {
  title?: string;
  searchPlaceholder?: string;
}

export function AdminHeader({
  title = "Dashboard",
  searchPlaceholder = "Search across entities",
}: AdminHeaderProps) {
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-4">
      {/* Page Title */}
      <h2 className="text-xl font-bold text-gray-900 shrink-0">{title}</h2>

      {/* Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#2C3466] focus:ring-1 focus:ring-[#2C3466] focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <Button
          size="sm"
          className="bg-[#0754FF] hover:bg-[#222E76] text-white rounded-lg px-4 h-9 text-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Quick Action
        </Button>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
              <Users2 className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={() => logout()}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
