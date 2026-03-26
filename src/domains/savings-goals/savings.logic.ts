import type { SavingsGoal } from "./savings.types";

/**
 * ACTIVE savings goal for a catalog product (same rules as cart linking).
 */
export function findActiveGoalForProduct(
  goals: SavingsGoal[],
  productId: string
): SavingsGoal | null {
  const match = goals.find(
    (g) =>
      g.status === "ACTIVE" &&
      (g.product?.id === productId || g.productId === productId)
  );
  return match ?? null;
}
