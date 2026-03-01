import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { AuthResponse } from "@/src/domains/auth/auth.types";
import type {
  AdminLoginRequest,
  BackendDashboardResponse,
  BackendActivityItem,
  BackendUserListResponse,
  BackendUserDetail,
  BackendUser,
  BackendMerchantProfile,
  BackendTransaction,
  BackendTransactionListResponse,
  BackendKycSubmission,
  BackendKycDetail,
  BackendKycListResponse,
  BackendPayout,
} from "./admin.types";

// ═══════════════════════════════════
// AUTH
// ═══════════════════════════════════

/**
 * Admin login - uses the shared email/signin endpoint, then verifies
 * the authenticated user holds the ADMIN role before returning.
 */
export async function adminLogin(
  credentials: AdminLoginRequest
): Promise<AuthResponse> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await apiClient.post<any>(
    API_ENDPOINTS.ADMIN.LOGIN,
    credentials,
    { skipAuth: true }
  );

  // ── Role guard: reject non-admin users at the frontend level ──
  const role = response.user?.role;
  if (role !== "ADMIN") {
    throw new Error(
      "Access denied. This account does not have admin privileges."
    );
  }

  // ── Map backend's unified "name" to firstName / lastName ──
  let firstName = "";
  let lastName = "";
  if (response.user?.name) {
    const parts = response.user.name.split(" ");
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  // ── Build the AuthResponse expected by AuthContext ──
  const authResponse: AuthResponse = {
    user: {
      ...response.user,
      firstName,
      lastName,
    },
    token: response.session?.token || response.token,
    refreshToken: response.session?.refreshToken || response.refreshToken,
  };

  return authResponse;
}

// ═══════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════

/** GET /api/admin/dashboard — Enhanced dashboard statistics */
export async function getDashboardStats(): Promise<BackendDashboardResponse> {
  return apiClient.get<BackendDashboardResponse>(API_ENDPOINTS.ADMIN.DASHBOARD);
}

/** GET /api/admin/activity — Recent system activity feed */
export async function getSystemActivity(
  limit: number = 30
): Promise<BackendActivityItem[]> {
  return apiClient.get<BackendActivityItem[]>(API_ENDPOINTS.ADMIN.ACTIVITY, {
    params: { limit },
  });
}

// ═══════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════

/** GET /api/admin/users — List all users (paginated) */
export async function listUsers(
  page: number = 1,
  limit: number = 20
): Promise<BackendUserListResponse> {
  return apiClient.get<BackendUserListResponse>(API_ENDPOINTS.ADMIN.USERS.LIST, {
    params: { page, limit },
  });
}

/** GET /api/admin/users/search — Search users with filters */
export async function searchUsers(
  query: string,
  filters?: { role?: string; kycStatus?: string; page?: number; limit?: number }
): Promise<BackendUserListResponse> {
  return apiClient.get<BackendUserListResponse>(API_ENDPOINTS.ADMIN.USERS.SEARCH, {
    params: {
      q: query,
      role: filters?.role,
      kycStatus: filters?.kycStatus,
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    },
  });
}

/** GET /api/admin/users/:id — Get detailed user profile */
export async function getUserDetail(id: string): Promise<BackendUserDetail> {
  return apiClient.get<BackendUserDetail>(API_ENDPOINTS.ADMIN.USERS.DETAILS(id));
}

/** PATCH /api/admin/users/:id/suspend — Suspend or unsuspend a user */
export async function suspendUser(
  id: string,
  suspend: boolean
): Promise<BackendUser> {
  return apiClient.patch<BackendUser>(API_ENDPOINTS.ADMIN.USERS.SUSPEND(id), {
    suspend,
  });
}

/** PATCH /api/admin/users/:id/role — Update user role */
export async function updateUserRole(
  id: string,
  role: "CONSUMER" | "MERCHANT" | "ADMIN"
): Promise<BackendUser> {
  return apiClient.patch<BackendUser>(API_ENDPOINTS.ADMIN.USERS.ROLE(id), {
    role,
  });
}

// ═══════════════════════════════════
// MERCHANT MANAGEMENT
// ═══════════════════════════════════

/** GET /api/admin/merchants — List all merchants */
export async function listMerchants(): Promise<BackendMerchantProfile[]> {
  return apiClient.get<BackendMerchantProfile[]>(
    API_ENDPOINTS.ADMIN.MERCHANTS.LIST
  );
}

/** PATCH /api/admin/merchants/:id/verify — Verify or reject merchant */
export async function verifyMerchant(
  id: string,
  isVerified: boolean
): Promise<BackendMerchantProfile> {
  return apiClient.patch<BackendMerchantProfile>(
    API_ENDPOINTS.ADMIN.MERCHANTS.VERIFY(id),
    { isVerified }
  );
}

// ═══════════════════════════════════
// KYC MANAGEMENT
// ═══════════════════════════════════

/** GET /api/admin/kyc/pending — List pending KYC submissions */
export async function listPendingKyc(): Promise<BackendKycSubmission[]> {
  return apiClient.get<BackendKycSubmission[]>(API_ENDPOINTS.ADMIN.KYC.PENDING);
}

/** GET /api/admin/kyc/all — List all KYC submissions with filter */
export async function listAllKyc(
  status?: string,
  page: number = 1,
  limit: number = 20
): Promise<BackendKycListResponse> {
  return apiClient.get<BackendKycListResponse>(API_ENDPOINTS.ADMIN.KYC.ALL, {
    params: { status, page, limit },
  });
}

/** GET /api/admin/kyc/:userId/detail — Get detailed KYC for review */
export async function getKycDetail(userId: string): Promise<BackendKycDetail> {
  return apiClient.get<BackendKycDetail>(API_ENDPOINTS.ADMIN.KYC.DETAIL(userId));
}

/** PATCH /api/admin/kyc/:userId/verify — Approve or decline KYC */
export async function verifyKyc(
  userId: string,
  status: "VERIFIED" | "FAILED",
  note?: string
): Promise<void> {
  await apiClient.patch(API_ENDPOINTS.ADMIN.KYC.VERIFY(userId), {
    status,
    note,
  });
}

/** PATCH /api/admin/kyc/:userId/selfie — Review selfie */
export async function reviewSelfie(
  userId: string,
  verified: boolean,
  matchScore?: number,
  note?: string
): Promise<void> {
  await apiClient.patch(API_ENDPOINTS.ADMIN.KYC.SELFIE(userId), {
    verified,
    matchScore,
    note,
  });
}

// ═══════════════════════════════════
// PAYOUTS
// ═══════════════════════════════════

/** GET /api/admin/payouts/pending — List pending merchant payouts */
export async function listPendingPayouts(): Promise<BackendPayout[]> {
  return apiClient.get<BackendPayout[]>(API_ENDPOINTS.ADMIN.PAYOUTS.PENDING);
}

/** PATCH /api/admin/payouts/:id/process — Approve or decline payout */
export async function processPayout(
  id: string,
  status: "COMPLETED" | "FAILED",
  note?: string
): Promise<BackendTransaction> {
  return apiClient.patch<BackendTransaction>(
    API_ENDPOINTS.ADMIN.PAYOUTS.PROCESS(id),
    { status, note }
  );
}

// ═══════════════════════════════════
// TRANSACTIONS
// ═══════════════════════════════════

/** GET /api/admin/transactions — List all system transactions */
export async function listTransactions(
  page: number = 1,
  limit: number = 50,
  filters?: { type?: string; status?: string }
): Promise<BackendTransactionListResponse> {
  return apiClient.get<BackendTransactionListResponse>(
    API_ENDPOINTS.ADMIN.TRANSACTIONS,
    {
      params: {
        page,
        limit,
        type: filters?.type,
        status: filters?.status,
      },
    }
  );
}
