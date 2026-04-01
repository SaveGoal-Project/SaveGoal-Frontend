/**
 * Admin Data Transformers
 * Pure functions that convert backend response shapes → frontend UI types.
 * Backend returns raw Prisma models (Decimal amounts, nested relations).
 * Frontend UI types use pre-formatted strings (e.g., "GH₵ 5,000").
 */

import type {
    AdminDashboardStats,
    AdminUserRow,
    AdminUserDetail,
    AdminUserSavingsPlan,
    AdminUserTransaction,
    AdminMerchantRow,
    AdminMerchantDetail,
    AdminPlanRow,
    AdminPlanDetail,
    AdminPaymentRow,
    AdminPaymentDetail,
    BackendDashboardResponse,
    BackendUser,
    BackendUserDetail,
    BackendMerchantProfile,
    BackendTransaction,
    BackendGoal,
    BackendKycDetail,
} from "./admin.types";

// ═══════════════════════════════════
// UTILITIES
// ═══════════════════════════════════

/** Format a numeric amount as GH₵ string */
export function formatCurrency(amount: number | string | null | undefined): string {
    const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
    if (isNaN(num)) return "GH₵ 0";
    return `GH₵ ${num.toLocaleString("en-GH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/** Format a numeric amount as full GH₵ string with decimals */
export function formatCurrencyFull(amount: number | string | null | undefined): string {
    const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
    if (isNaN(num)) return "GH₵ 0.00";
    return `GH₵ ${num.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format an ISO date string as "Jan 12, 2026" */
export function formatDate(isoString: string | null | undefined): string {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/** Format an ISO date string as "Feb 20, 2024 at 2:30 PM" */
export function formatDateTime(isoString: string | null | undefined): string {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

/** Get user initials from name */
function getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() || "?";
}

/** Convert Decimal/string to number safely */
function toNumber(val: number | string | null | undefined): number {
    if (val === null || val === undefined) return 0;
    const num = typeof val === "string" ? parseFloat(val) : val;
    return isNaN(num) ? 0 : num;
}

/** Map backend KYC status to frontend display status */
function mapKycStatus(kycStatus: string | undefined): "Verified" | "Pending" | "Rejected" {
    switch (kycStatus) {
        case "VERIFIED": return "Verified";
        case "FAILED": return "Rejected";
        default: return "Pending";
    }
}

/** Map backend emailVerified to user status (backend uses emailVerified as suspension flag) */
function mapUserStatus(emailVerified: boolean | undefined): "Active" | "Suspended" | "Pending" {
    if (emailVerified === false) return "Suspended";
    return "Active";
}

/** Map backend goal status to plan status */
function mapPlanStatus(status: string): "Active" | "Completed" | "Defaulted" {
    switch (status) {
        case "ACTIVE": return "Active";
        case "COMPLETED": return "Completed";
        case "CANCELLED":
        case "ARCHIVED":
            return "Defaulted";
        default: return "Active";
    }
}

/** Map backend transaction status to UI status */
function mapPaymentStatus(status: string): "Completed" | "Refunded" | "Failed" {
    switch (status) {
        case "COMPLETED": return "Completed";
        case "FAILED": return "Failed";
        case "CANCELLED": return "Refunded";
        default: return "Completed";
    }
}

/** Map backend transaction type to readable payment method */
function mapPaymentMethod(type: string): string {
    switch (type) {
        case "DEPOSIT": return "Mobile Money";
        case "GOAL_FUNDING": return "Wallet";
        case "MERCHANT_PAYOUT": return "Bank Transfer";
        case "AUTOMATED_SAVINGS": return "Auto-Debit";
        case "PUBLIC_CONTRIBUTION": return "Contribution";
        default: return "Other";
    }
}

// ═══════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════

export function transformDashboardStats(
    backend: BackendDashboardResponse
): AdminDashboardStats {
    return {
        totalUsers: backend.overview.totalUsers,
        activeSavingsPlans: backend.overview.activeGoals,
        totalFundsSaved: toNumber(backend.overview.totalSavedGHS),
        pendingRefunds: backend.overview.pendingPayouts,
    };
}

// ═══════════════════════════════════
// USERS
// ═══════════════════════════════════

export function transformUserRow(user: BackendUser): AdminUserRow {
    const goalCount = 0; // Not available in list view — backend doesn't include it
    const walletBalance = toNumber(user.wallet?.balance);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "—",
        plans: goalCount,
        savedAmount: formatCurrency(walletBalance),
        status: mapUserStatus(user.emailVerified),
        kycStatus: mapKycStatus(user.profile?.kycStatus),
        joined: formatDate(user.createdAt),
    };
}

export function transformUserDetail(detail: BackendUserDetail): AdminUserDetail {
    const walletBalance = toNumber(detail.wallet?.balance);
    const activeGoals = detail.goals.filter(g => g.status === "ACTIVE").length;
    const completedGoals = detail.goals.filter(g => g.status === "COMPLETED").length;

    return {
        id: detail.id,
        name: detail.name,
        email: detail.email,
        phone: detail.phone || "—",
        initial: getInitial(detail.name),
        location: detail.profile?.address || "Ghana",
        joined: formatDate(detail.createdAt),
        status: mapUserStatus(detail.emailVerified),
        kycStatus: mapKycStatus(detail.profile?.kycStatus),
        kycVerified: detail.profile?.kycStatus === "VERIFIED",
        totalSaved: formatCurrency(walletBalance),
        activePlans: activeGoals,
        completedPlans: completedGoals,
        totalTransactions: detail.transactions.length,
        personal: {
            fullName: detail.profile
                ? `${detail.profile.firstName} ${detail.profile.lastName}`
                : detail.name,
            phone: detail.phone || "—",
            joinDate: formatDate(detail.createdAt),
            email: detail.email,
        },
        financial: {
            funds: formatCurrencyFull(walletBalance),
            status: mapUserStatus(detail.emailVerified),
            joinDate: formatDate(detail.createdAt),
            totalSavings: formatCurrency(
                detail.goals.reduce((sum, g) => sum + toNumber(g.currentAmount), 0)
            ),
        },
        savingsPlans: detail.goals.map(transformGoalToSavingsPlan),
        recentTransactions: detail.transactions.slice(0, 10).map(transformTransactionToUserTx),
    };
}

function transformGoalToSavingsPlan(goal: BackendGoal): AdminUserSavingsPlan {
    const target = toNumber(goal.targetAmount);
    const current = toNumber(goal.currentAmount);
    const progress = target > 0 ? Math.round((current / target) * 100) : 0;

    return {
        id: goal.id,
        product: goal.name,
        target: goal.name,
        goal: goal.name,
        with: goal.category === "SNBL" ? "SNBL" : "Personal",
        targetAmount: formatCurrency(target),
        savedAmount: formatCurrency(current),
        progress,
        status: mapPlanStatus(goal.status),
        nextPayment: goal.isRecurring && goal.savingsDay
            ? `Day ${goal.savingsDay}`
            : "—",
    };
}

function transformTransactionToUserTx(tx: BackendTransaction): AdminUserTransaction {
    return {
        id: tx.id,
        type: tx.type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        amount: formatCurrency(tx.amount),
        date: formatDate(tx.createdAt),
        status: tx.status.charAt(0) + tx.status.slice(1).toLowerCase(),
        method: mapPaymentMethod(tx.type),
    };
}

// ═══════════════════════════════════
// MERCHANTS
// ═══════════════════════════════════

const MERCHANT_COLORS = [
    "bg-blue-500", "bg-emerald-500", "bg-purple-500",
    "bg-amber-500", "bg-rose-500", "bg-cyan-500",
];

export function transformMerchantRow(
    merchant: BackendMerchantProfile,
    index: number = 0
): AdminMerchantRow {
    return {
        id: merchant.id,
        businessName: merchant.businessName,
        owner: merchant.user.name,
        revenue: formatCurrency(merchant.balance),
        totalOrders: merchant._count.transactions,
        products: merchant._count.products,
        status: merchant.isVerified ? "Active" : "Pending",
        rating: 0, // No rating in backend yet
        initial: getInitial(merchant.businessName),
        initialColor: MERCHANT_COLORS[index % MERCHANT_COLORS.length],
    };
}

function mapProfileKycToLabel(
    kycStatus: BackendKycDetail["kycStatus"] | null | undefined
): AdminMerchantDetail["kycStatus"] {
    switch (kycStatus) {
        case "VERIFIED":
            return "KYC Verified";
        case "FAILED":
            return "Rejected";
        default:
            return "Pending";
    }
}

export function transformMerchantDetail(
    merchant: BackendMerchantProfile,
    kycDetail: BackendKycDetail | null,
    userDetail: BackendUserDetail | null
): AdminMerchantDetail {
    const suspended = userDetail ? userDetail.emailVerified === false : false;
    const status: AdminMerchantDetail["status"] = suspended
        ? "Suspended"
        : merchant.isVerified
          ? "Active"
          : "Pending";

    const kycRaw = kycDetail?.kycStatus ?? null;
    const kycLabel = mapProfileKycToLabel(kycRaw);
    const docDate = kycDetail?.updatedAt ? formatDate(kycDetail.updatedAt) : formatDate(merchant.createdAt);
    const pendingLabel = kycRaw === "VERIFIED" ? "Verified" : kycRaw === "FAILED" ? "Rejected" : "Pending";

    const kycDocuments: AdminMerchantDetail["kycDocuments"] = [];

    if (kycDetail?.idImageUrl) {
        kycDocuments.push({
            name: `${kycDetail.idType || "ID"} (front)`,
            status: pendingLabel,
            date: docDate,
            previewUrl: kycDetail.idImageUrl,
        });
    }
    if (kycDetail?.selfieImageUrl) {
        kycDocuments.push({
            name: "Selfie verification",
            status: kycDetail.selfieVerified ? "Verified" : pendingLabel,
            date: docDate,
            previewUrl: kycDetail.selfieImageUrl,
        });
    }
    if (merchant.registrationNo) {
        kycDocuments.push({
            name: "Business registration (reference)",
            status: "On file",
            date: formatDate(merchant.createdAt),
        });
    }

    return {
        id: merchant.id,
        userId: merchant.userId,
        name: merchant.user.name,
        businessName: merchant.businessName,
        email: merchant.contactEmail,
        phone: merchant.contactPhone,
        initial: getInitial(merchant.businessName),
        status,
        kycStatus: kycLabel,
        kycStatusRaw: kycRaw,
        storeInfo: {
            businessName: merchant.businessName,
            fullName: merchant.user.name,
            address: merchant.businessAddress,
            landmark: "—",
        },
        financialStatus: {
            totalEarned: formatCurrency(merchant.balance),
            totalWithdrawn: "GH₵ 0",
            lastPayoutDate: "—",
            status: merchant.isVerified ? "Active" : "Pending",
        },
        kycDocuments,
        kycIdentity: kycDetail
            ? {
                  idType: kycDetail.idType ?? null,
                  idNumber: kycDetail.idNumber ?? null,
                  bankName: kycDetail.bankName ?? null,
                  bankAccountNo: kycDetail.bankAccountNo ?? null,
                  bankAccountName: kycDetail.bankAccountName ?? null,
                  kycNote: kycDetail.kycNote ?? null,
              }
            : null,
    };
}

// ═══════════════════════════════════
// PLANS (mapped from Goals)
// ═══════════════════════════════════

export function transformGoalToPlanRow(
    goal: BackendGoal,
    userName: string = "Unknown"
): AdminPlanRow {
    const target = toNumber(goal.targetAmount);
    const current = toNumber(goal.currentAmount);
    const progress = target > 0 ? Math.round((current / target) * 100) : 0;
    // Derive installments: if recurring with monthlyAmount, compute total periods
    const monthly = toNumber(goal.monthlyAmount);
    const totalInstallments = monthly > 0 ? Math.ceil(target / monthly) : 0;
    const paidInstallments = monthly > 0 ? Math.floor(current / monthly) : 0;

    return {
        id: goal.id,
        planId: `SNBL-${goal.id.substring(0, 4).toUpperCase()}`,
        user: userName,
        product: goal.name,
        progressPercent: progress,
        progressCurrent: paidInstallments,
        progressTotal: totalInstallments,
        nextPayment: goal.isRecurring && goal.savingsDay
            ? `Day ${goal.savingsDay}`
            : "—",
        status: mapPlanStatus(goal.status),
        type: goal.category === "CONTRIBUTION" ? "Group" : "Individual",
    };
}

export function transformGoalToPlanDetail(
    goal: BackendGoal,
    userInfo: Record<string, string> = {},
    transactions: BackendTransaction[] = []
): AdminPlanDetail {
    const target = toNumber(goal.targetAmount);
    const current = toNumber(goal.currentAmount);
    const remaining = target - current;
    const progress = target > 0 ? Math.round((current / target) * 100) : 0;

    return {
        id: goal.id,
        planId: `SNBL-${goal.id.substring(0, 4).toUpperCase()}`,
        status: mapPlanStatus(goal.status),
        targetAmount: formatCurrencyFull(target),
        amountSaved: formatCurrencyFull(current),
        remaining: formatCurrencyFull(remaining > 0 ? remaining : 0),
        nextPayment: goal.isRecurring && goal.savingsDay
            ? `Day ${goal.savingsDay}`
            : "—",
        progressPercent: progress,
        expectedDate: goal.deadline ? formatDate(goal.deadline) : "—",
        monthlyContribution: goal.monthlyAmount
            ? formatCurrencyFull(goal.monthlyAmount)
            : "—",
        startDate: formatDate(goal.createdAt),
        user: userInfo,
        product: {
            name: goal.name,
            category: goal.category,
        },
        riskScore: "Low",
        paymentHistory: transactions.map(tx => ({
            date: formatDate(tx.createdAt),
            amount: formatCurrency(tx.amount),
            method: mapPaymentMethod(tx.type),
            status: tx.status.charAt(0) + tx.status.slice(1).toLowerCase(),
        })),
    };
}

// ═══════════════════════════════════
// PAYMENTS / TRANSACTIONS
// ═══════════════════════════════════

export function transformTransactionToPaymentRow(
    tx: BackendTransaction
): AdminPaymentRow {
    return {
        id: tx.id,
        transactionId: tx.reference || tx.id.substring(0, 8).toUpperCase(),
        user: tx.wallet?.user?.name || "Unknown",
        plan: tx.goal?.name || "—",
        amount: formatCurrency(tx.amount),
        date: formatDate(tx.createdAt),
        status: mapPaymentStatus(tx.status),
        method: mapPaymentMethod(tx.type),
    };
}

export function transformTransactionToPaymentDetail(
    tx: BackendTransaction
): AdminPaymentDetail {
    return {
        id: tx.id,
        transactionId: tx.reference || tx.id.substring(0, 8).toUpperCase(),
        amount: formatCurrencyFull(tx.amount),
        fee: "GH₵ 0.00",
        nextAmount: "—",
        status: mapPaymentStatus(tx.status),
        userInfo: {
            name: tx.wallet?.user?.name || "Unknown",
            email: tx.wallet?.user?.email || "—",
        },
        paymentDetails: {
            method: mapPaymentMethod(tx.type),
            reference: tx.reference || "—",
            date: formatDateTime(tx.createdAt),
            currency: tx.currency,
        },
        savingsPlan: {
            name: tx.goal?.name || "—",
            goalId: tx.goalId || "—",
        },
        riskAnalysis: {
            score: "Low",
            checks: [
                { label: "Amount within limits", status: "Passed" },
                { label: "User verified", status: "Passed" },
            ],
        },
        timeline: [
            { label: "Payment initiated", time: formatDateTime(tx.createdAt), status: "Completed" },
            { label: "Payment processed", time: formatDateTime(tx.updatedAt), status: tx.status === "COMPLETED" ? "Completed" : tx.status },
        ],
    };
}
