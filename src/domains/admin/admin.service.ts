/**
 * Admin Service Layer
 * Centralized data-fetching functions for all admin domains.
 * Backend-supported features use real API calls via admin.api.ts + transformers.
 * Features without backend support still use mock data.
 */

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

import * as api from "./admin.api";
import * as transform from "./admin.transformers";

// ── Helpers (for mock-only sections) ────────────────────────
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function paginate<T>(items: T[], params: PaginationParams): PaginatedResponse<T> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    let filtered = [...items];

    if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((item) =>
            JSON.stringify(item).toLowerCase().includes(q)
        );
    }

    const start = (page - 1) * pageSize;
    return {
        data: filtered.slice(start, start + pageSize),
        total: filtered.length,
        page,
        pageSize,
    };
}

// ═══════════════════════════════════
// DASHBOARD  ✅ CONNECTED TO BACKEND
// ═══════════════════════════════════
export async function fetchDashboardStats(): Promise<AdminDashboardStats> {
    const backendData = await api.getDashboardStats();
    return transform.transformDashboardStats(backendData);
}

// ═══════════════════════════════════
// USERS  ✅ CONNECTED TO BACKEND
// ═══════════════════════════════════
export async function fetchUsers(params: PaginationParams = {}): Promise<PaginatedResponse<AdminUserRow>> {
    const page = params.page || 1;
    const limit = params.pageSize || 10;

    // If search is active, use search endpoint
    if (params.search) {
        const result = await api.searchUsers(params.search, {
            role: undefined,
            kycStatus: params.status !== "All" ? params.status : undefined,
            page,
            limit,
        });
        return {
            data: result.users.map(transform.transformUserRow),
            total: result.pagination.total,
            page: result.pagination.page,
            pageSize: result.pagination.limit,
        };
    }

    const result = await api.listUsers(page, limit);
    let rows = result.users.map(transform.transformUserRow);

    // Client-side status filter (backend doesn't support status filter on list)
    if (params.status && params.status !== "All") {
        rows = rows.filter((u) => u.status === params.status);
    }

    return {
        data: rows,
        total: result.pagination.total,
        page: result.pagination.page,
        pageSize: result.pagination.limit,
    };
}

export async function fetchUserById(id: string): Promise<AdminUserDetail> {
    const backendDetail = await api.getUserDetail(id);
    return transform.transformUserDetail(backendDetail);
}

export async function updateUserStatus(id: string, status: "Active" | "Suspended"): Promise<void> {
    const suspend = status === "Suspended";
    await api.suspendUser(id, suspend);
}

// ═══════════════════════════════════
// MERCHANTS  ✅ CONNECTED TO BACKEND
// ═══════════════════════════════════
export async function fetchMerchants(params: PaginationParams = {}): Promise<PaginatedResponse<AdminMerchantRow>> {
    const merchants = await api.listMerchants();
    const rows = merchants.map((m, i) => transform.transformMerchantRow(m, i));

    // Client-side filtering & pagination (backend returns all)
    let filtered = [...rows];
    if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((m) =>
            m.businessName.toLowerCase().includes(q) ||
            m.owner.toLowerCase().includes(q)
        );
    }
    if (params.status && params.status !== "All") {
        filtered = filtered.filter((m) => m.status === params.status);
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;

    return {
        data: filtered.slice(start, start + pageSize),
        total: filtered.length,
        page,
        pageSize,
    };
}

export async function fetchMerchantById(id: string): Promise<AdminMerchantDetail> {
    // Backend doesn't have a single-merchant detail endpoint yet. 
    // Fetch from list and transform.
    const merchants = await api.listMerchants();
    const merchant = merchants.find((m) => m.id === id);
    if (!merchant) throw new Error("Merchant not found");
    return transform.transformMerchantDetail(merchant);
}

export async function updateMerchantStatus(id: string, status: "Active" | "Suspended"): Promise<void> {
    const isVerified = status === "Active";
    await api.verifyMerchant(id, isVerified);
}

export async function verifyKyc(id: string, status: "VERIFIED" | "FAILED", note?: string): Promise<void> {
    await api.verifyKyc(id, status, note);
}

// ═══════════════════════════════════
// PLANS  ✅ CONNECTED (Goals → Plans)
// ═══════════════════════════════════
export async function fetchPlans(params: PaginationParams = {}): Promise<PaginatedResponse<AdminPlanRow>> {
    // Fetch all users to get goals with user names
    const page = params.page || 1;
    const limit = params.pageSize || 10;

    // Use the transactions endpoint to get goal-related data
    // For now, we fetch users and extract goals from each
    const usersResult = await api.listUsers(1, 100); // Get a larger set
    const planRows: AdminPlanRow[] = [];

    for (const user of usersResult.users) {
        // Get user detail to access goals
        try {
            const detail = await api.getUserDetail(user.id);
            for (const goal of detail.goals) {
                planRows.push(transform.transformGoalToPlanRow(goal, user.name));
            }
        } catch {
            // Skip users we can't access
        }
    }

    // Client-side filtering
    let filtered = [...planRows];
    if (params.status && params.status !== "All") {
        filtered = filtered.filter((p) => p.status === params.status);
    }
    if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((p) =>
            p.user.toLowerCase().includes(q) ||
            p.product.toLowerCase().includes(q) ||
            p.planId.toLowerCase().includes(q)
        );
    }

    const start = (page - 1) * limit;
    return {
        data: filtered.slice(start, start + limit),
        total: filtered.length,
        page,
        pageSize: limit,
    };
}

export async function fetchPlanById(id: string): Promise<AdminPlanDetail> {
    // Find the goal across users
    const usersResult = await api.listUsers(1, 100);
    for (const user of usersResult.users) {
        try {
            const detail = await api.getUserDetail(user.id);
            const goal = detail.goals.find(g => g.id === id);
            if (goal) {
                const goalTxs = detail.transactions.filter(t => t.goalId === id);
                return transform.transformGoalToPlanDetail(
                    goal,
                    { Name: user.name, Email: user.email, Phone: user.phone || "—", Location: "Ghana" },
                    goalTxs
                );
            }
        } catch {
            continue;
        }
    }
    throw new Error("Plan not found");
}

// ═══════════════════════════════════
// PAYMENTS  ✅ CONNECTED TO BACKEND
// ═══════════════════════════════════
export async function fetchPayments(params: PaginationParams = {}): Promise<PaginatedResponse<AdminPaymentRow>> {
    const page = params.page || 1;
    const limit = params.pageSize || 10;

    // Map frontend status to backend status
    let statusFilter: string | undefined;
    if (params.status && params.status !== "All") {
        const statusMap: Record<string, string> = {
            "Completed": "COMPLETED",
            "Failed": "FAILED",
            "Refunded": "CANCELLED",
        };
        statusFilter = statusMap[params.status] || undefined;
    }

    const result = await api.listTransactions(page, limit, { status: statusFilter });
    const rows = result.transactions.map(transform.transformTransactionToPaymentRow);

    return {
        data: rows,
        total: result.pagination.total,
        page: result.pagination.page,
        pageSize: result.pagination.limit,
    };
}

export async function fetchPaymentById(id: string): Promise<AdminPaymentDetail> {
    // Fetch from transactions list to find the specific one
    const result = await api.listTransactions(1, 100);
    const tx = result.transactions.find(t => t.id === id);
    if (!tx) throw new Error("Payment not found");
    return transform.transformTransactionToPaymentDetail(tx);
}

// ═══════════════════════════════════
// DISPUTES  ⏳ MOCK (no backend yet)
// ═══════════════════════════════════
const MOCK_DISPUTES: AdminDisputeRow[] = [
    { id: "d1", disputeId: "DIS-2001", user: "Pearl Ena", merchant: "Pearl's Parlour", amount: "GH₵ 5,000", reason: "Product not received", status: "Escalated", priority: "High" },
    { id: "d2", disputeId: "DIS-2002", user: "Elsie Grey", merchant: "Tech Hub", amount: "GH₵ 3,200", reason: "Defective Item", status: "Resolved", priority: "Low" },
    { id: "d3", disputeId: "DIS-2003", user: "Eli White", merchant: "SNBL- 1240", amount: "GH₵ 1,500", reason: "Wrong Item Delivered", status: "In Review", priority: "Medium" },
    { id: "d4", disputeId: "DIS-2004", user: "Pearl Ena", merchant: "Pearl's Parlour", amount: "GH₵ 2,100", reason: "Product not received", status: "Escalated", priority: "High" },
    { id: "d5", disputeId: "DIS-2005", user: "Elsie Grey", merchant: "Tech Hub", amount: "GH₵ 800", reason: "Defective Item", status: "Resolved", priority: "Low" },
    { id: "d6", disputeId: "DIS-2006", user: "Eli White", merchant: "SNBL- 1240", amount: "GH₵ 4,500", reason: "Wrong Item Delivered", status: "In Review", priority: "Medium" },
    { id: "d7", disputeId: "DIS-2007", user: "Kofi Mensah", merchant: "GadgetWorld", amount: "GH₵ 6,000", reason: "Overcharged", status: "Rejected", priority: "Medium" },
];

export async function fetchDisputes(params: PaginationParams = {}): Promise<PaginatedResponse<AdminDisputeRow>> {
    await delay();
    let filtered = [...MOCK_DISPUTES];
    if (params.status && params.status !== "Open" && params.status !== "All") {
        filtered = filtered.filter((d) => d.status === params.status);
    }
    return paginate(filtered, params);
}

export async function fetchDisputeById(id: string): Promise<AdminDisputeDetail> {
    await delay();
    const row = MOCK_DISPUTES.find((d) => d.id === id) || MOCK_DISPUTES[0];
    return {
        id: row.id,
        disputeId: row.disputeId,
        disputeInfo: { "Filed By": row.user, "Against Merchant": row.merchant, "Savings Plan": "SNBL-1240", "Disputed Amount": row.amount, Reason: row.reason },
        userComplaint: "I ordered a laptop from TechHub Store and completed my SNBL plan on time. However, I never received the product. I've tried contacting the merchant multiple times without any response. I am requesting a full refund of " + row.amount + ".",
        merchantResponse: "The product was shipped on the expected date. We have tracking information showing delivery to the customer's address. This appears to be a case of customer error or potential fraud.",
        disputeStatus: { current: "Open", priority: row.priority, lastUpdated: "Two hours ago" },
        attachedDocuments: [{ name: "receipt_001.pdf" }, { name: "receipt_002.pdf" }],
    };
}

export async function resolveDispute(id: string, resolution: string): Promise<void> {
    await delay(500);
}

// ═══════════════════════════════════
// RISK  ⏳ MOCK (no backend yet)
// ═══════════════════════════════════
const MOCK_RISK_ENTITIES: AdminRiskEntity[] = [
    { name: "Pearl Ena", reason: "Multiple failed MoMo attempts", score: 70, status: "In Review" },
    { name: "TechHub", reason: "High refund ratio (18%)", score: 70, status: "Blocked" },
    { name: "Ray White", reason: "IP mismatch (Lagos vs Accra)", score: 70, status: "Blocked" },
    { name: "Pearl Ena", reason: "Multiple failed MoMo attempts", score: 70, status: "In Review" },
    { name: "Ray White", reason: "IP mismatch (Lagos vs Accra)", score: 70, status: "Blocked" },
];

export async function fetchRiskEntities(): Promise<AdminRiskEntity[]> {
    await delay();
    return MOCK_RISK_ENTITIES;
}

export async function fetchRiskEntityById(id: string): Promise<AdminRiskDetail> {
    await delay();
    return {
        id,
        name: "Kofi Mensah",
        flaggedOn: "Feb 10, 2026",
        riskScore: 78,
        riskLevel: "High Risk",
        flags: 3,
        activity: "24h",
        plans: 2,
        status: "Review",
        assignedTo: "Admin Team",
        reviewStatus: "Reviewing",
        profile: { email: "kofi@example.com", phone: "020000654", memberSince: "Jan 12, 2026", location: "Accra, Ghana", verificationStatus: "Verified" },
        riskFactors: [
            { title: "Multiple Failed Momo Attempts", description: "5 failed payment attempts in the last 48 hours", date: "10th Feb, 2026", severity: "High" },
            { title: "Multiple Failed Momo Attempts", description: "5 failed payment attempts in the last 48 hours", date: "10th Feb, 2026", severity: "Medium" },
            { title: "Multiple Failed Momo Attempts", description: "5 failed payment attempts in the last 48 hours", date: "10th Feb, 2026", severity: "Medium" },
            { title: "Multiple Failed Momo Attempts", description: "5 failed payment attempts in the last 48 hours", date: "10th Feb, 2026", severity: "Medium" },
        ],
    };
}

// ═══════════════════════════════════
// ANALYTICS  ⏳ MOCK (no backend yet)
// ═══════════════════════════════════
export async function fetchAnalytics(): Promise<AdminAnalyticsData> {
    await delay();
    return {
        summaryCards: [
            { label: "Total Revenue", value: "GH₵ 5M" },
            { label: "Total Users", value: "20,000" },
            { label: "Active Merchants", value: "500" },
            { label: "Total Saved", value: "GH₵ 3M" },
        ],
        revenueData: [
            { month: "Jan", savings: 5000, revenue: 7500 },
            { month: "Feb", savings: 4800, revenue: 5200 },
            { month: "Mar", savings: 3500, revenue: 5000 },
            { month: "Apr", savings: 4200, revenue: 6200 },
            { month: "May", savings: 4000, revenue: 5800 },
            { month: "Jun", savings: 3500, revenue: 5000 },
        ],
        barData: [
            { month: "Jan", merchants: 200, users: 2500 },
            { month: "Feb", merchants: 250, users: 4000 },
            { month: "Mar", merchants: 300, users: 6500 },
            { month: "Apr", merchants: 350, users: 7500 },
            { month: "May", merchants: 400, users: 9500 },
        ],
        pieSegments: [
            { label: "Active Plans", percentage: 66, color: "#22c55e" },
            { label: "Completed Plans", percentage: 25, color: "#3b82f6" },
            { label: "Defaulted", percentage: 7, color: "#ef4444" },
            { label: "Cancelled", percentage: 2, color: "#9ca3af" },
        ],
        funnelData: [
            { label: "Visitors", value: 10000, percentage: 100.0 },
            { label: "Signups", value: 3500, percentage: 35.0 },
            { label: "Verified", value: 2800, percentage: 28.0 },
            { label: "Plans Created", value: 2100, percentage: 21.0 },
            { label: "Active Savers", value: 1850, percentage: 18.5 },
        ],
        bottomMetrics: [
            { label: "Average Savings Plan Value", value: "GH₵ 5M", change: "+6.3% vs last month", changeColor: "text-green-500" },
            { label: "Default Rate", value: "7.5%", change: "+1.2% vs last month", changeColor: "text-red-500" },
            { label: "Refund Ratio", value: "8.5%", change: "2.1% vs last month", changeColor: "text-gray-400" },
        ],
    };
}

// ═══════════════════════════════════
// SYSTEM HEALTH  ⏳ MOCK (no backend yet)
// ═══════════════════════════════════
export async function fetchSystemHealth(): Promise<AdminSystemHealth> {
    await delay();
    return {
        cards: [
            { label: "API Availability", value: "99.99%", badge: "Healthy" },
            { label: "DB Connection", value: "8ms", badge: "Healthy" },
            { label: "Payment Gateway", value: "Active", badge: "Healthy" },
            { label: "Sync Latency", value: "1.2S", badge: "Optimal" },
        ],
        apiResponseData: [100, 110, 120, 140, 180, 220, 250, 260, 240, 200, 160, 120, 90, 70, 60, 50, 70, 100, 140, 180, 220, 260, 280, 260, 220, 180, 150, 140],
        cpuLoadData: [70, 65, 55, 45, 40, 42, 50, 55, 58, 55, 52, 55, 58, 55, 55, 58, 55, 55, 52, 55],
        ramUsageData: [35, 30, 32, 40, 50, 55, 58, 60, 65, 75, 80, 78, 65, 50, 30, 15, 25, 40, 50, 48],
        backgroundJobs: [
            { title: "KYC Process", items: [{ label: "Pending", value: 5, color: "text-blue-600" }, { label: "Processing", value: 12, color: "text-green-600" }, { label: "Failed", value: 0, color: "text-red-500" }] },
            { title: "Email Notifications", items: [{ label: "Pending", value: 140, color: "text-blue-600" }, { label: "Processing", value: 10, color: "text-green-600" }, { label: "Failed", value: 0, color: "text-red-500" }] },
            { title: "Payout Processing", items: [{ label: "Pending", value: 10, color: "text-blue-600" }, { label: "Processing", value: 11, color: "text-green-600" }, { label: "Failed", value: 0, color: "text-red-500" }] },
        ],
    };
}

// ═══════════════════════════════════
// ROLES  ⏳ MOCK (no backend yet)
// ═══════════════════════════════════
const MOCK_ROLES: AdminRole[] = [
    { id: "r1", name: "Super Admin", users: 2, permissions: ["Full System Access", "User Management", "Merchant Approval", "Financial Operations", "Risk Override", "System Configuration"] },
    { id: "r2", name: "Risk Officer", users: 5, permissions: ["Risk Assessment", "View All Users", "Flag Accounts", "View Reports", "Risk Override", "AML Screening"] },
    { id: "r3", name: "Compliance Officer", users: 2, permissions: ["KYC Review", "Document Verification", "Merchant Approval", "AML Screening", "View Reports", "Risk Assessment"] },
    { id: "r4", name: "Support Admin", users: 2, permissions: ["View Users", "View Disputes", "Send Notifications", "Chat Support", "View Reports", "Escalate Issues"] },
    { id: "r5", name: "Finance Admin", users: 2, permissions: ["View Payments", "Process Refunds", "View Analytics", "Financial Operations", "Generate Reports", "Transaction Audits"] },
    { id: "r6", name: "Super Admin", users: 2, permissions: ["Full System Access", "User Management", "Merchant Approval", "Financial Operations", "Risk Override", "System Configuration"] },
];

export async function fetchRoles(): Promise<AdminRole[]> {
    await delay();
    return MOCK_ROLES;
}

export async function createRole(name: string, permissions: string[]): Promise<AdminRole> {
    await delay(500);
    return { id: "r" + Date.now(), name, users: 0, permissions };
}

export async function updateRole(id: string, name: string, permissions: string[]): Promise<void> {
    await delay(500);
}

export async function deleteRole(id: string): Promise<void> {
    await delay(500);
}

// ═══════════════════════════════════
// AUDIT LOGS  ⏳ MOCK (DB model exists, no API endpoint yet)
// ═══════════════════════════════════
const MOCK_AUDIT_LOGS: AdminAuditLog[] = [
    { id: "a1", timestamp: "2024-02-10 14:35:22", adminName: "John Smith", adminRole: "Super Admin", action: "User Account Suspended", target: "Amina Okoro (USER-1240)", severity: "High score", status: "Success", ip: "102.89.23.45", sessionId: "sess_a8f3d2e1b9c4", details: "This action was performed as part of routine compliance review. The target account was flagged due to suspicious transaction patterns detected by the automated risk system. No further action required at this time." },
    { id: "a2", timestamp: "2024-02-10 14:20:11", adminName: "Sarah Johnson", adminRole: "Compliance Officer", action: "KYC Document Approved", target: "Kofi Mensah (USER-0892)", severity: "Low score", status: "Success", ip: "102.89.23.45", sessionId: "sess_b7e2c1d3a4f5", details: "KYC document verification completed. All submitted documents passed automated and manual review checks." },
    { id: "a3", timestamp: "2024-02-10 13:55:43", adminName: "Michael Chen", adminRole: "Finance Admin", action: "Refund Processed", target: "Transaction TXN-2024-003", severity: "High score", status: "Success", ip: "10.0.0.15", sessionId: "sess_c6d4e2f1b8a3", details: "Refund processed for disputed transaction. Amount credited back to customer's payment method." },
    { id: "a4", timestamp: "2024-02-10 13:12:08", adminName: "Emma Wilson", adminRole: "Risk Officer", action: "Account Flagged for Review", target: "John Doe (USER-5671)", severity: "Low score", status: "Success", ip: "10.0.0.22", sessionId: "sess_d5e3f1c2a7b6", details: "Account flagged for further review based on unusual login patterns and transaction activity." },
    { id: "a5", timestamp: "2024-02-10 12:45:30", adminName: "David Brown", adminRole: "Support Admin", action: "Password Reset Request", target: "Sarah Williams (USER-3421)", severity: "High score", status: "Success", ip: "192.168.1.1", sessionId: "sess_e4f2a1b3c6d5", details: "Password reset initiated at user's request. Identity verified through support channel." },
    { id: "a6", timestamp: "2024-02-10 11:30:15", adminName: "Sarah Johnson", adminRole: "Compliance Officer", action: "System Settings Changed", target: "SNBL Minimum Deposit Rate", severity: "Low score", status: "Success", ip: "102.89.23.45", sessionId: "sess_f3a1b2c4d5e6", details: "System settings updated for SNBL minimum deposit rate. Changes applied globally." },
];

export async function fetchAuditLogs(params: PaginationParams = {}): Promise<PaginatedResponse<AdminAuditLog>> {
    await delay();
    return paginate(MOCK_AUDIT_LOGS, params);
}

export async function fetchAuditLogById(id: string): Promise<AdminAuditLog> {
    await delay();
    return MOCK_AUDIT_LOGS.find((l) => l.id === id) || MOCK_AUDIT_LOGS[0];
}
