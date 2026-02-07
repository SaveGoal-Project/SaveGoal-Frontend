"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Star, Bookmark } from "lucide-react";
import Image from "next/image";

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
    <Card className={`bg-white border-2 border-[#3d4a99] rounded-[30px] overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Image Container */}
      <div className="relative h-[320px] bg-black">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
            <div className="w-3/4 h-3/4 relative">
              {/* Placeholder gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#ff6b4a]/30 via-transparent to-transparent" />
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#3d4a99]/90 text-white text-sm font-medium px-4 py-2 rounded-full">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6 space-y-4">
        {/* Brand */}
        {brand && (
          <span className="text-sm font-semibold text-[#5e7fc1] uppercase tracking-wide">
            {brand}
          </span>
        )}

        {/* Product Name */}
        <h3 className="text-2xl font-bold text-black leading-tight">{name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-[#ffce31] text-[#ffce31]" />
          <span className="text-base text-[#5f5e5e]">
            <span className="font-medium">{rating}</span>
            <span className="text-[#939393]"> rating ({formatReviewCount(reviewCount)} reviews)</span>
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          {/* Price and Save Button Row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-[#939393] mb-1">Total Price</p>
              <p className="text-3xl font-bold text-black">
                GH¢{price.toLocaleString()}
              </p>
            </div>
            <Button
              onClick={() => onSave?.(id)}
              className="bg-[#3d4a99] hover:bg-[#2d3369] text-white rounded-xl px-6 py-3 h-auto flex items-center gap-2"
            >
              <Bookmark className="h-5 w-5" />
              <span className="font-semibold">Save</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
