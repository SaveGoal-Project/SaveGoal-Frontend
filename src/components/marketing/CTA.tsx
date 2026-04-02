"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCard, Shield, Smartphone } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface CTAProps {
  className?: string;
}

export function CTA({ className }: CTAProps) {
  return (
    <section className={cn("bg-[#f5f5f5] py-10 md:py-14", className)}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[36px] border border-[#c3dbfb] bg-[linear-gradient(180deg,rgba(192,219,251,0.64)_0%,rgba(255,255,255,0.88)_50%,rgba(255,214,0,0.05)_100%)] shadow-[0_20px_56px_rgba(0,0,0,0.12)] md:rounded-[56px] lg:rounded-[72px]">
          <div className="grid items-center gap-8 px-6 py-8 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:py-0">
            <div className="max-w-[560px] py-4 lg:py-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#ffd6004d] px-4 py-2 text-[11px] font-medium text-[#665200]">
                <Smartphone className="h-4 w-4 text-[#7b5f00]" />
                Coming soon on mobile
              </div>
              <h2 className="mt-7 text-[34px] font-extrabold tracking-[-0.03em] text-black md:text-[44px]">
                Start Your Savings Journey Today
              </h2>
              <p className="mt-4 max-w-[720px] text-[15px] leading-7 text-[rgba(26,83,200,0.62)] md:text-[19px]">
                Join over 50,000 Ghanaians who are saving smarter. No credit
                checks, no interest-just smart savings for the products you
                love.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-[54px] items-center justify-center rounded-[14px] bg-gradient-to-r from-[#2b3063] to-[#5761c9] px-6 text-[14px] font-bold text-white shadow-[0_14px_28px_rgba(43,48,99,0.18)] transition-transform hover:-translate-y-0.5"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex h-[54px] items-center justify-center rounded-[14px] border-4 border-[#2d3369] px-6 text-[14px] font-bold text-[#4850a5] transition-colors hover:bg-[#edf2ff]"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-[11px] text-[#8aa0d7]">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#8aa0d7]" />
                  <span>Bank Level Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#8aa0d7]" />
                  <span>Momo &amp; Cards</span>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-[320px] items-end justify-center lg:min-h-[520px]">
              <Image
                src="/SaveGoal-CTA.png"
                alt="SaveGoal mobile app preview"
                width={720}
                height={920}
                className="h-auto w-full max-w-[440px] object-contain lg:max-w-[520px]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
