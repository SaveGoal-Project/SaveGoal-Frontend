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
  // 1. Create User Account (Signup)
  const signupPayload = {
    email: data.email || data.phone,
    password: data.password,
    name: data.fullName.trim(),
    role: "MERCHANT", // Assuming backend might optionally parse this
  };

  const authResponse = await apiClient.post<any>(
    API_ENDPOINTS.AUTH.REGISTER,
    signupPayload,
    { skipAuth: true }
  );

  // Extract token from successful signup
  const token = authResponse.session?.token || authResponse.token;
  const refreshToken = authResponse.session?.refreshToken || authResponse.refreshToken;

  if (!token) {
    throw new Error("Registration failed: No authentication token received.");
  }

  // Ensure tokens are stored *immediately* so the user is authenticated for the onboard request
  tokenStorage.setTokens(token, refreshToken);

  // 2. Map frontend state to backend `/merchants/onboard` payload expectation:
  // Required: [businessName, contactEmail, contactPhone, businessAddress]
  const merchantPayload = {
    businessName: data.storeName,
    businessAddress: `${data.address}, ${data.city}, ${data.region}`,
    contactEmail: data.email,
    contactPhone: data.phone,
    // Note: Other metadata collected by frontend like description/category/closestLandmark
    // aren't defined in the swagger spec explicitly, but we'll send them just in case.
    description: data.description,
    category: data.category,
    closestLandmark: data.closestLandmark
  };

  // 3. Create the active Merchant Profile securely (with Bearer Token stored via apiClient)
  await apiClient.post<any>("/merchants/onboard", merchantPayload);

  // Map the backend's unified "name" string back to the frontend's expected properties
  let responseFirstName = "";
  let responseLastName = "";
  if (authResponse.user?.name) {
    const parts = authResponse.user.name.split(" ");
    responseFirstName = parts[0] || "";
    responseLastName = parts.slice(1).join(" ") || "";
  }

  return {
    user: {
      ...authResponse.user,
      firstName: responseFirstName,
      lastName: responseLastName,
      role: "MERCHANT", // Override role UI locally
    },
    token,
    refreshToken,
  };
}

/**
 * Submit merchant verification documents (ID and selfie)
 */
export async function submitMerchantVerification(
  data: MerchantVerificationRequest
): Promise<{ success: boolean; message: string }> {
  // Use the new centralized /kyc/submit endpoint
  // Map frontend's Base64 image fields or CDN URLs if we have them
  const kycPayload = {
    idType: data.idType,
    idNumber: data.idNumber,
    idImageUrl: data.frontIdImage || "https://placeholder.com/id", // Fallbacks if base64 upload is unsupported natively
    selfieImageUrl: data.selfieImage || "https://placeholder.com/selfie",
    bankName: "Guaranty Trust Bank", // Placeholder for MVP
    bankAccountNo: "0000000000",
    bankAccountName: "SaveGoal Merchant",
  };

  const response = await apiClient.post<any>(
    API_ENDPOINTS.KYC.SUBMIT,
    kycPayload
  );

  return {
    success: response.status === "success" || !!response.id,
    message: "Identity verification submitted successfully.",
  };
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



