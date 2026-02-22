// Legacy types kept for backward compatibility with dashboard page
export interface RecentActivityItem {
    id: string;
    userInitial: string;
    userName: string;
    description: string;
    timestamp: string;
    status: "Success" | "Warning" | "Error";
}

export interface RiskAlertItem {
    id: string;
    message: string;
    severity: "high" | "medium";
}
