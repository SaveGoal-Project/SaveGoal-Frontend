# SaveGoal Backend Documentation

## 1. Overview
The SaveGoal backend is a RESTful API service built to support the SaveGoal Save Now, Buy Later (SNBL) platform. It manages user authentication, wallets, savings goals, and payment integrations.

**Tech Stack:**
- **Language:** TypeScript
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching/Rate Limiting:** Redis
- **Authentication:** Better-Auth
- **API Documentation:** Swagger UI

---

## 2. Project Structure
The source code is modular, following a Domain-Driven Design (DDD) approach.
- `src/api`: Contains the Express server setup (`server.ts`), global middleware (CORS, Helmet, Rate limiting), and global route aggregations.
- `src/config`: Environment variables, constants, and Swagger configuration.
- `src/infra`: Infrastructure clients (Prisma Client for DB, ioredis for Redis caching).
- `src/modules`: Domain-specific business logic. Each module typically has routes, controllers/services, and interfaces.
  - `auth`: Phone OTP and Email authentication logic using Better-Auth.
  - `goals`: Handles creation, listing, and funding of user savings goals.
  - `wallet`: Manages user balances and mock deposits.
  - `payments`: Integrates with Paystack (Initialize deposits, Webhooks).
- `src/shared`: Shared utilities, global exceptions (`ApiException`), and response formatters.

---

## 3. Database Schema
Managed via Prisma ORM (`prisma/schema.prisma`).

### Better-Auth Tables
- **User:** Extended with `phone` and `role` (CONSUMER, MERCHANT, ADMIN). Includes relations to Sessions, Accounts, Profiles, Wallets, and Goals.
- **Session:** Tracks active user sessions.
- **Account:** OAuth / external accounts mapping.
- **Verification:** Stores temporary verification data.

### Custom SaveGoal Tables
- **Profile & MerchantProfile:** Stores personal or business-specific information (KYC status, business details, balancing).
- **Wallet:** Tracks users' currency and current balance.
- **Goal:** Tracks user savings goals (`targetAmount`, `currentAmount`, `deadline`, `status`).
- **Transaction:** Logs all financial movements (`type` can be DEPOSIT, WITHDRAWAL, GOAL_FUNDING, GOAL_WITHDRAWAL).

---

## 4. API Endpoints

All responses follow a standard structure:
```json
{
  "success": true | false,
  "data": { ... }, // On success
  "error": { "code": "...", "message": "..." } // On failure
}
```

### Global Endpoints
- **`GET /`**: Welcome route and basic API info.
- **`GET /health`**: Health check endpoints.
- **`GET /api-docs`**: Swagger UI documentation.

### Authentication (`/api/auth`)
Better-Auth handles core sessions, but we have custom wrappers:
- **`POST /api/auth/phone/send-otp`**: Generates and sends a 6-digit OTP via Twilio to a Ghana phone number (+233). Rate limited. Returns OTP in dev mode.
- **`POST /api/auth/phone/verify-otp`**: Validates the OTP against Redis. If successful, creates/finds the user, generates a session, and returns token/user details.
- **`POST /api/auth/email/signup`**: Registers a user with email, password, and name. Automatically creates a `Wallet` for the user upon success.
- **`POST /api/auth/email/signin`**: Logs in a user via email/password.

### Wallet (`/api/wallet`)
*Require authentication (`requireAuth`)*
- **`GET /api/wallet`**: Retrieve the authenticated user's wallet details and balance.
- **`POST /api/wallet/deposit`**: Mock endpoint to simulate depositing money into the wallet. Expects `{ "amount": number }`.

### Goals (`/api/goals`)
*Require authentication (`requireAuth`)*
- **`GET /api/goals`**: List all goals belonging to the user.
- **`POST /api/goals`**: Create a new savings goal. Expects `name`, `targetAmount`, `deadline` (optional), and `description` (optional).
- **`GET /api/goals/:id`**: Retrieve specific goal details by ID.
- **`POST /api/goals/:id/fund`**: Fund a specific goal (deducts from wallet, adds to goal `currentAmount`, creates a Transaction). Expects `{ "amount": number }`.

### Payments (`/api/payments`)
- **`POST /api/payments/deposit`**: *(Requires auth)* Initialize a deposit via a real payment gateway (prepared for Paystack). Expects `{ "amount": number }`.
- **`POST /api/payments/webhook`**: Paystack Webhook handler. Verifies signature, processes `charge.success` events, and fulfills the payment in the DB.

---

## 5. Middleware & Security
- **Authentication (`requireAuth`):** Protects protected routes by verifying the current Better-Auth session token from headers (`Authorization: Bearer <token>`). Injects `req.user`.
- **Rate Limiting:** Limits overall API requests (`standardLimiter`) and restricts Auth routes (`authLimiter`) to prevent brute force attacks. Handled in Redis.
- **Global Error Handling:** Captures `ApiException` and unhandled errors, ensuring uniform JSON error responses and preventing stack trace leaks in production.

This concludes the architectural overview and API structure of the SaveGoal Backend.
