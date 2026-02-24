"use client";

import { useState, useCallback, useEffect } from "react";
import { fetchMerchantDashboard, fetchMerchantProfile, updateMerchantProfile } from "./merchant.api";
import { MerchantDashboardData, MerchantProfile, UpdateProfileRequest } from "./merchant.types";

export function useMerchantDashboard() {
    const [data, setData] = useState<MerchantDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchMerchantDashboard();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { data, isLoading, error, refetch: loadData };
}

export function useMerchantProfile() {
    const [profile, setProfile] = useState<MerchantProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchMerchantProfile();
            setProfile(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load merchant profile");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    return { profile, isLoading, error, refetch: loadProfile };
}

export function useUpdateMerchantProfile() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (data: UpdateProfileRequest) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await updateMerchantProfile(data);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update profile";
            setError(message);
            throw new Error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { update, isSubmitting, error };
}
