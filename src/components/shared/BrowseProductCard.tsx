"use client";

import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Star, Bookmark, Check, PiggyBank } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface BrowseProductCardProps {
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
  inCart?: boolean;
  activeGoalId?: string | null;
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
  inCart = false,
  activeGoalId = null,
}: BrowseProductCardProps) {
  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const hasActiveGoal = Boolean(activeGoalId);

  return (
    <Card
      className={`bg-white border border-[#3d4a99]/30 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 ${className ?? ""}`}
    >
      <Link href={`/products/${id}`} className="block">
        <div className="relative h-[240px] bg-gray-100">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
              <div className="w-16 h-16 bg-gray-300 rounded-lg" />
            </div>
          )}

          {category && (
            <div className="absolute top-3 left-3 z-[1]">
              <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                {category}
              </span>
            </div>
          )}

          {hasActiveGoal && (
            <div className="absolute top-3 right-3 z-[1]">
              <span className="inline-flex items-center gap-1 bg-[#1d4ed8] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                <PiggyBank className="h-3 w-3" />
                Saving
              </span>
            </div>
          )}

          {!hasActiveGoal && inCart && (
            <div className="absolute top-3 right-3 z-[1]">
              <span className="inline-flex items-center gap-1 bg-[#3d4a99]/95 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                <Check className="h-3 w-3" />
                In cart
              </span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          {brand && (
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {brand}
            </span>
          )}

          <h3 className="text-base font-bold text-black leading-tight line-clamp-1">{name}</h3>

          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-[#ffce31] text-[#ffce31]" />
            <span className="text-sm text-gray-600">
              <span className="font-medium">{rating}</span>
              <span className="text-gray-400"> rating ({formatReviewCount(reviewCount)} reviews)</span>
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Total Price</p>
              <p className="text-lg font-bold text-black">GH¢{price.toLocaleString()}</p>
            </div>

            {hasActiveGoal && activeGoalId ? (
              <Button
                asChild
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg px-4 py-2 h-auto text-sm font-semibold shrink-0"
              >
                <Link href={`/goals/${activeGoalId}`}>View savings</Link>
              </Button>
            ) : inCart ? (
              <Button
                type="button"
                disabled
                variant="outline"
                className="border-gray-200 text-gray-400 rounded-lg px-4 py-2 h-auto text-sm font-medium cursor-not-allowed shrink-0"
              >
                <Bookmark className="h-4 w-4 mr-1.5 opacity-60" />
                Saved
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => onSave?.(id)}
                className="bg-[#3d4a99] hover:bg-[#2d3369] text-white rounded-lg px-4 py-2 h-auto flex items-center gap-1.5 text-sm shrink-0"
              >
                <Bookmark className="h-4 w-4" />
                <span className="font-medium">Save</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
