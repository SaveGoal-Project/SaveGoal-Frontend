"use client";

import { useState, useCallback, useEffect } from "react";
import { Order, OrderStats } from "./orders.types";
import { fetchOrders, fetchOrder, fetchOrderStats } from "./orders.api";

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchOrders();
            setOrders(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    return { orders, isLoading, error, refetch: loadOrders };
}

export function useOrder(id: string) {
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOrder = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchOrder(id);
            setOrder(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load order");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    return { order, isLoading, error, refetch: loadOrder };
}

export function useOrderStats() {
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchOrderStats();
            setStats(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load order stats");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    return { stats, isLoading, error, refetch: loadStats };
}
