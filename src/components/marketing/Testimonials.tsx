"use client";

import Image from "next/image";
import { cn } from "@/src/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  product: string;
  avatar?: string;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
}

export function Testimonials({
  title = "Loved by Savers Across Ghana",
  subtitle = "Join thousands who are already achieving their goals with SaveGoal",
  testimonials,
  className,
}: TestimonialsProps) {
  return (
    <section
      className={cn(
        "bg-gradient-to-b from-[#1a53c8] to-white py-16 md:py-20",
        className
      )}
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-10">
        <div className="text-center">
          <h2 className="text-[38px] font-bold tracking-[-0.03em] text-white md:text-[50px]">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-[760px] text-[16px] text-white/90 md:text-[25px]">
            {subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-[18px] border border-[#8aabee] bg-[rgba(94,127,193,0.88)] px-5 pb-5 pt-6 text-white shadow-[0_10px_26px_rgba(24,73,173,0.14)]"
            >
              <p className="text-[42px] font-bold leading-none text-[#ffce31]">
                &ldquo;
              </p>
              <p className="mt-3 min-h-[84px] text-[13px] leading-6 text-white/95">
                {testimonial.quote}
              </p>
              <div className="mt-6 border-t border-white/20 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#ffce31] bg-[#274da3]">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {testimonial.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-[11px] text-[#d7e3ff]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-[#9bbcff]">Saved for</p>
                <p className="text-[15px] font-bold text-[#ffce31]">
                  {testimonial.product}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
