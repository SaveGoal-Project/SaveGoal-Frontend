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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await apiClient.post<any>(API_ENDPOINTS.MERCHANT.ONBOARD, merchantPayload);

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

/** Map UI ID type labels to backend-friendly codes (KYC route accepts string). */
function mapIdTypeToBackend(frontend: string): string {
  const t = frontend.toLowerCase();
  if (t.includes("ghana")) return "GHANA_CARD";
  if (t.includes("passport")) return "PASSPORT";
  if (t.includes("voter")) return "VOTERS_ID";
  if (t.includes("driver")) return "DRIVERS_LICENSE";
  return frontend.replace(/\s+/g, "_").toUpperCase();
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0]?.match(/:(.*?);/);
  const mime = mimeMatch?.[1] || "image/jpeg";
  const b64 = arr[1];
  if (!b64) {
    throw new Error("Invalid image data");
  }
  const binary = atob(b64);
  const len = binary.length;
  const u8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
  return new File([u8], filename, { type: mime });
}

/**
 * Prefer HTTPS URLs; if given a data URL, try upload endpoints; if upload is unavailable, send data URL (dev / small images).
 */
async function resolveKycImageUrl(
  dataUrlOrHttp: string,
  upload: (file: File) => Promise<{ url: string; filename: string }>,
  filename: string
): Promise<string> {
  const v = dataUrlOrHttp.trim();
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.startsWith("data:")) {
    try {
      const file = dataUrlToFile(v, filename);
      const out = await upload(file);
      return out.url;
    } catch {
      return v;
    }
  }
  return v;
}

/**
 * Submit merchant verification documents (ID and selfie) to POST /api/kyc/submit.
 * Ghana Card back / business registration files are collected in the UI but not persisted by the current API contract (single idImageUrl on Profile).
 */
export async function submitMerchantVerification(
  data: MerchantVerificationRequest
): Promise<{ success: boolean; message: string }> {
  const idImageUrl = await resolveKycImageUrl(
    data.frontIdImage,
    (file) => uploadIdDocument(file, "front"),
    "id-front.jpg"
  );
  const selfieImageUrl = await resolveKycImageUrl(
    data.selfieImage,
    uploadSelfie,
    "selfie.jpg"
  );

  const kycPayload = {
    idType: mapIdTypeToBackend(data.idType),
    idNumber: data.idNumber.trim(),
    idImageUrl,
    selfieImageUrl,
  };

  await apiClient.post(API_ENDPOINTS.KYC.SUBMIT, kycPayload);

  return {
    success: true,
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
  const response = await apiClient.get<{
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: "CONSUMER" | "MERCHANT" | "ADMIN";
    createdAt: string;
    updatedAt: string;
    merchantProfile?: {
      businessName: string;
      businessAddress: string;
      isVerified: boolean;
      contactEmail: string;
    } | null;
    profile?: {
      address?: string | null;
      kycStatus?: string | null;
    } | null;
  }>(API_ENDPOINTS.USERS.ME);

  const nameParts = response.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  if (response.role === "MERCHANT" && response.merchantProfile) {
    return {
      id: response.id,
      firstName,
      lastName,
      phone: response.phone || "",
      email: response.email,
      role: "MERCHANT",
      status: response.merchantProfile.isVerified ? "ACTIVE" : "PENDING_VERIFICATION",
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      storeName: response.merchantProfile.businessName,
      storeDescription: "",
      category: "General",
      region: "",
      city: "",
      address: response.merchantProfile.businessAddress || response.profile?.address || "",
      verificationStatus: response.merchantProfile.isVerified ? "APPROVED" : "PENDING",
      isVerified: response.merchantProfile.isVerified,
    };
  }

  return {
    id: response.id,
    firstName,
    lastName,
    phone: response.phone || "",
    email: response.email,
    role: response.role,
    status: "ACTIVE",
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
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



