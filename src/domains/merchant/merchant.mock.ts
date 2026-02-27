import { MerchantDashboardData, MerchantProfile } from "./merchant.types";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockMerchantDashboardData: MerchantDashboardData = {
    stats: {
        totalRevenue: "GH¢1.84M",
        revenueChange: "+12.5%",
        totalOrders: 324,
        ordersChange: "+8.2%",
        activeProducts: 48,
        productsChange: "+3",
        avgOrderValue: "GH¢5,679",
        avgOrderValueChange: "-2.1%",
        recentRevenue: [40, 65, 50, 80, 70, 95, 60, 85, 75, 90, 55, 70],
        orderStatusDistribution: [
            { label: 'Delivered', value: 58, color: '#1A53C8' },
            { label: 'Processing', value: 24, color: '#306CFE' },
            { label: 'Pending', value: 12, color: '#8AABEE' },
            { label: 'Cancelled', value: 6, color: '#E63330' },
        ]
    },
    recentActivities: [
        { id: '1', text: 'New order from Kwame Adu', time: '2 min ago', type: 'order' },
        { id: '2', text: 'Product "MacBook Pro" restocked', time: '1 hr ago', type: 'product' },
        { id: '3', text: 'Payment received GH¢7,000', time: '3 hrs ago', type: 'payment' },
        { id: '4', text: 'Order #ORD-0085 shipped', time: '5 hrs ago', type: 'shipping' },
    ],
    topProducts: [
        { name: 'Apple MacBook Pro', sales: 48, revenue: 'GH¢480,000', rating: 4.8 },
        { name: 'Sony PlayStation 5', sales: 35, revenue: 'GH¢245,000', rating: 5.0 },
        { name: 'Canon EOS R5', sales: 12, revenue: 'GH¢420,000', rating: 4.9 },
        { name: 'Nike Air Force', sales: 74, revenue: 'GH¢88,800', rating: 4.8 },
    ]
};

export const mockMerchantProfile: MerchantProfile = {
    id: "m_123",
    storeName: "Elite Electronics",
    ownerName: "John Doe",
    email: "john@eliteelectronics.com",
    phone: "+233241234567",
    category: "Electronics",
    address: "Accra Mall, Spintex Road, Accra",
    status: "ACTIVE"
};

export async function getMerchantDashboard(): Promise<MerchantDashboardData> {
    await delay(800);
    return mockMerchantDashboardData;
}

export async function getMerchantProfile(): Promise<MerchantProfile> {
    await delay(500);
    return mockMerchantProfile;
}
