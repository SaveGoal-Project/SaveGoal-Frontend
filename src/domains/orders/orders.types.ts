export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

export interface Order {
    id: string;
    customer: string;
    email: string;
    product: string;
    date: string;
    amount: string;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    items?: OrderItem[];
    shippingAddress?: string;
    phone?: string;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: string;
    image?: string;
}

export interface OrderStats {
    totalOrders: number;
    pendingProcessing: number;
    deliveredMonth: number;
    returns: number;
}
