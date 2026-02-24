import { getProducts, getProduct, getProductStats, createProduct } from "./products.mock";
import { Product, ProductStats, CreateProductRequest } from "./products.types";

export async function fetchProducts(): Promise<Product[]> {
    return getProducts();
}

export async function fetchProduct(id: string): Promise<Product | null> {
    return getProduct(id);
}

export async function fetchProductStats(): Promise<ProductStats> {
    return getProductStats();
}

export async function addProduct(data: CreateProductRequest): Promise<Product> {
    return createProduct(data);
}
