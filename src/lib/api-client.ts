import { API_CONFIG, HTTP_STATUS } from "@/src/config/api.config";
import { ApiError } from "@/src/types/api.types";

// Token storage keys
const ACCESS_TOKEN_KEY = "savegoal_access_token";
const REFRESH_TOKEN_KEY = "savegoal_refresh_token";

// Token management utilities
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken?: string): void => {
    tokenStorage.setAccessToken(accessToken);
    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken);
    }
  },
};

// Custom API Error class
export class ApiClientError extends Error {
  public statusCode: number;
  public code: string;
  public details?: Record<string, string[]>;

  constructor(statusCode: number, error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.code = error.code;
    this.details = error.details;
  }

  // Helper to check if it's a validation error
  isValidationError(): boolean {
    return this.statusCode === HTTP_STATUS.UNPROCESSABLE_ENTITY;
  }

  // Helper to check if it's an auth error
  isAuthError(): boolean {
    return this.statusCode === HTTP_STATUS.UNAUTHORIZED;
  }

  // Helper to check if it's a not found error
  isNotFoundError(): boolean {
    return this.statusCode === HTTP_STATUS.NOT_FOUND;
  }
}

// Request options type
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  skipAuth?: boolean;
}

// Build URL with query params
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

// Main API client
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, timeout = API_CONFIG.TIMEOUT, skipAuth = false, ...fetchOptions } = options;

  // Build headers
  const headers = new Headers(fetchOptions.headers);

  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Add auth token if available and not skipped
  if (!skipAuth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(buildUrl(endpoint, params), {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle no content responses
    if (response.status === HTTP_STATUS.NO_CONTENT) {
      return {} as T;
    }

    // Parse response
    const json = await response.json();

    // Handle error responses
    if (!response.ok || (json.success === false)) {
      const errorData = json.error || json;
      throw new ApiClientError(response.status || 400, {
        code: errorData.code || "UNKNOWN_ERROR",
        message: errorData.message || "An unexpected error occurred",
        details: errorData.details,
      });
    }

    // Unwrap the global response envelope if it exists
    if (json && typeof json === "object" && "success" in json && "data" in json) {
      return json.data as T;
    }

    return json as T;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort/timeout
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiClientError(408, {
        code: "REQUEST_TIMEOUT",
        message: "Request timed out. Please try again.",
      });
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiClientError(0, {
        code: "NETWORK_ERROR",
        message: "Unable to connect to the server. Please check your internet connection.",
      });
    }

    // Re-throw ApiClientError
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Wrap unknown errors
    throw new ApiClientError(500, {
      code: "UNKNOWN_ERROR",
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

// API Client with HTTP methods
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

// File upload helper
export async function uploadFile(
  endpoint: string,
  file: File,
  fieldName: string = "file",
  additionalData?: Record<string, string>
): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append(fieldName, file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  return apiClient.post(endpoint, formData);
}

export default apiClient;



