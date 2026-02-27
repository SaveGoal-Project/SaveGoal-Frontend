import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import type { Product } from "./products.types";

/**
 * Normalize a raw product from the backend:
 * - Convert Decimal price (string) to number
 */
function normalizeProduct(raw: Record<string, unknown>): Product {
    return {
        ...(raw as unknown as Product),
        price: Number(raw.price),
    };
}

/**
 * GET /api/products — list all available products (public)
 */
export async function getProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
        API_ENDPOINTS.PRODUCTS.LIST,
        { skipAuth: true }
    );

    // apiClient may return the raw array or a wrapped { data: [...] } depending on interceptor
    const items = Array.isArray(response)
        ? response
        : (response as unknown as Record<string, unknown>).data as Product[] || [];

    return items.map((p) => normalizeProduct(p as unknown as Record<string, unknown>));
}

/**
 * GET /api/products/:id — get single product details (public)
 */
export async function getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(
        API_ENDPOINTS.PRODUCTS.DETAILS(id),
        { skipAuth: true }
    );

    // Handle potential { data: {...} } wrapping
    const raw = (response as unknown as Record<string, unknown>).data || response;
    return normalizeProduct(raw as Record<string, unknown>);
}
