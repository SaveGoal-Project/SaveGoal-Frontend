export type SettlementStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type TransactionType = "SALE" | "PAYOUT";

export interface WalletBalance {
    currentBalance: number;
    availableForPayout: number;
    totalTransactions: number;
    pendingPayoutAmount?: number;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    direction: "credit" | "debit";
    amount: number;
    currency: string;
    status: SettlementStatus | string;
    createdAt: string;
    description: string;
    reference?: string | null;
}

export interface MerchantBankDetails {
    bankName: string;
    accountNumber: string;
    accountName: string;
    isVerified: boolean;
}

export interface PayoutRequestResult {
    id: string;
    status: string;
    reference?: string | null;
}
