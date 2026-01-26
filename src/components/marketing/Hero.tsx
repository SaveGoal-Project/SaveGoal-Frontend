"use client";

import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  return (
    <section className={className}>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Save Today,{" "}
            <span className="bg-gradient-to-r from-[#2b3063] to-[#5761c9] bg-clip-text text-transparent">
              Own Tomorrow
            </span>
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-[#1a53c8] max-w-3xl mx-auto leading-relaxed">
            Turn your dreams into reality with SaveGoal. Create structured savings plans for the products you love, and get them when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#2b3063] to-[#5761c9] hover:opacity-90 text-white px-8 py-6 text-lg rounded-full h-auto"
            >
              <Link href="/register">
                Start Saving Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-4 border-[#2d3369] text-[#4850a5] px-8 py-6 text-lg rounded-full h-auto hover:bg-[#2d3369] hover:text-white"
            >
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

