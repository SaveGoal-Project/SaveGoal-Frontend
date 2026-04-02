export interface MerchantSummary {
    availableBalance: number;
    totalRevenue: number;
    totalOrders: number;
    activeProducts: number;
    avgOrderValue: number;
    pendingPayoutAmount: number;
    pendingPayouts: number;
}

export interface RevenuePoint {
    label: string;
    amount: number;
}

export interface MerchantOrderPreview {
    id: string;
    productName: string;
    customerName: string;
    amount: number;
    currency: string;
    orderStatus: string;
    paymentStatus: string;
    reference: string | null;
    createdAt: string;
}

export interface RecentActivity {
    id: string;
    type: "order" | "product" | "payout";
    message: string;
    time: string;
}

export interface TopProduct {
    name: string;
    orders: number;
    revenue: number;
}

export interface MerchantDashboardData {
    summary: MerchantSummary;
    monthlyRevenue: RevenuePoint[];
    latestOrders: MerchantOrderPreview[];
    topProducts: TopProduct[];
    recentActivity: RecentActivity[];
}

export interface MerchantProfile {
    id: string;
    userId: string;
    storeName: string;
    ownerName: string;
    email: string;
    phone: string;
    address: string;
    registrationNo?: string | null;
    bankName?: string | null;
    bankAccountNo?: string | null;
    bankAccountName?: string | null;
    isVerified: boolean;
    balance: number;
    kycStatus: "PENDING" | "VERIFIED" | "FAILED" | "EXPIRED";
    kycNote: string | null;
    productsCount: number;
    activeProducts: number;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileRequest {
    storeName?: string;
    ownerName?: string;
    email?: string;
    phone?: string;
    address?: string;
    registrationNo?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankAccountName?: string;
}

export type KycStatus = "PENDING" | "VERIFIED" | "FAILED" | "EXPIRED";

export interface KycStatusResponse {
    kycStatus: KycStatus | null;
    kycNote: string | null;
    idType: string | null;
    idNumber: string | null;
    idImageUrl: string | null;
    selfieImageUrl: string | null;
    selfieVerified: boolean | null;
    selfieMatchScore: number | null;
    selfieReviewNote: string | null;
    bankName: string | null;
    bankAccountNo: string | null;
    bankAccountName: string | null;
    updatedAt: string;
}
