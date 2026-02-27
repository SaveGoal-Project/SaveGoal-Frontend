export type SettlementStatus = 'Completed' | 'Pending' | 'Scheduled' | 'Failed';
export type TransactionType = 'Sale' | 'Payout' | 'Refund' | 'Fee';

export interface WalletBalance {
    currentBalance: string;
    availableForPayout: string;
    pendingSettlement: string;
    totalEarnings: string;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: string;
    status: SettlementStatus;
    date: string;
    description: string;
    reference?: string;
}

export interface PayoutRequest {
    amount: number;
    accountDetails: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

export interface MerchantBankDetails {
    bankName: string;
    accountNumber: string;
    accountName: string;
    isVerified: boolean;
}
