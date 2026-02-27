import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import type { Product, ProductStats, CreateProductData } from "./products.types";
import {
    getProducts as getMockProducts,
    getProductById as getMockProductById,
    getProductStats as getMockProductStats,
    createProduct as mockCreateProduct,
} from "./products.mock";

/**
 * Normalize a raw product from the backend:
 * - Convert Decimal price (string) to number
 * - Map merchant.businessName to brand for compatibility
 */
function normalizeProduct(raw: Record<string, unknown>): Product {
    const merchant = raw.merchant as { businessName?: string; isVerified?: boolean } | undefined;
    return {
        ...(raw as unknown as Product),
        price: Number(raw.price),
        brand: merchant?.businessName || (raw as unknown as Product).brand,
    };
}

/**
 * GET /api/products — list all available products (public)
 * Falls back to mock data if the API is unavailable.
 */
export async function getProducts(): Promise<Product[]> {
    try {
        const response = await apiClient.get<Product[]>(
            API_ENDPOINTS.PRODUCTS.LIST,
            { skipAuth: true }
        );

        const items = Array.isArray(response)
            ? response
            : (response as unknown as Record<string, unknown>).data as Product[] || [];

        return items.map((p) => normalizeProduct(p as unknown as Record<string, unknown>));
    } catch {
        // Fallback to mock data
        return getMockProducts();
    }
}

/**
 * GET /api/products/:id — get single product details (public)
 * Falls back to mock data if the API is unavailable.
 */
export async function getProductById(id: string): Promise<Product | null> {
    try {
        const response = await apiClient.get<Product>(
            API_ENDPOINTS.PRODUCTS.DETAILS(id),
            { skipAuth: true }
        );

        const raw = (response as unknown as Record<string, unknown>).data || response;
        return normalizeProduct(raw as Record<string, unknown>);
    } catch {
        // Fallback to mock data
        return getMockProductById(id);
    }
}

/**
 * POST /api/products — create a product (Merchant only)
 * Falls back to mock create if the API is unavailable.
 */
export async function createProduct(data: CreateProductData): Promise<Product> {
    try {
        const payload = {
            name: data.name,
            description: data.description,
            price: typeof data.price === "string" ? parseFloat(data.price.replace(/[^0-9.]/g, "")) : data.price,
            stock: data.stock,
            image: data.images?.[0],
        };

        const response = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.LIST, payload);
        const raw = (response as unknown as Record<string, unknown>).data || response;
        return normalizeProduct(raw as Record<string, unknown>);
    } catch {
        return mockCreateProduct(data);
    }
}

/**
 * Get product stats (derived from the product list).
 * Falls back to mock stats if the API is unavailable.
 */
export async function getProductStats(): Promise<ProductStats> {
    try {
        const products = await getProducts();
        return {
            totalProducts: products.length,
            activeProducts: products.filter((p) => p.isAvailable !== false && (p.stock ?? 1) > 0).length,
            lowStock: products.filter((p) => (p.stock ?? 100) > 0 && (p.stock ?? 100) < 10).length,
            outOfStock: products.filter((p) => p.stock === 0).length,
        };
    } catch {
        return getMockProductStats();
    }
}
