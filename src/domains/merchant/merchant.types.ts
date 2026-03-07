export interface MerchantStats {
    totalRevenue: string;
    revenueChange: string;
    totalOrders: number;
    ordersChange: string;
    activeProducts: number;
    productsChange: string;
    avgOrderValue: string;
    avgOrderValueChange: string;
    recentRevenue: number[];
    orderStatusDistribution: {
        label: string;
        value: number;
        color: string;
    }[];
}

export interface RecentActivity {
    id: string;
    text: string;
    time: string;
    type: 'order' | 'product' | 'payment' | 'shipping';
}

export interface TopProduct {
    name: string;
    sales: number;
    revenue: string;
    rating: number;
}

export interface MerchantDashboardData {
    stats: MerchantStats;
    recentActivities: RecentActivity[];
    topProducts: TopProduct[];
}

export interface MerchantProfile {
    id: string;
    storeName: string;
    ownerName: string;
    email: string;
    phone: string;
    logo?: string;
    category: string;
    address: string;
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export interface UpdateProfileRequest {
    storeName?: string;
    ownerName?: string;
    email?: string;
    phone?: string;
    address?: string;
    category?: string;
    logo?: string;
}

// ─── KYC Verification ────────────────────────────────────────────────────────

export type KycStatus = "PENDING" | "VERIFIED" | "FAILED" | "EXPIRED";

/** Matches the shape returned by GET /api/kyc/status */
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
