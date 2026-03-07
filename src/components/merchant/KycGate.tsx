"use client";

import { ReactNode } from "react";
import { useKycStatus } from "@/src/domains/merchant/merchant.hooks";

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function KycLoadingSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <p className="text-slate-500 text-sm">Checking verification status…</p>
            </div>
        </div>
    );
}

// ─── Pending Screen ──────────────────────────────────────────────────────────

function KycPendingScreen() {
    const steps = [
        { label: "Documents Submitted", done: true },
        { label: "Under Review", done: false, active: true },
        { label: "Account Approved", done: false },
    ];

    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-lg text-center space-y-8">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>

                {/* Heading */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800">Account Under Review</h2>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Your identity documents have been submitted and are being reviewed by our team.
                        This typically takes <strong>24–48 hours</strong>.
                    </p>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-center gap-0">
                    {steps.map((step, i) => (
                        <div key={step.label} className="flex items-center">
                            {/* Dot */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                                        ${step.done
                                            ? "bg-green-500 text-white"
                                            : step.active
                                                ? "bg-amber-400 text-white animate-pulse"
                                                : "bg-slate-200 text-slate-400"
                                        }`}
                                >
                                    {step.done ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span className={`text-[11px] mt-1.5 whitespace-nowrap ${step.active ? "text-amber-600 font-medium" : "text-slate-400"}`}>
                                    {step.label}
                                </span>
                            </div>
                            {/* Connector */}
                            {i < steps.length - 1 && (
                                <div className={`w-12 h-0.5 mb-5 mx-1 ${step.done ? "bg-green-400" : "bg-slate-200"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Info cards */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left space-y-2">
                    <p className="text-blue-800 font-medium text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        What happens next?
                    </p>
                    <ul className="text-blue-700 text-xs space-y-1 ml-6 list-disc">
                        <li>Our team verifies your identity documents</li>
                        <li>You'll get access to the full dashboard once approved</li>
                        <li>This page refreshes automatically — no need to reload</li>
                    </ul>
                </div>

                {/* Support link */}
                <p className="text-slate-400 text-xs">
                    Taking longer than expected?{" "}
                    <a href="mailto:support@savegoal.com" className="text-indigo-500 hover:underline">
                        Contact Support
                    </a>
                </p>
            </div>
        </div>
    );
}

// ─── Rejected Screen ─────────────────────────────────────────────────────────

function KycRejectedScreen({ reason }: { reason: string | null }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-lg text-center space-y-8">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>

                {/* Heading */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800">Verification Not Approved</h2>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Unfortunately, your identity verification was not approved. Please review the reason below and re-submit your documents.
                    </p>
                </div>

                {/* Reason */}
                {reason && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left">
                        <p className="text-red-800 font-medium text-sm mb-1">Reason</p>
                        <p className="text-red-700 text-sm">{reason}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                    <a
                        href="/register"
                        className="inline-flex items-center justify-center w-full max-w-xs mx-auto gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                        </svg>
                        Re-submit Documents
                    </a>
                    <p className="text-slate-400 text-xs">
                        Need help?{" "}
                        <a href="mailto:support@savegoal.com" className="text-indigo-500 hover:underline">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── No Profile Screen ───────────────────────────────────────────────────────

function KycNoProfileScreen() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-lg text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800">Complete Your Registration</h2>
                    <p className="text-slate-500 text-sm">
                        Your merchant profile hasn't been set up yet. Please complete the registration process first.
                    </p>
                </div>
                <a
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
                >
                    Complete Registration
                </a>
            </div>
        </div>
    );
}

// ─── Error Screen ────────────────────────────────────────────────────────────

function KycErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-md text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-800">Something went wrong</h3>
                    <p className="text-slate-500 text-sm">{error}</p>
                </div>
                <button
                    onClick={onRetry}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

// ─── Main KYC Gate Component ─────────────────────────────────────────────────

export function KycGate({ children }: { children: ReactNode }) {
    const { status, note, isLoading, error, refetch } = useKycStatus();

    // Loading state
    if (isLoading) return <KycLoadingSkeleton />;

    // API error — could be 404 (no profile) or network error
    if (error) {
        // 404 means no profile found — user hasn't completed registration
        if (error.includes("not found") || error.includes("404")) {
            return <KycNoProfileScreen />;
        }
        return <KycErrorScreen error={error} onRetry={refetch} />;
    }

    // No KYC status at all (profile exists but hasn't submitted KYC)
    if (!status) return <KycPendingScreen />;

    // Gate by status
    switch (status) {
        case "VERIFIED":
            return <>{children}</>;
        case "FAILED":
            return <KycRejectedScreen reason={note} />;
        case "PENDING":
        case "EXPIRED":
        default:
            return <KycPendingScreen />;
    }
}
