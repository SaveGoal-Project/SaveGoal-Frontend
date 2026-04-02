import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { Order, OrderStats } from "./orders.types";

interface OrdersListResponse {
    items: Order[];
    stats: OrderStats;
}

export async function fetchOrders(): Promise<Order[]> {
    const response = await apiClient.get<OrdersListResponse>(API_ENDPOINTS.MERCHANT.ORDERS);
    return response.items;
}

export async function fetchOrder(id: string): Promise<Order | null> {
    return apiClient.get<Order>(`${API_ENDPOINTS.MERCHANT.ORDERS}/${id}`);
}

export async function fetchOrderStats(): Promise<OrderStats> {
    const response = await apiClient.get<OrdersListResponse>(API_ENDPOINTS.MERCHANT.ORDERS);
    return response.stats;
}
