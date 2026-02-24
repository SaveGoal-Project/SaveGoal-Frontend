"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SavingsGoal,
  SavingsGoalDetail,
  DashboardStats,
  CreateSavingsGoalRequest,
  CancelGoalResponse,
} from "./savings.types";
import {
  getSavingsGoals,
  getSavingsGoalById,
  createSavingsGoal,
  cancelSavingsGoal,
  getDashboardStats,
} from "./savings.api";

// ─── Hook: Fetch all savings goals ──────────────────────────────────────────

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSavingsGoals();
      setGoals(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load goals");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { goals, isLoading, error, refetch: fetchGoals };
}

// ─── Hook: Fetch single goal detail ─────────────────────────────────────────

export function useSavingsGoalDetail(goalId: string) {
  const [goal, setGoal] = useState<SavingsGoalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoal = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSavingsGoalById(goalId);
      setGoal(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load goal details"
      );
    } finally {
      setIsLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return { goal, isLoading, error, refetch: fetchGoal };
}

// ─── Hook: Dashboard stats ──────────────────────────────────────────────────

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard stats"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, isLoading, error };
}

// ─── Hook: Create savings goal ──────────────────────────────────────────────

export function useCreateSavingsGoal() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: CreateSavingsGoalRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const goal = await createSavingsGoal(data);
      return goal;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create goal";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { create, isLoading, error };
}

// ─── Hook: Cancel savings goal ──────────────────────────────────────────────

export function useCancelSavingsGoal() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CancelGoalResponse | null>(null);

  const cancel = useCallback(async (goalId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cancelSavingsGoal(goalId);
      setResult(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to cancel goal";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { cancel, isLoading, error, result };
}

