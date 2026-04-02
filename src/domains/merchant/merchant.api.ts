import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { getMerchantDashboard as getMockDashboard, getMerchantProfile as getMockProfile } from "./merchant.mock";
import {
    MerchantDashboardData,
    MerchantProfile,
    UpdateProfileRequest,
    KycStatusResponse,
} from "./merchant.types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

type MerchantApiEnvelope<T> = T | { data?: T; status?: string; success?: boolean };

interface RawMerchantProfileResponse {
    id: string;
    userId?: string;
    businessName: string;
    contactEmail: string;
    contactPhone: string;
    businessAddress: string;
    registrationNo?: string | null;
    isVerified?: boolean;
    balance?: string | number;
    products?: Array<{
        id: string;
        name: string;
        price: string | number;
        stock?: number | null;
        isAvailable?: boolean;
    }>;
}

function toNumber(v: string | number | undefined): number {
    if (v === undefined) return 0;
    const n = typeof v === "string" ? parseFloat(v) : v;
    return Number.isFinite(n) ? n : 0;
}

function unwrapResponse<T>(response: MerchantApiEnvelope<T>): T {
    if (response && typeof response === "object" && "data" in response && response.data !== undefined) {
        return response.data;
    }

    return response as T;
}

function mapProfile(raw: RawMerchantProfileResponse): MerchantProfile {
    return {
        id: raw.id,
        storeName: raw.businessName,
        ownerName: raw.businessName,
        email: raw.contactEmail,
        phone: raw.contactPhone,
        category: "General",
        address: raw.businessAddress,
        status: raw.isVerified ? "ACTIVE" : "PENDING",
    };
}

/**
 * GET /api/merchants/profile - merchant profile with products (when authenticated as MERCHANT).
 */
export async function fetchMerchantProfile(): Promise<MerchantProfile> {
    if (USE_MOCK) {
        return getMockProfile();
    }

    const response = await apiClient.get<MerchantApiEnvelope<RawMerchantProfileResponse>>(API_ENDPOINTS.MERCHANT.PROFILE);
    return mapProfile(unwrapResponse(response));
}

/**
 * PATCH /api/merchants/profile
 */
export async function updateMerchantProfile(data: UpdateProfileRequest): Promise<MerchantProfile> {
    if (USE_MOCK) {
        const current = await getMockProfile();
        return {
            ...current,
            storeName: data.storeName ?? current.storeName,
            ownerName: data.ownerName ?? current.ownerName,
            email: data.email ?? current.email,
            phone: data.phone ?? current.phone,
            address: data.address ?? current.address,
            category: data.category ?? current.category,
        };
    }

    const payload: Record<string, string | undefined> = {};
    if (data.storeName !== undefined) payload.businessName = data.storeName;
    if (data.email !== undefined) payload.contactEmail = data.email;
    if (data.phone !== undefined) payload.contactPhone = data.phone;
    if (data.address !== undefined) payload.businessAddress = data.address;

    const response = await apiClient.patch<MerchantApiEnvelope<RawMerchantProfileResponse>>(API_ENDPOINTS.MERCHANT.PROFILE, payload);
    return mapProfile(unwrapResponse(response));
}

/**
 * Build dashboard cards from merchant profile + products (no dedicated dashboard endpoint yet).
 */
export async function fetchMerchantDashboard(): Promise<MerchantDashboardData> {
    if (USE_MOCK) {
        return getMockDashboard();
    }

    const response = await apiClient.get<MerchantApiEnvelope<RawMerchantProfileResponse>>(API_ENDPOINTS.MERCHANT.PROFILE);
    const raw = unwrapResponse(response);
    const products = raw.products ?? [];
    const active = products.filter((p) => p.isAvailable !== false).length;
    const balance = toNumber(raw.balance ?? 0);

    const topProducts = products.slice(0, 4).map((p) => ({
        name: p.name,
        sales: typeof p.stock === "number" ? Math.max(0, 10 - p.stock) : 0,
        revenue: `GHc${toNumber(p.price).toLocaleString()}`,
        rating: 5,
    }));

    return {
        stats: {
            totalRevenue: `GHc${balance.toLocaleString()}`,
            revenueChange: "-",
            totalOrders: 0,
            ordersChange: "-",
            activeProducts: active,
            productsChange: "-",
            avgOrderValue: "-",
            avgOrderValueChange: "-",
            recentRevenue: [40, 50, 45, 60, 55, 50, 48, 52, 58, 54, 49, 53],
            orderStatusDistribution: [
                { label: "Active", value: active, color: "#1A53C8" },
                { label: "Other", value: Math.max(0, products.length - active), color: "#8AABEE" },
            ],
        },
        recentActivities: [],
        topProducts: topProducts.length
            ? topProducts
            : [{ name: "Add your first product", sales: 0, revenue: "GHc0", rating: 0 }],
    };
}

/**
 * Get the current merchant's KYC verification status.
 * Calls GET /api/kyc/status (requires auth token).
 */
export async function getKycStatus(): Promise<KycStatusResponse> {
    if (USE_MOCK) {
        return {
            kycStatus: "VERIFIED",
            kycNote: null,
            idType: "Ghana card",
            idNumber: "GHA-MOCK-12345",
            idImageUrl: null,
            selfieImageUrl: null,
            selfieVerified: true,
            selfieMatchScore: 0.98,
            selfieReviewNote: null,
            bankName: "GCB Bank",
            bankAccountNo: "1234567890",
            bankAccountName: "Mock Merchant",
            updatedAt: new Date().toISOString(),
        };
    }

    return apiClient.get<KycStatusResponse>(API_ENDPOINTS.KYC.STATUS);
}
