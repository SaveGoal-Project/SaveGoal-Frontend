import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import {
    SavingsGoal,
    SavingsGoalDetail,
    SavingsGoalsListResponse,
    DashboardStats,
    CancelGoalResponse,
    CreateSavingsGoalRequest,
    GoalProduct,
} from "./savings.types";
import * as savingsMock from "./savings.mock";

/** When true, use local mocks so dev works without a backend or Bearer token (see AuthContext mock user). */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

const DEFAULT_PRODUCT: GoalProduct = {
    id: "unknown",
    name: "Custom Savings Goal",
    price: 0,
    currency: "GHS",
    images: ["https://images.unsplash.com/photo-1579621970588-a3f5ce5ca1b1?w=800&q=80"],
};

/**
 * Transforms a raw backend goal into the UI-expected schema.
 * The backend now returns goals with a `product` relation (including `merchant`),
 * so we map the real product data into the GoalProduct shape.
 */
function normalizeGoal(rawGoal: SavingsGoal): SavingsGoal {
    // The backend includes `product` when the goal has a productId.
    // Map it into the GoalProduct shape the UI expects.
    const backendProduct = rawGoal.product as (GoalProduct & { image?: string; merchant?: { businessName?: string } }) | undefined | null;

    let product: GoalProduct;

    if (backendProduct && backendProduct.name) {
        product = {
            id: backendProduct.id || DEFAULT_PRODUCT.id,
            name: backendProduct.name,
            price: Number(backendProduct.price) || rawGoal.targetAmount || 0,
            currency: backendProduct.currency || "GHS",
            // Backend has single `image` field, UI expects `images[]`
            images: backendProduct.images?.length
                ? backendProduct.images
                : backendProduct.image
                    ? [backendProduct.image]
                    : DEFAULT_PRODUCT.images,
            merchant: backendProduct.merchant
                ? { id: backendProduct.id, businessName: backendProduct.merchant.businessName || "Merchant" }
                : undefined,
        };
    } else {
        // Fallback for goals without a linked product
        product = {
            ...DEFAULT_PRODUCT,
            name: rawGoal.name || "Savings Goal",
            price: rawGoal.targetAmount || 0,
        };
    }

    const progress = rawGoal.progress || (rawGoal.targetAmount > 0 ? (rawGoal.currentAmount / rawGoal.targetAmount) * 100 : 0);

    // Read monthlyAmount from backend (it's stored as a Decimal, so convert)
    const rawRecord = rawGoal as unknown as Record<string, unknown>;
    const monthlyAmount = Number(rawRecord.monthlyAmount) || rawGoal.monthlyAmount || 0;

    // Compute nextPaymentAmount: use the backend's value if present, otherwise derive from monthlyAmount
    let nextPaymentAmount = rawGoal.nextPaymentAmount || 0;
    if (!nextPaymentAmount && monthlyAmount > 0) {
        // monthlyAmount IS the per-payment amount (set during goal creation)
        nextPaymentAmount = monthlyAmount;
    }

    // Compute nextPaymentDate: use the backend's value if present, otherwise derive from createdAt
    let nextPaymentDate = rawGoal.nextPaymentDate;
    if (!nextPaymentDate || isNaN(Date.parse(nextPaymentDate))) {
        if (rawGoal.createdAt) {
            const created = new Date(rawGoal.createdAt);
            // Next payment is one month from creation (since monthlyAmount = per-month amount)
            created.setMonth(created.getMonth() + 1);
            // If next payment date is in the past, advance to the next upcoming date
            const now = new Date();
            while (created < now) {
                created.setMonth(created.getMonth() + 1);
            }
            nextPaymentDate = created.toISOString();
        }
    }

    // Compute estimatedCompletionDate
    let computedCompletionDate = rawGoal.estimatedCompletionDate;
    if (!computedCompletionDate || isNaN(Date.parse(computedCompletionDate))) {
        const remainingAmount = Math.max(0, rawGoal.targetAmount - rawGoal.currentAmount);

        if (remainingAmount > 0 && nextPaymentAmount > 0) {
            const paymentsLeft = Math.ceil(remainingAmount / nextPaymentAmount);
            const startDate = new Date(rawGoal.createdAt || new Date());
            startDate.setMonth(startDate.getMonth() + paymentsLeft);
            computedCompletionDate = startDate.toISOString();
        } else {
            computedCompletionDate = new Date().toISOString();
        }
    }

    // Derive the number of total payments (for display as "X months")
    const totalPayments = (nextPaymentAmount > 0 && rawGoal.targetAmount > 0)
        ? Math.ceil(rawGoal.targetAmount / nextPaymentAmount)
        : 0;

    return {
        ...rawGoal,
        id: rawGoal.id || (rawGoal as unknown as Record<string, string>)._id,
        productId: rawGoal.productId || (rawGoal as unknown as Record<string, string>).product_id,
        product,
        category: (rawGoal as unknown as Record<string, unknown>).category as SavingsGoal['category'] || undefined,
        // Ensure Prisma Decimals are cast to proper JS numbers
        currentAmount: Number(rawGoal.currentAmount) || 0,
        targetAmount: Number(rawGoal.targetAmount) || 0,
        progress,
        monthlyAmount,
        nextPaymentAmount,
        nextPaymentDate,
        estimatedCompletionDate: computedCompletionDate,
    };
}

// ─── API Functions ──────────────────────────────────────────────────────────

export async function getSavingsGoals(): Promise<SavingsGoalsListResponse> {
    if (USE_MOCK) {
        const res = await savingsMock.getSavingsGoals();
        return {
            ...res,
            items: res.items.map((g) => normalizeGoal(g)),
        };
    }

    const response = await apiClient.get<SavingsGoalsListResponse | SavingsGoal[]>(API_ENDPOINTS.SAVINGS.LIST);

    // Handle backend responses that might be wrapped differently
    const items = Array.isArray(response) ? response : response.items || (response as unknown as Record<string, unknown>).data as SavingsGoal[] || [];

    const transformedItems = items.map((goal: SavingsGoal) => normalizeGoal(goal));

    return {
        items: transformedItems,
        page: 1,
        pageSize: transformedItems.length,
        total: transformedItems.length,
    };
}

export async function getSavingsGoalById(goalId: string): Promise<SavingsGoalDetail> {
    if (USE_MOCK) {
        const goal = await savingsMock.getSavingsGoalById(goalId);
        const transformed = normalizeGoal(goal);
        return {
            ...transformed,
            deposits: goal.deposits ?? [],
        };
    }

    const response = await apiClient.get<SavingsGoalDetail>(API_ENDPOINTS.SAVINGS.DETAILS(goalId));
    const resRecord = response as unknown as Record<string, unknown>;
    const rawGoal = (resRecord.data || response) as SavingsGoalDetail & { transactions?: unknown[]; deposits?: unknown[] };

    const transformed = normalizeGoal(rawGoal);

    return {
        ...transformed,
        deposits: rawGoal.transactions || rawGoal.deposits || [],
    } as SavingsGoalDetail;
}

export async function createSavingsGoal(data: CreateSavingsGoalRequest): Promise<SavingsGoal> {
    if (USE_MOCK) {
        const raw = await savingsMock.createSavingsGoal(data);
        return normalizeGoal(raw);
    }

    const payload = {
        name: data.name || "Savings Goal",
        targetAmount: data.targetAmount,
        ...(data.productId && { productId: data.productId }),
        ...(data.category && { category: data.category }),
        isRecurring: data.isRecurring,
        monthlyAmount: data.monthlyAmount,
        savingsDay: data.savingsDay,
    };

    const response = await apiClient.post<SavingsGoal>(API_ENDPOINTS.SAVINGS.CREATE, payload);
    const rawGoal = (response as unknown as Record<string, unknown>).data as SavingsGoal || response;

    return normalizeGoal(rawGoal);
}

export async function cancelSavingsGoal(goalId: string): Promise<CancelGoalResponse> {
    if (USE_MOCK) {
        return savingsMock.cancelSavingsGoal(goalId);
    }

    const response = await apiClient.post<CancelGoalResponse>(API_ENDPOINTS.SAVINGS.CANCEL(goalId));
    return (response as unknown as Record<string, unknown>).data as CancelGoalResponse || response;
}

export async function pauseSavingsGoal(goalId: string): Promise<unknown> {
    if (USE_MOCK) {
        return savingsMock.pauseSavingsGoal(goalId);
    }

    const response = await apiClient.post<unknown>(API_ENDPOINTS.SAVINGS.PAUSE(goalId));
    return (response as unknown as Record<string, unknown>).data || response;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    if (USE_MOCK) {
        return savingsMock.getDashboardStats();
    }

    try {
        const goalsResp = await getSavingsGoals();
        const activeGoals = goalsResp.items.filter((g) => g.status === "ACTIVE");
        const totalSaved = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
        const nextPaymentDates = activeGoals
            .map((g) => g.nextPaymentDate)
            .filter(Boolean)
            .sort();

        return {
            totalSaved,
            activeGoals: activeGoals.length,
            completedGoals: goalsResp.items.filter((g) => g.status === "COMPLETED").length,
            nextPaymentDate: nextPaymentDates[0] ?? null,
        };
    } catch (error) {
        console.error("Failed to derive dashboard stats:", error);
        return {
            totalSaved: 0,
            activeGoals: 0,
            completedGoals: 0,
            nextPaymentDate: null,
        };
    }
}
