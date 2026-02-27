import { getOrders, getOrder, getOrderStats } from "./orders.mock";
import { Order, OrderStats } from "./orders.types";

export async function fetchOrders(): Promise<Order[]> {
    return getOrders();
}

export async function fetchOrder(id: string): Promise<Order | null> {
    return getOrder(id);
}

export async function fetchOrderStats(): Promise<OrderStats> {
    return getOrderStats();
}
