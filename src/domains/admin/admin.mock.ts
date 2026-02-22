import { AuthResponse } from "@/src/domains/auth/auth.types";
import { AdminLoginRequest } from "./admin.types";

const MOCK_ADMIN = {
  id: "admin-001",
  phone: "0200000001",
  email: "admin@savegoal.com",
  firstName: "Admin",
  lastName: "User",
  role: "ADMIN" as const,
  status: "ACTIVE" as const,
  createdAt: "2025-06-01T12:00:00Z",
};

function delay(ms: number = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Mock admin login - accepts admin@savegoal.com with any password */
export async function mockAdminLogin(
  credentials: AdminLoginRequest
): Promise<AuthResponse> {
  await delay();

  const isAdminEmail =
    credentials.email.toLowerCase() === "admin@savegoal.com";

  if (!isAdminEmail) {
    throw new Error("Invalid admin credentials. Use admin@savegoal.com");
  }

  return {
    user: MOCK_ADMIN,
    token: "mock-admin-token",
    refreshToken: "mock-admin-refresh",
  };
}
