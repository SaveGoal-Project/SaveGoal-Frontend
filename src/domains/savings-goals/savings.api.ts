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

// --- GOAL TRANSFORMER SHIM ---
// The current backend accepts and returns a generic string `name` for a goal instead of a `productId`.
// This shim provides a mock catalog to map string names back to product image visuals in the UI.
const SHIM_CATALOG: Record<string, GoalProduct> = {
    "Apple MacBook Pro": {
        id: "1",
        name: "Apple MacBook Pro",
        price: 10000,
        currency: "GHS",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"],
    },
    "Water Bottle": {
        id: "2",
        name: "Water Bottle",
        price: 10000,
        currency: "GHS",
        images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"],
    },
    "Apple Series 3": {
        id: "3",
        name: "Apple Series 3",
        price: 10000,
        currency: "GHS",
        images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80"],
    },
    "Adidas Sneakers": {
        id: "4",
        name: "Adidas Sneakers",
        price: 10000,
        currency: "GHS",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
    },
    "Sony PlayStation 5": {
        id: "5",
        name: "Sony PlayStation 5",
        price: 7000,
        currency: "GHS",
        images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80"],
    },
    "Long Sleeve Shirt": {
        id: "6",
        name: "Long Sleeve Shirt",
        price: 1000,
        currency: "GHS",
        images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"],
    },
    "LG 50\" Television": {
        id: "7",
        name: "LG 50\" Television",
        price: 10000,
        currency: "GHS",
        images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80"],
    },
    "Nike Air Force 1": {
        id: "8",
        name: "Nike Air Force 1",
        price: 10000,
        currency: "GHS",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"],
    },
};

const DEFAULT_PRODUCT: GoalProduct = {
    id: "unknown",
    name: "Custom Savings Goal",
    price: 0,
    currency: "GHS",
    images: ["https://images.unsplash.com/photo-1579621970588-a3f5ce5ca1b1?w=800&q=80"], // Generic savings image
};

/**
 * Transforms a raw backend goal into the UI expected schema by injecting the product visuals.
 */
function applyTransformerShim(rawGoal: SavingsGoal): SavingsGoal {
    const goalName = rawGoal.name || rawGoal.product?.name || "Custom Savings Goal";
    const mappedProduct = SHIM_CATALOG[goalName] || { ...DEFAULT_PRODUCT, name: goalName };

    return {
        ...rawGoal,
        product: {
            ...mappedProduct,
            price: rawGoal.targetAmount || mappedProduct.price,
        },
        progress: rawGoal.progress || (rawGoal.currentAmount / rawGoal.targetAmount) * 100 || 0,
    };
}

// ─── API Functions ──────────────────────────────────────────────────────────

export async function getSavingsGoals(): Promise<SavingsGoalsListResponse> {
    const response = await apiClient.get<SavingsGoalsListResponse | SavingsGoal[]>(API_ENDPOINTS.SAVINGS.LIST);

    // Handle backend responses that might be wrapped differently
    const items = Array.isArray(response) ? response : response.items || (response as any).data || [];

    const transformedItems = items.map((goal: SavingsGoal) => applyTransformerShim(goal));

    return {
        items: transformedItems,
        page: 1,
        pageSize: transformedItems.length,
        total: transformedItems.length,
    };
}

export async function getSavingsGoalById(goalId: string): Promise<SavingsGoalDetail> {
    const response = await apiClient.get<SavingsGoalDetail>(API_ENDPOINTS.SAVINGS.DETAILS(goalId));
    const rawGoal = (response as any).data || response;

    const transformed = applyTransformerShim(rawGoal);

    return {
        ...transformed,
        deposits: rawGoal.transactions || rawGoal.deposits || [],
    } as SavingsGoalDetail;
}

export async function createSavingsGoal(data: CreateSavingsGoalRequest): Promise<SavingsGoal> {
    // If we only have a productId, map it to a name for the backend payload
    let payloadName = data.name;
    if (!payloadName && data.productId) {
        const matchedProduct = Object.values(SHIM_CATALOG).find((p) => p.id === data.productId);
        payloadName = matchedProduct ? matchedProduct.name : "Custom Goal";
    }

    const payload = {
        name: payloadName || "Savings Goal",
        targetAmount: data.targetAmount,
        frequency: data.frequency,
    };

    const response = await apiClient.post<SavingsGoal>(API_ENDPOINTS.SAVINGS.CREATE, payload);
    const rawGoal = (response as any).data || response;
    return applyTransformerShim(rawGoal);
}

export async function cancelSavingsGoal(goalId: string): Promise<CancelGoalResponse> {
    const response = await apiClient.post<CancelGoalResponse>(API_ENDPOINTS.SAVINGS.CANCEL(goalId));
    return (response as any).data || response;
}

export async function pauseSavingsGoal(goalId: string): Promise<any> {
    const response = await apiClient.post<any>(API_ENDPOINTS.SAVINGS.PAUSE(goalId));
    return (response as any).data || response;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    // Try fetching goals directly to derive stats if there isn't a native dashboard endpoint
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
        // Fallback safe values
        return {
            totalSaved: 0,
            activeGoals: 0,
            completedGoals: 0,
            nextPaymentDate: null,
        };
    }
}
