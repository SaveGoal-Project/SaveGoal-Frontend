/**
 * Admin Hooks
 * React hooks for all admin domains — wraps service functions
 * with loading, error, and refetch state management.
 */

import { useState, useEffect, useCallback } from "react";
import type {
  AdminUserRow,
  AdminUserDetail,
  AdminMerchantRow,
  AdminMerchantDetail,
  AdminPlanRow,
  AdminPlanDetail,
  AdminPaymentRow,
  AdminPaymentDetail,
  AdminDisputeRow,
  AdminDisputeDetail,
  AdminRiskEntity,
  AdminRiskDetail,
  AdminAnalyticsData,
  AdminSystemHealth,
  AdminRole,
  AdminAuditLog,
  AdminDashboardStats,
  PaginatedResponse,
  PaginationParams,
} from "./admin.types";
import * as service from "./admin.service";

// ── Generic hook factory ────────────────────────
function useAsync<T>(fetchFn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// ── Mutation hook factory ────────────────────────
function useMutation<TArgs extends unknown[], TResult = void>(
  mutationFn: (...args: TArgs) => Promise<TResult>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mutationFn(...args);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "An error occurred";
        setError(msg);
        throw new Error(msg); // Throw so caller can show exact error
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn]
  );

  return { mutate, isLoading, error };
}

// ═══════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════
export function useAdminDashboard() {
  return useAsync<AdminDashboardStats>(() => service.fetchDashboardStats());
}

// ═══════════════════════════════════
// USERS
// ═══════════════════════════════════
export function useAdminUsers(params: PaginationParams = {}) {
  return useAsync<PaginatedResponse<AdminUserRow>>(
    () => service.fetchUsers(params),
    [params.page, params.search, params.status]
  );
}

export function useAdminUserDetail(id: string) {
  return useAsync<AdminUserDetail>(() => service.fetchUserById(id), [id]);
}

export function useUpdateUserStatus() {
  return useMutation(service.updateUserStatus);
}

// ═══════════════════════════════════
// MERCHANTS
// ═══════════════════════════════════
export function useAdminMerchants(params: PaginationParams = {}) {
  return useAsync<PaginatedResponse<AdminMerchantRow>>(
    () => service.fetchMerchants(params),
    [params.page, params.search, params.status]
  );
}

export function useAdminMerchantDetail(id: string) {
  return useAsync<AdminMerchantDetail>(() => service.fetchMerchantById(id), [id]);
}

export function useUpdateMerchantStatus() {
  return useMutation(service.updateMerchantStatus);
}

// ═══════════════════════════════════
// PLANS
// ═══════════════════════════════════
export function useAdminPlans(params: PaginationParams = {}) {
  return useAsync<PaginatedResponse<AdminPlanRow>>(
    () => service.fetchPlans(params),
    [params.page, params.search, params.status]
  );
}

export function useAdminPlanDetail(id: string) {
  return useAsync<AdminPlanDetail>(() => service.fetchPlanById(id), [id]);
}

// ═══════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════
export function useAdminPayments(params: PaginationParams = {}) {
  return useAsync<PaginatedResponse<AdminPaymentRow>>(
    () => service.fetchPayments(params),
    [params.page, params.search, params.status]
  );
}

export function useAdminPaymentDetail(id: string) {
  return useAsync<AdminPaymentDetail>(() => service.fetchPaymentById(id), [id]);
}

// ═══════════════════════════════════
// DISPUTES
// ═══════════════════════════════════
export function useAdminDisputes(params: PaginationParams = {}) {
  return useAsync<PaginatedResponse<AdminDisputeRow>>(
    () => service.fetchDisputes(params),
    [params.page, params.search, params.status]
  );
}

export function useAdminDisputeDetail(id: string) {
  return useAsync<AdminDisputeDetail>(() => service.fetchDisputeById(id), [id]);
}

export function useResolveDispute() {
  return useMutation(service.resolveDispute);
}

// ═══════════════════════════════════
// RISK
// ═══════════════════════════════════
export function useAdminRiskEntities() {
  return useAsync<AdminRiskEntity[]>(() => service.fetchRiskEntities());
}

export function useAdminRiskDetail(id: string) {
  return useAsync<AdminRiskDetail>(() => service.fetchRiskEntityById(id), [id]);
}

// ═══════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════
export function useAdminAnalytics() {
  return useAsync<AdminAnalyticsData>(() => service.fetchAnalytics());
}

// ═══════════════════════════════════
// SYSTEM HEALTH
// ═══════════════════════════════════
export function useAdminSystemHealth() {
  return useAsync<AdminSystemHealth>(() => service.fetchSystemHealth());
}

// ═══════════════════════════════════
// ROLES
// ═══════════════════════════════════
export function useAdminRoles() {
  return useAsync<AdminRole[]>(() => service.fetchRoles());
}

export function useCreateRole() {
  return useMutation(service.createRole);
}

export function useUpdateRole() {
  return useMutation(service.updateRole);
}

export function useDeleteRole() {
  return useMutation(service.deleteRole);
}

// ═══════════════════════════════════
// AUDIT LOGS
// ═══════════════════════════════════
export function useAdminAuditLogs(params: PaginationParams = {}) {
  return useAsync<PaginatedResponse<AdminAuditLog>>(
    () => service.fetchAuditLogs(params),
    [params.page, params.search, params.status]
  );
}

export function useAdminAuditLogDetail(id: string) {
  return useAsync<AdminAuditLog>(() => service.fetchAuditLogById(id), [id]);
}

// ═══════════════════════════════════
// DASHBOARD LEGACY HOOKS
// ═══════════════════════════════════
import type { RecentActivityItem, RiskAlertItem } from "./admin.types.legacy";

async function fetchRecentActivity(): Promise<RecentActivityItem[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: "1", userInitial: "S", userName: "Sarah Williams", description: "New Merchant: TechHaven Ltd", timestamp: "Sarah Williams · 2 mins ago", status: "Success" },
    { id: "2", userInitial: "M", userName: "Michael Chen", description: "SNBL Plan Default Risk", timestamp: "Michael Chen · 15 mins ago", status: "Warning" },
    { id: "3", userInitial: "D", userName: "David Miller", description: "Failed Payment - Card Auth", timestamp: "David Miller · 1 hour ago", status: "Error" },
    { id: "4", userInitial: "A", userName: "Amina Okoro", description: "New KYC Submission", timestamp: "Amina Okoro · 2 hours ago", status: "Success" },
    { id: "5", userInitial: "P", userName: "Pearl Grey", description: "New Merchant: Pearl's Palour", timestamp: "Pearl Grey · 5mins ago", status: "Success" },
    { id: "6", userInitial: "J", userName: "James Wilson", description: "Large Withdrawal Flagged", timestamp: "James Wilson · 3 hours ago", status: "Success" },
  ];
}

async function fetchRiskAlerts(): Promise<RiskAlertItem[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: "1", message: "Suspicious payment pattern detected on 12 accounts in the Lagos region. Possible coordinated fraud.", severity: "high" },
    { id: "2", message: "Suspicious payment pattern detected on 12 accounts in the Lagos region. Possible coordinated fraud.", severity: "high" },
    { id: "3", message: "Suspicious payment pattern detected on 12 accounts in the Lagos region. Possible coordinated fraud.", severity: "medium" },
  ];
}

export function useAdminRecentActivity() {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity().then(setActivities).finally(() => setIsLoading(false));
  }, []);

  return { activities, isLoading };
}

export function useAdminRiskAlerts() {
  const [alerts, setAlerts] = useState<RiskAlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRiskAlerts().then(setAlerts).finally(() => setIsLoading(false));
  }, []);

  return { alerts, isLoading };
}

// ═══════════════════════════════════
// RE-EXPORTS
// ═══════════════════════════════════
export type { AdminDashboardStats } from "./admin.types";
export type { RecentActivityItem, RiskAlertItem } from "./admin.types.legacy";
