// Mock data service for savings goals — mirrors exact API response shapes
// Swap imports from savings.mock → savings.api when backend is ready

import {
  SavingsGoal,
  SavingsGoalDetail,
  SavingsGoalsListResponse,
  DashboardStats,
  CancelGoalResponse,
  CreateSavingsGoalRequest,
} from "./savings.types";

// ─── Dynamic Date Helpers ────────────────────────────────────────────────────

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD format
}

function monthsFromNow(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockGoals: SavingsGoal[] = [
  {
    id: "goal-001",
    productId: "prod-001",
    userId: "user-001",
    targetAmount: 7000,
    currentAmount: 3400,
    frequency: "WEEKLY",
    status: "ACTIVE",
    estimatedCompletionDate: monthsFromNow(3),
    progress: 49,
    nextPaymentDate: daysFromNow(5),
    nextPaymentAmount: 425,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(7),
    product: {
      id: "prod-001",
      name: "Sony PlayStation 5",
      price: 7000,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
      ],
      merchant: {
        id: "merch-001",
        businessName: "TechZone Ghana",
      },
    },
  },
  {
    id: "goal-002",
    productId: "prod-002",
    userId: "user-001",
    targetAmount: 10000,
    currentAmount: 4000,
    frequency: "BIWEEKLY",
    status: "ACTIVE",
    estimatedCompletionDate: monthsFromNow(5),
    progress: 40,
    nextPaymentDate: daysFromNow(10),
    nextPaymentAmount: 850,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(14),
    product: {
      id: "prod-002",
      name: "MacBook Air M2",
      price: 10000,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      ],
      merchant: {
        id: "merch-002",
        businessName: "Apple Store Accra",
      },
    },
  },
  {
    id: "goal-003",
    productId: "prod-003",
    userId: "user-001",
    targetAmount: 1000,
    currentAmount: 0,
    frequency: "MONTHLY",
    status: "ACTIVE",
    estimatedCompletionDate: monthsFromNow(4),
    progress: 0,
    nextPaymentDate: daysFromNow(3),
    nextPaymentAmount: 250,
    createdAt: daysAgo(7),
    product: {
      id: "prod-003",
      name: "Nike AirForce 1",
      price: 1000,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
      ],
      merchant: {
        id: "merch-003",
        businessName: "Nike Store",
      },
    },
  },
];

/** Goals created in the current session (mock mode only) — appended by createSavingsGoal */
const dynamicGoals: SavingsGoal[] = [];

const mockGoalDetails: Record<string, SavingsGoalDetail> = {
  "goal-001": {
    ...mockGoals[0],
    deposits: [
      {
        id: "dep-001",
        paymentId: "pay-001",
        amount: 425,
        method: "MTN Mobile Money",
        status: "COMPLETED",
        createdAt: daysAgo(7),
      },
      {
        id: "dep-002",
        paymentId: "pay-002",
        amount: 425,
        method: "MTN Mobile Money",
        status: "COMPLETED",
        createdAt: daysAgo(14),
      },
      {
        id: "dep-003",
        paymentId: "pay-003",
        amount: 425,
        method: "Telecel Cash",
        status: "COMPLETED",
        createdAt: daysAgo(21),
      },
      {
        id: "dep-004",
        paymentId: "pay-004",
        amount: 425,
        method: "MTN Mobile Money",
        status: "COMPLETED",
        createdAt: daysAgo(28),
      },
      {
        id: "dep-005",
        paymentId: "pay-005",
        amount: 425,
        method: "Telecel Cash",
        status: "COMPLETED",
        createdAt: daysAgo(35),
      },
    ],
  },
  "goal-002": {
    ...mockGoals[1],
    deposits: [
      {
        id: "dep-006",
        paymentId: "pay-006",
        amount: 850,
        method: "MTN Mobile Money",
        status: "COMPLETED",
        createdAt: daysAgo(14),
      },
      {
        id: "dep-007",
        paymentId: "pay-007",
        amount: 850,
        method: "Telecel Cash",
        status: "COMPLETED",
        createdAt: daysAgo(28),
      },
      {
        id: "dep-008",
        paymentId: "pay-008",
        amount: 850,
        method: "MTN Mobile Money",
        status: "COMPLETED",
        createdAt: daysAgo(42),
      },
    ],
  },
  "goal-003": {
    ...mockGoals[2],
    deposits: [],
  },
};

// ─── Mock Service Functions ──────────────────────────────────────────────────

/** Simulate network delay */
function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** GET /savings-goals */
export async function getSavingsGoals(): Promise<SavingsGoalsListResponse> {
  await delay();
  const items = [...mockGoals, ...dynamicGoals];
  return {
    items,
    page: 1,
    pageSize: 20,
    total: items.length,
  };
}

/** GET /savings-goals/:id */
export async function getSavingsGoalById(
  goalId: string
): Promise<SavingsGoalDetail> {
  await delay();
  const goal = [...mockGoals, ...dynamicGoals].find((g) => g.id === goalId);
  if (!goal) throw new Error("Goal not found");

  // Return detail version with deposits if available
  if (mockGoalDetails[goalId]) {
    return mockGoalDetails[goalId];
  }

  return {
    ...goal,
    deposits: [],
  };
}

/** POST /savings-goals */
export async function createSavingsGoal(
  _data: CreateSavingsGoalRequest
): Promise<SavingsGoal> {
  await delay(800);
  const goal: SavingsGoal = {
    id: `goal-${Date.now()}`,
    name: _data.name,
    productId: _data.productId,
    userId: "user-001",
    targetAmount: _data.targetAmount,
    currentAmount: 0,
    frequency: _data.frequency,
    status: "ACTIVE",
    estimatedCompletionDate: monthsFromNow(3),
    progress: 0,
    nextPaymentAmount: _data.monthlyAmount,
    monthlyAmount: _data.monthlyAmount,
    nextPaymentDate: daysFromNow(7),
    createdAt: new Date().toISOString(),
    product: {
      id: _data.productId || "unknown",
      name: _data.name || "New Product",
      price: _data.targetAmount,
      currency: "GHS",
      images: [],
    },
  };
  dynamicGoals.push(goal);
  return goal;
}

/** POST /savings-goals/:id/cancel */
export async function cancelSavingsGoal(
  goalId: string
): Promise<CancelGoalResponse> {
  await delay(800);
  const goal = [...mockGoals, ...dynamicGoals].find((g) => g.id === goalId);
  return {
    id: goalId,
    status: "CANCELLED",
    cancelledAt: new Date().toISOString(),
    refundEligible: true,
    refundableAmount: goal?.currentAmount ?? 0,
  };
}

/** POST /savings-goals/:id/pause */
export async function pauseSavingsGoal(goalId: string): Promise<{ id: string; status: string }> {
  await delay(400);
  return { id: goalId, status: "PAUSED" };
}

/** Get dashboard stats derived from goals */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(300);
  const all = [...mockGoals, ...dynamicGoals];
  const activeGoals = all.filter((g) => g.status === "ACTIVE");
  const totalSaved = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const nextPaymentDates = activeGoals
    .map((g) => g.nextPaymentDate)
    .filter(Boolean)
    .sort();

  return {
    totalSaved,
    activeGoals: activeGoals.length,
    completedGoals: all.filter((g) => g.status === "COMPLETED").length,
    nextPaymentDate: nextPaymentDates[0] ?? null,
  };
}
