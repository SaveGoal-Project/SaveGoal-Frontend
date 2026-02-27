import { getMerchantDashboard, getMerchantProfile } from "./merchant.mock";
import { MerchantDashboardData, MerchantProfile, UpdateProfileRequest } from "./merchant.types";

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
