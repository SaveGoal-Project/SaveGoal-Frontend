"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  requestPhoneVerification,
  verifyPhoneCode,
  forgotPassword,
  resetPassword,
  submitMerchantVerification,
  uploadIdDocument,
  uploadSelfie,
} from "./auth.api";
import {
  PhoneVerificationRequest,
  PhoneVerificationConfirmRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  MerchantVerificationRequest,
} from "./auth.types";

// ==================== Phone Verification Hook ====================

interface UsePhoneVerificationReturn {
  isLoading: boolean;
  error: string | null;
  isCodeSent: boolean;
  isVerified: boolean;
  sendVerificationCode: (phone: string) => Promise<void>;
  verifyCode: (phone: string, code: string) => Promise<boolean>;
  reset: () => void;
}

export function usePhoneVerification(): UsePhoneVerificationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const sendVerificationCode = useCallback(async (phone: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await requestPhoneVerification({ phone });
      setIsCodeSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async (phone: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyPhoneCode({ phone, code });
      setIsVerified(result.verified);
      return result.verified;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify code");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setIsCodeSent(false);
    setIsVerified(false);
  }, []);

  return {
    isLoading,
    error,
    isCodeSent,
    isVerified,
    sendVerificationCode,
    verifyCode,
    reset,
  };
}

// ==================== Password Recovery Hook ====================

interface UsePasswordRecoveryReturn {
  isLoading: boolean;
  error: string | null;
  isResetEmailSent: boolean;
  isPasswordReset: boolean;
  requestReset: (phoneOrEmail: string) => Promise<void>;
  confirmReset: (token: string, newPassword: string) => Promise<void>;
  reset: () => void;
}

export function usePasswordRecovery(): UsePasswordRecoveryReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const requestReset = useCallback(async (phoneOrEmail: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword({ phoneOrEmail });
      setIsResetEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmReset = useCallback(async (resetToken: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword({ resetToken, newPassword });
      setIsPasswordReset(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setIsResetEmailSent(false);
    setIsPasswordReset(false);
  }, []);

  return {
    isLoading,
    error,
    isResetEmailSent,
    isPasswordReset,
    requestReset,
    confirmReset,
    reset,
  };
}

// ==================== Merchant Verification Hook ====================

interface UseMerchantVerificationReturn {
  isLoading: boolean;
  error: string | null;
  frontIdUrl: string | null;
  backIdUrl: string | null;
  selfieUrl: string | null;
  uploadFrontId: (file: File) => Promise<string>;
  uploadBackId: (file: File) => Promise<string>;
  uploadSelfieImage: (file: File) => Promise<string>;
  submitVerification: (data: Omit<MerchantVerificationRequest, "frontIdImage" | "backIdImage" | "selfieImage">) => Promise<void>;
  reset: () => void;
}

export function useMerchantVerification(): UseMerchantVerificationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frontIdUrl, setFrontIdUrl] = useState<string | null>(null);
  const [backIdUrl, setBackIdUrl] = useState<string | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);

  const uploadFrontId = useCallback(async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadIdDocument(file, "front");
      setFrontIdUrl(result.url);
      return result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload front ID");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadBackId = useCallback(async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadIdDocument(file, "back");
      setBackIdUrl(result.url);
      return result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload back ID");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadSelfieImage = useCallback(async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadSelfie(file);
      setSelfieUrl(result.url);
      return result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload selfie");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitVerification = useCallback(
    async (data: Omit<MerchantVerificationRequest, "frontIdImage" | "backIdImage" | "selfieImage">) => {
      if (!frontIdUrl || !backIdUrl || !selfieUrl) {
        setError("Please upload all required documents");
        throw new Error("Please upload all required documents");
      }

      setIsLoading(true);
      setError(null);

      try {
        await submitMerchantVerification({
          ...data,
          frontIdImage: frontIdUrl,
          backIdImage: backIdUrl,
          selfieImage: selfieUrl,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit verification");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [frontIdUrl, backIdUrl, selfieUrl]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setFrontIdUrl(null);
    setBackIdUrl(null);
    setSelfieUrl(null);
  }, []);

  return {
    isLoading,
    error,
    frontIdUrl,
    backIdUrl,
    selfieUrl,
    uploadFrontId,
    uploadBackId,
    uploadSelfieImage,
    submitVerification,
    reset,
  };
}

// ==================== Login/Register Form Hook ====================

interface UseAuthFormReturn {
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useAuthForm(): UseAuthFormReturn {
  const { isLoading, error, clearError } = useAuth();

  return {
    isLoading,
    error,
    clearError,
  };
}

// Re-export useAuth for convenience
export { useAuth } from "@/src/contexts/AuthContext";



