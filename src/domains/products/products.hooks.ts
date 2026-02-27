"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product, ProductStats, CreateProductData } from "./products.types";
import { getProducts, getProductById, createProduct, getProductStats } from "./products.api";

// ─── Hook: Fetch all products ─────────────────────────────────────────────

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, isLoading, error, refetch: fetchProducts };
}

// ─── Hook: Fetch single product ───────────────────────────────────────────

export function useProduct(id: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await getProductById(id);
            setProduct(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load product details"
            );
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return { product, isLoading, error, refetch: fetchProduct };
}

// ─── Hook: Create a product (Merchant) ────────────────────────────────────

export function useCreateProduct() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (data: CreateProductData): Promise<Product> => {
        setIsSubmitting(true);
        setError(null);
        try {
            const product = await createProduct(data);
            return product;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to create product";
            setError(message);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return { create, isSubmitting, error };
}

// ─── Hook: Fetch product stats (Merchant dashboard) ───────────────────────

export function useProductStats() {
    const [stats, setStats] = useState<ProductStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getProductStats();
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load product stats");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, isLoading, error, refetch: fetchStats };
}
