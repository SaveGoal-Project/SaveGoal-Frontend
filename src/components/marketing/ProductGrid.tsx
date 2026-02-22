"use client";

import { ProductCard } from "@/src/components/shared/ProductCard";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  currency?: string;
  image?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  showViewAll?: boolean;
  className?: string;
}

export function ProductGrid({
  title = "Popular Products",
  subtitle = "Start saving for these trending items today",
  products,
  showViewAll = true,
  className,
}: ProductGridProps) {
  return (
    <section className={`py-16 md:py-24 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-10 md:mb-12">
          <div className="space-y-2 mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-black">{title}</h2>
            <p className="text-base md:text-lg text-[#5e7fc1]">{subtitle}</p>
          </div>
          {showViewAll && (
            <Link
              href="/products"
              className="border-2 border-[#2C3466] text-[#2C3466] px-7 py-2.5 text-sm font-semibold rounded-full hover:bg-[#2C3466] hover:text-white transition-all duration-300 inline-block text-center whitespace-nowrap"
            >
              View All Products
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
