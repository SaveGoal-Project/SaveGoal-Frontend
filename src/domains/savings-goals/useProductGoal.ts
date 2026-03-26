"use client";

import { useMemo } from "react";
import { useSavingsGoals } from "./savings.hooks";
import { findActiveGoalForProduct } from "./savings.logic";

/**
 * Use on product detail only (one subscription to goals per page).
 * On browse grids, call useSavingsGoals once in the parent and use findActiveGoalForProduct.
 */
export function useProductGoal(productId: string | undefined) {
  const { goals, isLoading, error, refetch } = useSavingsGoals();
  const activeGoal = useMemo(
    () => (productId ? findActiveGoalForProduct(goals, productId) : null),
    [goals, productId]
  );
  return { activeGoal, isLoading, error, refetch };
}
