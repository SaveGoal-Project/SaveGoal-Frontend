// User Profile Types — mirrors API response shapes

export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  address?: string;
  role: "CONSUMER" | "MERCHANT" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  createdAt: string;
  updatedAt?: string;
}

// Update profile request
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// User stats (for settings header)
export interface UserStats {
  activeGoals: number;
  totalSaved: number;
  completedGoals: number;
}

// Notification preferences
export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  paymentReminders: boolean;
  goalUpdates: boolean;
  promotions: boolean;
}

// Next of kin
export interface NextOfKin {
  fullName: string;
  phone: string;
  email?: string;
  relationship: string;
}

