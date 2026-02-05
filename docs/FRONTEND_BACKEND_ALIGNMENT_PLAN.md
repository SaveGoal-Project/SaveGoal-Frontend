# 🔄 Frontend-Backend Alignment Plan

> **Created:** January 31, 2026  
> **Status:** Planning (Backend not yet deployed)  
> **Purpose:** Guide for aligning frontend with backend API when deployment is ready

---

## 📊 Backend API Analysis Summary

### 1. Authentication System

The backend uses **better-auth** library (NOT custom JWT!):

- **Session-based authentication** (cookie-based, not Bearer tokens)
- Email/password login via `/api/auth/*` (handled by better-auth)
- Phone OTP as custom route: `/api/auth/phone/*`
- User roles: `CONSUMER`, `MERCHANT`, `ADMIN`

### 2. API Response Structure

**All responses follow this standardized format:**

```typescript
// Success Response
{
  success: true,
  data: T,
  meta?: { page?: number, limit?: number, total?: number },
  timestamp: string
}

// Error Response
{
  success: false,
  data: null,
  error: { code: string, message: string, details?: unknown },
  timestamp: string
}
```

### 3. API Endpoints (Backend Reference)

| Route | Method | Auth Required | Description |
|-------|--------|---------------|-------------|
| `/api/auth/*` | ALL | No | better-auth routes (login, register, etc.) |
| `/api/auth/phone/send-otp` | POST | No | Send OTP to phone |
| `/api/auth/phone/verify-otp` | POST | No | Verify OTP & create session |
| `/api/wallet` | GET | Yes | Get wallet balance |
| `/api/wallet/deposit` | POST | Yes | Mock deposit (testing) |
| `/api/goals` | GET | Yes | List all goals |
| `/api/goals` | POST | Yes | Create new goal |
| `/api/goals/:id` | GET | Yes | Get goal details |
| `/api/goals/:id/fund` | POST | Yes | Fund goal from wallet |
| `/api/payments/deposit` | POST | Yes | Initialize Paystack deposit |
| `/api/payments/webhook` | POST | No | Paystack webhook |
| `/health` | GET | No | Health check |

### 4. Key Constants (from Backend)

```typescript
// Phone validation (Ghana)
GHANA_PHONE_REGEX: /^\+233[0-9]{9}$/

// OTP
OTP_LENGTH: 6
OTP_EXPIRY_SECONDS: 300 // 5 minutes

// Session
SESSION_EXPIRY_SECONDS: 7 * 24 * 60 * 60 // 7 days

// Pagination
DEFAULT_PAGE_SIZE: 20
MAX_PAGE_SIZE: 100
```

---

## 🔴 Key Differences from Current Frontend

| Area | Current Frontend | Backend Reality | Action Needed |
|------|-----------------|-----------------|---------------|
| **Auth Library** | Custom JWT with Bearer tokens | `better-auth` with cookies/sessions | Major refactor needed |
| **Response Format** | `{ data: T }` | `{ success, data, timestamp }` | Update API client |
| **Error Format** | `{ code, message }` | `{ success: false, error: {...} }` | Update error handling |
| **Login Endpoint** | `/auth/login` | `/api/auth/sign-in/email` | Update endpoint |
| **Register Endpoint** | `/auth/register` | `/api/auth/sign-up/email` | Update endpoint |
| **Phone OTP** | `/auth/verify-phone` | `/api/auth/phone/send-otp` | Update endpoint |
| **Goals Endpoint** | `/savings-goals` | `/api/goals` | Update endpoint |
| **Token Storage** | localStorage | HTTP-only cookies | Remove token logic |
| **Merchant Register** | Custom endpoint | ❌ Not in backend yet | Discuss with team |

---

## 📋 Files to Update When Backend Deploys

### Phase 1: Core API Layer Updates

#### 1. `src/config/api.config.ts`

Update endpoints to match backend:

```typescript
export const API_ENDPOINTS = {
  // better-auth handles these at /api/auth/*
  AUTH: {
    SIGN_UP: "/api/auth/sign-up/email",
    SIGN_IN: "/api/auth/sign-in/email",
    SIGN_OUT: "/api/auth/sign-out",
    SESSION: "/api/auth/get-session",
  },
  
  // Custom phone OTP routes
  PHONE_OTP: {
    SEND: "/api/auth/phone/send-otp",
    VERIFY: "/api/auth/phone/verify-otp",
  },
  
  // Wallet
  WALLET: {
    GET: "/api/wallet",
    DEPOSIT: "/api/wallet/deposit",
  },
  
  // Goals (Savings)
  GOALS: {
    LIST: "/api/goals",
    CREATE: "/api/goals",
    DETAILS: (id: string) => `/api/goals/${id}`,
    FUND: (id: string) => `/api/goals/${id}/fund`,
  },
  
  // Payments
  PAYMENTS: {
    DEPOSIT: "/api/payments/deposit",
  },
  
  // Health
  HEALTH: {
    CHECK: "/health",
    DB: "/health/db",
    REDIS: "/health/redis",
  },
} as const;
```

#### 2. `src/types/api.types.ts`

Update to match backend response structure:

```typescript
// Standard API Response wrapper (matches backend)
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

#### 3. `src/lib/api-client.ts`

Major changes needed:

```typescript
// Key changes:
// 1. Remove Bearer token handling
// 2. Add credentials: 'include' for cookies
// 3. Update response parsing for new format
// 4. Update error handling for new format

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(endpoint, params), {
    ...fetchOptions,
    headers,
    credentials: 'include', // IMPORTANT: For cookie-based auth
    signal: controller.signal,
  });

  const result = await response.json();

  // Handle new response format
  if (!result.success) {
    throw new ApiClientError(response.status, {
      code: result.error.code,
      message: result.error.message,
      details: result.error.details,
    });
  }

  return result.data as T;
}

// Remove tokenStorage entirely - better-auth uses cookies
```

#### 4. `src/domains/auth/auth.types.ts`

Update to match backend user model:

```typescript
// User Roles
export type UserRole = "CONSUMER" | "MERCHANT" | "ADMIN";

// User (matches better-auth + custom fields)
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Session (from better-auth)
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

// Phone OTP Request
export interface SendOtpRequest {
  phone: string; // Must be +233XXXXXXXXX format
}

export interface SendOtpResponse {
  message: string;
}

// Phone OTP Verify
export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  name?: string; // Optional, for new user registration
}

export interface VerifyOtpResponse {
  user: {
    id: string;
    phone: string;
    name: string;
    role: UserRole;
  };
  session: {
    token: string;
    expiresAt: string;
  };
}

// Email Sign Up (better-auth)
export interface EmailSignUpRequest {
  email: string;
  password: string;
  name: string;
}

// Email Sign In (better-auth)
export interface EmailSignInRequest {
  email: string;
  password: string;
}
```

#### 5. `src/domains/auth/auth.api.ts`

Update to use better-auth endpoints:

```typescript
// Email/Password Registration (better-auth)
export async function signUpWithEmail(data: EmailSignUpRequest): Promise<User> {
  return apiClient.post(API_ENDPOINTS.AUTH.SIGN_UP, data);
}

// Email/Password Login (better-auth)
export async function signInWithEmail(data: EmailSignInRequest): Promise<User> {
  return apiClient.post(API_ENDPOINTS.AUTH.SIGN_IN, data);
}

// Sign Out (better-auth)
export async function signOut(): Promise<void> {
  return apiClient.post(API_ENDPOINTS.AUTH.SIGN_OUT);
}

// Get Current Session (better-auth)
export async function getSession(): Promise<{ user: User; session: Session } | null> {
  try {
    return await apiClient.get(API_ENDPOINTS.AUTH.SESSION);
  } catch {
    return null;
  }
}

// Phone OTP - Send
export async function sendPhoneOtp(phone: string): Promise<SendOtpResponse> {
  return apiClient.post(API_ENDPOINTS.PHONE_OTP.SEND, { phone });
}

// Phone OTP - Verify
export async function verifyPhoneOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  return apiClient.post(API_ENDPOINTS.PHONE_OTP.VERIFY, data);
}
```

---

### Phase 2: New Domain Files

#### 6. Create `src/domains/wallet/wallet.types.ts`

```typescript
export interface Wallet {
  id: string;
  userId: string;
  currency: "GHS";
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "DEPOSIT" | "GOAL_FUNDING" | "WITHDRAWAL";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Transaction {
  id: string;
  walletId: string;
  goalId?: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reference: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DepositRequest {
  amount: number;
}

export interface DepositResponse {
  wallet: Wallet;
  transaction: Transaction;
}
```

#### 7. Create `src/domains/wallet/wallet.api.ts`

```typescript
import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { Wallet, DepositRequest, DepositResponse } from "./wallet.types";

export async function getWallet(): Promise<Wallet> {
  return apiClient.get(API_ENDPOINTS.WALLET.GET);
}

export async function deposit(data: DepositRequest): Promise<DepositResponse> {
  return apiClient.post(API_ENDPOINTS.WALLET.DEPOSIT, data);
}
```

#### 8. Create `src/domains/goals/goals.types.ts`

```typescript
export type GoalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  description?: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  name: string;
  targetAmount: number;
  deadline?: string;
  description?: string;
}

export interface FundGoalRequest {
  amount: number;
}

export interface FundGoalResponse {
  goal: Goal;
  transaction: Transaction;
}
```

#### 9. Create `src/domains/goals/goals.api.ts`

```typescript
import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { Goal, CreateGoalRequest, FundGoalRequest, FundGoalResponse } from "./goals.types";

export async function getGoals(): Promise<Goal[]> {
  return apiClient.get(API_ENDPOINTS.GOALS.LIST);
}

export async function createGoal(data: CreateGoalRequest): Promise<Goal> {
  return apiClient.post(API_ENDPOINTS.GOALS.CREATE, data);
}

export async function getGoal(id: string): Promise<Goal> {
  return apiClient.get(API_ENDPOINTS.GOALS.DETAILS(id));
}

export async function fundGoal(id: string, data: FundGoalRequest): Promise<FundGoalResponse> {
  return apiClient.post(API_ENDPOINTS.GOALS.FUND(id), data);
}
```

#### 10. Create `src/domains/payments/payments.types.ts`

```typescript
export interface InitializeDepositRequest {
  amount: number;
}

export interface InitializeDepositResponse {
  authorization_url: string;
  reference: string;
}
```

#### 11. Create `src/domains/payments/payments.api.ts`

```typescript
import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { InitializeDepositRequest, InitializeDepositResponse } from "./payments.types";

export async function initializeDeposit(data: InitializeDepositRequest): Promise<InitializeDepositResponse> {
  return apiClient.post(API_ENDPOINTS.PAYMENTS.DEPOSIT, data);
}
```

---

### Phase 3: Context Updates

#### 12. Update `src/contexts/AuthContext.tsx`

Key changes:
- Use better-auth session management
- Use cookie-based authentication (no localStorage tokens)
- Update session check logic to use `/api/auth/get-session`

```typescript
// Initialize auth state on mount
useEffect(() => {
  const initializeAuth = async () => {
    try {
      const session = await getSession();
      if (session) {
        setState({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  initializeAuth();
}, []);
```

---

## ⚠️ Questions for Backend Team

Before implementing, clarify with your backend team:

### Critical Questions

1. **Merchant Registration**
   - The current backend doesn't have merchant-specific registration
   - How will merchants register? Separate endpoint? Role upgrade?

2. **better-auth Client SDK**
   - Will they provide a client SDK (like `@better-auth/client`)?
   - Or should we use the REST API directly?

3. **Session Refresh**
   - How does session refresh work with better-auth?
   - Is it automatic or do we need to call an endpoint?

4. **User Profile Updates**
   - What endpoint for updating user profile (name, email, phone)?
   - Is there a `/api/users/me` endpoint?

5. **Ghana Card/ID Verification**
   - Where does merchant ID verification get stored?
   - Is there an upload endpoint for ID documents?

6. **Password Reset**
   - Is password reset handled by better-auth?
   - What's the flow (email link vs OTP)?

### Nice to Have

7. **Products/Catalog**
   - Will there be a products module for merchants?
   - What endpoints for product CRUD?

8. **Notifications**
   - Any WebSocket or push notification support?

9. **File Uploads**
   - What endpoint for uploading images (profile, products, ID)?
   - Direct to S3/Cloudinary or through backend?

---

## 🚀 Implementation Order (When Backend Deploys)

### Step 1: Foundation (Day 1)
1. ✅ Update `src/types/api.types.ts` - Match response format
2. ✅ Update `src/lib/api-client.ts` - Cookie auth, new response parsing
3. ✅ Update `src/config/api.config.ts` - Correct endpoints

### Step 2: Authentication (Day 1-2)
4. ✅ Update `src/domains/auth/auth.types.ts` - Match backend models
5. ✅ Update `src/domains/auth/auth.api.ts` - Use better-auth + phone OTP
6. ✅ Update `src/contexts/AuthContext.tsx` - Session-based auth
7. ✅ Test login/register flow with backend

### Step 3: Core Features (Day 2-3)
8. ✅ Create wallet domain - Types, API, hooks
9. ✅ Create goals domain - Types, API, hooks
10. ✅ Create payments domain - Paystack integration

### Step 4: UI Updates (Day 3-4)
11. ✅ Update LoginForm - Connect to real API
12. ✅ Update RegisterForm - Connect to real API
13. ✅ Update MerchantRegisterForm - Connect to real API (if endpoint exists)

### Step 5: New Pages (Day 4-5)
14. ✅ Build Dashboard page - Show goals, wallet balance
15. ✅ Build Goals page - List, create, fund goals
16. ✅ Build Wallet page - Balance, deposit, history

### Step 6: Testing & Polish (Day 5+)
17. ✅ End-to-end testing
18. ✅ Error handling edge cases
19. ✅ Loading states and UX polish

---

## 📁 Environment Variables

Update `.env.local` when backend is deployed:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.savegoal.com

# For local development
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📚 Reference: Backend File Structure

```
docs/
├── api/
│   ├── server.ts                 # Express server setup
│   ├── routes/v1/
│   │   └── health.routes.ts      # Health check endpoints
│   └── middlewares/
│       └── rateLimit.middleware.ts
├── config/
│   ├── env.config.ts             # Environment validation
│   └── constants.ts              # App constants
├── modules/
│   ├── auth/
│   │   ├── auth.ts               # better-auth configuration
│   │   ├── auth.routes.ts        # Auth route handler
│   │   ├── auth.middleware.ts    # requireAuth, requireRole
│   │   └── phone/
│   │       └── phone-otp.routes.ts # Phone OTP endpoints
│   ├── wallet/
│   │   ├── wallet.routes.ts
│   │   └── wallet.service.ts
│   ├── goals/
│   │   ├── goals.routes.ts
│   │   └── goals.service.ts
│   └── payments/
│       ├── payment.routes.ts
│       ├── payment.service.ts
│       └── providers/
│           └── paystack.provider.ts
└── shared/
    ├── utils/
    │   └── response.util.ts      # Standard response helpers
    └── exceptions/
        └── api.exception.ts      # Custom exception class
```

---

## ✅ Checklist

Use this checklist when backend is deployed:

- [ ] Backend team confirms deployment URL
- [ ] Update `NEXT_PUBLIC_API_URL` in `.env.local`
- [ ] Test health endpoint: `GET /health`
- [ ] Update API types to match backend response format
- [ ] Update API client for cookie-based auth
- [ ] Update auth endpoints and test login
- [ ] Update auth endpoints and test registration
- [ ] Test phone OTP flow
- [ ] Implement wallet domain
- [ ] Implement goals domain
- [ ] Implement payments domain
- [ ] Update all forms to use real API
- [ ] Build dashboard pages
- [ ] End-to-end testing
- [ ] Production deployment

---

*This document should be updated as the backend evolves and new endpoints are added.*

