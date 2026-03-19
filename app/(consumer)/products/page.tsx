"use client";

import { useState, useMemo } from "react";
import { Footer } from "@/src/components/marketing/Footer";
import { BrowseProductCard } from "@/src/components/shared/BrowseProductCard";
import { Search, ChevronDown, CheckCircle } from "lucide-react";
import { useProducts } from "@/src/domains/products/products.hooks";
import { useCart } from "@/src/contexts/CartContext";

const sortOptions = ["Most Popular", "Price: Low to High", "Price: High to Low", "Newest"];

export default function BrowseProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [savedNotif, setSavedNotif] = useState<string | null>(null);

  const { products, isLoading, error } = useProducts();
  const { addToCart, isInCart } = useCart();

  const filteredProducts = useMemo(() => {
    let items = [...products];

    // Filter by search query
    if (searchQuery) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.merchant?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case "Price: Low to High":
        items.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        items.sort((a, b) => b.price - a.price);
        break;
      case "Newest":
        items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default:
        break;
    }

    return items;
  }, [products, searchQuery, sortBy]);

  const handleSaveProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (isInCart(id)) {
      setSavedNotif("Item is already in your cart");
    } else {
      addToCart({
        productId: product.id,
        productName: product.name,
        productImage: product.image || null,
        merchantName: product.merchant?.businessName || null,
        price: product.price,
      });
      setSavedNotif("Item saved to cart!");
    }

    // Auto-dismiss after 3 seconds
    setTimeout(() => setSavedNotif(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-3">
            Browse Products
          </h1>
          <p className="text-[#3d4a99] text-lg">
            Discover amazing products and start saving today
          </p>
        </div>
        {/* Save Notification Toast */}
        {savedNotif && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <p className="text-sm font-medium text-green-800 flex-1">{savedNotif}</p>
            <button
              onClick={() => setSavedNotif(null)}
              className="text-green-400 hover:text-green-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[37px] pl-12 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3d4a99] focus:border-transparent"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-[#3d4a99] transition-all min-w-[150px] justify-between"
            >
              <span>{sortBy}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
            </button>

            {isSortOpen && (
              <div className="absolute top-full right-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setIsSortOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${sortBy === option ? "bg-gray-50 text-[#3d4a99] font-medium" : "text-gray-700"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-[240px] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-24 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-lg mb-2">Failed to load products</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredProducts.map((product) => (
              <BrowseProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.merchant?.businessName}
                price={product.price}
                image={product.image || undefined}
                onSave={handleSaveProduct}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
