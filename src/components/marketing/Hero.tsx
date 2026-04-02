"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles, WalletCards } from "lucide-react";

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const stats = [
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Secure Saving",
    },
    {
      icon: Sparkles,
      value: "50K +",
      label: "Goals Achieved",
    },
    {
      icon: WalletCards,
      value: "GHc5M +",
      label: "Saved",
    },
  ];

  return (
    <section className={className}>
      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 md:px-8 md:pb-20 md:pt-12 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_1.12fr] lg:gap-11">
          <div className="max-w-[530px]">
            <h1 className="max-w-[480px] text-[2.65rem] font-extrabold leading-[0.98] tracking-[-0.04em] text-black md:text-[3.6rem] lg:text-[4.2rem]">
              Save Today,{" "}
              <span className="bg-gradient-to-r from-[#4850a5] to-[#5761c9] bg-clip-text text-transparent">
                Own Tomorrow
              </span>
            </h1>
            <p className="mt-5 max-w-[470px] text-[15px] leading-6 text-[#6e7db6] md:text-base">
              Turn your dreams into reality with SaveGoal. Create structured
              savings plans for the products you love, and get them when
              you&apos;re ready.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#2b3063] to-[#5761c9] px-6 text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(45,51,105,0.18)] transition-transform hover:-translate-y-0.5"
              >
                Start Saving Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex h-14 items-center justify-center rounded-[14px] border-[2.5px] border-[#3d4a99] px-6 text-[14px] font-semibold text-[#3d4a99] transition-colors hover:bg-[#eef2ff]"
              >
                Browse Products
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-[#dbe6ff] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff4ff] text-[#4850a5]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[18px] font-bold leading-none text-[#2e3994]">
                      {value}
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#9bbcff]">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[22px] bg-[#0b1024] shadow-[0_26px_60px_rgba(10,18,44,0.18)]">
              <div className="absolute right-5 top-4 z-10 rounded-full bg-[#ffd54f] px-4 py-1.5 text-[11px] font-semibold text-black">
                No Interest
              </div>
              <Image
                src="/hero.png"
                alt="SaveGoal showcase"
                width={1000}
                height={720}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <div className="absolute bottom-4 left-4 rounded-xl border border-black/5 bg-white px-3 py-2 shadow-[0_16px_30px_rgba(0,0,0,0.12)] md:bottom-6 md:left-6">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#ffce31]">
                Product Highlight
              </p>
              <p className="mt-1 text-[11px] font-bold text-[#1f2556]">
                Apple MacBook Pro 13
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

