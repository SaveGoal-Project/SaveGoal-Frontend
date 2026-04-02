import { MerchantBankDetails, PayoutRequestResult, Transaction, WalletBalance } from "./settlements.types";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockWalletBalance: WalletBalance = {
    currentBalance: 18450,
    availableForPayout: 14200,
    pendingPayoutAmount: 4250,
    totalTransactions: 5,
};

export const mockTransactions: Transaction[] = [
    {
        id: "TX-1001",
        type: "SALE",
        direction: "credit",
        amount: 7000,
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
        description: "Goal redeemed for Sony PlayStation 5",
        reference: "ORD-0090",
        currency: "GHS",
    },
    {
        id: "TX-1002",
        type: "PAYOUT",
        direction: "debit",
        amount: 5000,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        description: "Payout request to bank account",
        reference: "PO-8821",
        currency: "GHS",
    },
];

export const mockBankDetails: MerchantBankDetails = {
    bankName: "Standard Chartered Bank",
    accountNumber: "0101234567",
    accountName: "Elite Electronics Ltd.",
    isVerified: true,
};

export async function getWalletBalance(): Promise<WalletBalance> {
    await delay(600);
    return mockWalletBalance;
}

export async function getTransactions(): Promise<Transaction[]> {
    await delay(800);
    return mockTransactions;
}

export async function getBankDetails(): Promise<MerchantBankDetails> {
    await delay(400);
    return mockBankDetails;
}

export async function requestPayout(amount: number): Promise<PayoutRequestResult> {
    await delay(1500);
    if (amount > 14200) {
        throw new Error("Insufficient available balance for payout");
    }

    return {
        id: "payout-1",
        status: "PENDING",
        reference: "PO-1001",
    };
}
