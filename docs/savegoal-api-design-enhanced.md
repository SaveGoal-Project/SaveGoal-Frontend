# SaveGoal API Design Specification - Enhanced Documentation

> **Version:** 1.0 (Web-First, SNBL Only)  
> **API Style:** RESTful  
> **Base URL:** `https://api.savegoal.com/api/v1`  
> **Authentication:** JWT (JSON Web Token)

---

## Table of Contents

1. [API Overview](#1-api-overview)
2. [Authentication and Security](#2-authentication-and-security)
3. [Request and Response Conventions](#3-request-and-response-conventions)
4. [API Endpoints Reference](#4-api-endpoints-reference)
5. [Webhook Integrations](#5-webhook-integrations)
6. [Error Handling](#6-error-handling)
7. [Rate Limiting](#7-rate-limiting)
8. [API Versioning](#8-api-versioning)

---

## 1. API Overview

### What is a REST API?

A **REST (Representational State Transfer) API** is an architectural style for building web services that use standard HTTP methods to perform operations on resources.

| HTTP Method | Operation | Example |
|-------------|-----------|---------|
| `GET` | Read/Retrieve data | Get list of products |
| `POST` | Create new resource | Create a savings goal |
| `PATCH` | Partial update | Update user profile |
| `PUT` | Full replacement | Replace entire resource |
| `DELETE` | Remove resource | Delete a product |

### API Architecture Diagram

```
API REQUEST FLOW
================

    Clients                 Gateway Layer                     Backend Services
    
    [Web App] --------> [ Load Balancer ] ------------------> [ Auth Service ]
                                |
                                v
                        [ Rate Limiter  ] ------------------> [ Product Service ]
                                |
                                v
                        [ Auth Check    ] ------------------> [ Savings Service ]
                        (JWT Validation)
                                |                             [ Payment Service ]
                                +---------------------------> 
                                                              [ Merchant Service]
                                                              
                                                              [ Admin Service   ]
```

### API Endpoint Summary

| Category | Base Path | Description | Auth Required |
|----------|-----------|-------------|---------------|
| **Authentication** | `/auth/*` | Login, register, password reset | Varies |
| **Users** | `/users/*` | Profile management | Yes |
| **Products** | `/products/*` | Product catalog (public browsing) | No (read), Yes (write) |
| **Savings Goals** | `/savings-goals/*` | SNBL goal management | Yes (Consumer) |
| **Payments** | `/payments/*` | Payment transactions | Yes |
| **Refunds** | `/refunds/*` | Refund requests | Yes |
| **Merchant** | `/merchant/*` | Merchant dashboard operations | Yes (Merchant) |
| **Admin** | `/admin/*` | Administration | Yes (Admin) |
| **Webhooks** | `/webhooks/*` | External service callbacks | Signature verification |

---

## 2. Authentication and Security

### JWT (JSON Web Token) Explained

A JWT is a compact, self-contained token for securely transmitting information between parties. SaveGoal uses JWTs for authentication.

**JWT Structure:**
`header.payload.signature`

```
JWT VISUALIZATION
=================

+-----------------------+      +------------------------+      +-------------------------+
|      HEADER           |      |      PAYLOAD           |      |      SIGNATURE          |
| {                     |      | {                      |      | HMACSHA256(             |
|  "alg": "HS256",      |  .   |  "sub": "user_id",     |  .   |   base64Url(header) +   |
|  "typ": "JWT"         |      |  "role": "CONSUMER",   |      |   "." +                 |
| }                     |      |  "exp": 1704844800     |      |   base64Url(payload),   |
|                       |      | }                      |      |   secret_key)           |
+-----------------------+      +------------------------+      +-------------------------+
```

**Example JWT Payload:**
```json
{
  "sub": "user-uuid-here",
  "role": "CONSUMER",
  "email": "user@example.com",
  "merchantId": null,
  "iat": 1704844800,
  "exp": 1704848400
}
```

| Field | Full Name | Description |
|-------|-----------|-------------|
| `sub` | Subject | User ID (UUID) |
| `role` | Role | User role for RBAC (CONSUMER, MERCHANT_USER, ADMIN) |
| `iat` | Issued At | Timestamp when token was created |
| `exp` | Expiration | Timestamp when token expires |

### Authentication Flow

```
LOGIN PROCESS
=============

1. User submits credentials (phone + password)
   |
   v
2. API validates credentials against Database (bcrypt hash check)
   |
   +---> (Invalid) --> Return 401 Unauthorized
   |
   v (Valid)
3. API signs JWT with Secret Key
   |
   v
4. API returns JWT to Client
   - Format: { "token": "ey..." }
   - Or sets HTTP-only cookie (preferred for web)

SUBSEQUENT REQUESTS
===================

1. Client sends request with header:
   Authorization: Bearer <token>
   |
   v
2. API Middleware verifies JWT signature
   |
   +---> (Invalid/Expired) --> Return 401
   |
   v (Valid)
3. API attaches user info to request object (req.user)
   |
   v
4. Request proceeds to controller
```

### Token Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| **Access Token Lifetime** | 15 minutes | Short-lived for security |
| **Refresh Token Lifetime** | 7 days | Optional, for extended sessions |
| **Storage Method** | HTTP-only Cookie | Prevents XSS attacks |
| **Algorithm** | HS256 or RS256 | HMAC or RSA signing |

### RBAC (Role-Based Access Control)

```
ROLE HIERARCHY
==============

+-----------------+
|      ADMIN      |  (Full System Access)
+--------+--------+
         |
         | Can manage Users, Merchants, Config
         v
+--------+--------+    +-----------------+
|  MERCHANT_USER  |    |    CONSUMER     |
+-----------------+    +-----------------+
- Own Products         - Own Profile
- Own Payouts          - Own Goals
- Own Refunds          - Own Payments
```

---

## 3. Request and Response Conventions

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes* | `Bearer <jwt-token>` for authenticated endpoints |
| `Content-Type` | Yes (POST/PATCH) | `application/json` |
| `Accept` | Optional | `application/json` |
| `X-Request-ID` | Optional | Client-generated request ID for tracing |

### Standard Response Format

**Success Response:**
```json
{
  "data": {
    // Resource data here
  },
  "meta": {
    "requestId": "req-123",
    "timestamp": "2026-01-10T12:00:00Z"
  }
}
```

**Paginated Response:**
```json
{
  "items": [
    // Array of resources
  ],
  "page": 1,
  "pageSize": 20,
  "total": 100,
  "totalPages": 5
}
```

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": {
      "phone": "Invalid Ghana phone number format"
    }
  }
}
```

### Query Parameters for Lists

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | Integer | Page number (1-indexed) | `?page=2` |
| `pageSize` | Integer | Items per page (max: 100) | `?pageSize=50` |
| `sort` | String | Sort order | `?sort=newest` |
| `status` | String | Filter by status | `?status=ACTIVE` |

---

## 4. API Endpoints Reference

### 4.1 Authentication Endpoints

#### Register New User

```http
POST /auth/register
```

**Description:** Create a new consumer account.

**Request Body:**
```json
{
  "phone": "+233501234567",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Field Validations:**
| Field | Rules |
|-------|-------|
| `phone` | Required, Ghana format (+233XXXXXXXXX), unique |
| `email` | Optional but unique if provided, valid email format |
| `password` | Min 8 chars, 1 uppercase, 1 number, 1 special char |
| `firstName` | Required, 2-100 characters |
| `lastName` | Required, 2-100 characters |

**Success Response (201 Created):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "+233501234567",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CONSUMER",
    "status": "ACTIVE",
    "createdAt": "2026-01-10T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Login

```http
POST /auth/login
```

**Description:** Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "phoneOrEmail": "+233501234567",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "+233501234567",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CONSUMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Logout

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Description:** Invalidate current session token.

**Success Response (204 No Content):** Empty body

---

#### Forgot Password

```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "phoneOrEmail": "user@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "message": "If an account exists, a reset link has been sent."
}
```

> **Security Note:** Always return success to prevent user enumeration attacks.

---

#### Reset Password

```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "resetToken": "abc123-reset-token-from-sms-or-email",
  "newPassword": "NewSecurePass456!"
}
```

---

### 4.2 User Endpoints

#### Get Current User Profile

```http
GET /users/me
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "phone": "+233501234567",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CONSUMER",
  "status": "ACTIVE",
  "createdAt": "2026-01-10T12:00:00Z",
  "updatedAt": "2026-01-10T12:00:00Z"
}
```

---

#### Update Profile

```http
PATCH /users/me
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "email": "newemail@example.com"
}
```

---

### 4.3 Product Catalog Endpoints

#### List Products

```http
GET /products
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `pageSize` | int | 20 | Items per page (max 100) |
| `category` | string | - | Filter by category |
| `minPrice` | number | - | Minimum price filter |
| `maxPrice` | number | - | Maximum price filter |
| `merchantId` | uuid | - | Filter by merchant |
| `sort` | string | newest | `newest`, `price_asc`, `price_desc`, `popular` |

**Success Response (200 OK):**
```json
{
  "items": [
    {
      "id": "prod-uuid-001",
      "merchantId": "merch-uuid-001",
      "name": "Samsung Galaxy S24",
      "description": "Latest flagship smartphone with AI features",
      "category": "ELECTRONICS",
      "price": 6500.00,
      "currency": "GHS",
      "stockQuantity": 25,
      "status": "ACTIVE",
      "images": [
        "https://cdn.savegoal.com/products/s24-front.jpg",
        "https://cdn.savegoal.com/products/s24-back.jpg"
      ],
      "createdAt": "2026-01-05T10:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 156
}
```

---

#### Get Product Details

```http
GET /products/{productId}
```

**Success Response (200 OK):**
```json
{
  "id": "prod-uuid-001",
  "merchantId": "merch-uuid-001",
  "name": "Samsung Galaxy S24",
  "description": "Latest flagship smartphone with AI features. Includes 256GB storage, 8GB RAM, and 5G connectivity.",
  "category": "ELECTRONICS",
  "price": 6500.00,
  "currency": "GHS",
  "stockQuantity": 25,
  "status": "ACTIVE",
  "images": [
    "https://cdn.savegoal.com/products/s24-front.jpg",
    "https://cdn.savegoal.com/products/s24-back.jpg"
  ],
  "merchant": {
    "id": "merch-uuid-001",
    "businessName": "TechZone Ghana",
    "rating": 4.7,
    "totalSales": 342
  },
  "createdAt": "2026-01-05T10:00:00Z",
  "updatedAt": "2026-01-08T14:30:00Z"
}
```

---

### 4.4 Savings Goals Endpoints (SNBL)

#### List User's Savings Goals

```http
GET /savings-goals
Authorization: Bearer <token>
```

**Required Role:** Consumer

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter: `ACTIVE`, `COMPLETED`, `CANCELLED` |
| `page` | int | Page number |
| `pageSize` | int | Items per page |

**Success Response (200 OK):**
```json
{
  "items": [
    {
      "id": "goal-uuid-001",
      "productId": "prod-uuid-001",
      "userId": "user-uuid-001",
      "targetAmount": 6500.00,
      "currentAmount": 2100.00,
      "frequency": "MONTHLY",
      "status": "ACTIVE",
      "estimatedCompletionDate": "2026-06-01",
      "progress": 32.3,
      "createdAt": "2026-01-10T12:00:00Z",
      "product": {
        "id": "prod-uuid-001",
        "name": "Samsung Galaxy S24",
        "price": 6500.00,
        "images": ["https://cdn.savegoal.com/products/s24-front.jpg"]
      }
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 3
}
```

---

#### Create Savings Goal

```http
POST /savings-goals
Authorization: Bearer <token>
```

**Required Role:** Consumer

**Request Body:**
```json
{
  "productId": "prod-uuid-001",
  "targetAmount": 6500.00,
  "frequency": "MONTHLY"
}
```

**Field Descriptions:**
| Field | Required | Description |
|-------|----------|-------------|
| `productId` | Yes | UUID of the target product |
| `targetAmount` | Yes | Amount to save (must equal product price) |
| `frequency` | Yes | `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `FLEXIBLE` |

**Frequency Options Explained:**

| Frequency | Description | Typical Duration |
|-----------|-------------|------------------|
| `WEEKLY` | User plans to deposit weekly | Shorter savings period |
| `BIWEEKLY` | User deposits every 2 weeks | Medium duration |
| `MONTHLY` | User deposits monthly | Longer duration |
| `FLEXIBLE` | No fixed schedule | User-defined pace |

**Success Response (201 Created):**
```json
{
  "id": "goal-uuid-new",
  "productId": "prod-uuid-001",
  "userId": "user-uuid-001",
  "targetAmount": 6500.00,
  "currentAmount": 0.00,
  "frequency": "MONTHLY",
  "status": "ACTIVE",
  "estimatedCompletionDate": "2026-07-10",
  "progress": 0,
  "createdAt": "2026-01-10T12:00:00Z"
}
```

**Business Rules:**
- User cannot have more than 10 active goals (configurable)
- Target amount must match product price
- Product must be ACTIVE and in stock

---

#### Get Savings Goal Details

```http
GET /savings-goals/{goalId}
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "id": "goal-uuid-001",
  "userId": "user-uuid-001",
  "productId": "prod-uuid-001",
  "targetAmount": 6500.00,
  "currentAmount": 2100.00,
  "frequency": "MONTHLY",
  "status": "ACTIVE",
  "estimatedCompletionDate": "2026-06-01",
  "progress": 32.3,
  "createdAt": "2026-01-10T12:00:00Z",
  "updatedAt": "2026-01-15T09:30:00Z",
  "product": {
    "id": "prod-uuid-001",
    "name": "Samsung Galaxy S24",
    "price": 6500.00,
    "currency": "GHS",
    "images": ["https://cdn.savegoal.com/products/s24-front.jpg"],
    "merchant": {
      "id": "merch-uuid-001",
      "businessName": "TechZone Ghana"
    }
  },
  "deposits": [
    {
      "id": "dep-uuid-001",
      "paymentId": "pay-uuid-001",
      "amount": 1000.00,
      "status": "COMPLETED",
      "createdAt": "2026-01-12T10:00:00Z"
    },
    {
      "id": "dep-uuid-002",
      "paymentId": "pay-uuid-002",
      "amount": 1100.00,
      "status": "COMPLETED",
      "createdAt": "2026-01-15T09:30:00Z"
    }
  ]
}
```

---

#### Cancel Savings Goal

```http
POST /savings-goals/{goalId}/cancel
Authorization: Bearer <token>
```

**Request Body (optional):**
```json
{
  "reason": "Cannot continue saving due to financial constraints"
}
```

**Success Response (200 OK):**
```json
{
  "id": "goal-uuid-001",
  "status": "CANCELLED",
  "cancelledAt": "2026-01-10T15:00:00Z",
  "refundEligible": true,
  "refundableAmount": 2100.00
}
```

> **Note:** Cancellation triggers the refund eligibility check. User must create a separate refund request.

---

#### Complete Savings Goal

```http
POST /savings-goals/{goalId}/complete
Authorization: Bearer <token>
```

**Description:** Marks goal as complete when fully funded.

**Preconditions:**
- `current_amount >= target_amount`
- Status must be `ACTIVE`

**Success Response (200 OK):**
```json
{
  "id": "goal-uuid-001",
  "status": "COMPLETED",
  "completedAt": "2026-01-10T15:00:00Z",
  "message": "Congratulations! Your savings goal is complete. The merchant will process your order."
}
```

---

### 4.5 Payment Endpoints

#### Initiate Deposit Payment

```http
POST /payments/initiate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "savingsGoalId": "goal-uuid-001",
  "amount": 1000.00,
  "method": "MOMO"
}
```

**Payment Methods:**
| Method | Description | Process |
|--------|-------------|---------|
| `MOMO` | Mobile Money | User receives USSD prompt or redirect |
| `CARD` | Debit/Credit Card | Redirect to secure payment page |
| `BANK_TRANSFER` | Bank Transfer | Generate virtual account for transfer |

**Success Response (201 Created):**
```json
{
  "payment": {
    "id": "pay-uuid-new",
    "userId": "user-uuid-001",
    "amount": 1000.00,
    "currency": "GHS",
    "method": "MOMO",
    "status": "PENDING",
    "purpose": "SAVINGS_DEPOSIT",
    "createdAt": "2026-01-10T12:00:00Z"
  },
  "gateway": {
    "provider": "Paystack",
    "redirectUrl": "https://checkout.paystack.com/xyz123",
    "reference": "PSK-SAV-1704844800-ABC123",
    "expiresAt": "2026-01-10T12:30:00Z"
  }
}
```

**Payment Flow Diagram:**

```
APP FLOW
--------
1. Click "Add Deposit"
2. POST /payments/initiate
3. Redirect user to Gateway URL

GATEWAY FLOW
------------
1. User completes payment on Gateway
2. Gateway sends webhook to API
3. API updates payment status -> SUCCESS

COMPLETION
----------
1. User redirected back to App success page
2. App polls payment status or shows success
```

---

#### Get Payment Status

```http
GET /payments/{paymentId}
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "id": "pay-uuid-001",
  "userId": "user-uuid-001",
  "externalReference": "PSK-SAV-1704844800-ABC123",
  "amount": 1000.00,
  "currency": "GHS",
  "method": "MOMO",
  "status": "SUCCESS",
  "purpose": "SAVINGS_DEPOSIT",
  "metadata": {
    "gateway": "Paystack",
    "authorization": {
      "channel": "mobile_money",
      "provider": "mtn"
    }
  },
  "createdAt": "2026-01-10T12:00:00Z",
  "updatedAt": "2026-01-10T12:05:00Z"
}
```

**Payment Status Values:**

| Status | Description |
|--------|-------------|
| `PENDING` | Payment initiated, awaiting completion |
| `SUCCESS` | Payment confirmed and processed |
| `FAILED` | Payment failed or rejected |
| `REFUNDED` | Payment has been refunded |

---

### 4.6 Refund Endpoints

#### Create Refund Request

```http
POST /refunds
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "savingsGoalId": "goal-uuid-001",
  "reason": "Unable to continue saving",
  "requestedAmount": 2100.00
}
```

**Success Response (201 Created):**
```json
{
  "id": "refund-uuid-001",
  "savingsGoalId": "goal-uuid-001",
  "userId": "user-uuid-001",
  "merchantId": "merch-uuid-001",
  "status": "PENDING",
  "requestedAmount": 2100.00,
  "approvedAmount": null,
  "reason": "Unable to continue saving",
  "createdAt": "2026-01-10T15:00:00Z"
}
```

---

#### List Refund Requests

```http
GET /refunds
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `page` | int | Page number |
| `pageSize` | int | Items per page |

---

### 4.7 Merchant Endpoints

All merchant endpoints require `MERCHANT_USER` role.

#### List Merchant's Products

```http
GET /merchant/products
Authorization: Bearer <token>
```

**Multi-Tenant Behavior:** Returns only products belonging to the authenticated merchant.

---

#### Create Product

```http
POST /merchant/products
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Apple's latest flagship with titanium design",
  "category": "ELECTRONICS",
  "price": 8500.00,
  "stockQuantity": 15
}
```

---

#### Update Product

```http
PATCH /merchant/products/{productId}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "price": 8200.00,
  "stockQuantity": 20
}
```

---

#### Merchant Refund Decision

```http
POST /merchant/refunds/{refundId}/decision
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "decision": "APPROVE",
  "approvedAmount": 2000.00,
  "note": "2.5% fee applied for processing"
}
```

**Decision Values:**
| Decision | Description |
|----------|-------------|
| `APPROVE` | Accept refund with optional fee deduction |
| `REJECT` | Decline refund with reason |

---

#### List Merchant Payouts

```http
GET /merchant/payouts
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "items": [
    {
      "id": "payout-uuid-001",
      "amount": 45000.00,
      "currency": "GHS",
      "status": "PAID",
      "method": "BANK_TRANSFER",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-01-31",
      "createdAt": "2026-02-01T10:00:00Z",
      "paidAt": "2026-02-02T14:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 6
}
```

---

### 4.8 Admin Endpoints

All admin endpoints require `ADMIN` role.

#### List All Users

```http
GET /admin/users
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `role` | string | Filter: CONSUMER, MERCHANT_USER, ADMIN |
| `status` | string | Filter: ACTIVE, SUSPENDED, DELETED |
| `search` | string | Search by name, phone, or email |

---

#### Update User Status

```http
PATCH /admin/users/{userId}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "SUSPENDED",
  "reason": "Suspicious activity detected"
}
```

---

#### List All Merchants

```http
GET /admin/merchants
Authorization: Bearer <token>
```

---

#### Update Merchant Status

```http
PATCH /admin/merchants/{merchantId}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

---

#### Get/Update Configuration

```http
GET /admin/config
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "settings": {
    "savingsFeePolicy": {
      "type": "PERCENTAGE",
      "value": 2.5,
      "description": "Fee applied on refunds"
    },
    "maxSavingsGoalsPerUser": 10,
    "payoutSchedule": {
      "frequency": "WEEKLY",
      "dayOfWeek": "FRIDAY"
    }
  }
}
```

---

## 5. Webhook Integrations

### Payment Gateway Webhook

```http
POST /webhooks/payments/gateway
```

**Authentication:** IP allowlist + HMAC signature verification

**Example Payload (from Paystack):**
```json
{
  "event": "charge.success",
  "data": {
    "reference": "PSK-SAV-1704844800-ABC123",
    "status": "success",
    "amount": 100000,
    "currency": "GHS",
    "channel": "mobile_money",
    "paid_at": "2026-01-10T12:05:00Z",
    "metadata": {
      "paymentId": "pay-uuid-001",
      "savingsGoalId": "goal-uuid-001"
    }
  }
}
```

**Processing Flow:**

```
WEBHOOK HANDLING
================

1. Verify HMAC Signature
2. Find Payment by Reference
3. Idempotency Check (Already processed?)
4. Update Payment Status -> SUCCESS
5. Create Savings Deposit
6. Update Goal Amount
7. Send Confirmation to User
```

---

## 6. Error Handling

### Standard Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request body or parameters |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | User lacks permission for this action |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Resource already exists (e.g., duplicate email) |
| 422 | `BUSINESS_RULE_VIOLATION` | Request violates business rules |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error |
| 502 | `GATEWAY_ERROR` | External service failure |

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": {
      "phone": "Must be a valid Ghana phone number (+233XXXXXXXXX)",
      "password": "Must contain at least one uppercase letter"
    },
    "requestId": "req-abc123",
    "timestamp": "2026-01-10T12:00:00Z"
  }
}
```

### Domain-Specific Errors

| Error Code | HTTP Status | When It Occurs |
|------------|-------------|----------------|
| `PAYMENT_FAILED` | 400 | Payment gateway declined transaction |
| `REFUND_FAILED` | 400 | Refund processing failed |
| `INSUFFICIENT_STOCK` | 400 | Product out of stock for goal creation |
| `GOAL_LIMIT_REACHED` | 400 | User has maximum active goals |
| `GOAL_NOT_ACTIVE` | 400 | Attempting action on cancelled/completed goal |
| `AMOUNT_EXCEEDS_TARGET` | 400 | Deposit would exceed goal target |

---

## 7. Rate Limiting

### Rate Limit Configuration

| Endpoint Category | Limit | Window | Description |
|-------------------|-------|--------|-------------|
| **Authentication** | 5 | 1 minute | Prevent brute force |
| **Payment Initiation** | 10 | 1 minute | Prevent payment abuse |
| **General API** | 100 | 1 minute | Standard limit |
| **Webhooks** | 1000 | 1 minute | High throughput for payment callbacks |

### Rate Limit Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704848400
```

### Rate Limit Exceeded Response

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

## 8. API Versioning

### Versioning Strategy

- **URL Path Versioning:** `/api/v1/`, `/api/v2/`
- **Current Version:** `v1`
- **Deprecation Policy:** Old versions supported for 12 months after new version release

### Version Lifecycle

```
VERSION LIFECYCLE
=================

[ v1 Released ] ---> [ v2 Released ] ---> [ v1 Deprecated ] ---> [ v1 End of Life ]
(Production)         (New Standard)       (Maintenance Only)     (Shut Down)
```

### Breaking vs Non-Breaking Changes

| Change Type | Breaking? | Requires New Version? |
|-------------|-----------|----------------------|
| Add new endpoint | No | No |
| Add optional field to request | No | No |
| Add field to response | No | No |
| Remove endpoint | Yes | Yes |
| Remove field from response | Yes | Yes |
| Change field type | Yes | Yes |
| Make optional field required | Yes | Yes |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial enhanced API documentation |

---

> **Related Documents:**
> - [System Architecture](./savegoal-system-architecture-enhanced.md)
> - [Database Schema](./savegoal-db-schema-enhanced.md)
