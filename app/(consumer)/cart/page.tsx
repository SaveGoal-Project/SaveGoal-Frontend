"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  ShoppingCart,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/contexts/CartContext";
import { useCreateSavingsGoal } from "@/src/domains/savings-goals/savings.hooks";
import { SavingsFrequency } from "@/src/domains/savings-goals/savings.types";
import { useState } from "react";

function formatFrequencyLabel(frequency: string, months: number): string {
  switch (frequency) {
    case "WEEKLY":
      return "Weekly · 20 payments";
    case "BIWEEKLY":
      return "Bi-Weekly · 10 payments";
    case "MONTHLY":
      return `Monthly · ${months} payment${months > 1 ? "s" : ""}`;
    default:
      return frequency;
  }
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, clearCart, cartCount } = useCart();
  const { create, isLoading: isCreating } = useCreateSavingsGoal();
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStartSaving = async (item: (typeof items)[0]) => {
    setSavingItemId(item.id);
    setSuccessMessage(null);
    try {
      await create({
        name: item.productName,
        productId: item.productId,
        targetAmount: item.price,
        frequency: item.frequency as SavingsFrequency,
        isRecurring: true,
        monthlyAmount: item.perPayment,
      });

      removeFromCart(item.id);
      setSuccessMessage(
        `Savings goal for "${item.productName}" created! View it on your dashboard.`
      );
    } catch (err) {
      console.error("Failed to create savings goal:", err);
    } finally {
      setSavingItemId(null);
    }
  };

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-[#3d4a99] hover:text-[#2d3369] text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Continue Shopping
      </Link>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Cart
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {cartCount} {cartCount === 1 ? "item" : "items"} saved
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              {successMessage}
            </p>
            <Link
              href="/dashboard"
              className="text-xs text-green-600 underline mt-1 inline-block"
            >
              Go to Dashboard →
            </Link>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-400 hover:text-green-600 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && !successMessage && (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Your cart is empty
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            Browse products and click &quot;Save&quot; to add items to your cart
            and start saving.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-xl px-8 py-3 font-semibold"
          >
            Browse Products
          </Button>
        </div>
      )}

      {/* Cart Items */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items List — Left */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-[90px] h-[75px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="90px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                          {item.productName}
                        </h3>
                        {item.merchantName && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.merchantName}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Price & Plan Details */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-[#3d4a99]" />
                        <span className="text-sm font-bold text-[#3d4a99]">
                          GH¢ {item.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatFrequencyLabel(item.frequency, item.months)}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                        GH¢ {item.perPayment.toLocaleString()}/payment
                      </span>
                    </div>
                  </div>
                </div>

                {/* Start Saving CTA */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Button
                    onClick={() => handleStartSaving(item)}
                    disabled={
                      isCreating && savingItemId === item.id
                    }
                    className="w-full h-10 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-70"
                  >
                    {isCreating && savingItemId === item.id ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Goal...
                      </span>
                    ) : (
                      "Start Saving for This Item"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary — Right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-28">
              <h3 className="text-base font-bold text-gray-900 mb-5">
                Cart Summary
              </h3>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Items</span>
                  <span className="font-medium text-gray-900">
                    {cartCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Value</span>
                  <span className="font-bold text-gray-900">
                    GH¢ {totalValue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
