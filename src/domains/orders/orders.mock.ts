import { Order, OrderStats } from "./orders.types";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockOrders: Order[] = [
    {
        id: 'ORD-0091',
        customer: 'Kwame Adu',
        email: 'kwame.adu@example.com',
        product: 'Apple MacBook Pro 14"',
        date: 'Oct 24, 2025',
        amount: 'GH¢10,000.00',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        phone: '+233 24 123 4567',
        shippingAddress: 'House No. 4, Spintex Road, Accra',
        items: [
            { id: 'item-1', name: 'Apple MacBook Pro 14"', quantity: 1, price: 'GH¢10,000.00', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4' }
        ]
    },
    {
        id: 'ORD-0090',
        customer: 'Ama Owusu',
        email: 'ama.o@example.com',
        product: 'Sony PlayStation 5',
        date: 'Oct 23, 2025',
        amount: 'GH¢7,000.00',
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        phone: '+233 20 987 6543',
        shippingAddress: 'Flat 2B, Ridge, Accra',
        items: [
            { id: 'item-2', name: 'Sony PlayStation 5', quantity: 1, price: 'GH¢7,000.00', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db' }
        ]
    },
    {
        id: 'ORD-0089',
        customer: 'Kofi Mensah',
        email: 'kofi.m@example.com',
        product: 'Adidas Sneakers',
        date: 'Oct 23, 2025',
        amount: 'GH¢800.00',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        phone: '+233 55 111 2233',
        shippingAddress: 'No. 8, University Road, Legon',
        items: [
            { id: 'item-3', name: 'Adidas Sneakers', quantity: 1, price: 'GH¢800.00', image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb' }
        ]
    },
    {
        id: 'ORD-0088',
        customer: 'Abena Sarpong',
        email: 'abena.s@example.com',
        product: 'Canon EOS R5',
        date: 'Oct 22, 2025',
        amount: 'GH¢35,000.00',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        phone: '+233 26 555 6677',
        shippingAddress: 'Plot 42, Kumasi High Street, Kumasi',
        items: [
            { id: 'item-4', name: 'Canon EOS R5', quantity: 1, price: 'GH¢35,000.00', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32' }
        ]
    },
    {
        id: 'ORD-0087',
        customer: 'Yaw Boateng',
        email: 'yaw.b@example.com',
        product: 'Nike Air Force 1',
        date: 'Oct 21, 2025',
        amount: 'GH¢1,200.00',
        paymentStatus: 'Failed',
        orderStatus: 'Cancelled',
        phone: '+233 27 000 9988',
        shippingAddress: 'House 15, Tema Community 5, Tema',
        items: [
            { id: 'item-5', name: 'Nike Air Force 1', quantity: 1, price: 'GH¢1,200.00', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a' }
        ]
    }
];

export const mockOrderStats: OrderStats = {
    totalOrders: 1248,
    pendingProcessing: 24,
    deliveredMonth: 156,
    returns: 3
};

export async function getOrders(): Promise<Order[]> {
    await delay(700);
    return mockOrders;
}

export async function getOrder(id: string): Promise<Order | null> {
    await delay(500);
    return mockOrders.find(o => o.id === id) || null;
}

export async function getOrderStats(): Promise<OrderStats> {
    await delay(400);
    return mockOrderStats;
}
