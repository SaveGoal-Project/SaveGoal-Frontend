---
name: SaveGoal Frontend Project Standards
description: Comprehensive coding standards, architecture patterns, and conventions for the SaveGoal frontend application. Read this before implementing any feature or modification.
---

# SaveGoal Frontend — Project Standards

> **Project**: SaveGoal — A savings-goal platform enabling users in Ghana to save towards products via structured plans with no interest or credit checks.
> **Stack**: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · react-hook-form + Zod

---

## 1. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.4 |
| UI Library | React | 19 |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS | 4 |
| Component Library | shadcn/ui (Radix UI) | Latest |
| Form Management | react-hook-form + Zod | Latest |
| Icons | lucide-react | Latest |
| Class Utilities | clsx + tailwind-merge + class-variance-authority | Latest |
| Animation | tailwindcss-animate | Latest |
| Font | Montserrat (Google Fonts via next/font) | 300–800 |

---

## 2. Project Architecture

### 2.1 Directory Structure

```
savegoal-frontend/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (Montserrat font, <Providers>)
│   ├── page.tsx                  # Marketing homepage
│   ├── globals.css               # Global CSS with Tailwind + shadcn CSS vars
│   ├── (auth)/                   # Auth route group (public)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── verification/page.tsx
│   ├── (consumer)/               # Consumer route group (auth-guarded)
│   │   ├── layout.tsx            # Auth guard layout
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── products/page.tsx
│   │   └── goals/[id]/page.tsx
│   ├── (admin)/                  # Admin route group (role-guarded)
│   └── (merchant)/               # Merchant route group (role-guarded)
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives (DO NOT hand-edit)
│   │   ├── forms/                # Form components (LoginForm, RegisterForm, etc.)
│   │   ├── dashboard/            # Dashboard-specific components
│   │   ├── shared/               # Reusable cross-feature components
│   │   ├── settings/             # Settings page tab components
│   │   ├── marketing/            # Landing page marketing components
│   │   ├── layouts/              # Layout components (Navbar, AuthSidebar)
│   │   └── providers/            # Context providers (Providers.tsx)
│   ├── config/                   # Configuration files
│   │   ├── api.config.ts         # API endpoints & HTTP status codes
│   │   ├── app.config.ts         # App-level config (empty, reserved)
│   │   ├── design-tokens.ts      # Brand colors, typography, spacing from Figma
│   │   └── routes.config.ts      # Route constants (empty, reserved)
│   ├── constants/                # App-wide constants
│   ├── contexts/                 # React Context providers
│   │   ├── AuthContext.tsx        # Authentication state + withAuth HOC
│   │   └── NotificationContext.tsx # (Placeholder)
│   ├── domains/                  # Domain-driven modules
│   │   ├── auth/                 # types, api, hooks, validators, mock
│   │   ├── savings-goals/        # types, hooks, mock
│   │   ├── payments/             # types, hooks, mock
│   │   ├── user-profile/         # types, hooks, mock
│   │   ├── products/             # (reserved)
│   │   ├── refunds/              # (reserved)
│   │   ├── merchant/             # (reserved)
│   │   └── admin/                # (reserved)
│   ├── lib/                      # Core utility libraries
│   │   ├── api-client.ts         # Custom fetch wrapper with token mgmt
│   │   ├── utils.ts              # cn() class merging utility
│   │   ├── rbac.ts               # (Placeholder for RBAC)
│   │   └── auth.ts               # (Placeholder)
│   ├── types/                    # Shared TypeScript types
│   │   └── api.types.ts          # ApiResponse, PaginatedResponse, ApiError, etc.
│   ├── hooks/                    # Shared custom hooks (currently empty)
│   ├── features/                 # Feature modules (currently empty)
│   ├── styles/                   # Additional style files
│   └── utils/                    # General utilities
├── docs/                         # Project documentation
│   └── FRONTEND_BACKEND_ALIGNMENT_PLAN.md
├── tailwind.config.ts            # Tailwind + shadcn theme config
├── components.json               # shadcn/ui config
└── package.json
```

### 2.2 Architecture Principles

1. **Domain-Driven Design (DDD)**: Business logic lives in `src/domains/{domain}/`. Each domain is self-contained with its own types, API functions, hooks, validators, and mock data.
2. **Route Groups**: Next.js route groups `(auth)`, `(consumer)`, `(admin)`, `(merchant)` enforce layout and auth boundaries.
3. **Mock-First Development**: All domains use mock data functions that mirror real API shapes. Swap `import from "./domain.mock"` → `"./domain.api"` when backend deploys.
4. **Component Colocation by Feature**: Components are grouped by their feature area (`forms/`, `dashboard/`, `settings/`, `marketing/`), not by type.

---

## 3. Naming Conventions

### 3.1 Files

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `LoginForm.tsx`, `SavingsGoalCard.tsx` |
| Pages | `page.tsx` inside route folder | `app/(auth)/login/page.tsx` |
| Layouts | `layout.tsx` inside route folder | `app/(consumer)/layout.tsx` |
| Domain types | `{domain}.types.ts` | `auth.types.ts`, `savings.types.ts` |
| Domain API | `{domain}.api.ts` | `auth.api.ts`, `payment.api.ts` |
| Domain hooks | `{domain}.hooks.ts` | `auth.hooks.ts`, `savings.hooks.ts` |
| Domain mock | `{domain}.mock.ts` | `auth.mock.ts`, `savings.mock.ts` |
| Domain validators | `{domain}.validators.ts` | `auth.validators.ts` |
| Config files | `{purpose}.config.ts` | `api.config.ts`, `app.config.ts` |
| Utility files | camelCase | `utils.ts`, `api-client.ts` |

### 3.2 Code

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase function | `export function LoginForm()` |
| Custom hooks | `use` prefix, camelCase | `useSavingsGoals`, `usePaymentHistory` |
| Context | `{Name}Context` | `AuthContext` |
| Providers | `{Name}Provider` | `AuthProvider` |
| HOCs | `with` prefix | `withAuth` |
| Types/Interfaces | PascalCase | `UserProfile`, `SavingsGoal` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINTS`, `HTTP_STATUS` |
| Enums (as string unions) | UPPER_SNAKE_CASE values | `"CONSUMER" | "MERCHANT" | "ADMIN"` |

### 3.3 Imports

Always use the `@/` path alias (maps to project root):

```typescript
// ✅ Correct
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/contexts/AuthContext";
import { SavingsGoal } from "@/src/domains/savings-goals/savings.types";

// ❌ Wrong
import { Button } from "../../../components/ui/button";
```

---

## 4. State Management Patterns

### 4.1 Global State — React Context API

Only `AuthContext` currently exists for global state. New global state should follow the same pattern:

```typescript
// src/contexts/AuthContext.tsx pattern:
"use client";

const Context = createContext<ContextValue | undefined>(undefined);

export function Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  
  const action = useCallback(async (params) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await apiCall(params);
      setState(prev => ({ ...prev, data: result, isLoading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  }, []);

  return <Context.Provider value={{ ...state, action }}>{children}</Context.Provider>;
}

export function useHook() {
  const context = useContext(Context);
  if (!context) throw new Error("useHook must be used within Provider");
  return context;
}
```

### 4.2 Domain-Level State — Custom Hooks

All domain hooks follow a **consistent pattern**:

```typescript
// Standard data-fetching hook pattern:
export function useDomainResource() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mockOrApiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Standard mutation hook pattern:
export function useDomainAction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(async (params: Params) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await mockOrApiFunction(params);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { execute, isLoading, error, success };
}
```

**Return shape**: `{ data, isLoading, error, refetch? }` for queries; `{ execute, isLoading, error, success }` for mutations.

### 4.3 Component-Level State

Use `useState` for UI-only state (tabs, modals, form visibility, etc.):

```typescript
const [activeTab, setActiveTab] = useState("profile");
const [showPassword, setShowPassword] = useState(false);
const [isSortOpen, setIsSortOpen] = useState(false);
```

---

## 5. Component Patterns

### 5.1 Client Components

All interactive components must use the `"use client"` directive:

```typescript
"use client";

import { useState } from "react";
// ... component code
```

### 5.2 shadcn/ui Components

- Located in `src/components/ui/`
- **DO NOT hand-edit** these files — they are managed by `npx shadcn@latest add`
- Import via: `import { Button } from "@/src/components/ui/button"`
- Currently installed: alert, avatar, badge, breadcrumb, button, card, checkbox, context-menu, dialog, dropdown-menu, form, input, label, navigation-menu, popover, progress, radio-group, select, separator, skeleton, table, tabs, textarea, tooltip

### 5.3 Form Components

Forms use **react-hook-form** with **Zod** schemas and shadcn/ui `<Form>` wrapper:

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";

const schema = z.object({
  field: z.string().min(1, "Required"),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { field: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => { /* ... */ };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### 5.4 Loading & Error States

Components must handle three states: loading, error, and data:

```typescript
if (isLoading) return <div className="animate-pulse">Loading...</div>;
if (error) return <div className="text-red-500">{error}</div>;
if (!data) return null;
// Render data...
```

For buttons during async actions:

```typescript
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Processing...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

---

## 6. Styling Standards

### 6.1 Tailwind CSS Conventions

- **Use Tailwind utility classes** for all styling
- **Use `cn()` helper** from `src/lib/utils.ts` for conditional classes:

```typescript
import { cn } from "@/src/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" ? "primary-classes" : "secondary-classes"
)} />
```

### 6.2 Brand Colors (Inline Hex Values)

The project uses **inline hex values** in Tailwind classes rather than CSS variables for brand-specific colors:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Navy | `#2C3466` | Buttons, links, focus rings |
| Primary Dark | `#141936` | Gradients (dark end) |
| Primary Light | `#4556c0` | Gradients (light end) |
| Brand Blue | `#3d4a99` | Categories, marketing accents |
| Accent Yellow | `#ffce31` | CTA highlights |
| Brand Blue Alt | `#1a53c8` | Primary brand blue |

**Usage**: `bg-[#2C3466]`, `text-[#3d4a99]`, `focus:ring-[#2C3466]`

### 6.3 CSS Variables (shadcn/ui Theme)

For theme-consistent colors, use the CSS variable system:

```css
/* globals.css defines: */
--background, --foreground, --primary, --secondary, --muted,
--accent, --destructive, --border, --input, --ring, --radius
```

Usage: `bg-background`, `text-foreground`, `border-border`

### 6.4 Common Class Patterns

```typescript
// Input fields
className="h-12 border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#2C3466] focus:ring-[#2C3466]"

// Primary button
className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl"

// Card containers
className="bg-white rounded-2xl border border-gray-100 p-6"

// Section backgrounds
className="bg-[#f0f1f7]" // Light blue-gray
className="bg-gradient-to-b from-[#141936] to-[#4556c0]" // Auth sidebar
```

### 6.5 Responsive Design

Use Tailwind breakpoint prefixes:

```typescript
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
className="hidden lg:flex" // Desktop only
className="text-3xl md:text-5xl" // Responsive typography
```

### 6.6 Design Tokens Reference

The `src/config/design-tokens.ts` file contains Figma-extracted tokens:
- Colors: brand, accent, neutral, semantic
- Typography: Montserrat font family, sizes (xs–5xl), weights (300–800)
- Spacing: xs(4)–5xl(64)
- Border Radius: sm(4)–full(9999)
- Shadows: sm, md, lg
- Breakpoints: sm(640)–2xl(1536)

---

## 7. Domain Module Standards

### 7.1 Creating a New Domain

When adding a new domain (e.g., `refunds`), create these files:

```
src/domains/refunds/
├── refunds.types.ts      # TypeScript interfaces & types
├── refunds.api.ts        # API functions using apiClient
├── refunds.hooks.ts      # Custom React hooks
├── refunds.mock.ts       # Mock data & mock service functions
├── refunds.validators.ts # Zod validation schemas (if forms exist)
└── index.ts              # Barrel exports (optional)
```

### 7.2 Type Definitions (`*.types.ts`)

```typescript
// Mirror the API response shape exactly
export interface Refund {
  id: string;
  userId: string;
  amount: number;
  status: RefundStatus;
  createdAt: string;
  updatedAt?: string;
}

export type RefundStatus = "PENDING" | "APPROVED" | "REJECTED";

// Request/Response types
export interface CreateRefundRequest {
  goalId: string;
  reason: string;
}
```

### 7.3 Mock Data (`*.mock.ts`)

```typescript
import { Refund } from "./refunds.types";

// Mock data mirrors API shape
const mockRefunds: Refund[] = [/* ... */];

// Simulate network delay
function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** GET /refunds */
export async function getRefunds(): Promise<Refund[]> {
  await delay(300);
  return mockRefunds;
}
```

### 7.4 API Functions (`*.api.ts`)

```typescript
import { apiClient } from "@/src/lib/api-client";
import { API_ENDPOINTS } from "@/src/config/api.config";
import { Refund, CreateRefundRequest } from "./refunds.types";

export async function getRefunds(): Promise<Refund[]> {
  return apiClient.get(API_ENDPOINTS.REFUNDS.LIST);
}

export async function createRefund(data: CreateRefundRequest): Promise<Refund> {
  return apiClient.post(API_ENDPOINTS.REFUNDS.CREATE, data);
}
```

### 7.5 Hooks (`*.hooks.ts`)

Follow the standard hook pattern from §4.2. Import from `*.mock.ts` during development, switch to `*.api.ts` for production.

---

## 8. API Client Standards

### 8.1 Current Implementation (`src/lib/api-client.ts`)

- Custom `fetch` wrapper with interceptors
- Token management via `localStorage` (access + refresh tokens)
- `ApiClientError` class for structured errors
- Configurable timeouts and retries
- File upload via `uploadFile` utility

### 8.2 Usage

```typescript
import { apiClient } from "@/src/lib/api-client";

// GET
const data = await apiClient.get<ResponseType>("/endpoint");

// POST
const result = await apiClient.post<ResponseType>("/endpoint", body);

// With options
const data = await apiClient.get<T>("/endpoint", {
  params: { page: 1, limit: 20 },
  skipAuth: true,  // For public endpoints
  timeout: 10000,
});
```

### 8.3 Backend Alignment (Future)

When the backend deploys, the auth mechanism will switch from **Bearer tokens** to **cookie-based sessions** (better-auth). See `docs/FRONTEND_BACKEND_ALIGNMENT_PLAN.md` for the migration plan.

---

## 9. Routing & Auth Guards

### 9.1 Route Groups

| Group | Path | Auth | Description |
|-------|------|------|-------------|
| `(auth)` | `/login`, `/register`, etc. | Public | Authentication pages |
| `(consumer)` | `/dashboard`, `/settings`, etc. | Required | Consumer-facing pages |
| `(admin)` | `/admin/*` | Required + ADMIN role | Admin pages |
| `(merchant)` | `/merchant/*` | Required + MERCHANT role | Merchant pages |

### 9.2 Consumer Layout Auth Guard Pattern

```typescript
// app/(consumer)/layout.tsx
"use client";
export default function ConsumerLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
```

### 9.3 User Roles

```typescript
type UserRole = "CONSUMER" | "MERCHANT" | "ADMIN";
type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
```

---

## 10. Currency & Locale

- **Currency**: Ghana Cedi (GHS / GH¢)
- **Format**: `GH¢ 7,400` or `GHS 7,000.00`
- **Phone Format**: Ghana phone numbers (`+233XXXXXXXXX` or `0XXXXXXXXX`)
- **Payment Methods**: Mobile Money (MTN MoMo, Telecel Cash, AT Money), Visa, Mastercard
- **Payment Gateway**: Paystack (planned)

---

## 11. Testing & Verification Standards

### 11.1 Mock Mode

Set `NEXT_PUBLIC_USE_MOCK_AUTH=true` in `.env.local` for mock authentication during development.

### 11.2 Running the Dev Server

```bash
npm run dev
# Runs at http://localhost:3000
```

### 11.3 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001   # Backend API URL
NEXT_PUBLIC_USE_MOCK_AUTH=true              # Enable mock auth
```

---

## 12. Code Quality Rules

1. **All components are client components** — use `"use client"` directive
2. **No inline API calls in components** — always go through domain hooks
3. **No direct `fetch` calls** — use `apiClient` from `src/lib/api-client.ts`
4. **No hand-editing `src/components/ui/`** — managed by shadcn CLI
5. **Type everything** — no `any` types, define interfaces for all data structures
6. **Handle all states** — loading, error, empty, and success for every async operation
7. **Use Zod for all form validation** — colocate schemas in domain `*.validators.ts`
8. **Use `cn()` for conditional classes** — never string concatenation for Tailwind
9. **Ghana-specific context** — all currency in GHS, phone in +233 format

---

## 13. Adding a New Page Checklist

1. Create the route file: `app/(group)/route-name/page.tsx`
2. Add `"use client"` directive
3. Import and use domain hooks for data
4. Follow existing layout patterns (Navbar, container widths, spacing)
5. Handle loading/error/empty states
6. Use shadcn/ui components and brand color conventions
7. Add mock data in the appropriate domain `*.mock.ts` if needed
8. Update `src/config/api.config.ts` with new endpoints if applicable

---

## 14. Adding a New Component Checklist

1. Determine the correct directory:
   - `ui/` → Only via `npx shadcn@latest add`
   - `forms/` → Form-specific components
   - `dashboard/` → Dashboard widgets
   - `shared/` → Reusable across features
   - `settings/` → Settings page tabs
   - `marketing/` → Landing page sections
   - `layouts/` → Navigation and structural layouts
2. Use PascalCase filename matching the component name
3. Add `"use client"` if interactive
4. Accept `className?: string` prop for style customization
5. Use `cn()` for class merging
6. Export as a named export (not default)

---

## 15. Key Reference Files

| Purpose | File |
|---------|------|
| Root layout & font | `app/layout.tsx` |
| Global styles & CSS vars | `app/globals.css` |
| Tailwind config | `tailwind.config.ts` |
| API endpoints | `src/config/api.config.ts` |
| Design tokens (Figma) | `src/config/design-tokens.ts` |
| API client | `src/lib/api-client.ts` |
| Auth context | `src/contexts/AuthContext.tsx` |
| Shared types | `src/types/api.types.ts` |
| Class utility | `src/lib/utils.ts` |
| Backend migration plan | `docs/FRONTEND_BACKEND_ALIGNMENT_PLAN.md` |
