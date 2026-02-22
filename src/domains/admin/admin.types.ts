import { User } from "@/src/domains/auth/auth.types";

// ── Admin Auth ────────────────────────
export interface AdminLoginRequest {
  email: string;
  password: string;
}
export type AdminUser = User & { role: "ADMIN" };

// ── Pagination ────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Users ────────────────────────
export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  plans: number;
  savedAmount: string;
  status: "Active" | "Suspended" | "Pending";
  kycStatus: "Verified" | "Pending" | "Rejected";
  joined: string;
}

export interface AdminUserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  initial: string;
  location: string;
  joined: string;
  status: "Active" | "Suspended" | "Pending";
  kycStatus: "Verified" | "Pending" | "Rejected";
  kycVerified: boolean;
  totalSaved: string;
  activePlans: number;
  completedPlans: number;
  totalTransactions: number;
  personal: {
    fullName: string;
    phone: string;
    joinDate: string;
    email: string;
  };
  financial: {
    funds: string;
    status: string;
    joinDate: string;
    totalSavings: string;
  };
  savingsPlans: AdminUserSavingsPlan[];
  recentTransactions: AdminUserTransaction[];
}

export interface AdminUserSavingsPlan {
  id: string;
  product: string;
  target: string;
  goal: string;
  with: string;
  targetAmount: string;
  savedAmount: string;
  progress: number;
  status: string;
  nextPayment: string;
}

export interface AdminUserTransaction {
  id: string;
  type: string;
  amount: string;
  date: string;
  status: string;
  method: string;
}

// ── Merchants ────────────────────────
export interface AdminMerchantRow {
  id: string;
  businessName: string;
  owner: string;
  revenue: string;
  totalOrders: number;
  products: number;
  status: "Active" | "Pending" | "Suspended";
  rating: number;
  initial: string;
  initialColor: string;
}

export interface AdminMerchantDetail {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  initial: string;
  status: "Active" | "Pending" | "Suspended";
  kycStatus: "KYC Verified" | "Pending" | "Rejected";
  storeInfo: {
    businessName: string;
    fullName: string;
    address: string;
    landmark: string;
  };
  financialStatus: {
    totalEarned: string;
    totalWithdrawn: string;
    lastPayoutDate: string;
    status: string;
  };
  kycDocuments: { name: string; status: string; date: string }[];
}

// ── Plans ────────────────────────
export interface AdminPlanRow {
  id: string;
  planId: string;
  user: string;
  product: string;
  progressPercent: number;
  progressCurrent: number;
  progressTotal: number;
  nextPayment: string;
  status: "Active" | "Completed" | "Defaulted";
  type: "Individual" | "Group";
}

export interface AdminPlanDetail {
  id: string;
  planId: string;
  status: string;
  targetAmount: string;
  amountSaved: string;
  remaining: string;
  nextPayment: string;
  progressPercent: number;
  expectedDate: string;
  monthlyContribution: string;
  startDate: string;
  user: Record<string, string>;
  product: Record<string, string>;
  riskScore: string;
  paymentHistory: { date: string; amount: string; method: string; status: string }[];
}

// ── Payments ────────────────────────
export interface AdminPaymentRow {
  id: string;
  transactionId: string;
  user: string;
  plan: string;
  amount: string;
  date: string;
  status: "Completed" | "Refunded" | "Failed";
  method: string;
}

export interface AdminPaymentDetail {
  id: string;
  transactionId: string;
  amount: string;
  fee: string;
  nextAmount: string;
  status: string;
  userInfo: Record<string, string>;
  paymentDetails: Record<string, string>;
  savingsPlan: Record<string, string>;
  riskAnalysis: { score: string; checks: { label: string; status: string }[] };
  timeline: { label: string; time: string; status: string }[];
}

// ── Disputes ────────────────────────
export interface AdminDisputeRow {
  id: string;
  disputeId: string;
  user: string;
  merchant: string;
  amount: string;
  reason: string;
  status: "Escalated" | "Resolved" | "In Review" | "Rejected";
  priority: "High" | "Medium" | "Low";
}

export interface AdminDisputeDetail {
  id: string;
  disputeId: string;
  disputeInfo: Record<string, string>;
  userComplaint: string;
  merchantResponse: string;
  disputeStatus: { current: string; priority: string; lastUpdated: string };
  attachedDocuments: { name: string }[];
}

// ── Risk ────────────────────────
export interface AdminRiskEntity {
  name: string;
  reason: string;
  score: number;
  status: "In Review" | "Blocked";
}

export interface AdminRiskDetail {
  id: string;
  name: string;
  flaggedOn: string;
  riskScore: number;
  riskLevel: string;
  flags: number;
  activity: string;
  plans: number;
  status: string;
  assignedTo: string;
  reviewStatus: string;
  profile: Record<string, string>;
  riskFactors: { title: string; description: string; date: string; severity: "High" | "Medium" }[];
}

// ── Analytics ────────────────────────
export interface AdminAnalyticsData {
  summaryCards: { label: string; value: string }[];
  revenueData: { month: string; savings: number; revenue: number }[];
  barData: { month: string; merchants: number; users: number }[];
  pieSegments: { label: string; percentage: number; color: string }[];
  funnelData: { label: string; value: number; percentage: number }[];
  bottomMetrics: { label: string; value: string; change: string; changeColor: string }[];
}

// ── System Health ────────────────────────
export interface AdminSystemHealth {
  cards: { label: string; value: string; badge: string }[];
  apiResponseData: number[];
  cpuLoadData: number[];
  ramUsageData: number[];
  backgroundJobs: {
    title: string;
    items: { label: string; value: number; color: string }[];
  }[];
}

// ── Roles ────────────────────────
export interface AdminRole {
  id: string;
  name: string;
  users: number;
  permissions: string[];
}

export interface CreateRoleRequest {
  name: string;
  permissions: string[];
}

// ── Audit Logs ────────────────────────
export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: string;
  action: string;
  target: string;
  severity: "High score" | "Low score";
  status: "Success";
  ip: string;
  sessionId: string;
  details: string;
}

// ── Dashboard Summary ────────────────────────
export interface AdminDashboardStats {
  totalUsers: number;
  activeSavingsPlans: number;
  totalFundsSaved: number;
  pendingRefunds: number;
}
