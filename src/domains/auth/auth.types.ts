// User Roles
export type UserRole = "CONSUMER" | "MERCHANT" | "ADMIN";

// User Status
export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";

// Merchant Verification Status
export type VerificationStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

// Base User interface
export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

// Merchant User with additional fields
export interface MerchantUser extends User {
  role: "MERCHANT";
  storeName: string;
  storeDescription?: string;
  category: string;
  region: string;
  city: string;
  address: string;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
}

// Auth Response from login/register
export interface AuthResponse {
  user: User | MerchantUser;
  token: string;
  refreshToken?: string;
}

// Login Request
export interface LoginRequest {
  phoneOrEmail: string;
  password: string;
}

// Consumer Register Request
export interface RegisterRequest {
  phone: string;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Merchant Register Request - Step 1: Basic Info
export interface MerchantBasicInfoRequest {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

// Merchant Register Request - Step 2: Store Info
export interface MerchantStoreInfoRequest {
  storeName: string;
  category: string;
  description: string;
  region: string;
  city: string;
  closestLandmark: string;
}

// Merchant Register Request - Step 3: Password & Terms
export interface MerchantPasswordRequest {
  password: string;
  confirmPassword: string;
  terms: boolean;
}

// Combined Merchant Registration Request
export interface MerchantRegisterRequest {
  // Basic Info
  fullName: string;
  phone: string;
  email: string;
  address: string;
  // Store Info
  storeName: string;
  category: string;
  description: string;
  region: string;
  city: string;
  closestLandmark: string;
  // Password
  password: string;
}

// Merchant Verification Request
export interface MerchantVerificationRequest {
  idType: string;
  idNumber: string;
  frontIdImage: string; // Base64 or URL
  backIdImage: string; // Base64 or URL
  selfieImage: string; // Base64 or URL
}

// Phone Verification Request
export interface PhoneVerificationRequest {
  phone: string;
}

// Phone Verification Confirm
export interface PhoneVerificationConfirmRequest {
  phone: string;
  code: string;
}

// Forgot Password Request
export interface ForgotPasswordRequest {
  phoneOrEmail: string;
}

// Reset Password Request
export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

// Change Password Request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Token Refresh Request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Token Refresh Response
export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

// Auth State for Context
export interface AuthState {
  user: User | MerchantUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}



