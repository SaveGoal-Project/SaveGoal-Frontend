import { WalletBalance, Transaction, SettlementStatus, TransactionType, MerchantBankDetails } from "./settlements.types";

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockWalletBalance: WalletBalance = {
    currentBalance: "GH¢18,450.00",
    availableForPayout: "GH¢14,200.00",
    pendingSettlement: "GH¢4,250.00",
    totalEarnings: "GH¢184,500.00"
};

export const mockTransactions: Transaction[] = [
    {
        id: "TX-1001",
        type: "Sale",
        amount: "+GH¢7,000.00",
        status: "Completed",
        date: "Oct 24, 2025",
        description: "Sale: Sony PlayStation 5",
        reference: "ORD-0090"
    },
    {
        id: "TX-1002",
        type: "Payout",
        amount: "-GH¢5,000.00",
        status: "Completed",
        date: "Oct 22, 2025",
        description: "Withdrawal to Bank Account",
        reference: "WD-8821"
    },
    {
        id: "TX-1003",
        type: "Sale",
        amount: "+GH¢10,000.00",
        status: "Completed",
        date: "Oct 22, 2025",
        description: "Sale: Apple MacBook Pro",
        reference: "ORD-0091"
    },
    {
        id: "TX-1004",
        type: "Fee",
        amount: "-GH¢300.00",
        status: "Completed",
        date: "Oct 22, 2025",
        description: "Platform Transaction Fee (3%)"
    },
    {
        id: "TX-1005",
        type: "Sale",
        amount: "+GH¢800.00",
        status: "Pending",
        date: "Oct 22, 2025",
        description: "Sale: Adidas Sneakers",
        reference: "ORD-0089"
    }
];

export const mockBankDetails: MerchantBankDetails = {
    bankName: "Standard Chartered Bank",
    accountNumber: "010****4567",
    accountName: "Elite Electronics Ltd.",
    isVerified: true
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

export async function requestPayout(amount: number): Promise<{ success: boolean; message: string }> {
    await delay(1500);
    if (amount > 14200) {
        throw new Error("Insufficient available balance for payout");
    }
    return { success: true, message: "Payout request submitted successfully" };
}
