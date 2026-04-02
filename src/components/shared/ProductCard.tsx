"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  brand?: string;
  price: number;
  currency?: string;
  image?: string | null;
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
  rating = 5,
  reviewCount = 1200,
  className,
  onSave,
}: ProductCardProps) {
  const router = useRouter();

  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }

    return String(count);
  };

  const formatPrice = (amount: number) => {
    if (currency.toUpperCase() === "GHS") {
      return `GHc${amount.toLocaleString()}`;
    }

    return `${currency} ${amount.toLocaleString()}`;
  };

  const handleSave = () => {
    if (onSave) {
      onSave(id);
      return;
    }

    router.push("/login");
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-[20px] border border-[#1a53c8] bg-white shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(26,83,200,0.12)]",
        className
      )}
    >
      <Link href={`/products/${id}`} className="block">
        <div className="relative h-[228px] overflow-hidden border-b border-[#dce4f8] bg-[#f7f8fc]">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eef3ff] to-[#f9fbff]" />
          )}
          {category ? (
            <span className="absolute left-3 top-3 rounded-full bg-[rgba(245,245,245,0.72)] px-3 py-1 text-[11px] text-black backdrop-blur-sm">
              {category}
            </span>
          ) : null}
        </div>
        <div className="space-y-2 px-4 pb-3 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#939393]">
            {brand || "SaveGoal"}
          </p>
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[14px] font-bold leading-5 text-black">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-[8px] text-[#5f5e5e]">
            <Star className="h-3.5 w-3.5 fill-[#ffce31] text-[#ffce31]" />
            <span>{rating.toFixed(1)} rating ({formatReviewCount(reviewCount)} reviews)</span>
          </div>
        </div>
      </Link>

      <div className="border-t border-[#dce4f8] px-4 pb-4 pt-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[9px] text-[#939393]">Total Price</p>
            <p className="mt-1 text-[14px] font-bold text-black">
              {formatPrice(price)}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleSave}
            className="h-7 rounded-full bg-[#2e3369] px-3 text-[11px] font-semibold text-white hover:bg-[#232858]"
          >
            <Bookmark className="h-3 w-3" />
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
}
