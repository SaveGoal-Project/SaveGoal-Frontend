"use client";

import { Shield, Target, TrendingUp } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  {
    value: "100%",
    label: "Secure Savings",
    icon: <Shield className="h-10 w-10" />,
  },
  {
    value: "50K+",
    label: "Goals Achieved",
    icon: <Target className="h-10 w-10" />,
  },
  {
    value: "GH¢5M+",
    label: "Total Saved",
    icon: <TrendingUp className="h-10 w-10" />,
  },
];

export function Stats({ className }: { className?: string }) {
  return (
    <section className={`bg-white py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4 text-[#1a53c8]">
                {stat.icon}
              </div>
              <div className="text-5xl md:text-6xl font-bold text-[#1a53c8] mb-2">
                {stat.value}
              </div>
              <div className="text-xl text-[#5e7fc1] font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
