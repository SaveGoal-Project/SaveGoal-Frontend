import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import {
    KycStatusResponse,
    MerchantDashboardData,
    MerchantProfile,
    UpdateProfileRequest,
} from "./merchant.types";

interface RawMerchantProfileResponse {
    id: string;
    userId: string;
    businessName: string;
    ownerName: string;
    contactEmail: string;
    contactPhone: string;
    businessAddress: string;
    registrationNo?: string | null;
    bankName?: string | null;
    bankAccountNo?: string | null;
    bankAccountName?: string | null;
    isVerified: boolean;
    balance: number | string;
    kycStatus: MerchantProfile["kycStatus"];
    kycNote: string | null;
    productsCount: number;
    activeProducts: number;
    createdAt: string;
    updatedAt: string;
}

function toNumber(value: string | number | undefined | null): number {
    if (value === null || value === undefined) {
        return 0;
    }

    const parsed = typeof value === "string" ? parseFloat(value) : value;
    return Number.isFinite(parsed) ? parsed : 0;
}

function mapProfile(raw: RawMerchantProfileResponse): MerchantProfile {
    return {
        id: raw.id,
        userId: raw.userId,
        storeName: raw.businessName,
        ownerName: raw.ownerName,
        email: raw.contactEmail,
        phone: raw.contactPhone,
        address: raw.businessAddress,
        registrationNo: raw.registrationNo ?? null,
        bankName: raw.bankName ?? null,
        bankAccountNo: raw.bankAccountNo ?? null,
        bankAccountName: raw.bankAccountName ?? null,
        isVerified: raw.isVerified,
        balance: toNumber(raw.balance),
        kycStatus: raw.kycStatus,
        kycNote: raw.kycNote,
        productsCount: raw.productsCount,
        activeProducts: raw.activeProducts,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
}

export async function fetchMerchantProfile(): Promise<MerchantProfile> {
    const response = await apiClient.get<RawMerchantProfileResponse>(API_ENDPOINTS.MERCHANT.PROFILE);
    return mapProfile(response);
}

export async function updateMerchantProfile(data: UpdateProfileRequest): Promise<MerchantProfile> {
    const payload: Record<string, string | undefined> = {};

    if (data.storeName !== undefined) payload.businessName = data.storeName;
    if (data.ownerName !== undefined) payload.ownerName = data.ownerName;
    if (data.email !== undefined) payload.contactEmail = data.email;
    if (data.phone !== undefined) payload.contactPhone = data.phone;
    if (data.address !== undefined) payload.businessAddress = data.address;
    if (data.registrationNo !== undefined) payload.registrationNo = data.registrationNo;
    if (data.bankName !== undefined) payload.bankName = data.bankName;
    if (data.bankAccountNo !== undefined) payload.bankAccountNo = data.bankAccountNo;
    if (data.bankAccountName !== undefined) payload.bankAccountName = data.bankAccountName;

    const response = await apiClient.patch<RawMerchantProfileResponse>(API_ENDPOINTS.MERCHANT.PROFILE, payload);
    return mapProfile(response);
}

export async function fetchMerchantDashboard(): Promise<MerchantDashboardData> {
    return apiClient.get<MerchantDashboardData>(API_ENDPOINTS.MERCHANT.DASHBOARD);
}

export async function getKycStatus(): Promise<KycStatusResponse> {
    return apiClient.get<KycStatusResponse>(API_ENDPOINTS.KYC.STATUS);
}
