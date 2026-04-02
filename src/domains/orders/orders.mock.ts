import { Order, OrderStats } from "./orders.types";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockOrders: Order[] = [
    {
        id: "ORD-0091",
        goalId: "goal-1",
        productId: "prod-1",
        productName: 'Apple MacBook Pro 14"',
        customerName: "Kwame Adu",
        customerEmail: "kwame.adu@example.com",
        customerPhone: "+233241234567",
        shippingAddress: "House No. 4, Spintex Road, Accra",
        amount: 10000,
        currency: "GHS",
        paymentStatus: "PAID",
        orderStatus: "FULFILLED",
        reference: "ORD-0091",
        createdAt: new Date().toISOString(),
        items: [
            { id: "item-1", name: 'Apple MacBook Pro 14"', quantity: 1, unitPrice: 10000, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4" },
        ],
    },
];

export const mockOrderStats: OrderStats = {
    totalOrders: 1,
    processing: 0,
    fulfilled: 1,
    cancelled: 0,
};

export async function getOrders(): Promise<Order[]> {
    await delay(700);
    return mockOrders;
}

export async function getOrder(id: string): Promise<Order | null> {
    await delay(500);
    return mockOrders.find((order) => order.id === id) || null;
}

export async function getOrderStats(): Promise<OrderStats> {
    await delay(400);
    return mockOrderStats;
}
