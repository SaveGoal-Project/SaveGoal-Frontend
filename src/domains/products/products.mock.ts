// Mock product data — shared across browse and detail pages
// Replace with actual API calls when backend is ready

export interface MockProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    currency: string;
    category: string;
    rating: number;
    reviewCount: number;
    image: string;
    images: string[];
    description: string;
    specifications: { label: string; value: string }[];
}

function delay(ms: number = 400): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockProducts: MockProduct[] = [
    {
        id: "1",
        name: "Apple MacBook Pro",
        brand: "APPLE",
        price: 10000,
        currency: "GHS",
        category: "Electronics",
        rating: 5.0,
        reviewCount: 1200,
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
        ],
        description:
            "The most powerful MacBook Pro ever. With the blazing-fast M2 Pro chip, up to 22 hours of battery life, and a stunning Liquid Retina XDR display, it's the ultimate pro notebook.",
        specifications: [
            { label: "CPU", value: "Apple M2 Pro (12 cores)" },
            { label: "GPU", value: "19-core GPU" },
            { label: "Storage", value: "512GB SSD" },
            { label: "Display", value: '16" Liquid Retina XDR' },
        ],
    },
    {
        id: "2",
        name: "Water Bottle",
        brand: "MELCOM",
        price: 10000,
        currency: "GHS",
        category: "Health",
        rating: 5.0,
        reviewCount: 1200,
        image:
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
            "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80",
            "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&q=80",
        ],
        description:
            "Premium insulated water bottle that keeps your drinks cold for 24 hours or hot for 12 hours. Made with BPA-free, food-grade stainless steel.",
        specifications: [
            { label: "Material", value: "Stainless Steel" },
            { label: "Capacity", value: "750ml" },
            { label: "Insulation", value: "Double-wall vacuum" },
            { label: "Weight", value: "350g" },
        ],
    },
    {
        id: "3",
        name: "Apple Series 3",
        brand: "TELEFONICA",
        price: 10000,
        currency: "GHS",
        category: "Electronics",
        rating: 5.0,
        reviewCount: 1200,
        image:
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
            "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80",
            "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
        ],
        description:
            "Stay connected, active, and healthy with Apple Watch Series 3. Make calls, send texts, and get directions with cellular. Track your workout and daily activity.",
        specifications: [
            { label: "Display", value: "OLED Retina" },
            { label: "Connectivity", value: "GPS + Cellular" },
            { label: "Water Resistance", value: "50m" },
            { label: "Battery", value: "Up to 18 hours" },
        ],
    },
    {
        id: "4",
        name: "Adidas Sneakers",
        brand: "ADIDAS",
        price: 10000,
        currency: "GHS",
        category: "Sneakers",
        rating: 5.0,
        reviewCount: 1200,
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
        ],
        description:
            "Iconic Adidas sneakers combining classic style with modern comfort technology. Featuring Boost cushioning and a breathable Primeknit upper.",
        specifications: [
            { label: "Material", value: "Primeknit Upper" },
            { label: "Sole", value: "Boost Cushioning" },
            { label: "Closure", value: "Lace-up" },
            { label: "Style", value: "Athletic / Casual" },
        ],
    },
    {
        id: "5",
        name: "Sony PlayStation 5",
        brand: "Sony",
        price: 7000,
        currency: "GHS",
        category: "Electronics",
        rating: 5.0,
        reviewCount: 1200,
        image:
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
            "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80",
            "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&q=80",
        ],
        description:
            "Experience lightning-fast loading with the PS5's ultra-high speed SSD, deeper immersion with haptic feedback, and a whole new generation of incredible PlayStation games.",
        specifications: [
            { label: "CPU", value: "AMD Zen 2 (8 cores)" },
            { label: "GPU", value: "10.28 TFLOPs" },
            { label: "Storage", value: "825GB SSD" },
            { label: "Resolution", value: "Up to 8K" },
        ],
    },
    {
        id: "6",
        name: "Long Sleeve Shirt",
        brand: "MELCOM",
        price: 1000,
        currency: "GHS",
        category: "Clothing",
        rating: 5.0,
        reviewCount: 1200,
        image:
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
            "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=800&q=80",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
        ],
        description:
            "Classic long sleeve shirt crafted from premium cotton. Perfect for both casual and semi-formal occasions with a comfortable regular fit.",
        specifications: [
            { label: "Material", value: "100% Cotton" },
            { label: "Fit", value: "Regular" },
            { label: "Care", value: "Machine Washable" },
            { label: "Closure", value: "Button Front" },
        ],
    },
    {
        id: "7",
        name: 'LG 50" Television',
        brand: "TELEFONICA",
        price: 10000,
        currency: "GHS",
        category: "Electronics",
        rating: 5.0,
        reviewCount: 1200,
        image:
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
            "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80",
            "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80",
        ],
        description:
            'Experience stunning 4K visuals on this 50" LG Smart TV. Featuring webOS for seamless streaming, AI-powered picture optimization, and Dolby Audio for immersive sound.',
        specifications: [
            { label: "Display", value: '50" 4K UHD' },
            { label: "Smart TV", value: "webOS" },
            { label: "Audio", value: "Dolby Audio" },
            { label: "Connectivity", value: "HDMI x3, USB x2" },
        ],
    },
    {
        id: "8",
        name: "Nike Air Force 1",
        brand: "NIKE",
        price: 10000,
        currency: "GHS",
        category: "Sneakers",
        rating: 5.0,
        reviewCount: 1200,
        image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
            "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
        ],
        description:
            "The Nike Air Force 1 — a timeless sneaker icon since 1982. Featuring Nike Air cushioning, a padded collar, and a durable rubber outsole.",
        specifications: [
            { label: "Material", value: "Leather Upper" },
            { label: "Sole", value: "Air Cushioning" },
            { label: "Closure", value: "Lace-up" },
            { label: "Style", value: "Lifestyle" },
        ],
    },
];

/** GET /products/:id */
export async function getProductById(
    id: string
): Promise<MockProduct | undefined> {
    await delay(300);
    return mockProducts.find((p) => p.id === id);
}

/** GET /products */
export async function getProducts(): Promise<MockProduct[]> {
    await delay(300);
    return mockProducts;
}
