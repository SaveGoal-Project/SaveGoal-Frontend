import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import type { CreateProductData, Product, ProductStats, UpdateProductData } from "./products.types";
import {
  getProductById as getMockProductById,
  getProducts as getMockProducts,
} from "./products.mock";
import { mapProduct, toMerchantProductPayload } from "./products.mappers";

type ProductResponse = Product | Product[] | { data?: Product | Product[] };

function unwrapProductList(response: ProductResponse): Product[] {
  const items = Array.isArray(response)
    ? response
    : Array.isArray((response as { data?: Product[] }).data)
      ? (response as { data: Product[] }).data
      : [];

  return items.map((product) => mapProduct(product as unknown as Record<string, unknown>));
}

function unwrapProduct(response: ProductResponse): Product | null {
  const raw = Array.isArray(response)
    ? response[0]
    : ((response as { data?: Product }).data ?? response);

  if (!raw || Array.isArray(raw)) {
    return null;
  }

  return mapProduct(raw as unknown as Record<string, unknown>);
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST, {
      skipAuth: true,
    });

    return unwrapProductList(response);
  } catch {
    return getMockProducts();
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAILS(id), {
      skipAuth: true,
    });

    return unwrapProduct(response);
  } catch {
    return getMockProductById(id);
  }
}

export async function getMerchantProducts(): Promise<Product[]> {
  const response = await apiClient.get<Product[]>(API_ENDPOINTS.MERCHANT.PRODUCTS);
  return unwrapProductList(response);
}

export async function getMerchantProductById(id: string): Promise<Product | null> {
  const response = await apiClient.get<Product>(API_ENDPOINTS.MERCHANT.PRODUCT_DETAILS(id));
  return unwrapProduct(response);
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  const response = await apiClient.post<Product>(
    API_ENDPOINTS.MERCHANT.PRODUCTS,
    toMerchantProductPayload(data)
  );
  const product = unwrapProduct(response);

  if (!product) {
    throw new Error("Product creation returned an empty response");
  }

  return product;
}

export async function updateMerchantProduct(id: string, data: UpdateProductData): Promise<Product> {
  const response = await apiClient.patch<Product>(
    API_ENDPOINTS.MERCHANT.PRODUCT_DETAILS(id),
    toMerchantProductPayload(data)
  );
  const product = unwrapProduct(response);

  if (!product) {
    throw new Error("Product update returned an empty response");
  }

  return product;
}

export async function deleteMerchantProduct(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.MERCHANT.PRODUCT_DETAILS(id));
}

export async function getProductStats(): Promise<ProductStats> {
  const products = await getMerchantProducts();

  return {
    totalProducts: products.length,
    activeProducts: products.filter((product) => product.isAvailable !== false && (product.stock ?? 1) > 0).length,
    lowStock: products.filter((product) => (product.stock ?? 100) > 0 && (product.stock ?? 100) < 10).length,
    outOfStock: products.filter((product) => product.stock === 0).length,
  };
}
