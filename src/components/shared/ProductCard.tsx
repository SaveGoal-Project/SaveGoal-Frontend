"use client";

import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Star, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  brand?: string;
  price: number;
  currency?: string;
  image?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  className?: string;
  onSave?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  currency = "GHS",
  image,
  category,
  rating = 5.0,
  reviewCount = 1200,
  className,
  onSave,
}: ProductCardProps) {
  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card className={`bg-white border border-[#3d4a99]/40 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#3d4a99]/70 transition-all duration-300 group ${className}`}>
      <Link href={`/products/${id}`} className="block">
        {/* Image Container */}
        <div className="relative h-[220px] md:h-[240px] bg-gray-100 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
              <div className="w-3/4 h-3/4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d4a99]/10 via-transparent to-transparent" />
              </div>
            </div>
          )}

          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#3d4a99]/90 text-white text-xs font-medium px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 space-y-2.5">
          {/* Brand */}
          {brand && (
            <span className="text-xs font-semibold text-[#5e7fc1] uppercase tracking-wider">
              {brand}
            </span>
          )}

          {/* Product Name */}
          <h3 className="text-base md:text-lg font-bold text-black leading-snug">{name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-[#ffce31] text-[#ffce31]" />
            <span className="text-xs text-[#5f5e5e]">
              <span className="font-medium">{rating}</span>
              <span className="text-[#939393]"> rating ({formatReviewCount(reviewCount)} reviews)</span>
            </span>
          </div>
        </div>
      </Link>

      {/* Price & Save — outside Link for independent click */}
      <div className="px-4 md:px-5 pb-4 md:pb-5">
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-[#939393] mb-0.5">Total Price</p>
              <p className="text-xl md:text-2xl font-bold text-black">
                GH¢{price.toLocaleString()}
              </p>
            </div>
            <Button
              onClick={() => onSave?.(id)}
              size="sm"
              className="bg-[#3d4a99] hover:bg-[#2d3369] text-white rounded-lg px-4 py-2 h-auto flex items-center gap-1.5 text-xs font-semibold"
            >
              <Bookmark className="h-3.5 w-3.5" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
