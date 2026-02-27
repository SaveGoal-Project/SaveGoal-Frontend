import { Product, ProductStats } from "./products.types";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockProducts: Product[] = [
    {
        id: "1",
        name: "Apple MacBook Pro 14\"",
        brand: "APPLE",
        merchantId: "m_123",
        merchantName: "Elite Electronics",
        price: 14500,
        formattedPrice: "GH¢14,500.00",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca4",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca4"
        ],
        stock: 12,
        status: "Active",
        rating: 4.8,
        reviewCount: 24,
        sku: "APP-MBP-14",
        description: "The most powerful MacBook Pro ever. With the blazing-fast M2 Pro chip.",
        specifications: [
            { label: "Processor", value: "M2 Pro" },
            { label: "RAM", value: "16GB" },
            { label: "Storage", value: "512GB SSD" }
        ]
    },
    {
        id: "2",
        name: "Sony PlayStation 5",
        brand: "SONY",
        merchantId: "m_123",
        merchantName: "Elite Electronics",
        price: 7200,
        formattedPrice: "GH¢7,200.00",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
        images: [
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db"
        ],
        stock: 5,
        status: "Low Stock",
        rating: 5.0,
        reviewCount: 42,
        sku: "SON-PS5-DS",
        description: "Experience lightning-fast loading with an ultra-high speed SSD.",
        specifications: [
            { label: "Category", value: "Console" },
            { label: "Storage", value: "825GB" },
            { label: "HDR", value: "Supported" }
        ]
    },
    {
        id: "3",
        name: "Canon EOS R5",
        brand: "CANON",
        merchantId: "m_123",
        merchantName: "Elite Electronics",
        price: 35000,
        formattedPrice: "GH¢35,000.00",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
        ],
        stock: 0,
        status: "Out of Stock",
        rating: 4.9,
        reviewCount: 15,
        sku: "CAN-R5-BODY",
        description: "Professional full-frame mirrorless camera.",
        specifications: [
            { label: "Resolution", value: "45MP" },
            { label: "Video", value: "8K Raw" }
        ]
    },
    {
        id: "4",
        name: "Nike Air Force 1",
        brand: "NIKE",
        merchantId: "m_123",
        merchantName: "Elite Electronics",
        price: 1200,
        formattedPrice: "GH¢1,200.00",
        category: "Sneakers",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
        images: [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
        ],
        stock: 45,
        status: "Active",
        rating: 4.7,
        reviewCount: 89,
        sku: "NIK-AF1-WHT",
        description: "Classic style meets modern comfort.",
        specifications: [
            { label: "Material", value: "Leather" },
            { label: "Color", value: "White" }
        ]
    }
];

export const mockProductStats: ProductStats = {
    totalProducts: 48,
    activeProducts: 42,
    outOfStock: 3,
    lowStock: 3
};

export async function getProducts(): Promise<Product[]> {
    await delay(600);
    return mockProducts;
}

export async function getProduct(id: string): Promise<Product | null> {
    await delay(400);
    return mockProducts.find(p => p.id === id) || null;
}

// Aliases for backward compatibility
export const getProductById = getProduct;
export type MockProduct = Product;

export async function getProductStats(): Promise<ProductStats> {
    await delay(300);
    return mockProductStats;
}

export async function createProduct(data: any): Promise<Product> {
    await delay(1000);
    const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        brand: data.brand || "Unknown",
        ...data,
        price: typeof data.price === 'string' ? parseFloat(data.price.replace(/[^0-9.]/g, '')) : data.price,
        formattedPrice: `GH¢${data.price}`,
        merchantId: "m_123",
        merchantName: "Elite Electronics",
        status: "Active",
        rating: 0,
        reviewCount: 0,
        images: data.images || [],
        specifications: data.specifications || []
    };
    return newProduct;
}
