export type OrderStatus = "PROCESSING" | "FULFILLED" | "CANCELLED";
export type PaymentStatus = "PAID" | "PENDING" | "FAILED";

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    image?: string | null;
}

export interface Order {
    id: string;
    goalId: string | null;
    productId: string | null;
    productName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    amount: number;
    currency: string;
    paymentStatus: PaymentStatus | string;
    orderStatus: OrderStatus | string;
    reference: string | null;
    createdAt: string;
    items: OrderItem[];
}

export interface OrderStats {
    totalOrders: number;
    processing: number;
    fulfilled: number;
    cancelled: number;
}
