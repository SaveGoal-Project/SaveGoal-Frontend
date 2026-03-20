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
    const frequency = rawGoal.frequency || "MONTHLY";
    const nextPaymentAmount = rawGoal.nextPaymentAmount || 0;

    let computedCompletionDate = rawGoal.estimatedCompletionDate;
    
    // Only parse standard Date formats. If invalid or missing, calculate it manually
    if (!computedCompletionDate || isNaN(Date.parse(computedCompletionDate))) {
        computedCompletionDate = new Date().toISOString(); // Default to today
        
        const remainingAmount = Math.max(0, rawGoal.targetAmount - rawGoal.currentAmount);

        if (remainingAmount > 0 && nextPaymentAmount > 0) {
            const paymentsLeft = Math.ceil(remainingAmount / nextPaymentAmount);
            const today = new Date();
            
            if (frequency === "WEEKLY") {
                today.setDate(today.getDate() + (paymentsLeft * 7));
            } else if (frequency === "BIWEEKLY") {
                today.setDate(today.getDate() + (paymentsLeft * 14));
            } else if (frequency === "MONTHLY") {
                today.setMonth(today.getMonth() + paymentsLeft);
            }
            computedCompletionDate = today.toISOString();
        }
    }

    return {
        ...rawGoal,
        id: rawGoal.id || (rawGoal as unknown as Record<string, string>)._id,
        productId: rawGoal.productId || (rawGoal as unknown as Record<string, string>).product_id,
        product,
        category: (rawGoal as unknown as Record<string, unknown>).category as SavingsGoal['category'] || undefined,
        progress,
        estimatedCompletionDate: computedCompletionDate,
    };
}

// ─── API Functions ──────────────────────────────────────────────────────────

export async function getSavingsGoals(): Promise<SavingsGoalsListResponse> {
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
    const response = await apiClient.post<CancelGoalResponse>(API_ENDPOINTS.SAVINGS.CANCEL(goalId));
    return (response as unknown as Record<string, unknown>).data as CancelGoalResponse || response;
}

export async function pauseSavingsGoal(goalId: string): Promise<unknown> {
    const response = await apiClient.post<unknown>(API_ENDPOINTS.SAVINGS.PAUSE(goalId));
    return (response as unknown as Record<string, unknown>).data || response;
}

export async function getDashboardStats(): Promise<DashboardStats> {
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
