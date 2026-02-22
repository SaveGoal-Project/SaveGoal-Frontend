// Savings Goal Types — mirrors API response shapes from savegoal-api-design-enhanced.md

export type GoalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED";

export type SavingsFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "FLEXIBLE";

// Product summary embedded in goal responses
export interface GoalProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  merchant?: {
    id: string;
    businessName: string;
  };
}

// Deposit record within a goal
export interface GoalDeposit {
  id: string;
  paymentId: string;
  amount: number;
  method: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: string;
}

// Savings Goal — list item shape
export interface SavingsGoal {
  id: string;
  productId: string;
  userId: string;
  targetAmount: number;
  currentAmount: number;
  frequency: SavingsFrequency;
  status: GoalStatus;
  estimatedCompletionDate: string;
  progress: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  createdAt: string;
  updatedAt?: string;
  product: GoalProduct;
}

// Savings Goal — detail shape (includes deposits)
export interface SavingsGoalDetail extends SavingsGoal {
  deposits: GoalDeposit[];
}

// Create goal request
export interface CreateSavingsGoalRequest {
  productId: string;
  targetAmount: number;
  frequency: SavingsFrequency;
}

// Cancel goal request
export interface CancelGoalRequest {
  reason?: string;
}

// Cancel goal response
export interface CancelGoalResponse {
  id: string;
  status: "CANCELLED";
  cancelledAt: string;
  refundEligible: boolean;
  refundableAmount: number;
}

// Complete goal response
export interface CompleteGoalResponse {
  id: string;
  status: "COMPLETED";
  completedAt: string;
  message: string;
}

// Goals list response (paginated)
export interface SavingsGoalsListResponse {
  items: SavingsGoal[];
  page: number;
  pageSize: number;
  total: number;
}

// Dashboard summary stats
export interface DashboardStats {
  totalSaved: number;
  activeGoals: number;
  completedGoals: number;
  nextPaymentDate: string | null;
}

