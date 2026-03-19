"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, CartFrequency } from "@/src/domains/cart/cart.types";

// ─── Context Value Type ──────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  addToCart: (params: AddToCartParams) => void;
  removeFromCart: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<Pick<CartItem, "frequency" | "months" | "perPayment">>) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

export interface AddToCartParams {
  productId: string;
  productName: string;
  productImage: string | null;
  merchantName: string | null;
  price: number;
  frequency?: CartFrequency;
  months?: number;
}

// ─── Storage Key ─────────────────────────────────────────────────────────────

const CART_STORAGE_KEY = "savegoal_cart";

// ─── Helper: Calculate per-payment amount ────────────────────────────────────

function calculatePerPayment(
  price: number,
  frequency: CartFrequency,
  months: number
): number {
  switch (frequency) {
    case "WEEKLY":
      return Math.ceil(price / 20);
    case "BIWEEKLY":
      return Math.ceil(price / 10);
    case "MONTHLY":
      return Math.ceil(price / months);
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on change (skip initial load)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = useCallback((params: AddToCartParams) => {
    setItems((prev) => {
      // Don't add duplicates of the same product
      if (prev.some((item) => item.productId === params.productId)) {
        return prev;
      }

      const frequency = params.frequency ?? "MONTHLY";
      const months = params.months ?? 3;
      const perPayment = calculatePerPayment(params.price, frequency, months);

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        productId: params.productId,
        productName: params.productName,
        productImage: params.productImage,
        merchantName: params.merchantName,
        price: params.price,
        frequency,
        months,
        perPayment,
        addedAt: new Date().toISOString(),
      };

      return [...prev, newItem];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateItem = useCallback(
    (
      itemId: string,
      updates: Partial<Pick<CartItem, "frequency" | "months" | "perPayment">>
    ) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;

          const updatedFrequency = updates.frequency ?? item.frequency;
          const updatedMonths = updates.months ?? item.months;
          const updatedPerPayment = calculatePerPayment(
            item.price,
            updatedFrequency,
            updatedMonths
          );

          return {
            ...item,
            frequency: updatedFrequency,
            months: updatedMonths,
            perPayment: updates.perPayment ?? updatedPerPayment,
          };
        })
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount: items.length,
        addToCart,
        removeFromCart,
        updateItem,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
