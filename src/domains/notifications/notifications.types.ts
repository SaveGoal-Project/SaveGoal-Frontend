export type NotificationCategory = "TRANSACTION" | "SECURITY" | "GOAL_UPDATE" | "SYSTEM";

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    category: NotificationCategory;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, unknown> | null;
}

export interface NotificationsResponse {
    notifications: AppNotification[];
    unreadCount: number;
}
