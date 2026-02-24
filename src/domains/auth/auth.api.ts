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
  // Map frontend's generic phoneOrEmail input into the explicit email key expected by the backend
  const payload = {
    email: credentials.phoneOrEmail,
    password: credentials.password,
  };

  const response = await apiClient.post<any>(
    API_ENDPOINTS.AUTH.LOGIN,
    payload,
    { skipAuth: true }
  );

  // Map the backend's unified "name" string back to the frontend's expected properties
  let firstName = "";
  let lastName = "";
  if (response.user?.name) {
    const parts = response.user.name.split(" ");
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  // Format the unwrapped API response back to the structural contract expected by AuthContext
  const authResponse: AuthResponse = {
    user: {
      ...response.user,
      firstName,
      lastName,
    },
    token: response.session?.token || response.token,
    refreshToken: response.session?.refreshToken || response.refreshToken,
  };

  // Store tokens on successful login
  tokenStorage.setTokens(authResponse.token, authResponse.refreshToken);

  return authResponse;
}

/**
 * Register a new consumer account
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  // Combine frontend split names to satisfy backend BetterAuth string mapping
  const payload = {
    email: data.email || data.phone,
    password: data.password,
    name: `${data.firstName} ${data.lastName}`.trim(),
  };

  const response = await apiClient.post<any>(
    API_ENDPOINTS.AUTH.REGISTER,
    payload,
    { skipAuth: true }
  );

  // Map the backend's unified "name" string back to the frontend's expected properties
  let responseFirstName = "";
  let responseLastName = "";
  if (response.user?.name) {
    const parts = response.user.name.split(" ");
    responseFirstName = parts[0] || "";
    responseLastName = parts.slice(1).join(" ") || "";
  }

  const authResponse: AuthResponse = {
    user: {
      ...response.user,
      firstName: responseFirstName,
      lastName: responseLastName,
    },
    token: response.session?.token || response.token,
    refreshToken: response.session?.refreshToken || response.refreshToken,
  };

  // Store tokens on successful registration
  tokenStorage.setTokens(authResponse.token, authResponse.refreshToken);

  return authResponse;
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
  return apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, data, { skipAuth: true });
}

/**
 * Verify phone with OTP code
 */
export async function verifyPhoneCode(
  data: PhoneVerificationConfirmRequest
): Promise<{ success: boolean; verified: boolean }> {
  return apiClient.post(API_ENDPOINTS.AUTH.VERIFY_PHONE, data, { skipAuth: true });
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



