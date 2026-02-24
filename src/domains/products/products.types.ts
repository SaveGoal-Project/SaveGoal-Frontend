export type ProductStatus = 'Active' | 'Low Stock' | 'Out of Stock' | 'Draft' | 'Inactive';

export interface Product {
    id: number | string;
    name: string;
    brand: string;
    merchantId: string;
    merchantName: string;
    price: number;
    formattedPrice?: string;
    category: string;
    image: string;
    images: string[];
    stock: number;
    status: ProductStatus;
    rating: number;
    reviewCount: number;
    description: string;
    sku?: string;
    specifications: {
        label: string;
        value: string;
    }[];
    createdAt?: string;
}

export interface ProductStats {
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
    lowStock: number;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    category: string;
    price: string;
    stock: number;
    sku: string;
    images: string[];
}
