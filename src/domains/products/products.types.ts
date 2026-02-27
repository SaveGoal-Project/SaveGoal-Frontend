// Product types — mirrors the backend's Product model from Prisma

export interface Product {
    id: string;
    merchantProfileId: string;
    name: string;
    description: string | null;
    price: number; // Converted from Decimal
    currency: string;
    image: string | null;
    stock: number | null;
    isAvailable: boolean;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    merchant: {
        businessName: string;
        isVerified: boolean;
    };
}

export interface ProductListResponse {
    status: string;
    data: Product[];
}

export interface ProductDetailResponse {
    status: string;
    data: Product;
}
