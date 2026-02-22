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
    estimatedCompletionDate: "2026-05-06",
    progress: 40,
    nextPaymentDate: "2026-02-05",
    nextPaymentAmount: 425,
    createdAt: "2025-11-15T12:00:00Z",
    updatedAt: "2026-01-22T10:00:00Z",
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
    estimatedCompletionDate: "2026-08-15",
    progress: 40,
    nextPaymentDate: "2026-02-05",
    nextPaymentAmount: 850,
    createdAt: "2025-12-01T12:00:00Z",
    updatedAt: "2026-01-18T10:00:00Z",
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
    frequency: "WEEKLY",
    status: "ACTIVE",
    estimatedCompletionDate: "2026-04-15",
    progress: 0,
    nextPaymentDate: "2026-02-05",
    nextPaymentAmount: 425,
    createdAt: "2026-01-15T12:00:00Z",
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
        createdAt: "2026-01-22T10:00:00Z",
      },
      {
        id: "dep-002",
        paymentId: "pay-002",
        amount: 425,
        method: "MTN Mobile Money",
        status: "COMPLETED",
        createdAt: "2026-01-15T10:00:00Z",
      },
      {
        id: "dep-003",
        paymentId: "pay-003",
        amount: 425,
        method: "Telecel Cash",
        status: "COMPLETED",
        createdAt: "2026-01-08T10:00:00Z",
      },
      {
        id: "dep-004",
        paymentId: "pay-004",
        amount: 425,
        method: "MTN Mobile Money",
        status: "COMPLETED",
        createdAt: "2026-01-01T10:00:00Z",
      },
      {
        id: "dep-005",
        paymentId: "pay-005",
        amount: 425,
        method: "Telecel Cash",
        status: "COMPLETED",
        createdAt: "2025-12-25T10:00:00Z",
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
        createdAt: "2026-01-18T10:00:00Z",
      },
      {
        id: "dep-007",
        paymentId: "pay-007",
        amount: 850,
        method: "Telecel Cash",
        status: "COMPLETED",
        createdAt: "2026-01-04T10:00:00Z",
      },
      {
        id: "dep-008",
        paymentId: "pay-008",
        amount: 850,
        method: "MTN Mobile Money",
        status: "COMPLETED",
        createdAt: "2025-12-21T10:00:00Z",
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
  return {
    items: mockGoals,
    page: 1,
    pageSize: 20,
    total: mockGoals.length,
  };
}

/** GET /savings-goals/:id */
export async function getSavingsGoalById(
  goalId: string
): Promise<SavingsGoalDetail> {
  await delay();
  const goal = mockGoals.find((g) => g.id === goalId);
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
  // Return a new mock goal
  return {
    id: `goal-${Date.now()}`,
    productId: _data.productId,
    userId: "user-001",
    targetAmount: _data.targetAmount,
    currentAmount: 0,
    frequency: _data.frequency,
    status: "ACTIVE",
    estimatedCompletionDate: "2026-08-01",
    progress: 0,
    createdAt: new Date().toISOString(),
    product: {
      id: _data.productId,
      name: "New Product",
      price: _data.targetAmount,
      currency: "GHS",
      images: [],
    },
  };
}

/** POST /savings-goals/:id/cancel */
export async function cancelSavingsGoal(
  goalId: string
): Promise<CancelGoalResponse> {
  await delay(800);
  const goal = mockGoals.find((g) => g.id === goalId);
  return {
    id: goalId,
    status: "CANCELLED",
    cancelledAt: new Date().toISOString(),
    refundEligible: true,
    refundableAmount: goal?.currentAmount ?? 0,
  };
}

/** Get dashboard stats derived from goals */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(300);
  const activeGoals = mockGoals.filter((g) => g.status === "ACTIVE");
  const totalSaved = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const nextPaymentDates = activeGoals
    .map((g) => g.nextPaymentDate)
    .filter(Boolean)
    .sort();

  return {
    totalSaved,
    activeGoals: activeGoals.length,
    completedGoals: 2,
    nextPaymentDate: nextPaymentDates[0] ?? null,
  };
}

