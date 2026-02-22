import { apiClient, tokenStorage } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { AuthResponse } from "@/src/domains/auth/auth.types";
import { AdminLoginRequest } from "./admin.types";

/**
 * Admin login - uses admin-only endpoint
 * Swap to mock when backend is not ready
 */
export async function adminLogin(
  credentials: AdminLoginRequest
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.ADMIN.LOGIN,
    credentials,
    { skipAuth: true }
  );

  tokenStorage.setTokens(response.token, response.refreshToken);
  return response;
}
