import { MerchantDashboardData, MerchantProfile } from "./merchant.types";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockMerchantDashboardData: MerchantDashboardData = {
    summary: {
        availableBalance: 18450,
        totalRevenue: 184500,
        totalOrders: 324,
        activeProducts: 48,
        avgOrderValue: 569.79,
        pendingPayoutAmount: 4200,
        pendingPayouts: 2,
    },
    monthlyRevenue: [
        { label: "Nov 2025", amount: 21000 },
        { label: "Dec 2025", amount: 26500 },
        { label: "Jan 2026", amount: 24100 },
        { label: "Feb 2026", amount: 31800 },
        { label: "Mar 2026", amount: 28900 },
        { label: "Apr 2026", amount: 35200 },
    ],
    latestOrders: [
        {
            id: "ord-1",
            productName: "Apple MacBook Pro",
            customerName: "Kwame Adu",
            amount: 10000,
            currency: "GHS",
            orderStatus: "PROCESSING",
            paymentStatus: "PAID",
            reference: "ORD-0091",
            createdAt: new Date().toISOString(),
        },
    ],
    recentActivity: [
        { id: "1", message: "Kwame Adu redeemed Apple MacBook Pro", time: "2 min ago", type: "order" },
        { id: "2", message: "Payout request pending for GHS 4,200", time: "1 hr ago", type: "payout" },
        { id: "3", message: "Product added: Sony PlayStation 5", time: "5 hrs ago", type: "product" },
    ],
    topProducts: [
        { name: "Apple MacBook Pro", orders: 48, revenue: 480000 },
        { name: "Sony PlayStation 5", orders: 35, revenue: 245000 },
        { name: "Canon EOS R5", orders: 12, revenue: 420000 },
    ],
};

export const mockMerchantProfile: MerchantProfile = {
    id: "m_123",
    userId: "u_123",
    storeName: "Elite Electronics",
    ownerName: "John Doe",
    email: "john@eliteelectronics.com",
    phone: "+233241234567",
    address: "Accra Mall, Spintex Road, Accra",
    registrationNo: "REG-00123",
    bankName: "GCB Bank",
    bankAccountNo: "1234567890",
    bankAccountName: "Elite Electronics Ltd",
    isVerified: true,
    balance: 18450,
    kycStatus: "VERIFIED",
    kycNote: null,
    productsCount: 54,
    activeProducts: 48,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export async function getMerchantDashboard(): Promise<MerchantDashboardData> {
    await delay(800);
    return mockMerchantDashboardData;
}

export async function getMerchantProfile(): Promise<MerchantProfile> {
    await delay(500);
    return mockMerchantProfile;
}
