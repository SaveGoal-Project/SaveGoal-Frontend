import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import {
    Payment,
    PaymentsListResponse,
    InitiatePaymentRequest,
    InitiatePaymentResponse,
    SavedPaymentMethod,
    RecentActivity,
} from "./payment.types";

export async function getPaymentHistory(): Promise<PaymentsListResponse> {
    const response = await apiClient.get<PaymentsListResponse>(API_ENDPOINTS.PAYMENTS.HISTORY);
    return (response as any).data || response;
}

export async function getPaymentById(paymentId: string): Promise<Payment> {
    // If the backend has an endpoint, map it. Otherwise mock or fallback.
    // There's no specific details endpoint listed in config, but assuming standard REST:
    const response = await apiClient.get<Payment>(`/payments/${paymentId}`);
    return (response as any).data || response;
}

export async function initiatePayment(data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    const response = await apiClient.post<InitiatePaymentResponse>(API_ENDPOINTS.PAYMENTS.INITIATE, data);
    return (response as any).data || response;
}

export async function getSavedPaymentMethods(): Promise<SavedPaymentMethod[]> {
    // Not explicitly defined in current API design, returning empty until fully supported
    return [];
}

export async function deletePaymentMethod(_methodId: string): Promise<{ success: boolean }> {
    return { success: true };
}

export async function setDefaultPaymentMethod(_methodId: string): Promise<{ success: boolean }> {
    return { success: true };
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
    // Derive recent activity from payment history if not natively provided
    try {
        const history = await getPaymentHistory();
        const items = history.items || [];
        return items.map((p) => ({
            id: p.id,
            description: `Payment for Goal`,
            date: p.createdAt,
            amount: p.amount,
            type: "payment",
        }));
    } catch (err) {
        console.error("Failed to map recent activity:", err);
        return [];
    }
}
