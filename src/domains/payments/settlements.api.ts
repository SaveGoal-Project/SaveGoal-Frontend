import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import type {
    MerchantBankDetails,
    PayoutRequestResult,
    Transaction,
    WalletBalance,
} from "./settlements.types";
import type { MerchantProfile } from "../merchant/merchant.types";

interface MerchantPayoutSummary {
    currentBalance: number | string;
    availableForPayout: number | string;
    pendingPayoutAmount: number | string;
}

interface MerchantPayoutListResponse {
    summary: MerchantPayoutSummary;
    items: Array<{
        id: string;
        amount: number | string;
        currency: string;
        status: string;
        reference?: string | null;
        requestedAt: string;
        processedAt?: string | null;
        adminNote?: string | null;
    }>;
}

interface MerchantTransactionsResponse {
    summary: {
        currentBalance: number | string;
        availableForPayout: number | string;
        totalTransactions: number;
    };
    items: Transaction[];
}

function toNumber(value: string | number | undefined | null): number {
    if (value === null || value === undefined) {
        return 0;
    }

    const parsed = typeof value === "string" ? parseFloat(value) : value;
    return Number.isFinite(parsed) ? parsed : 0;
}

export async function fetchWalletBalance(): Promise<WalletBalance> {
    const response = await apiClient.get<MerchantPayoutListResponse>(API_ENDPOINTS.MERCHANT.PAYOUTS);

    return {
        currentBalance: toNumber(response.summary.currentBalance),
        availableForPayout: toNumber(response.summary.availableForPayout),
        pendingPayoutAmount: toNumber(response.summary.pendingPayoutAmount),
        totalTransactions: response.items.length,
    };
}

export async function fetchTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get<MerchantTransactionsResponse>(API_ENDPOINTS.MERCHANT.TRANSACTIONS);
    return response.items;
}

export async function fetchBankDetails(): Promise<MerchantBankDetails> {
    const response = await apiClient.get<MerchantProfile>(API_ENDPOINTS.MERCHANT.PROFILE);

    return {
        bankName: response.bankName || "",
        accountNumber: response.bankAccountNo || "",
        accountName: response.bankAccountName || "",
        isVerified: response.isVerified,
    };
}

export async function submitPayoutRequest(amount: number): Promise<PayoutRequestResult> {
    return apiClient.post<PayoutRequestResult>(API_ENDPOINTS.MERCHANT.PAYOUTS, { amount });
}
