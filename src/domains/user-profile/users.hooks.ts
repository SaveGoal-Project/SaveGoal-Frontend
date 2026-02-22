"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserStats,
  NotificationPreferences,
  NextOfKin,
} from "./users.types";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserStats,
  getNotificationPreferences,
  updateNotificationPreferences,
  getNextOfKin,
  updateNextOfKin,
} from "./users.mock";

// ─── Hook: User profile ─────────────────────────────────────────────────────

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load profile"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const update = useCallback(async (data: UpdateProfileRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await updateUserProfile(data);
      setProfile(updated);
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { profile, isLoading, error, update, refetch: fetchProfile };
}

// ─── Hook: Change password ──────────────────────────────────────────────────

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const change = useCallback(async (data: ChangePasswordRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await changePassword(data);
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to change password";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { change, isLoading, error, success };
}

// ─── Hook: User stats ───────────────────────────────────────────────────────

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load user stats"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, isLoading, error };
}

// ─── Hook: Notification preferences ─────────────────────────────────────────

export function useNotificationPreferences() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await getNotificationPreferences();
        setPreferences(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load notification preferences"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const update = useCallback(
    async (data: Partial<NotificationPreferences>) => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await updateNotificationPreferences(data);
        setPreferences(updated);
        return updated;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update notification preferences";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { preferences, isLoading, error, update };
}

// ─── Hook: Next of kin ──────────────────────────────────────────────────────

export function useNextOfKin() {
  const [nextOfKin, setNextOfKin] = useState<NextOfKin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await getNextOfKin();
        setNextOfKin(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load next of kin"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const update = useCallback(async (data: NextOfKin) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await updateNextOfKin(data);
      setNextOfKin(updated);
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update next of kin";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { nextOfKin, isLoading, error, update };
}

