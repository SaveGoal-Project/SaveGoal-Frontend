import { getWalletBalance, getTransactions, getBankDetails, requestPayout } from "./settlements.mock";
import { WalletBalance, Transaction, MerchantBankDetails } from "./settlements.types";

export async function fetchWalletBalance(): Promise<WalletBalance> {
    return getWalletBalance();
}

export async function fetchTransactions(): Promise<Transaction[]> {
    return getTransactions();
}

export async function fetchBankDetails(): Promise<MerchantBankDetails> {
    return getBankDetails();
}

export async function submitPayoutRequest(amount: number) {
    return requestPayout(amount);
}
