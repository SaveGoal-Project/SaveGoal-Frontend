"use client";

/**
 * Reusable admin loading skeleton.
 * Shows animated pulse bars mimicking table/card content.
 */
export function AdminLoadingSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="h-7 w-48 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-72 bg-gray-100 rounded mt-2" />
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            </div>

            {/* Cards skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                        <div className="h-8 w-24 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="h-10 w-64 bg-gray-100 rounded-lg mb-5" />
                <div className="space-y-3">
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50">
                            <div className="h-4 w-24 bg-gray-100 rounded" />
                            <div className="h-4 w-32 bg-gray-100 rounded" />
                            <div className="h-4 w-20 bg-gray-100 rounded" />
                            <div className="h-4 w-16 bg-gray-100 rounded" />
                            <div className="h-4 w-20 bg-gray-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Reusable admin error state.
 * Shows an error message with a retry button.
 */
export function AdminErrorState({
    message = "Something went wrong",
    onRetry,
}: {
    message?: string;
    onRetry?: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.732c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Error</h3>
            <p className="text-sm text-gray-500 mb-4 text-center max-w-sm">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-5 py-2 bg-[#0754FF] text-white text-sm font-medium rounded-lg hover:bg-[#0643cc] transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

/**
 * Simple toast notification for action feedback.
 */
export function AdminToast({
    message,
    type = "success",
    onClose,
}: {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
}) {
    const bgColor = type === "success" ? "bg-green-50 border-green-200" : type === "error" ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200";
    const textColor = type === "success" ? "text-green-800" : type === "error" ? "text-red-800" : "text-blue-800";
    const iconColor = type === "success" ? "text-green-500" : type === "error" ? "text-red-500" : "text-blue-500";

    return (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border ${bgColor} shadow-lg animate-in slide-in-from-top-2 duration-300`}>
            {type === "success" ? (
                <svg className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
            <span className={`text-sm font-medium ${textColor}`}>{message}</span>
            <button onClick={onClose} className={`ml-2 ${textColor} hover:opacity-70`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

/**
 * Confirm dialog modal for destructive actions.
 */
export function AdminConfirmDialog({
    title,
    message,
    confirmLabel = "Confirm",
    confirmVariant = "danger",
    isLoading = false,
    onConfirm,
    onCancel,
}: {
    title: string;
    message: string;
    confirmLabel?: string;
    confirmVariant?: "danger" | "primary";
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const confirmBgColor = confirmVariant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[#0754FF] hover:bg-[#0643cc]";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-2.5 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${confirmBgColor}`}
                    >
                        {isLoading ? "Processing..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
