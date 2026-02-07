"use client";

import { Search, Target, Wallet, Package } from "lucide-react";

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
    description: "Explore electronics, clothing, and more from verified merchants across Ghana.",
    icon: <Search className="h-6 w-6 text-white" />,
    iconBg: "bg-[#5761c9]",
  },
  {
    number: 2,
    title: "Set Your Goal",
    description: "Choose your product and create a flexible savings plan that fits your budget.",
    icon: <Target className="h-6 w-6 text-white" />,
    iconBg: "bg-[#e74c3c]",
  },
  {
    number: 3,
    title: "Save Gradually",
    description: "Make weekly, bi-weekly, or monthly deposits via mobile money or bank transfer.",
    icon: <Wallet className="h-6 w-6 text-black" />,
    iconBg: "bg-[#ffce31]",
  },
  {
    number: 4,
    title: "Get Your Product",
    description: "Once you've saved 100%, your product is shipped directly to you.",
    icon: <Package className="h-6 w-6 text-white" />,
    iconBg: "bg-[#27ae60]",
  },
];

export function HowItWorks({ className }: { className?: string }) {
  return (
    <section className={`py-16 md:py-24 bg-[#f5f5f5] ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
            How SaveGoal Works
          </h2>
          <p className="text-base md:text-lg text-[#9ca3af] max-w-2xl mx-auto leading-relaxed">
            A simple, transparent way to save for the things you want—no credit checks, no interest, no surprises.
          </p>
        </div>

        {/* Steps - Horizontal Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Number Badge - Outside Card */}
              <div className="absolute -top-3 -left-3 z-10 w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center">
                <span className="text-white text-sm font-bold">{step.number}</span>
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl p-6 h-full shadow-sm">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center mb-4`}>
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-black mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
