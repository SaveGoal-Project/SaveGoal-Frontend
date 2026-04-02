// Product types — covers both backend API responses and merchant UI needs

export interface Product {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    currency?: string;
    image?: string | null;
    images?: string[];
    stock?: number | null;
    isAvailable?: boolean;
    metadata?: Record<string, unknown> | null;
    createdAt?: string;
    updatedAt?: string;

    // Backend relation (from GET /api/products)
    merchantProfileId?: string;
    merchant?: {
        businessName: string;
        isVerified?: boolean;
    };

    // Merchant UI fields (used by merchant dashboard pages)
    brand?: string;
    merchantId?: string;
    merchantName?: string;
    formattedPrice?: string;
    category?: string;
    sku?: string;
    status?: string;
    rating?: number;
    reviewCount?: number;
    specifications?: { label: string; value: string }[];
}

export interface ProductMetadata {
    category?: string;
    sku?: string;
    images?: string[];
}

export interface ProductStats {
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
    lowStock: number;
}

export interface ProductListResponse {
    status: string;
    data: Product[];
}

export interface ProductDetailResponse {
    status: string;
    data: Product;
}

export interface CreateProductData {
    name: string;
    description?: string;
    category?: string;
    price: string | number;
    sku?: string;
    stock?: number;
    images?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
    isAvailable?: boolean;
}
