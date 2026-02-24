export interface Product {
    id: number | string;
    name: string;
    merchant: string;
    price: string;
    tag?: string;
    image: string;
    rating?: number;
    reviews?: number;
    description?: string;
    specs?: {
        [key: string]: string;
    };
    features?: string[];
}
