// Mock data service for payments — mirrors exact API response shapes
// Swap imports from payment.mock → payment.api when backend is ready

import {
  Payment,
  PaymentsListResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  SavedPaymentMethod,
  RecentActivity,
} from "./payment.types";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockPayments: Payment[] = [
  {
    id: "pay-001",
    userId: "user-001",
    externalReference: "PSK-SAV-001-ABC",
    amount: 425,
    currency: "GHS",
    method: "MOMO_MTN",
    status: "SUCCESS",
    purpose: "SAVINGS_DEPOSIT",
    savingsGoalId: "goal-001",
    productName: "Sony PlayStation 5",
    createdAt: "2026-01-22T10:00:00Z",
    updatedAt: "2026-01-22T10:05:00Z",
  },
  {
    id: "pay-002",
    userId: "user-001",
    externalReference: "PSK-SAV-002-DEF",
    amount: 855,
    currency: "GHS",
    method: "MOMO_MTN",
    status: "SUCCESS",
    purpose: "SAVINGS_DEPOSIT",
    savingsGoalId: "goal-002",
    productName: "MacBook Air M2",
    createdAt: "2026-01-18T10:00:00Z",
    updatedAt: "2026-01-18T10:05:00Z",
  },
  {
    id: "pay-003",
    userId: "user-001",
    externalReference: "PSK-SAV-003-GHI",
    amount: 425,
    currency: "GHS",
    method: "MOMO_TELECEL",
    status: "SUCCESS",
    purpose: "SAVINGS_DEPOSIT",
    savingsGoalId: "goal-001",
    productName: "Sony PlayStation 5",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:05:00Z",
  },
  {
    id: "pay-004",
    userId: "user-001",
    externalReference: "PSK-SAV-004-JKL",
    amount: 425,
    currency: "GHS",
    method: "MOMO_MTN",
    status: "SUCCESS",
    purpose: "SAVINGS_DEPOSIT",
    savingsGoalId: "goal-001",
    productName: "Sony PlayStation 5",
    createdAt: "2026-01-08T10:00:00Z",
    updatedAt: "2026-01-08T10:05:00Z",
  },
  {
    id: "pay-005",
    userId: "user-001",
    externalReference: "PSK-SAV-005-MNO",
    amount: 425,
    currency: "GHS",
    method: "MOMO_TELECEL",
    status: "SUCCESS",
    purpose: "SAVINGS_DEPOSIT",
    savingsGoalId: "goal-001",
    productName: "Sony PlayStation 5",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:05:00Z",
  },
  {
    id: "pay-006",
    userId: "user-001",
    externalReference: "PSK-SAV-006-PQR",
    amount: 425,
    currency: "GHS",
    method: "MOMO_MTN",
    status: "SUCCESS",
    purpose: "SAVINGS_DEPOSIT",
    savingsGoalId: "goal-001",
    productName: "Sony PlayStation 5",
    createdAt: "2025-12-25T10:00:00Z",
    updatedAt: "2025-12-25T10:05:00Z",
  },
];

const mockSavedPaymentMethods: SavedPaymentMethod[] = [
  {
    id: "pm-001",
    type: "MOMO_MTN",
    label: "MTN Mobile Money",
    number: "0200000000",
    isDefault: true,
    createdAt: "2025-10-01T12:00:00Z",
  },
  {
    id: "pm-002",
    type: "MOMO_TELECEL",
    label: "Telecel Cash",
    number: "0200000000",
    isDefault: false,
    createdAt: "2025-11-01T12:00:00Z",
  },
  {
    id: "pm-003",
    type: "CARD",
    label: "Visa",
    number: "02 XXX XXXX XX",
    isDefault: false,
    createdAt: "2025-12-01T12:00:00Z",
  },
];

const mockRecentActivity: RecentActivity[] = [
  {
    id: "act-001",
    description: "Payment for Sony PlayStation 5",
    date: "2026-01-22T10:00:00Z",
    amount: 425,
    type: "payment",
  },
  {
    id: "act-002",
    description: "Payment for MacBook Air M2",
    date: "2026-01-18T10:00:00Z",
    amount: 855,
    type: "payment",
  },
  {
    id: "act-003",
    description: "Started Saving for Nike AirForce 1",
    date: "2026-01-15T12:00:00Z",
    type: "goal_created",
  },
];

// ─── Mock Service Functions ──────────────────────────────────────────────────

function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** GET /payments/history */
export async function getPaymentHistory(): Promise<PaymentsListResponse> {
  await delay();
  return {
    items: mockPayments,
    page: 1,
    pageSize: 20,
    total: mockPayments.length,
  };
}

/** GET /payments/:id */
export async function getPaymentById(paymentId: string): Promise<Payment> {
  await delay();
  const payment = mockPayments.find((p) => p.id === paymentId);
  if (!payment) throw new Error("Payment not found");
  return payment;
}

/** POST /payments/initiate */
export async function initiatePayment(
  data: InitiatePaymentRequest
): Promise<InitiatePaymentResponse> {
  await delay(1500); // Simulate gateway processing
  const newPayment: Payment = {
    id: `pay-${Date.now()}`,
    userId: "user-001",
    externalReference: `PSK-SAV-${Date.now()}`,
    amount: data.amount,
    currency: "GHS",
    method: data.method,
    status: "SUCCESS",
    purpose: "SAVINGS_DEPOSIT",
    savingsGoalId: data.savingsGoalId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return {
    payment: newPayment,
    gateway: {
      provider: "Paystack",
      redirectUrl: "https://checkout.paystack.com/mock",
      reference: newPayment.externalReference!,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  };
}

/** Get saved payment methods */
export async function getSavedPaymentMethods(): Promise<SavedPaymentMethod[]> {
  await delay(300);
  return mockSavedPaymentMethods;
}

/** Delete saved payment method */
export async function deletePaymentMethod(
  methodId: string
): Promise<{ success: boolean }> {
  await delay(300);
  return { success: true };
}

/** Set default payment method */
export async function setDefaultPaymentMethod(
  methodId: string
): Promise<{ success: boolean }> {
  await delay(300);
  return { success: true };
}

/** Get recent activity for dashboard */
export async function getRecentActivity(): Promise<RecentActivity[]> {
  await delay(300);
  return mockRecentActivity;
}

