"use client";

import Image from "next/image";

interface HeroShowcaseProps {
  className?: string;
}

export function HeroShowcase({ className }: HeroShowcaseProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Image
        src="/hero.png"
        alt="SaveGoal Hero Showcase"
        width={1000}
        height={1000}
        className="w-full h-auto"
        priority
      />
    </div>
  );
}
