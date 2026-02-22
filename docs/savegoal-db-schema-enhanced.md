# SaveGoal Database Schema and Migration Plan - Enhanced Documentation

> **Version:** 1.0 (Web-First, SNBL Only)  
> **Database:** PostgreSQL 15+  
> **Architecture:** Multi-Tenant with Shared Database

---

## Table of Contents

1. [Database Design Principles](#1-database-design-principles)
2. [Multi-Tenancy Data Strategy](#2-multi-tenancy-data-strategy)
3. [Entity-Relationship Diagram](#3-entity-relationship-diagram)
4. [Core Tables Reference](#4-core-tables-reference)
5. [Indexing Strategy](#5-indexing-strategy)
6. [Migration Plan](#6-migration-plan)
7. [Backup and Recovery](#7-backup-and-recovery)
8. [Data Retention Policy](#8-data-retention-policy)

---

## 1. Database Design Principles

### Core Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Relational Integrity** | Strong consistency for all financial operations | PostgreSQL with ACID (Atomicity, Consistency, Isolation, Durability) transactions |
| **Normalized Core** | Minimize data redundancy, ensure data integrity | Third Normal Form (3NF) on main entities |
| **Auditability** | Complete trail for all financial activities | `audit_logs` table captures all state changes with before/after snapshots |
| **Extensibility** | Support future features without breaking changes | JSONB fields for flexible metadata; nullable columns for new features |
| **Soft Deletes** | Preserve data for compliance and recovery | Status fields instead of physical deletion |

### Data Type Conventions

| Data Type | PostgreSQL Type | Usage |
|-----------|-----------------|-------|
| **Identifiers** | `UUID` | All primary keys and foreign keys |
| **Money/Currency** | `NUMERIC(14,2)` | All monetary values (supports up to 999,999,999,999.99) |
| **Status Fields** | `VARCHAR(32)` | Enum-like status values stored as strings for flexibility |
| **Timestamps** | `TIMESTAMPTZ` | All date/time fields with timezone awareness |
| **Flexible Data** | `JSONB` | Metadata, gateway responses, configuration objects |
| **Phone Numbers** | `VARCHAR(20)` | International format support (e.g., +233XXXXXXXXX) |
| **Email Addresses** | `VARCHAR(255)` | Standard email length support |

---

## 2. Multi-Tenancy Data Strategy

SaveGoal uses a **shared database with tenant isolation** model. All merchants share the same database tables, with each record tagged by `merchant_id` to enforce data separation.

### Tenant Isolation Diagram

```
TENANT DATA ISOLATION
=====================

+-------------------------------------------------------------+
|               SHARED POSTGRESQL DATABASE                    |
|                                                             |
|  PRODUCTS TABLE                                             |
|  +----+--------------+-------------+                        |
|  | ID | Name         | merchant_id |                        |
|  +----+--------------+-------------+                        |
|  | P1 | Product A    | 001         | <--- Merchant 001 Data |
|  | P2 | Product B    | 001         | <--- Merchant 001 Data |
|  | P3 | Product C    | 002         | <--- Merchant 002 Data |
|  | P4 | Product D    | 003         | <--- Merchant 003 Data |
|  +----+--------------+-------------+                        |
+-------------------------------------------------------------+
               ^
               | 3. Database returns ONLY rows
               |    matching 'WHERE merchant_id = 001'
               |
+--------------+----------------------------------------------+
|               API LAYER FILTERING                           |
|                                                             |
|  1. Incoming Request   2. Row-Level Filter Applied          |
|     (Merchant 001)  ->    "SELECT * FROM products           |
|                           WHERE merchant_id = '001'"        |
+-------------------------------------------------------------+
```

### Tenant-Aware Tables

| Table | Tenant Column | Description |
|-------|--------------|-------------|
| `products` | `merchant_id` | Products belong to a specific merchant |
| `refund_requests` | `merchant_id` | Refunds are linked to the product's merchant |
| `payouts` | `merchant_id` | Payouts are per-merchant |
| `merchant_users` | `merchant_id` | Links users to their merchant accounts |

### Consumer Data (Cross-Tenant)

Consumer data (`users`, `savings_goals`, `payments`) is **not tenant-isolated** because:
- A consumer can save for products from multiple merchants
- Payment records belong to the consumer, not the merchant
- Savings goals reference products but belong to users

```
CONSUMER CROSS-TENANT ACCESS
============================

                  +----------------+
                  |    CONSUMER    |
                  +-------+--------+
                          |
          +---------------+---------------+
          |                               |
          v                               v
  +-------+--------+              +-------+--------+
  | Savings Goal 1 |              | Savings Goal 2 |
  +-------+--------+              +-------+--------+
          |                               |
          v                               v
  +-------+--------+              +-------+--------+
  |   Product A    |              |   Product B    |
  | (Merchant 001) |              | (Merchant 002) |
  +----------------+              +----------------+

NOTE: A single consumer identity links to products across
      different merchants seamlessly.
```

---

## 3. Entity-Relationship Diagram

### Complete Data Model

```
ENTITY RELATIONSHIP DIAGRAM (ERD)
=================================

+---------------+       +---------------+       +---------------+
|     USER      |       |   MERCHANT    |       |    PRODUCT    |
+---------------+       +---------------+       +---------------+
| id (PK)       |       | id (PK)       |       | id (PK)       |
| phone (UK)    |       | business_name |       | merchant_id(FK|--+
| email (UK)    |       | contact_email |       | name          |  |
| role          |       | status        |       | price         |  |
| status        |       | bank_details  |       | stock_quantity|  |
+-------+-------+       +-------+-------+       | status        |  |
        |                       |               +-------+-------+  |
        |                       |                       |          |
        |               +-------v-------+               |          |
        |               | MERCHANT_USER |               |          |
        |               +---------------+               |          |
        |               | id (PK)       |               |          |
        +-------------->| user_id (FK)  |               |          |
                        | merch_id (FK) |<--------------+          |
                        +---------------+                          |
        |                                                          |
        | CREATES                                 LISTS            |
        v                                                          |
+-------+-------+                               +-------+-------+  |
| SAVINGS_GOAL  |                               | PRODUCT_IMAGE |  |
+---------------+                               +---------------+  |
| id (PK)       |                               | id (PK)       |  |
| user_id (FK)  |                               | product_id(FK)|<-+
| product_id(FK)|<------------------------------+ url           |
| target_amount |         TARGET OF             +---------------+
| current_amount|
| status        |         ACCUMULATES
+-------+-------+-------------------------+
        |                                 |
        | INITIATES                       v
        v                       +---------+---------+
+-------+-------+               |  SAVINGS_DEPOSIT  |
|    PAYMENT    |               +-------------------+
+---------------+               | id (PK)           |
| id (PK)       |               | savings_goal_id(FK|
| user_id (FK)  |               | payment_id (FK)   |<--+
| amount        |               | amount            |   |
| status        |               | status            |   |
| purpose       |               +-------------------+   |
+-------+-------+                                       |
        |                         FUNDS                 |
        | SUBMITS --------------------------------------+
        v
+-------+-------+               RESULTS IN
| REFUND_REQUEST|-------------------------+
+---------------+                         |
| id (PK)       |                         v
| user_id (FK)  |               +---------+---------+
| goal_id (FK)  |               | REFUND_TRANSACTION|
| merch_id (FK) |               +-------------------+
| status        |               | id (PK)           |
| req_amount    |               | refund_req_id (FK)|
| app_amount    |               | payment_id (FK)   |<--+
+---------------+               | amount            |   |
                                | status            |   |
                                +-------------------+   |
                                                        |
                          MAY REFUND                    |
                          ------------------------------+
```

---

## 4. Core Tables Reference

### 4.1 `users` - All Login-Capable Accounts

**Purpose:** Stores all platform users including consumers, merchant staff, and administrators.

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(20) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(32) NOT NULL,      -- CONSUMER, MERCHANT_USER, ADMIN
    status          VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, SUSPENDED, DELETED
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_users_phone ON users(phone);
CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role_status ON users(role, status);
```

**Field Descriptions:**

| Field | Description |
|-------|-------------|
| `id` | UUID (Universally Unique Identifier) - 128-bit identifier unique across all systems |
| `phone` | Ghanaian phone number format: +233XXXXXXXXX |
| `email` | Optional email address for additional contact/login |
| `password_hash` | Securely hashed password using bcrypt or Argon2 algorithm |
| `role` | User role determining access permissions (see RBAC) |
| `status` | Account status - ACTIVE (can login), SUSPENDED (blocked), DELETED (soft deleted) |

---

### 4.2 `merchants` - Business Entities (Tenants)

**Purpose:** Stores merchant/tenant information. Each merchant is a separate "tenant" in the multi-tenant architecture.

```sql
CREATE TABLE merchants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name   VARCHAR(255) NOT NULL,
    contact_email   VARCHAR(255),
    contact_phone   VARCHAR(20),
    status          VARCHAR(32) NOT NULL DEFAULT 'PENDING',  -- PENDING, APPROVED, SUSPENDED
    bank_details    JSONB,  -- {"bank_name": "...", "account_number": "...", "branch": "..."}
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_merchants_status ON merchants(status);
CREATE INDEX idx_merchants_business_name ON merchants(business_name);
```

**Status Lifecycle:**

```
[ PENDING ] --> (Admin Verifies) --> [ APPROVED ]
     |                                   |
     | (Admin Rejects)                   | (Policy Violation)
     v                                   v
[ REJECTED ]                        [ SUSPENDED ]
                                         |
                                         | (Issue Resolved)
                                         v
                                    [ APPROVED ]
```

---

### 4.3 `merchant_users` - User-Merchant Association

**Purpose:** Links users to merchants, enabling multi-merchant support (e.g., a user managing multiple stores).

```sql
CREATE TABLE merchant_users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    merchant_id     UUID NOT NULL REFERENCES merchants(id),
    role            VARCHAR(32) NOT NULL DEFAULT 'OWNER',  -- OWNER, STAFF
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (user_id, merchant_id)
);

CREATE INDEX idx_merchant_users_user ON merchant_users(user_id);
CREATE INDEX idx_merchant_users_merchant ON merchant_users(merchant_id);
```

---

### 4.4 `products` - Product Catalog

**Purpose:** Stores all products available for SNBL savings goals.

```sql
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id),  -- TENANT KEY
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    category        VARCHAR(100),
    price           NUMERIC(14,2) NOT NULL,
    currency        VARCHAR(10) NOT NULL DEFAULT 'GHS',
    stock_quantity  INT NOT NULL DEFAULT 0,
    status          VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, INACTIVE, OUT_OF_STOCK
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_merchant ON products(merchant_id);
CREATE INDEX idx_products_category_status ON products(category, status);
CREATE INDEX idx_products_status ON products(status);
```

**Multi-Tenant Query Example:**

```sql
-- Merchant can only see their own products
SELECT * FROM products 
WHERE merchant_id = :current_merchant_id 
  AND status = 'ACTIVE';

-- Consumers can browse all active products (no tenant filter)
SELECT * FROM products 
WHERE status = 'ACTIVE';
```

---

### 4.5 `savings_goals` - SNBL Savings Goals

**Purpose:** Tracks each consumer's saving progress towards a product.

```sql
CREATE TABLE savings_goals (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                     UUID NOT NULL REFERENCES users(id),
    product_id                  UUID NOT NULL REFERENCES products(id),
    target_amount               NUMERIC(14,2) NOT NULL,
    current_amount              NUMERIC(14,2) NOT NULL DEFAULT 0,
    frequency                   VARCHAR(32) NOT NULL,  -- WEEKLY, BIWEEKLY, MONTHLY, FLEXIBLE
    status                      VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, CANCELLED, COMPLETED
    estimated_completion_date   DATE,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_savings_goals_user_status ON savings_goals(user_id, status);
CREATE INDEX idx_savings_goals_product ON savings_goals(product_id);
CREATE INDEX idx_savings_goals_status_completion ON savings_goals(status, estimated_completion_date);

-- Partial index for active goals only (performance optimization)
CREATE INDEX idx_savings_goals_active ON savings_goals(user_id) WHERE status = 'ACTIVE';
```

**Goal Lifecycle:**

```
              +----------+
      +-----> |  ACTIVE  | <-----+
      |       +----+-----+       |
      |            |             |
Create Goal   Make Deposit   Deposit made
              (Increase Amt)
                   |
        +----------+----------+
        |                     |
   Amount >= Target      User Cancels
        |                     |
        v                     v
   +-----------+        +-----------+
   | COMPLETED |        | CANCELLED |
   +-----+-----+        +-----+-----+
         |                    |
   Product Shipped      Refund Processed
```

---

### 4.6 `payments` - Payment Transactions

**Purpose:** Records all payment attempts and their outcomes.

```sql
CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    external_reference  VARCHAR(255),  -- Gateway reference (unique when not null)
    amount              NUMERIC(14,2) NOT NULL,
    currency            VARCHAR(10) NOT NULL DEFAULT 'GHS',
    method              VARCHAR(32) NOT NULL,  -- MOMO, CARD, BANK_TRANSFER
    status              VARCHAR(32) NOT NULL,  -- PENDING, SUCCESS, FAILED, REFUNDED
    purpose             VARCHAR(32) NOT NULL,  -- SAVINGS_DEPOSIT, REFUND
    metadata            JSONB,  -- Gateway request/response, debug info
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_payments_external_ref ON payments(external_reference) WHERE external_reference IS NOT NULL;
CREATE INDEX idx_payments_user_status ON payments(user_id, status);
CREATE INDEX idx_payments_purpose_status ON payments(purpose, status);
```

**Payment Methods Explained:**

| Method | Full Name | Description |
|--------|-----------|-------------|
| `MOMO` | Mobile Money | Digital wallet payments via MTN MoMo, Vodafone Cash, AirtelTigo Money |
| `CARD` | Debit/Credit Card | Visa, Mastercard via payment gateway |
| `BANK_TRANSFER` | Bank Transfer | Direct bank-to-bank transfer |

**Payment Flow:**

```
[ PENDING ] ---> (Gateway Success) ---> [ SUCCESS ] ---> (Refunded) ---> [ REFUNDED ]
     |
     |
     +---------> (Gateway Fail) ------> [ FAILED ]
```

---

### 4.7 `refund_requests` & `refund_transactions`

**Purpose:** Manages the refund workflow when consumers cancel savings goals.

```sql
CREATE TABLE refund_requests (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    savings_goal_id     UUID NOT NULL REFERENCES savings_goals(id),
    merchant_id         UUID NOT NULL REFERENCES merchants(id),  -- TENANT KEY
    reason              TEXT,
    status              VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    requested_amount    NUMERIC(14,2) NOT NULL,
    approved_amount     NUMERIC(14,2),
    decided_by          UUID REFERENCES users(id),  -- Admin who approved/rejected
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at         TIMESTAMPTZ
);

CREATE TABLE refund_transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refund_request_id   UUID NOT NULL REFERENCES refund_requests(id),
    payment_id          UUID NOT NULL REFERENCES payments(id),
    amount              NUMERIC(14,2) NOT NULL,
    status              VARCHAR(32) NOT NULL,  -- PENDING, SUCCESS, FAILED
    gateway_response    JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Refund Workflow:**

```
1. Consumer Requests ----> [ PENDING ]
Refund

2. Merchant Reviews
   |
   +---> (Reject) -------> [ REJECTED ]
   |
   +---> (Approve) ------> Admin Reviews
                           |
                           v
                   [ PROCESSING ] --> Gateway --> [ COMPLETED ]
                                      Transfer    (or FAILED)
```

---

### 4.8 `audit_logs` - Comprehensive Audit Trail

**Purpose:** Records all significant system actions for compliance and debugging.

```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type      VARCHAR(32) NOT NULL,  -- USER, MERCHANT, ADMIN, SYSTEM
    actor_id        UUID,
    action          VARCHAR(255) NOT NULL,  -- CREATE_SAVINGS_GOAL, APPROVE_REFUND, etc.
    entity_type     VARCHAR(64),            -- USER, MERCHANT, SAVINGS_GOAL, etc.
    entity_id       UUID,
    before_state    JSONB,                  -- Entity state before action
    after_state     JSONB,                  -- Entity state after action
    ip              INET,                   -- Client IP address
    user_agent      TEXT,                   -- Browser/client info
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_type, actor_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

**Audit Log Example:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "actor_type": "ADMIN",
  "actor_id": "admin-uuid",
  "action": "APPROVE_REFUND",
  "entity_type": "REFUND_REQUEST",
  "entity_id": "refund-uuid",
  "before_state": { "status": "PENDING", "approved_amount": null },
  "after_state": { "status": "APPROVED", "approved_amount": 450.00 },
  "ip": "192.168.1.100",
  "created_at": "2026-01-10T12:00:00Z"
}
```

---

## 5. Indexing Strategy

### Index Types Explained

| Index Type | When to Use | Example |
|------------|-------------|---------|
| **B-Tree (Default)** | Equality and range queries | `WHERE status = 'ACTIVE'`, `WHERE created_at > '2026-01-01'` |
| **Unique Index** | Enforce uniqueness | `UNIQUE INDEX ON users(email)` |
| **Partial Index** | Index subset of rows | `CREATE INDEX ... WHERE status = 'ACTIVE'` |
| **Composite Index** | Multi-column queries | `INDEX ON (user_id, status)` |

### Key Indexes Summary

```
INDEX COVERAGE MAP
==================

Query 1: Find user by phone
Index: users(phone) [UNIQUE]

Query 2: Get user's active goals
Index: savings_goals(user_id) WHERE status = 'ACTIVE'

Query 3: List merchant's active products
Index: products(merchant_id, status)

Query 4: Find payments by external reference
Index: payments(external_reference) [UNIQUE]
```

---

## 6. Migration Plan

### Migration Tooling Options

| Tool | Pros | Cons |
|------|------|------|
| **Prisma Migrate** | Type-safe, auto-generates migrations from schema | Locked to Prisma ecosystem |
| **TypeORM Migrations** | Decorator-based, good TypeScript support | Can be complex for advanced scenarios |
| **Knex Migrations** | Lightweight, pure SQL support | Manual schema management |
| **golang-migrate** | Language-agnostic, pure SQL | Requires separate tooling |

### Migration Sequence for v1

```
TIMELINE: DATABASE MIGRATION
============================

Day 1: Core Schema           Day 2: Financial Tables      Day 3: Supporting Tables
----------------------       -----------------------      ------------------------
1. Users & Auth              4. Savings Goals             8. Audit Logs
2. Merchants & Staff         5. Deposits                  9. Config Settings
3. Products & Images         6. Payments                 10. Seed Data
                             7. Refunds & Payouts
```

### Migration Files Structure

```
migrations/
├── 2026_01_01_0001_create_users_table.sql
├── 2026_01_01_0002_create_merchants_table.sql
├── 2026_01_01_0003_create_merchant_users_table.sql
├── 2026_01_01_0004_create_products_table.sql
├── 2026_01_01_0005_create_product_images_table.sql
├── 2026_01_01_0006_create_savings_goals_table.sql
├── 2026_01_01_0007_create_savings_deposits_table.sql
├── 2026_01_01_0008_create_payments_table.sql
├── 2026_01_01_0009_create_refund_tables.sql
├── 2026_01_01_0010_create_payouts_table.sql
├── 2026_01_01_0011_create_audit_logs_table.sql
├── 2026_01_01_0012_create_config_settings_table.sql
└── 2026_01_01_0013_seed_initial_data.sql
```

### Safe Migration Practices

| Practice | Description |
|----------|-------------|
| **Add nullable first** | New columns start as nullable, add NOT NULL constraint after backfill |
| **No destructive DDL** | Never DROP columns/tables in same migration as schema changes |
| **Backfill separately** | Use background jobs for large data migrations |
| **Test on staging** | Always run migrations on staging before production |
| **Backup before migrate** | Take a database snapshot before any production migration |

---

## 7. Backup and Recovery

### Backup Strategy

```
BACKUP STRATEGY
===============

1. DAILY FULL BACKUP
   - Occurs at 2:00 AM UTC
   - Dump entire PostgreSQL database
   - Store in AWS S3 (Encrypted)

2. WAL ARCHIVING (Continuous)
   - Write-Ahead Logs streamed to S3
   - Allows Point-In-Time Recovery (PITR)
   - Granularity: Up to the last second

3. RETENTION
   - Daily backups: 30 days
   - Monthly snapshots: 12 months
```

### Recovery Time Objectives

| Metric | Target | Description |
|--------|--------|-------------|
| **RPO** (Recovery Point Objective) | < 1 minute | Maximum data loss in disaster |
| **RTO** (Recovery Time Objective) | < 1 hour | Time to restore service |

### Recovery Testing

- **Monthly:** Restore to staging environment from backup
- **Quarterly:** Full disaster recovery simulation

---

## 8. Data Retention Policy

### Retention Periods

| Data Category | Retention Period | Reason |
|---------------|------------------|--------|
| **Financial transactions** | 10 years | Tax and audit compliance |
| **Audit logs** | 7 years | Legal and compliance requirements |
| **User accounts** | Indefinite (soft delete) | Account recovery, legal compliance |
| **Session data** | 90 days | Security and analytics |
| **Temporary data** | 7 days | Cache, processing queues |

### Soft Delete Strategy

Financial and user data is never physically deleted:

```sql
-- Instead of DELETE, update status
UPDATE users 
SET status = 'DELETED', 
    updated_at = NOW() 
WHERE id = :user_id;

-- Queries exclude soft-deleted records
SELECT * FROM users WHERE status != 'DELETED';
```

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial enhanced database documentation |

---

> **Related Documents:**
> - [System Architecture](./savegoal-system-architecture-enhanced.md)
> - [API Design Specification](./savegoal-api-design-enhanced.md)
