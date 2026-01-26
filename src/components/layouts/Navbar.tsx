"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#1a53c8]">SaveGoal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/products"
              className="text-base font-medium text-[#1a53c8] hover:text-[#2d3369] transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/how-it-works"
              className="text-base font-medium text-[#1a53c8] hover:text-[#2d3369] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/merchants"
              className="text-base font-medium text-[#1a53c8] hover:text-[#2d3369] transition-colors"
            >
              For Merchants
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-base font-semibold text-gray-800 hover:text-[#1a53c8] transition-colors"
            >
              Sign In
            </Link>
            <Button
              asChild
              className="bg-gradient-to-r from-[#2b3063] to-[#5761c9] hover:opacity-90 text-white rounded-full px-6"
            >
              <Link href="/register">Get Started</Link>
            </Button>
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
              <Link
                href="/products"
                className="text-base font-medium text-gray-700 hover:text-[#1a53c8] py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/how-it-works"
                className="text-base font-medium text-gray-700 hover:text-[#1a53c8] py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/merchants"
                className="text-base font-medium text-gray-700 hover:text-[#1a53c8] py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Merchants
              </Link>
              <Link
                href="/about"
                className="text-base font-medium text-gray-700 hover:text-[#1a53c8] py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
