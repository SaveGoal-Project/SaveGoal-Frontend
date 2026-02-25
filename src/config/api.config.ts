// API Configuration
// Base URL will be set via environment variable

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.savegoal.com/api/v1",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/email/signin",
    REGISTER: "/auth/email/signup",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    SEND_OTP: "/auth/phone/send-otp",
    VERIFY_PHONE: "/auth/phone/verify-otp",
    VERIFY_EMAIL: "/auth/verify-email",
    REFRESH_TOKEN: "/auth/refresh-token",
  },

  // Merchant Authentication
  MERCHANT_AUTH: {
    REGISTER: "/auth/merchant/register",
    VERIFY_BUSINESS: "/auth/merchant/verify-business",
    UPLOAD_ID: "/auth/merchant/upload-id",
    UPLOAD_SELFIE: "/auth/merchant/upload-selfie",
  },

  // Know Your Customer (Verification)
  KYC: {
    STATUS: "/kyc/status",
    SUBMIT: "/kyc/submit",
  },

  // Users
  USERS: {
    ME: "/users/me",
    UPDATE_PROFILE: "/users/me",
    CHANGE_PASSWORD: "/users/me/password",
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    DETAILS: (id: string) => `/products/${id}`,
    CATEGORIES: "/products/categories",
    SEARCH: "/products/search",
  },

  // Savings Goals
  SAVINGS: {
    LIST: "/goals",
    CREATE: "/goals",
    DETAILS: (id: string) => `/goals/${id}`,
    DEPOSIT: (id: string) => `/goals/${id}/deposit`,
    CANCEL: (id: string) => `/goals/${id}/cancel`,
    PAUSE: (id: string) => `/goals/${id}/pause`,
  },

  // Payments
  PAYMENTS: {
    INITIATE: "/payments/initiate",
    VERIFY: (reference: string) => `/payments/verify/${reference}`,
    HISTORY: "/payments/history",
  },

  // Merchant
  MERCHANT: {
    DASHBOARD: "/merchant/dashboard",
    PRODUCTS: "/merchant/products",
    ORDERS: "/merchant/orders",
    PAYOUTS: "/merchant/payouts",
    ANALYTICS: "/merchant/analytics",
  },

  // Refunds
  REFUNDS: {
    REQUEST: "/refunds",
    STATUS: (id: string) => `/refunds/${id}`,
  },

  // Admin
  ADMIN: {
    LOGIN: "/auth/admin/login",
    DASHBOARD: "/admin/dashboard",
    USERS: {
      LIST: "/admin/users",
      DETAILS: (id: string) => `/admin/users/${id}`,
    },
    MERCHANTS: {
      LIST: "/admin/merchants",
      DETAILS: (id: string) => `/admin/merchants/${id}`,
    },
    PLANS: {
      LIST: "/admin/plans",
      DETAILS: (id: string) => `/admin/plans/${id}`,
    },
    PAYMENTS: {
      LIST: "/admin/payments",
      DETAILS: (id: string) => `/admin/payments/${id}`,
    },
    DISPUTES: {
      LIST: "/admin/disputes",
      DETAILS: (id: string) => `/admin/disputes/${id}`,
    },
    RISK: {
      OVERVIEW: "/admin/risk",
      INVESTIGATION: (id: string) => `/admin/risk/${id}`,
    },
    ANALYTICS: "/admin/analytics",
    SETTINGS: "/admin/settings",
    SYSTEM_HEALTH: "/admin/system-health",
    ROLES: {
      LIST: "/admin/roles",
      CREATE: "/admin/roles",
      UPDATE: (id: string) => `/admin/roles/${id}`,
      DELETE: (id: string) => `/admin/roles/${id}`,
    },
    AUDIT: "/admin/audit",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;



