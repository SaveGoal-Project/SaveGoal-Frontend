"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  ShoppingCart,
  Calendar,
  CreditCard,
  Target,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/contexts/CartContext";
import { useSavingsGoals } from "@/src/domains/savings-goals/savings.hooks";
import type { SavingsGoal } from "@/src/domains/savings-goals/savings.types";

function goalStatusStyles(status: SavingsGoal["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-50 text-green-700";
    case "PAUSED":
      return "bg-amber-50 text-amber-800";
    case "COMPLETED":
      return "bg-[#3d4a99]/10 text-[#3d4a99]";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, clearCart, cartCount } = useCart();
  const { goals, isLoading: goalsLoading } = useSavingsGoals();

  const displayGoals = useMemo(
    () =>
      goals.filter(
        (g) =>
          g.status === "ACTIVE" ||
          g.status === "PAUSED" ||
          g.status === "COMPLETED"
      ),
    [goals]
  );

  const showFullCartEmpty =
    items.length === 0 && !goalsLoading && displayGoals.length === 0;

  const handleAction = (item: (typeof items)[0]) => {
    // Check if an active goal already exists for this product
    const existingGoal = goals.find(
      (g) => item.productId && (g.product?.id === item.productId || g.productId === item.productId) && g.status === "ACTIVE"
    );

    if (existingGoal) {
      router.push(`/goals/${existingGoal.id}`);
    } else {
      router.push(`/products/${item.productId}/save`);
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

      {/* Goals — from API; shown whenever user has goals (not localStorage cart) */}
      {displayGoals.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-[#3d4a99]" aria-hidden />
            <h2 className="text-lg font-bold text-gray-900">
              Your saving goals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayGoals.map((goal) => {
              const imageUrl = goal.product?.images?.[0];
              const pct = Math.min(
                100,
                Math.round(Number(goal.progress) || 0)
              );
              return (
                <Link
                  key={goal.id}
                  href={`/goals/${goal.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#3d4a99]/40 transition-colors flex gap-4 text-left group"
                >
                  <div className="relative w-[90px] h-[75px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={goal.product.name}
                        fill
                        sizes="90px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-[#3d4a99] transition-colors">
                        {goal.product.name}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${goalStatusStyles(goal.status)}`}
                      >
                        {goal.status === "ACTIVE"
                          ? "Active"
                          : goal.status === "PAUSED"
                            ? "Paused"
                            : "Completed"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      GH¢ {goal.currentAmount.toLocaleString()} of GH¢{" "}
                      {goal.targetAmount.toLocaleString()}
                    </p>
                    <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22c55e] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && goalsLoading && displayGoals.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-10">
          Loading your saving goals…
        </p>
      )}

      {/* Browse-later cart empty (distinct from goals above) */}
      {items.length === 0 && displayGoals.length > 0 && (
        <div className="bg-gray-50/80 rounded-2xl border border-dashed border-gray-200 p-8 text-center mb-8">
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Nothing saved for later here yet. Use{" "}
            <span className="font-medium text-gray-800">Save</span> on a
            product while browsing to add it to this list. Your active saving
            goals are above.
          </p>
          <Button
            onClick={() => router.push("/products")}
            variant="outline"
            className="mt-4 border-[#3d4a99] text-[#3d4a99] hover:bg-[#3d4a99]/5"
          >
            Browse products
          </Button>
        </div>
      )}

      {/* Empty State — no cart items and no goals */}
      {showFullCartEmpty && (
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
                      {/* Only show plan details if an active goal exists for this item */}
                      {(() => {
                        const existingGoal = goals.find(
                          (g) => item.productId && (g.product?.id === item.productId || g.productId === item.productId) && g.status === "ACTIVE"
                        );
                        if (!existingGoal) return null;

                        const perPayment = existingGoal.nextPaymentAmount || existingGoal.monthlyAmount || 0;
                        const totalMonths = perPayment > 0 ? Math.ceil(existingGoal.targetAmount / perPayment) : 0;
                        const planLabel = totalMonths > 0
                          ? `Monthly · ${totalMonths} month${totalMonths > 1 ? "s" : ""}`
                          : "Saving Plan Active";

                        return (
                          <>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {planLabel}
                              </span>
                            </div>
                            {perPayment > 0 && (
                              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                                GH¢ {perPayment.toLocaleString()}/payment
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Start Saving CTA */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  {(() => {
                    const existingGoal = goals.find(
                      (g) => item.productId && (g.product?.id === item.productId || g.productId === item.productId) && g.status === "ACTIVE"
                    );

                    return existingGoal ? (
                      <Button
                        onClick={() => handleAction(item)}
                        className="w-full h-10 bg-[#3d4a99] hover:bg-[#2d3369] text-white text-sm font-semibold rounded-lg transition-all"
                      >
                        Make Deposit
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleAction(item)}
                        className="w-full h-10 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold rounded-lg transition-all"
                      >
                        Start Saving for This Item
                      </Button>
                    );
                  })()}
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
