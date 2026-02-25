"use client";

import { useState, useMemo } from "react";
import { Footer } from "@/src/components/marketing/Footer";
import { BrowseProductCard } from "@/src/components/shared/BrowseProductCard";
import { Search, ChevronDown } from "lucide-react";

// Mock product data matching the Figma design
const mockProducts = [
  {
    id: "1",
    name: "Apple MacBook Pro",
    brand: "APPLE",
    price: 10000,
    category: "Electronics",
    rating: 5.0,
    reviewCount: 1200,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
  },
  {
    id: "2",
    name: "Water Bottle",
    brand: "MELCOM",
    price: 10000,
    category: "Health",
    rating: 5.0,
    reviewCount: 1200,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
  },
  {
    id: "3",
    name: "Apple Series 3",
    brand: "TELEFONICA",
    price: 10000,
    category: "Electronics",
    rating: 5.0,
    reviewCount: 1200,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
  },
  {
    id: "4",
    name: "Adidas Sneakers",
    brand: "APPLE",
    price: 10000,
    category: "Sneakers",
    rating: 5.0,
    reviewCount: 1200,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  },
  {
    id: "5",
    name: "Sony PlayStation 5",
    brand: "Sony",
    price: 7000,
    category: "Electronic",
    rating: 5.0,
    reviewCount: 1200,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
  },
  {
    id: "6",
    name: "Long Sleeve Shirt",
    brand: "MELCOM",
    price: 1000,
    category: "Clothing",
    rating: 5.0,
    reviewCount: 1200,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
  },
  {
    id: "7",
    name: 'LG 50" Television',
    brand: "TELEFONICA",
    price: 10000,
    category: "Electronics",
    rating: 5.0,
    reviewCount: 1200,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
  },
  {
    id: "8",
    name: "Nike Air Force 1",
    brand: "APPLE",
    price: 10000,
    category: "Sneakers",
    rating: 5.0,
    reviewCount: 1200,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
  },
];

const categories = ["All", "Electronics", "Clothing"];
const sortOptions = ["Most Popular", "Price: Low to High", "Price: High to Low", "Newest"];

export default function BrowseProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by search query
    if (searchQuery) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory !== "All") {
      products = products.filter((p) =>
        p.category.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case "Price: Low to High":
        products.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        products.sort((a, b) => b.price - a.price);
        break;
      case "Newest":
        // Keep original order for newest
        break;
      default:
        // Most Popular - keep original order
        break;
    }

    return products;
  }, [searchQuery, activeCategory, sortBy]);

  const handleSaveProduct = (id: string) => {
    console.log("Saving product:", id);
    // TODO: Implement save functionality
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

          {/* Category Filters */}
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-lg border text-sm font-medium transition-all ${activeCategory === category
                  ? "bg-[#3d4a99] text-white border-[#3d4a99]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#3d4a99] hover:text-[#3d4a99]"
                  }`}
              >
                {category}
              </button>
            ))}
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredProducts.map((product) => (
            <BrowseProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              price={product.price}
              category={product.category}
              rating={product.rating}
              reviewCount={product.reviewCount}
              image={product.image}
              onSave={handleSaveProduct}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

