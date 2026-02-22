"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Star, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BrowseProductCardProps {
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

export function BrowseProductCard({
  id,
  name,
  brand,
  price,
  image,
  category,
  rating = 5.0,
  reviewCount = 1200,
  className,
  onSave,
}: BrowseProductCardProps) {
  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card className={`bg-white border border-[#3d4a99]/30 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}>
      <Link href={`/products/${id}`} className="block">
        {/* Image Container */}
        <div className="relative h-[240px] bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
              <div className="w-16 h-16 bg-gray-300 rounded-lg" />
            </div>
          )}

          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Brand */}
          {brand && (
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {brand}
            </span>
          )}

          {/* Product Name */}
          <h3 className="text-base font-bold text-black leading-tight line-clamp-1">{name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-[#ffce31] text-[#ffce31]" />
            <span className="text-sm text-gray-600">
              <span className="font-medium">{rating}</span>
              <span className="text-gray-400"> rating ({formatReviewCount(reviewCount)} reviews)</span>
            </span>
          </div>
        </div>
      </Link>

      {/* Price & Save — outside of Link so button is independently clickable */}
      <div className="px-4 pb-4">
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Total Price</p>
              <p className="text-lg font-bold text-black">
                GH¢{price.toLocaleString()}
              </p>
            </div>
            <Button
              onClick={() => onSave?.(id)}
              className="bg-[#3d4a99] hover:bg-[#2d3369] text-white rounded-lg px-4 py-2 h-auto flex items-center gap-1.5 text-sm"
            >
              <Bookmark className="h-4 w-4" />
              <span className="font-medium">Save</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

