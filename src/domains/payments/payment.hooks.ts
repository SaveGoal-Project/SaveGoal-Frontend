"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Payment,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  SavedPaymentMethod,
  RecentActivity,
} from "./payment.types";
import {
  getPaymentHistory,
  initiatePayment,
  getSavedPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  getRecentActivity,
} from "./payment.api";

// ─── Hook: Payment history ──────────────────────────────────────────────────

export function usePaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPaymentHistory();
      setPayments(response.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payment history"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, isLoading, error, refetch: fetchPayments };
}

// ─── Hook: Initiate payment (deposit) ───────────────────────────────────────

export function useInitiatePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InitiatePaymentResponse | null>(null);

  const initiate = useCallback(async (data: InitiatePaymentRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await initiatePayment(data);
      setResult(response);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment initiation failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { initiate, isLoading, error, result, reset };
}

// ─── Hook: Saved payment methods ────────────────────────────────────────────

export function useSavedPaymentMethods() {
  const [methods, setMethods] = useState<SavedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSavedPaymentMethods();
      setMethods(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load payment methods"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const remove = useCallback(
    async (methodId: string) => {
      await deletePaymentMethod(methodId);
      setMethods((prev) => prev.filter((m) => m.id !== methodId));
    },
    []
  );

  const setDefault = useCallback(
    async (methodId: string) => {
      await setDefaultPaymentMethod(methodId);
      setMethods((prev) =>
        prev.map((m) => ({
          ...m,
          isDefault: m.id === methodId,
        }))
      );
    },
    []
  );

  return { methods, isLoading, error, refetch: fetchMethods, remove, setDefault };
}

// ─── Hook: Recent activity ──────────────────────────────────────────────────

export function useRecentActivity() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const data = await getRecentActivity();
        setActivities(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load recent activity"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return { activities, isLoading, error };
}

