// Mock data service for user profile — mirrors exact API response shapes
// Swap imports from users.mock → users.api when backend is ready

import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserStats,
  NotificationPreferences,
  NextOfKin,
} from "./users.types";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockUser: UserProfile = {
  id: "user-001",
  phone: "0200000000",
  email: "example@gmail.com",
  firstName: "Kusi",
  lastName: "Mensah",
  address: "C4600 swellview east street",
  role: "CONSUMER",
  status: "ACTIVE",
  createdAt: "2025-06-01T12:00:00Z",
  updatedAt: "2026-01-20T12:00:00Z",
};

const mockUserStats: UserStats = {
  activeGoals: 4,
  totalSaved: 7000,
  completedGoals: 3,
};

const mockNotificationPreferences: NotificationPreferences = {
  emailNotifications: true,
  smsNotifications: true,
  paymentReminders: true,
  goalUpdates: true,
  promotions: false,
};

const mockNextOfKin: NextOfKin = {
  fullName: "",
  phone: "",
  email: "",
  relationship: "",
};

// ─── Mock Service Functions ──────────────────────────────────────────────────

function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** GET /users/me */
export async function getUserProfile(): Promise<UserProfile> {
  await delay(300);
  return mockUser;
}

/** PATCH /users/me */
export async function updateUserProfile(
  data: UpdateProfileRequest
): Promise<UserProfile> {
  await delay(600);
  return { ...mockUser, ...data, updatedAt: new Date().toISOString() };
}

/** POST /users/me/password */
export async function changePassword(
  _data: ChangePasswordRequest
): Promise<{ success: boolean; message: string }> {
  await delay(600);
  return { success: true, message: "Password changed successfully" };
}

/** Get user stats */
export async function getUserStats(): Promise<UserStats> {
  await delay(300);
  return mockUserStats;
}

/** Get notification preferences */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  await delay(300);
  return mockNotificationPreferences;
}

/** Update notification preferences */
export async function updateNotificationPreferences(
  data: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  await delay(400);
  return { ...mockNotificationPreferences, ...data };
}

/** Get next of kin */
export async function getNextOfKin(): Promise<NextOfKin> {
  await delay(300);
  return mockNextOfKin;
}

/** Update next of kin */
export async function updateNextOfKin(data: NextOfKin): Promise<NextOfKin> {
  await delay(400);
  return data;
}

