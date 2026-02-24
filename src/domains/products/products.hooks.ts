"use client";

import { useState, useCallback, useEffect } from "react";
import { Product, ProductStats, CreateProductRequest } from "./products.types";
import { fetchProducts, fetchProduct, fetchProductStats, addProduct } from "./products.api";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchProducts();
            setProducts(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return { products, isLoading, error, refetch: loadProducts };
}

export function useProduct(id: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProduct = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchProduct(id);
            setProduct(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load product");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    return { product, isLoading, error, refetch: loadProduct };
}

export function useProductStats() {
    const [stats, setStats] = useState<ProductStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchProductStats();
            setStats(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load product stats");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    return { stats, isLoading, error, refetch: loadStats };
}

export function useCreateProduct() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: CreateProductRequest) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await addProduct(data);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to create product";
            setError(message);
            throw new Error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { create, isSubmitting, error };
}
