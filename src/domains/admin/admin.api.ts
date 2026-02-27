import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { AuthResponse } from "@/src/domains/auth/auth.types";
import { AdminLoginRequest } from "./admin.types";

/**
 * Admin login - uses the shared email/signin endpoint, then verifies
 * the authenticated user holds the ADMIN role before returning.
 */
export async function adminLogin(
  credentials: AdminLoginRequest
): Promise<AuthResponse> {
  // The backend returns: { success, data: { user: { id, email, name, phone, role }, session: { token, expiresAt } } }
  // apiClient.post already unwraps `data` from the `success` envelope.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await apiClient.post<any>(
    API_ENDPOINTS.ADMIN.LOGIN,
    credentials,
    { skipAuth: true }
  );

  // ── Role guard: reject non-admin users at the frontend level ──
  const role = response.user?.role;
  if (role !== "ADMIN") {
    throw new Error(
      "Access denied. This account does not have admin privileges."
    );
  }

  // ── Map backend's unified "name" to firstName / lastName ──
  let firstName = "";
  let lastName = "";
  if (response.user?.name) {
    const parts = response.user.name.split(" ");
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  // ── Build the AuthResponse expected by AuthContext ──
  const authResponse: AuthResponse = {
    user: {
      ...response.user,
      firstName,
      lastName,
    },
    token: response.session?.token || response.token,
    refreshToken: response.session?.refreshToken || response.refreshToken,
  };

  return authResponse;
}
