"use client";

import { Package, Search, Target, Wallet } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Browse Products",
    description:
      "Explore electronics, clothing, and more from verified merchants across Ghana.",
    icon: <Search className="h-5 w-5 text-white" />,
    iconBg: "bg-[#1a53c8]",
  },
  {
    number: 2,
    title: "Set Your Goal",
    description:
      "Choose your product and create a flexible savings plan that fits your budget.",
    icon: <Target className="h-5 w-5 text-white" />,
    iconBg: "bg-[#e63330]",
  },
  {
    number: 3,
    title: "Save Gradually",
    description:
      "Make weekly, bi-weekly, or monthly deposits via mobile money or bank transfer.",
    icon: <Wallet className="h-5 w-5 text-black" />,
    iconBg: "bg-[#ffce31]",
  },
  {
    number: 4,
    title: "Get Your Product",
    description:
      "Once you've saved 100%, your product is shipped directly to you.",
    icon: <Package className="h-5 w-5 text-white" />,
    iconBg: "bg-[#2bc81a]",
  },
];

export function HowItWorks({ className }: { className?: string }) {
  return (
    <section className={cn("bg-[#f5f5f5] py-12 md:py-16", className)}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[850px] text-center">
          <h2 className="text-[30px] font-bold tracking-[-0.03em] text-black md:text-[38px]">
            How SaveGoal Works
          </h2>
          <p className="mx-auto mt-4 max-w-[760px] text-[14px] leading-6 text-[rgba(26,83,200,0.66)] md:text-[19px]">
            A simple, transparent way to save for the things you want-no credit
            checks, no interest, no surprises.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-16">
          <div className="absolute left-[13%] right-[13%] top-[72px] hidden h-px bg-[#d7dded] lg:block" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map((step) => (
              <article key={step.number} className="relative">
                <div className="absolute -left-1 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black">
                  <span className="text-sm font-bold text-white">
                    {step.number}
                  </span>
                </div>
                <div className="rounded-[10px] border border-[#d9dfea] bg-white px-6 pb-5 pt-11 shadow-[2px_2px_10px_rgba(0,0,0,0.12)]">
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] ${step.iconBg}`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-[16px] font-bold text-black">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-5 text-[rgba(0,0,0,0.5)]">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
