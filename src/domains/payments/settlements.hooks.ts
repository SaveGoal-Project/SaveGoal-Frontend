"use client";

import { useState, useCallback, useEffect } from "react";
import { WalletBalance, Transaction, MerchantBankDetails } from "./settlements.types";
import { fetchWalletBalance, fetchTransactions, fetchBankDetails, submitPayoutRequest } from "./settlements.api";

export function useWalletBalance() {
    const [balance, setBalance] = useState<WalletBalance | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadBalance = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchWalletBalance();
            setBalance(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load wallet balance");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBalance();
    }, [loadBalance]);

    return { balance, isLoading, error, refetch: loadBalance };
}

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchTransactions();
            setTransactions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load transactions");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    return { transactions, isLoading, error, refetch: loadTransactions };
}

export function useBankDetails() {
    const [bankDetails, setBankDetails] = useState<MerchantBankDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadBankDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchBankDetails();
            setBankDetails(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load bank details");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBankDetails();
    }, [loadBankDetails]);

    return { bankDetails, isLoading, error, refetch: loadBankDetails };
}

export function usePayoutRequest() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = async (amount: number) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await submitPayoutRequest(amount);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to submit payout request";
            setError(message);
            throw new Error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { request, isSubmitting, error };
}
