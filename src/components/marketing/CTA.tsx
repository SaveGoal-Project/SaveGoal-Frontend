"use client";

import { Shield, CreditCard, Smartphone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CTAProps {
  className?: string;
}

export function CTA({ className }: CTAProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Main CTA Card with Gradient Background */}
        <div 
          className="relative rounded-[50px] md:rounded-[72px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #D6E6FA 0%, #EEF3F8 25%, #F5F3E8 50%, #F8F4E0 75%, #FAF5DC 100%)",
          }}
        >
          <div className="relative p-8 md:p-0 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-50 lg:gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-6 z-10">
                {/* Coming Soon Badge */}
                <div className="inline-flex items-center gap-2 bg-[#FFD6004D] rounded-full px-5 py-2">
                  <Smartphone className="w-5 h-5 text-black" />
                  <span className="text-base font-semibold text-black">
                    Coming soon on mobile
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight">
                  Start Your Savings Journey Today
                </h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-[#5e7fc1] leading-relaxed max-w-lg">
                  Join over 50,000 Ghanaians who are saving smarter. No credit checks, no interest—just smart savings for the products you love.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#2b3063] to-[#5761c9] hover:opacity-90 text-white px-8 py-4 text-base font-semibold rounded-full transition-all duration-300"
                  >
                    Create Free Account
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center border-2 border-[#2d3369] text-[#2d3369] px-8 py-4 text-base font-semibold rounded-full hover:bg-[#2d3369] hover:text-white transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#1a53c8]/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-[#1a53c8]" />
                    </div>
                    <span className="text-base text-[#5e7fc1] font-medium">
                      Bank Level Security
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#1a53c8]/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-[#1a53c8]" />
                    </div>
                    <span className="text-base text-[#5e7fc1] font-medium">
                      Momo & Cards
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - Phone Image */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-[300px] md:w-[380px] lg:w-[450px] h-[400px] md:h-[500px] lg:h-[580px]">
                  <Image
                    src="/SaveGoal-CTA.png"
                    alt="SaveGoal Mobile App"
                    fill
                    sizes="(max-width: 768px) 300px, (max-width: 1024px) 380px, 450px"
                    className="object-contain object-center"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
