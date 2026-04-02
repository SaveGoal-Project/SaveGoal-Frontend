"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Menu, X, ChevronDown, LogOut, Settings, ShoppingCart, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useCart } from "@/src/contexts/CartContext";
import { cn } from "@/src/lib/utils";
import { NotificationBell } from "@/src/components/shared/NotificationBell";

interface NavbarProps {
  variant?: "default" | "marketing";
}

export function Navbar({ variant = "default" }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/products", label: "Browse Products" },
        { href: "/contributors", label: "Contributors" },
        { href: "/how-it-works", label: "How It Works" },
      ]
    : [
        { href: "/products", label: "Browse Products" },
        { href: "/contributors", label: "Contributors" },
        { href: "/how-it-works", label: "How It Works" },
        { href: "/merchants", label: "For Merchants" },
      ];

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  const isMarketing = variant === "marketing";

  return (
    <nav
      className={cn(
        "sticky top-0 z-50",
        isMarketing
          ? "border-b border-black/5 bg-white/55 shadow-[0_4px_25px_rgba(0,0,0,0.11)] backdrop-blur-md"
          : "border-b border-gray-100 bg-white/80 shadow-sm backdrop-blur-md"
      )}
    >
      <div
        className={cn(
          "mx-auto px-4",
          isMarketing ? "max-w-[1440px] md:px-6 lg:px-10" : "container"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between",
            isMarketing ? "h-[89px]" : "h-20"
          )}
        >
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
            <Image
              src="/SavegoalLogo.png"
              alt="SaveGoal"
              width={140}
              height={48}
              style={{ width: "auto", height: isMarketing ? "44px" : "48px" }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className={cn("hidden md:flex items-center", isMarketing ? "gap-8 lg:gap-[52px]" : "gap-10")}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-[#2d3369]",
                  isMarketing
                    ? "text-[14px] font-semibold text-[#1a53c8]"
                    : "text-base font-medium text-[#1a53c8]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              /* Authenticated: notification bell + cart + avatar dropdown */
              <div className="flex items-center gap-2">
                <NotificationBell variant="consumer" />

                {/* Cart Icon */}
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-600 hover:text-[#1a53c8] transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-[#3d4a99] text-white text-[10px] font-bold leading-none">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* User Avatar Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#2d3369] flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials()}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user.email || user.phone}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Not authenticated: Sign In + Get Started */
              <>
                <Link
                  href="/login"
                  className={cn(
                    "font-semibold text-gray-800 transition-colors hover:text-[#1a53c8]",
                    isMarketing ? "text-[14px]" : "text-base"
                  )}
                >
                  Sign In
                </Link>
                <Button
                  asChild
                  className={cn(
                    "bg-gradient-to-r from-[#2b3063] to-[#5761c9] text-white hover:opacity-90",
                    isMarketing ? "h-14 rounded-[11px] px-8 text-[14px] font-bold" : "rounded-full px-6"
                  )}
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-gray-700 hover:text-[#1a53c8] py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-[#1a53c8] py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Cart
                      {cartCount > 0 && (
                        <span className="ml-1 h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-[#3d4a99] text-white text-[10px] font-bold">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/settings"
                      className="text-base font-medium text-gray-700 hover:text-[#1a53c8] py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="text-base font-semibold text-red-600 py-2 text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-base font-semibold text-gray-800 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[#2b3063] to-[#5761c9] hover:opacity-90 text-white rounded-full"
                    >
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
