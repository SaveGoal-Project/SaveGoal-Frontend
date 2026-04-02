"use client";

import Link from "next/link";
import { ProductCard } from "@/src/components/shared/ProductCard";
import { useProducts } from "@/src/domains/products/products.hooks";
import { cn } from "@/src/lib/utils";

interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  currency?: string;
  image?: string | null;
  category?: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
  showViewAll?: boolean;
  className?: string;
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[20px] border border-[#b9caf7] bg-white"
        >
          <div className="h-[228px] animate-pulse bg-[#eff3ff]" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-[#eef2ff]" />
            <div className="h-4 w-32 animate-pulse rounded bg-[#e2e8ff]" />
            <div className="h-3 w-24 animate-pulse rounded bg-[#eef2ff]" />
            <div className="h-px bg-[#dde5f8]" />
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="h-3 w-14 animate-pulse rounded bg-[#eef2ff]" />
                <div className="h-5 w-20 animate-pulse rounded bg-[#e2e8ff]" />
              </div>
              <div className="h-8 w-16 animate-pulse rounded-full bg-[#d8e1fb]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({
  title = "Popular Products",
  subtitle = "Start saving for these trending items today",
  products,
  showViewAll = true,
  className,
}: ProductGridProps) {
  const {
    products: liveProducts,
    isLoading,
    error,
  } = useProducts();

  const items = (products ?? liveProducts).slice(0, 4);

  return (
    <section className={cn("bg-white py-14 md:py-16", className)}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[30px] font-bold tracking-[-0.03em] text-black">
              {title}
            </h2>
            <p className="mt-1 text-[14px] text-[#303770]">{subtitle}</p>
          </div>
          {showViewAll && (
            <Link
              href="/products"
              className="inline-flex h-[50px] items-center justify-center self-start rounded-[15px] border-4 border-[#2d3369] px-6 text-[14px] font-bold text-[#4850a5] transition-colors hover:bg-[#eef2ff]"
            >
              View All Products
            </Link>
          )}
        </div>

        {isLoading && !products ? (
          <ProductGridSkeleton />
        ) : items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-[#b9caf7] bg-[#f8faff] px-6 py-10 text-center text-sm text-[#5e7fc1]">
            No products are available right now.
          </div>
        )}

        {error && !products ? (
          <p className="mt-4 text-sm text-[#b42318]">
            We could not load live products, so this section may be incomplete.
          </p>
        ) : null}
      </div>
    </section>
  );
}
