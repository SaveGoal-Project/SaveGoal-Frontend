/**
 * Admin Service Layer
 * Centralized data-fetching functions for all admin domains.
 * Currently uses mock data; swap to real API calls when backend is ready.
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

// ── Helpers ────────────────────────
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
// DASHBOARD
// ═══════════════════════════════════
export async function fetchDashboardStats(): Promise<AdminDashboardStats> {
    await delay();
    return {
        totalUsers: 1400,
        activeSavingsPlans: 451400,
        totalFundsSaved: 50_000_000,
        pendingRefunds: 100,
    };
}

// ═══════════════════════════════════
// USERS
// ═══════════════════════════════════
const MOCK_USERS: AdminUserRow[] = [
    { id: "u1", name: "Amina Okoro", email: "amina@email.com", phone: "020 000 1234", plans: 3, savedAmount: "GH₵ 5,000", status: "Active", kycStatus: "Verified", joined: "Jan 12, 2026" },
    { id: "u2", name: "Kwame Asante", email: "kwame@email.com", phone: "024 555 6789", plans: 2, savedAmount: "GH₵ 3,200", status: "Active", kycStatus: "Verified", joined: "Feb 1, 2026" },
    { id: "u3", name: "Pearl Grey", email: "pearl@email.com", phone: "027 111 4567", plans: 1, savedAmount: "GH₵ 1,500", status: "Suspended", kycStatus: "Pending", joined: "Dec 15, 2025" },
    { id: "u4", name: "Samuel Adjei", email: "samuel@email.com", phone: "050 222 3344", plans: 4, savedAmount: "GH₵ 8,000", status: "Active", kycStatus: "Verified", joined: "Nov 5, 2025" },
    { id: "u5", name: "Elsie White", email: "elsie@email.com", phone: "020 333 5566", plans: 2, savedAmount: "GH₵ 2,800", status: "Active", kycStatus: "Rejected", joined: "Jan 20, 2026" },
    { id: "u6", name: "Kofi Mensah", email: "kofi@email.com", phone: "024 444 7788", plans: 1, savedAmount: "GH₵ 1,200", status: "Pending", kycStatus: "Pending", joined: "Feb 10, 2026" },
    { id: "u7", name: "Grace Owusu", email: "grace@email.com", phone: "027 555 9900", plans: 5, savedAmount: "GH₵ 12,000", status: "Active", kycStatus: "Verified", joined: "Oct 8, 2025" },
];

export async function fetchUsers(params: PaginationParams = {}): Promise<PaginatedResponse<AdminUserRow>> {
    await delay();
    let filtered = [...MOCK_USERS];
    if (params.status && params.status !== "All") {
        filtered = filtered.filter((u) => u.status === params.status);
    }
    return paginate(filtered, params);
}

export async function fetchUserById(id: string): Promise<AdminUserDetail> {
    await delay();
    const row = MOCK_USERS.find((u) => u.id === id) || MOCK_USERS[0];
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: "+233 24 000 0000",
        initial: row.name.charAt(0),
        location: "Accra, Ghana",
        joined: row.joined,
        status: row.status,
        kycStatus: row.kycStatus,
        kycVerified: row.kycStatus === "Verified",
        totalSaved: row.savedAmount,
        activePlans: row.plans,
        completedPlans: 2,
        totalTransactions: 24,
        personal: {
            fullName: row.name,
            phone: "+233 24 000 0000",
            joinDate: row.joined,
            email: row.email,
        },
        financial: {
            funds: row.savedAmount,
            status: "Dependable",
            joinDate: row.joined,
            totalSavings: row.savedAmount,
        },
        savingsPlans: [
            { id: "sp1", product: "iPhone 15 Pro", target: "GHS 5,000", goal: "GHS 3,800", with: "60%", targetAmount: "GH\u20b5 8,000", savedAmount: "GH\u20b5 5,000", progress: 60, status: "On Track", nextPayment: "Mar 1, 2026" },
            { id: "sp2", product: "MacBook Air M3", target: "GHS 12,000", goal: "GHS 3,600", with: "30%", targetAmount: "GH\u20b5 12,000", savedAmount: "GH\u20b5 3,600", progress: 30, status: "Behind", nextPayment: "Mar 5, 2026" },
            { id: "sp3", product: "Galaxy S24 Plus", target: "GHS 4,800", goal: "GHS 3,500", with: "72%", targetAmount: "GH\u20b5 4,800", savedAmount: "GH\u20b5 3,500", progress: 72, status: "On Track", nextPayment: "Mar 10, 2026" },
            { id: "sp4", product: "iPhone 14", target: "GHS 3,800", goal: "GHS 3,200", with: "85%", targetAmount: "GH\u20b5 3,800", savedAmount: "GH\u20b5 3,200", progress: 85, status: "On Track", nextPayment: "Mar 15, 2026" },
            { id: "sp5", product: "Phone 1 Ultra", target: "GHS 4,800", goal: "GHS 4,800", with: "100%", targetAmount: "GH\u20b5 4,800", savedAmount: "GH\u20b5 4,800", progress: 100, status: "Completed", nextPayment: "N/A" },
        ],
        recentTransactions: [
            { id: "t1", type: "Deposit", amount: "GH\u20b5 500", date: "Feb 20, 2026", status: "Success", method: "Mobile Money" },
            { id: "t2", type: "Deposit", amount: "GH\u20b5 500", date: "Feb 15, 2026", status: "Success", method: "Mobile Money" },
            { id: "t3", type: "Withdrawal", amount: "GH\u20b5 200", date: "Feb 10, 2026", status: "Success", method: "Bank Transfer" },
        ],
    };
}

export async function updateUserStatus(id: string, status: "Active" | "Suspended"): Promise<void> {
    await delay(500);
    // Mock: In production, this would call the API
}

// ═══════════════════════════════════
// MERCHANTS
// ═══════════════════════════════════
const MOCK_MERCHANTS: AdminMerchantRow[] = [
    { id: "m1", businessName: "TechHaven Ltd", owner: "Pearl Grey", revenue: "GH₵ 15,000", totalOrders: 1200, products: 48, status: "Active", rating: 4.8, initial: "T", initialColor: "bg-blue-500" },
    { id: "m2", businessName: "GadgetWorld GH", owner: "Grace Owusu", revenue: "GH₵ 12,000", totalOrders: 890, products: 35, status: "Active", rating: 4.5, initial: "G", initialColor: "bg-green-500" },
    { id: "m3", businessName: "PhoneFix Pro", owner: "Kwame Adjei", revenue: "GH₵ 8,500", totalOrders: 560, products: 22, status: "Pending", rating: 4.2, initial: "P", initialColor: "bg-purple-500" },
    { id: "m4", businessName: "Pearl's Parlour", owner: "Pearl Ena", revenue: "GH₵ 6,200", totalOrders: 340, products: 15, status: "Active", rating: 4.0, initial: "P", initialColor: "bg-amber-500" },
];

export async function fetchMerchants(params: PaginationParams = {}): Promise<PaginatedResponse<AdminMerchantRow>> {
    await delay();
    return paginate(MOCK_MERCHANTS, params);
}

export async function fetchMerchantById(id: string): Promise<AdminMerchantDetail> {
    await delay();
    const row = MOCK_MERCHANTS.find((m) => m.id === id) || MOCK_MERCHANTS[0];
    return {
        id: row.id,
        name: row.owner,
        businessName: row.businessName,
        email: "contact@" + row.businessName.toLowerCase().replace(/\s/g, "") + ".com",
        phone: "0200798766",
        initial: row.initial,
        status: row.status,
        kycStatus: "KYC Verified",
        storeInfo: {
            businessName: row.businessName,
            fullName: row.owner,
            address: "Tema Com. 16",
            landmark: "Tema Habour",
        },
        financialStatus: {
            totalEarned: "GHS 90,000",
            totalWithdrawn: "GHS 50,000",
            lastPayoutDate: "Jan 16, 2026",
            status: "Active",
        },
        kycDocuments: [
            { name: "National ID (Front)", status: "Verified", date: "Jan 20, 2026" },
            { name: "National ID (Back)", status: "Verified", date: "Jan 20, 2026" },
            { name: "Selfie Verification", status: "Verified", date: "Jan 20, 2026" },
        ],
    };
}

export async function updateMerchantStatus(id: string, status: "Active" | "Suspended"): Promise<void> {
    await delay(500);
}

// ═══════════════════════════════════
// PLANS
// ═══════════════════════════════════
const MOCK_PLANS: AdminPlanRow[] = [
    { id: "p1", planId: "SNBL-1240", user: "Pearl Ena", product: "iPhone 15 Pro", progressPercent: 75, progressCurrent: 6, progressTotal: 8, nextPayment: "Mar 1, 2026", status: "Active", type: "Individual" },
    { id: "p2", planId: "SNBL-1241", user: "Elsie Grey", product: "MacBook Air M3", progressPercent: 45, progressCurrent: 3, progressTotal: 6, nextPayment: "Mar 5, 2026", status: "Active", type: "Individual" },
    { id: "p3", planId: "SNBL-1242", user: "Eli White", product: "Samsung Galaxy S24", progressPercent: 100, progressCurrent: 10, progressTotal: 10, nextPayment: "—", status: "Completed", type: "Group" },
    { id: "p4", planId: "SNBL-1243", user: "Kofi Mensah", product: "AirPods Pro", progressPercent: 20, progressCurrent: 1, progressTotal: 5, nextPayment: "Mar 10, 2026", status: "Active", type: "Individual" },
    { id: "p5", planId: "SNBL-1244", user: "Amina Okoro", product: "PlayStation 5", progressPercent: 10, progressCurrent: 1, progressTotal: 8, nextPayment: "Mar 15, 2026", status: "Defaulted", type: "Individual" },
    { id: "p6", planId: "SNBL-1245", user: "Grace Owusu", product: "Dell XPS 15", progressPercent: 60, progressCurrent: 3, progressTotal: 5, nextPayment: "Mar 3, 2026", status: "Active", type: "Group" },
    { id: "p7", planId: "SNBL-1246", user: "Samuel Adjei", product: "iPad Pro M4", progressPercent: 90, progressCurrent: 9, progressTotal: 10, nextPayment: "Mar 20, 2026", status: "Active", type: "Individual" },
];

export async function fetchPlans(params: PaginationParams = {}): Promise<PaginatedResponse<AdminPlanRow>> {
    await delay();
    let filtered = [...MOCK_PLANS];
    if (params.status && params.status !== "All") {
        filtered = filtered.filter((p) => p.status === params.status);
    }
    return paginate(filtered, params);
}

export async function fetchPlanById(id: string): Promise<AdminPlanDetail> {
    await delay();
    const row = MOCK_PLANS.find((p) => p.id === id) || MOCK_PLANS[0];
    return {
        id: row.id,
        planId: row.planId,
        status: row.status,
        targetAmount: "GH₵ 8,000",
        amountSaved: "GH₵ 5,000",
        remaining: "GH₵ 3,000",
        nextPayment: row.nextPayment,
        progressPercent: row.progressPercent,
        expectedDate: "June 15, 2026",
        monthlyContribution: "GH₵ 1,000",
        startDate: "Jan 15, 2026",
        user: { Name: row.user, Email: "user@email.com", Phone: "020 000 1234", Location: "Accra, Ghana" },
        product: { Name: row.product, Price: "GH₵ 8,000", Merchant: "TechHaven Ltd" },
        riskScore: "Low",
        paymentHistory: [
            { date: "Feb 15, 2026", amount: "GH₵ 1,000", method: "Mobile Money", status: "Success" },
            { date: "Jan 15, 2026", amount: "GH₵ 1,000", method: "Mobile Money", status: "Success" },
        ],
    };
}

// ═══════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════
const MOCK_PAYMENTS: AdminPaymentRow[] = [
    { id: "pay1", transactionId: "TXN-2001", user: "Pearl Ena", plan: "SNBL-1240", amount: "GH₵ 5,000", date: "Feb 20, 2024", status: "Completed", method: "Mobile Money" },
    { id: "pay2", transactionId: "TXN-2002", user: "Elsie Grey", plan: "SNBL-1241", amount: "GH₵ 3,200", date: "Feb 19, 2024", status: "Completed", method: "Bank Transfer" },
    { id: "pay3", transactionId: "TXN-2003", user: "Eli White", plan: "SNBL-1242", amount: "GH₵ 1,500", date: "Feb 18, 2024", status: "Refunded", method: "Mobile Money" },
    { id: "pay4", transactionId: "TXN-2004", user: "Kofi Mensah", plan: "SNBL-1243", amount: "GH₵ 800", date: "Feb 17, 2024", status: "Failed", method: "Card" },
    { id: "pay5", transactionId: "TXN-2005", user: "Amina Okoro", plan: "SNBL-1244", amount: "GH₵ 2,100", date: "Feb 16, 2024", status: "Completed", method: "Mobile Money" },
    { id: "pay6", transactionId: "TXN-2006", user: "Grace Owusu", plan: "SNBL-1245", amount: "GH₵ 4,500", date: "Feb 15, 2024", status: "Completed", method: "Bank Transfer" },
    { id: "pay7", transactionId: "TXN-2007", user: "Samuel Adjei", plan: "SNBL-1246", amount: "GH₵ 6,000", date: "Feb 14, 2024", status: "Completed", method: "Mobile Money" },
];

export async function fetchPayments(params: PaginationParams = {}): Promise<PaginatedResponse<AdminPaymentRow>> {
    await delay();
    let filtered = [...MOCK_PAYMENTS];
    if (params.status && params.status !== "All") {
        filtered = filtered.filter((p) => p.status === params.status);
    }
    return paginate(filtered, params);
}

export async function fetchPaymentById(id: string): Promise<AdminPaymentDetail> {
    await delay();
    const row = MOCK_PAYMENTS.find((p) => p.id === id) || MOCK_PAYMENTS[0];
    return {
        id: row.id,
        transactionId: row.transactionId,
        amount: row.amount,
        fee: "GH₵ 50",
        nextAmount: "GH₵ 1,000",
        status: row.status,
        userInfo: { Name: row.user, Email: "user@email.com", Phone: "020 000 1234", Plan: row.plan },
        paymentDetails: { Method: row.method, Provider: "MTN Mobile Money", Account: "020****1234", Reference: row.transactionId, IP: "102.89.23.45", Location: "Accra, Ghana", Device: "iPhone 15" },
        savingsPlan: { "Plan ID": row.plan, Product: "iPhone 15 Pro", Progress: "75%", "Next Date": "Mar 1, 2026" },
        riskAnalysis: { score: "Low", checks: [{ label: "Identity Verified", status: "Passed" }, { label: "Amount Threshold", status: "Passed" }, { label: "Velocity Check", status: "Passed" }] },
        timeline: [
            { label: "Payment Initiated", time: row.date + " 10:00", status: "completed" },
            { label: "Processing", time: row.date + " 10:01", status: "completed" },
            { label: "Verified", time: row.date + " 10:02", status: "completed" },
            { label: "Completed", time: row.date + " 10:03", status: "completed" },
        ],
    };
}

// ═══════════════════════════════════
// DISPUTES
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
// RISK
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
// ANALYTICS
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
// SYSTEM HEALTH
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
// ROLES
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
// AUDIT LOGS
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
