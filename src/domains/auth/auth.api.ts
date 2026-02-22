import { apiClient, tokenStorage, uploadFile } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  MerchantRegisterRequest,
  MerchantVerificationRequest,
  PhoneVerificationRequest,
  PhoneVerificationConfirmRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  MerchantUser,
} from "./auth.types";

// ==================== Consumer Auth ====================

/**
 * Login with phone/email and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials,
    { skipAuth: true }
  );
  
  // Store tokens on successful login
  tokenStorage.setTokens(response.token, response.refreshToken);
  
  return response;
}

/**
 * Register a new consumer account
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    data,
    { skipAuth: true }
  );
  
  // Store tokens on successful registration
  tokenStorage.setTokens(response.token, response.refreshToken);
  
  return response;
}

/**
 * Logout and invalidate session
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } finally {
    // Always clear tokens, even if the API call fails
    tokenStorage.clearTokens();
  }
}

// ==================== Merchant Auth ====================

/**
 * Register a new merchant account
 */
export async function registerMerchant(data: MerchantRegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.MERCHANT_AUTH.REGISTER,
    data,
    { skipAuth: true }
  );
  
  // Store tokens on successful registration
  tokenStorage.setTokens(response.token, response.refreshToken);
  
  return response;
}

/**
 * Submit merchant verification documents (ID and selfie)
 */
export async function submitMerchantVerification(
  data: MerchantVerificationRequest
): Promise<{ success: boolean; message: string }> {
  return apiClient.post(API_ENDPOINTS.MERCHANT_AUTH.VERIFY_BUSINESS, data);
}

/**
 * Upload ID document (front or back)
 */
export async function uploadIdDocument(
  file: File,
  side: "front" | "back"
): Promise<{ url: string; filename: string }> {
  return uploadFile(API_ENDPOINTS.MERCHANT_AUTH.UPLOAD_ID, file, "idImage", { side });
}

/**
 * Upload selfie for verification
 */
export async function uploadSelfie(file: File): Promise<{ url: string; filename: string }> {
  return uploadFile(API_ENDPOINTS.MERCHANT_AUTH.UPLOAD_SELFIE, file, "selfie");
}

// ==================== Phone Verification ====================

/**
 * Request phone verification OTP
 */
export async function requestPhoneVerification(
  data: PhoneVerificationRequest
): Promise<{ success: boolean; message: string }> {
  return apiClient.post(API_ENDPOINTS.AUTH.VERIFY_PHONE, data, { skipAuth: true });
}

/**
 * Verify phone with OTP code
 */
export async function verifyPhoneCode(
  data: PhoneVerificationConfirmRequest
): Promise<{ success: boolean; verified: boolean }> {
  return apiClient.post(`${API_ENDPOINTS.AUTH.VERIFY_PHONE}/confirm`, data, { skipAuth: true });
}

// ==================== Password Recovery ====================

/**
 * Request password reset (sends OTP/link)
 */
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<{ success: boolean; message: string }> {
  return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data, { skipAuth: true });
}

/**
 * Reset password with token
 */
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<{ success: boolean; message: string }> {
  return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data, { skipAuth: true });
}

// ==================== Token Management ====================

/**
 * Refresh access token
 */
export async function refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    data,
    { skipAuth: true }
  );
  
  // Update stored tokens
  tokenStorage.setTokens(response.token, response.refreshToken);
  
  return response;
}

// ==================== User Profile ====================

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User | MerchantUser> {
  return apiClient.get<User | MerchantUser>(API_ENDPOINTS.USERS.ME);
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  return !!tokenStorage.getAccessToken();
}

// ==================== Auth Service Object (Alternative API) ====================

export const authService = {
  // Consumer
  login,
  register,
  logout,
  
  // Merchant
  registerMerchant,
  submitMerchantVerification,
  uploadIdDocument,
  uploadSelfie,
  
  // Phone verification
  requestPhoneVerification,
  verifyPhoneCode,
  
  // Password
  forgotPassword,
  resetPassword,
  
  // Token
  refreshToken,
  
  // User
  getCurrentUser,
  isAuthenticated,
};

export default authService;



