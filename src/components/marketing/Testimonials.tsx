"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import Image from "next/image";

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
    <section className={`py-16 md:py-24 bg-gradient-to-b from-[#1a53c8] to-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {title}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-[#5e7fc1] border-[#8aabee] border rounded-[30px] overflow-hidden"
            >
              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Quote */}
                <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-2">
                  {/* Avatar */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="text-lg md:text-xl font-bold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm md:text-base text-[#9bbcff]">
                      {testimonial.role}
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-[#9bbcff]">Saved for </span>
                      <span className="text-base font-bold text-[#ffce31]">
                        {testimonial.product}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
