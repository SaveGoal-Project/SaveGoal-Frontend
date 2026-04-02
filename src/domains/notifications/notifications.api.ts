import { API_ENDPOINTS } from "@/src/config/api.config";
import { apiClient } from "@/src/lib/api-client";
import type { NotificationsResponse } from "./notifications.types";

interface FetchNotificationsOptions {
    page?: number;
    limit?: number;
}

export async function fetchNotifications(
    options: FetchNotificationsOptions = {}
): Promise<NotificationsResponse> {
    const { page = 1, limit = 8 } = options;

    return apiClient.get<NotificationsResponse>(API_ENDPOINTS.NOTIFICATIONS.LIST, {
        params: { page, limit },
    });
}

export async function markNotificationRead(notificationId: string): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
}

export async function markAllNotificationsRead(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
}
