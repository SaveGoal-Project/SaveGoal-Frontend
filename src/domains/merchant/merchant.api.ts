import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { getMerchantDashboard, getMerchantProfile } from "./merchant.mock";
import { MerchantDashboardData, MerchantProfile, UpdateProfileRequest, KycStatusResponse } from "./merchant.types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

/**
 * In a real application, these would use apiClient.get()
 * For Phase 1-5, we use mock functions to simulate backend responses
 */

export async function fetchMerchantDashboard(): Promise<MerchantDashboardData> {
    return getMerchantDashboard();
}

export async function fetchMerchantProfile(): Promise<MerchantProfile> {
    return getMerchantProfile();
}

export async function updateMerchantProfile(data: UpdateProfileRequest): Promise<MerchantProfile> {
    const current = await getMerchantProfile();
    return { ...current, ...data };
}

/**
 * Get the current merchant's KYC verification status.
 * Calls GET /api/kyc/status (requires auth token).
 * In mock mode, returns VERIFIED so dev isn't blocked.
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
