// Payment Types — mirrors API response shapes

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type PaymentMethod = "MOMO_MTN" | "MOMO_TELECEL" | "MOMO_AT" | "CARD";

export type PaymentPurpose = "SAVINGS_DEPOSIT" | "REFUND";

// Payment record
export interface Payment {
  id: string;
  userId: string;
  externalReference?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  purpose: PaymentPurpose;
  savingsGoalId?: string;
  productName?: string;
  metadata?: {
    gateway?: string;
    authorization?: {
      channel: string;
      provider: string;
    };
  };
  createdAt: string;
  updatedAt?: string;
}

// Initiate payment request
export interface InitiatePaymentRequest {
  savingsGoalId: string;
  amount: number;
  method: PaymentMethod;
}

// Initiate payment response
export interface InitiatePaymentResponse {
  payment: Payment;
  gateway: {
    provider: string;
    redirectUrl: string;
    reference: string;
    expiresAt: string;
  };
}

// Payments list response (paginated)
export interface PaymentsListResponse {
  items: Payment[];
  page: number;
  pageSize: number;
  total: number;
}

// Saved payment method (for settings)
export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethod;
  label: string;
  number: string;
  isDefault: boolean;
  createdAt: string;
}

// Recent activity item (for dashboard)
export interface RecentActivity {
  id: string;
  description: string;
  date: string;
  amount?: number;
  type: "payment" | "goal_created" | "goal_completed" | "goal_cancelled";
}

