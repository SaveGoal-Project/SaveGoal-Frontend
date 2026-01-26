# SaveGoal Web Platform - Enhanced System Architecture

> **Version:** 1.0 (Web-First, SNBL Only)  
> **Last Updated:** January 2026  
> **Architecture Type:** Multi-Tenant SaaS Platform

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Glossary of Terms and Acronyms](#2-glossary-of-terms-and-acronyms)
3. [Scope Definition](#3-scope-definition)
4. [Multi-Tenant Architecture Overview](#4-multi-tenant-architecture-overview)
5. [High-Level System Context](#5-high-level-system-context)
6. [Layered Logical Architecture](#6-layered-logical-architecture)
7. [Backend Services and Components](#7-backend-services-and-components)
8. [Conceptual Data Model](#8-conceptual-data-model)
9. [Deployment and Infrastructure](#9-deployment-and-infrastructure)
10. [Security and Authentication](#10-security-and-authentication)
11. [Technology Stack Summary](#11-technology-stack-summary)

---

## 1. Executive Summary

**SaveGoal** is a **Save Now, Buy Later (SNBL)** platform that enables consumers to save money towards purchasing products from registered merchants. Unlike traditional "Buy Now, Pay Later" (BNPL) credit models, SNBL promotes financial discipline by having users save the full product price before purchase - no credit lines or debt involved.

### What This Platform Does

```
CONSUMER JOURNEY
================

+------------------+     +---------------------+     +------------------+
|  Browse Products | --> |  Create Savings     | --> |  Make Deposits   |
|                  |     |  Goal               |     |                  |
+------------------+     +---------------------+     +------------------+
                                                              |
                                                              v
+------------------+     +---------------------+     +------------------+
|  Receive Product | <-- |  Merchant Ships     | <-- |  Goal Completed  |
|                  |     |  Order              |     |  (100% saved)    |
+------------------+     +---------------------+     +------------------+


MONEY FLOW
==========

  Consumer          SaveGoal           Merchant
  Deposits          Platform           Payout
     |                 |                  |
     +-----> [ $ ] ----+-----> [ $ ] -----+
                   Holds funds        Receives payment
                   until complete     when goal done
```

### Key Stakeholders

| Stakeholder | Role | Primary Actions |
|-------------|------|-----------------|
| **Consumer** | End user saving for products | Browse, save, deposit, request refunds |
| **Merchant** | Business selling products | List products, manage inventory, receive payouts |
| **Admin** | Platform operator | Manage users, handle disputes, configure system |

---

## 2. Glossary of Terms and Acronyms

### Core Business Terms

| Term | Full Form | Definition |
|------|-----------|------------|
| **SNBL** | Save Now, Buy Later | A savings-based purchasing model where consumers save the full product price before acquisition. No credit or loans involved. |
| **BNPL** | Buy Now, Pay Later | (Not used in v1) Credit-based purchasing where users pay in installments after receiving the product. |
| **SNBL Express** | Save Now, Buy Later Express | (Not in v1) Accelerated access feature where users can receive products after saving 50% of the price. |
| **KYC** | Know Your Customer | Identity verification process to comply with financial regulations. Automated KYC is excluded from v1. |

### Technical Acronyms

| Acronym | Full Form | Explanation |
|---------|-----------|-------------|
| **API** | Application Programming Interface | A set of rules and protocols that allows different software applications to communicate with each other. |
| **REST** | Representational State Transfer | An architectural style for designing networked applications using standard HTTP methods (GET, POST, PUT, DELETE). |
| **JWT** | JSON Web Token | A compact, URL-safe token format used for securely transmitting authentication and authorization information between parties. |
| **BFF** | Backend For Frontend | A design pattern where a dedicated backend service is created specifically to serve the needs of a particular frontend application. |
| **RBAC** | Role-Based Access Control | A security model that restricts system access based on the roles assigned to individual users (e.g., Consumer, Merchant, Admin). |
| **ORM** | Object-Relational Mapping | A programming technique that allows developers to interact with a database using objects in code rather than writing raw SQL queries. Examples: Prisma, TypeORM, Sequelize. |
| **MQ** | Message Queue | A form of asynchronous communication between services where messages are stored in a queue until they can be processed. Used for background jobs like sending notifications. |
| **CDN** | Content Delivery Network | A geographically distributed network of servers that delivers static content (images, CSS, JavaScript) to users from the nearest location for faster load times. |
| **APM** | Application Performance Monitoring | Tools and practices for tracking and analyzing the performance, availability, and user experience of software applications. |
| **TLS** | Transport Layer Security | A cryptographic protocol that provides secure communication over a computer network. HTTPS uses TLS. |
| **SSR** | Server-Side Rendering | A technique where web pages are rendered on the server and sent as fully-formed HTML to the browser, improving initial load time and SEO. |
| **WAL** | Write-Ahead Logging | A database technique where changes are first written to a log before being applied to the main database, enabling point-in-time recovery. |
| **UUID** | Universally Unique Identifier | A 128-bit identifier (e.g., 550e8400-e29b-41d4-a716-446655440000) that is unique across all systems worldwide. |
| **CORS** | Cross-Origin Resource Sharing | A security mechanism that allows or restricts web pages from making requests to a different domain than the one serving the web page. |
| **CI/CD** | Continuous Integration / Continuous Deployment | Automated processes for building, testing, and deploying code changes to production environments. |
| **3NF** | Third Normal Form | A database design principle that reduces data redundancy by ensuring that all non-key columns depend only on the primary key. |

### Infrastructure Terms

| Term | Definition |
|------|------------|
| **PostgreSQL** | An open-source relational database management system known for reliability, data integrity, and extensibility. |
| **Redis** | An in-memory data store used as a cache and message broker for high-speed data access. |
| **RabbitMQ** | An open-source message broker that enables applications to communicate via message queues for asynchronous processing. |
| **Next.js** | A React-based framework for building web applications with features like server-side rendering and static site generation. |
| **Express** | A minimal and flexible Node.js web application framework for building APIs and web servers. |

### Payment Terms

| Term | Definition |
|------|------------|
| **MOMO** | Mobile Money - A digital payment method allowing users to send/receive money and pay for services using their mobile phones. Popular in Africa (e.g., MTN Mobile Money, Vodafone Cash). |
| **Webhook** | An HTTP callback that automatically sends data to a specified URL when a specific event occurs (e.g., payment completion). |
| **Payout** | The transfer of funds from the SaveGoal platform to a merchant's bank account after a consumer completes their savings goal. |

---

## 3. Scope Definition

### Features Included in Version 1

```
SAVEGOAL V1 FEATURE MAP
========================

+------------------------------------------------------------------+
|                        SAVEGOAL PLATFORM                          |
+------------------------------------------------------------------+
|                                                                   |
|  CONSUMER WEB APP              MERCHANT DASHBOARD                 |
|  +------------------------+    +------------------------+         |
|  | - Registration/Login  |    | - Account Onboarding   |         |
|  | - Product Browsing    |    | - Product Management   |         |
|  | - Search & Filtering  |    | - Inventory Control    |         |
|  | - SNBL Savings Goals  |    | - Order Viewing        |         |
|  | - Deposit Payments    |    | - Payout Tracking      |         |
|  | - Progress Tracking   |    | - Basic Analytics      |         |
|  | - Refund Requests     |    |                        |         |
|  +------------------------+    +------------------------+         |
|                                                                   |
|  ADMIN DASHBOARD               BACKEND INFRASTRUCTURE             |
|  +------------------------+    +------------------------+         |
|  | - User Management     |    | - REST API             |         |
|  | - Merchant Management |    | - PostgreSQL Database  |         |
|  | - Refund Handling     |    | - Redis Cache          |         |
|  | - Dispute Resolution  |    | - RabbitMQ Queue       |         |
|  | - System Config       |    | - Object Storage       |         |
|  | - Audit Trails        |    | - Payment Gateways     |         |
|  |                        |    | - SMS & Email          |         |
|  |                        |    | - Monitoring           |         |
|  +------------------------+    +------------------------+         |
|                                                                   |
+------------------------------------------------------------------+
```

### Features Excluded from Version 1

| Feature | Reason for Exclusion | Planned Version |
|---------|---------------------|-----------------|
| **SNBL Express** | Requires complex 50% deposit logic and early fulfillment workflows | v2 |
| **Automated KYC** | Ghana Card / biometric verification requires third-party integrations | v2 |
| **Pause/Resume Goals** | Adds complexity to goal lifecycle management | v2 |
| **Cryptocurrency Payments** | Regulatory and volatility concerns | Future consideration |
| **Native Mobile Apps** | Web-first approach; architecture supports future mobile apps | v2+ |

---

## 4. Multi-Tenant Architecture Overview

SaveGoal is designed as a **multi-tenant platform** where multiple merchants share the same infrastructure while maintaining data isolation.

### What is Multi-Tenancy?

```
MULTI-TENANT ARCHITECTURE
=========================

+------------------------------------------------------------------+
|                    SHARED INFRASTRUCTURE                          |
|                                                                   |
|  +------------------+  +------------------+  +------------------+ |
|  |   SHARED API     |  | SHARED DATABASE  |  |  SHARED CACHE    | |
|  |   LAYER          |  | (PostgreSQL)     |  |  (Redis)         | |
|  +------------------+  +------------------+  +------------------+ |
|                               |                                   |
+-------------------------------|-----------------------------------+
                                |
                    +-----------+-----------+
                    |                       |
        +-----------v-----------+  +--------v------------+
        |  TENANT ISOLATION     |  |  TENANT ISOLATION   |
        |                       |  |                     |
        |  +-----------------+  |  |  +----------------+ |
        |  | Merchant A Data |  |  |  | Merchant B Data| |
        |  | - Products      |  |  |  | - Products     | |
        |  | - Payouts       |  |  |  | - Payouts      | |
        |  | - Refunds       |  |  |  | - Refunds      | |
        |  +-----------------+  |  |  +----------------+ |
        +-----------------------+  +---------------------+

KEY: Each merchant's data is isolated using merchant_id in database queries
```

### Multi-Tenancy Model in SaveGoal

| Aspect | Implementation | Description |
|--------|---------------|-------------|
| **Database Strategy** | Shared database with tenant ID | All merchants share one PostgreSQL database. Each record includes a merchant_id foreign key for tenant isolation. |
| **Data Isolation** | Row-level filtering | Queries automatically filter data by the authenticated merchant's ID to prevent cross-tenant data access. |
| **API Isolation** | Token-based tenant identification | JWT tokens include merchant context; API middleware enforces tenant boundaries. |
| **Resource Sharing** | Shared compute, storage, and cache | All tenants share the same infrastructure, with logical separation at the application layer. |
| **Customization** | Per-tenant configuration | Merchants can customize their store settings, fee structures, and policies within platform limits. |

### Tenant Data Flow

```
TENANT DATA FLOW - API REQUEST HANDLING
=======================================

  Consumer                Web App                API Server
     |                       |                       |
     | 1. Browse Merchant    |                       |
     |    A Products         |                       |
     +---------------------->|                       |
                             |                       |
                             | 2. GET /products      |
                             |    ?merchantId=A      |
                             +---------------------->|
                                                     |
                                              +------v------+
                                              | 3. Auth     |
                                              | Middleware  |
                                              | validates   |
                                              | request     |
                                              +------+------+
                                                     |
                                              +------v------+
                                              | 4. Query DB |
                                              | WHERE       |
                                              | merchant_id |
                                              | = 'A'       |
                                              +------+------+
                                                     |
                             | 5. Return Merchant   |
                             |    A products ONLY   |
                             +<---------------------+
     | 6. Display products   |
     +<----------------------+


NOTE: Merchant B's products are NEVER returned - they are filtered out
      at the database level using the merchant_id constraint.
```

### Tenant Hierarchy

```
PLATFORM TENANT HIERARCHY
=========================

                    +-------------------+
                    |    PLATFORM       |
                    |    (SaveGoal)     |
                    +--------+----------+
                             |
           +-----------------+-----------------+
           |                 |                 |
    +------v------+   +------v------+   +------v------+
    |  MERCHANT A |   |  MERCHANT B |   |  MERCHANT C |
    +------+------+   +------+------+   +------+------+
           |                 |                 |
     +-----+-----+     +-----+-----+     +-----+-----+
     |     |     |     |     |     |     |     |     |
   Users  Prod  Pay  Users  Prod  Pay  Users  Prod  Pay
   
   
   Legend:
   - Users = Merchant Users (staff)
   - Prod = Products
   - Pay = Payouts


CONSUMER DATA (Cross-Tenant):
+----------------------------------------------------------+
| Consumers are NOT tenant-isolated because they can save  |
| for products across MULTIPLE merchants.                  |
|                                                          |
|   Consumer --> Savings Goal --> Product (Merchant A)     |
|           \--> Savings Goal --> Product (Merchant B)     |
+----------------------------------------------------------+
```

---

## 5. High-Level System Context

This diagram shows how external actors interact with the SaveGoal platform as a unified system.

```
SYSTEM CONTEXT DIAGRAM
======================

+------------------+     +------------------+     +------------------+
|    CONSUMER      |     |    MERCHANT      |     |     ADMIN        |
| (End users who   |     | (Businesses that |     | (Platform        |
|  save for items) |     |  sell products)  |     |  operators)      |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         |                        |                        |
         +------------------------+------------------------+
                                  |
                                  v
+---------------------------------------------------------------------+
|                        SAVEGOAL PLATFORM                             |
|                                                                      |
|  +--------------------+          +-----------------------------+     |
|  | PRESENTATION TIER  |          |      APPLICATION TIER       |     |
|  |                    |          |                             |     |
|  | +----------------+ |          | +-------------------------+ |     |
|  | | Web Frontend   | |   <-->   | | Backend API             | |     |
|  | | (Next.js/React)| |          | | (Node.js/Express)       | |     |
|  | | - Consumer UI  | |          | | - Authentication        | |     |
|  | | - Merchant UI  | |          | | - Business Logic        | |     |
|  | | - Admin UI     | |          | | - Data Validation       | |     |
|  | +----------------+ |          | +-------------------------+ |     |
|  +--------------------+          +-----------------------------+     |
|                                               |                      |
|                                               v                      |
|  +------------------------------------------------------------------+|
|  |                         DATA TIER                                 ||
|  |                                                                   ||
|  | +--------------+ +-------------+ +------------+ +--------------+  ||
|  | | PostgreSQL   | | Redis       | | RabbitMQ   | | Object       |  ||
|  | | (Database)   | | (Cache)     | | (Queue)    | | Storage      |  ||
|  | | - Users      | | - Sessions  | | - Async    | | - Images     |  ||
|  | | - Products   | | - Hot Data  | |   Jobs     | | - Documents  |  ||
|  | | - Payments   | |             | |            | |              |  ||
|  | +--------------+ +-------------+ +------------+ +--------------+  ||
|  +------------------------------------------------------------------+|
|                                                                      |
|  +--------------------+          +-----------------------------+     |
|  | INTERNAL SERVICES  |          |      NOTIFICATION LAYER     |     |
|  | +----------------+ |          | +-------------------------+ |     |
|  | | Analytics &    | |          | | SMS & Email Dispatch    | |     |
|  | | Logging        | |          | | - OTP Codes             | |     |
|  | +----------------+ |          | | - Confirmations         | |     |
|  +--------------------+          | | - Reminders             | |     |
|                                  | +-------------------------+ |     |
|                                  +-----------------------------+     |
+---------------------------------------------------------------------+
         |                        |                        |
         v                        v                        v
+------------------+     +------------------+     +------------------+
| PAYMENT GATEWAYS |     |   SMS PROVIDER   |     |  EMAIL PROVIDER  |
| - Mobile Money   |     | - Twilio         |     | - SendGrid       |
| - Cards          |     | - Africa's       |     | - Mailgun        |
| - Bank Transfer  |     |   Talking        |     |                  |
+------------------+     +------------------+     +------------------+
                                  |
                                  v
                         +------------------+
                         | APM/MONITORING   |
                         | - Logs           |
                         | - Metrics        |
                         | - Alerts         |
                         +------------------+
```

### Component Responsibilities

| Component | Purpose | Key Technologies |
|-----------|---------|-----------------|
| **Web Frontend** | User interface for all three user types (Consumer, Merchant, Admin) | Next.js, React, Tailwind CSS |
| **Backend API** | Business logic, data validation, security enforcement | Node.js, Express, JWT |
| **PostgreSQL** | Persistent storage for users, products, goals, payments, and transactions | PostgreSQL 14+ |
| **Redis** | High-speed caching for frequently accessed data and session management | Redis 6+ |
| **RabbitMQ** | Asynchronous job processing (notifications, reports, scheduled tasks) | RabbitMQ 3.x |
| **Object Storage** | Static file storage for product images, user documents, and exports | AWS S3 / MinIO |
| **Payment Gateways** | Processing deposits via Mobile Money, cards, and bank transfers | Paystack, Flutterwave, MTN MOMO API |
| **Notification Service** | Sending transactional SMS and emails | Internal service + third-party APIs |

---

## 6. Layered Logical Architecture

The system follows a clean **layered architecture** where each layer has specific responsibilities and only communicates with adjacent layers.

```
LAYERED ARCHITECTURE
====================

+======================================================================+
|  LAYER 1: PRESENTATION                                               |
|  +----------------------------------------------------------------+  |
|  |                    WEB APPLICATION                             |  |
|  |                    (Next.js / React)                           |  |
|  |                                                                |  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  |  | Consumer Portal  | | Merchant Dashboard| | Admin Console   ||  |
|  |  | - Product Browse | | - Product Mgmt   | | - User Mgmt     ||  |
|  |  | - Savings Goals  | | - Payout View    | | - Refund Queue  ||  |
|  |  | - Payment History| | - Analytics      | | - System Config ||  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  +----------------------------------------------------------------+  |
+======================================================================+
                                   |
                                   | HTTP/HTTPS (JWT Auth)
                                   v
+======================================================================+
|  LAYER 2: API GATEWAY (BFF - Backend For Frontend)                   |
|  +----------------------------------------------------------------+  |
|  |                    NODE.JS / EXPRESS                           |  |
|  |                                                                |  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  |  | Request          | | Authentication   | | Rate Limiting   ||  |
|  |  | Validation       | | (JWT Verify)     | | & Throttling    ||  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  |                                                                |  |
|  |  API Routes: /auth, /users, /products, /savings-goals,        |  |
|  |              /payments, /refunds, /merchant, /admin           |  |
|  +----------------------------------------------------------------+  |
+======================================================================+
                                   |
                                   v
+======================================================================+
|  LAYER 3: DOMAIN & SERVICE LAYER (Business Logic)                    |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |  +-------------------+  +-------------------+                  |  |
|  |  | Savings Goal      |  | Payment           |                  |  |
|  |  | Rules:            |  | Processing:       |                  |  |
|  |  | - Create goal     |  | - Validate amount |                  |  |
|  |  | - Track progress  |  | - Gateway calls   |                  |  |
|  |  | - Cancel/Complete |  | - Record deposits |                  |  |
|  |  +-------------------+  +-------------------+                  |  |
|  |                                                                |  |
|  |  +-------------------+  +-------------------+                  |  |
|  |  | Refund            |  | Payout            |                  |  |
|  |  | Calculation:      |  | Computation:      |                  |  |
|  |  | - Apply fees      |  | - Calculate fees  |                  |  |
|  |  | - Approval flow   |  | - Schedule payout |                  |  |
|  |  +-------------------+  +-------------------+                  |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
+======================================================================+
                                   |
                                   v
+======================================================================+
|  LAYER 4: DATA ACCESS LAYER (Repository Pattern)                     |
|  +----------------------------------------------------------------+  |
|  |                    ORM (Prisma / TypeORM)                      |  |
|  |                                                                |  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  |  | UserRepository   | | ProductRepository| | GoalRepository  ||  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  |  | PaymentRepository| | RefundRepository | | PayoutRepository||  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
+======================================================================+
                                   |
                                   v
+======================================================================+
|  LAYER 5: INFRASTRUCTURE LAYER                                       |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  |  | Database Clients | | Payment Gateway  | | SMS/Email       ||  |
|  |  | (PostgreSQL)     | | Clients          | | Clients         ||  |
|  |  +------------------+ +------------------+ +------------------+|  |
|  |  +------------------+ +------------------+                    |  |
|  |  | Cache Client     | | Queue Client     |                    |  |
|  |  | (Redis)          | | (RabbitMQ)       |                    |  |
|  |  +------------------+ +------------------+                    |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
+======================================================================+
```

### Layer Details

#### Layer 1: Presentation Layer (Client)

A single **responsive web application** serves all user types with role-based views:

| User Type | Features | Route Examples |
|-----------|----------|----------------|
| **Consumer** | Product catalog, savings goals, payment history | /products, /goals, /payments |
| **Merchant** | Product management, payout tracking, analytics | /merchant/products, /merchant/payouts |
| **Admin** | User management, refund queue, system config | /admin/users, /admin/refunds |

**Authentication Flow:**
```
Login --> Receive JWT --> Store in HTTP-only Cookie --> Include in API requests
```

#### Layer 2: API Layer (Backend for Frontend)

The BFF pattern provides a single API optimized for the web frontend:

```
API ENDPOINT GROUPS
===================

/auth/*          - Login, Register, Logout, Password Reset
/users/*         - Profile Management
/products/*      - Catalog & Search
/savings-goals/* - SNBL Goal Management
/payments/*      - Transaction Processing
/refunds/*       - Cancellation Flow
/merchant/*      - Merchant Operations
/admin/*         - Administration
```

#### Layer 3: Domain & Service Layer

This is where **business rules** are enforced:

| Module | Key Business Rules |
|--------|-------------------|
| **Savings Goals** | Target amount cannot exceed product price; only ACTIVE goals can receive deposits |
| **Payments** | Validate amount, enforce method restrictions, handle gateway callbacks |
| **Refunds** | Calculate refund amount based on policy, require merchant/admin approval |
| **Payouts** | Compute merchant earnings after platform fees, schedule disbursements |

#### Layer 4: Data Access Layer

Repositories abstract database operations:

```
// Example Repository Interface

interface SavingsGoalRepository {
  findById(id: UUID): Promise<SavingsGoal | null>;
  findByUserId(userId: UUID, status?: GoalStatus): Promise<SavingsGoal[]>;
  create(data: CreateGoalDTO): Promise<SavingsGoal>;
  updateAmount(id: UUID, amount: number): Promise<SavingsGoal>;
}
```

#### Layer 5: Infrastructure Layer

Wrappers around external dependencies that can be swapped without affecting business logic:

| Wrapper | Abstracts |
|---------|----------|
| PaymentGatewayClient | Paystack, Flutterwave, MOMO APIs |
| SMSClient | Africa's Talking, Twilio |
| EmailClient | SendGrid, Mailgun, SES |
| CacheClient | Redis operations |
| QueueClient | RabbitMQ publish/subscribe |

---

## 7. Backend Services and Components

```
BACKEND SERVICE ARCHITECTURE
============================

+------------------+
|   WEB CLIENT     |
|  (Next.js App)   |
+--------+---------+
         |
         v
+--------+---------+
|   API GATEWAY    |
|  (Express.js)    |
| - Authentication |
| - Routing        |
| - Validation     |
+--------+---------+
         |
         +----------------------------------------------------+
         |              |              |              |       |
         v              v              v              v       v
+--------+----+ +-------+-----+ +------+------+ +-----+-----+ |
| Auth &      | | Product     | | Savings     | | Payment   | |
| User        | | Catalog     | | Goal        | | Service   | |
| Service     | | Service     | | Service     | |           | |
+-------------+ +-------------+ +-------------+ +-----------+ |
                                                              |
         +----------------------------------------------------+
         |              |              |              |
         v              v              v              v
+--------+----+ +-------+-----+ +------+------+ +-----+------+
| Refund      | | Merchant    | | Admin       | | Reporting  |
| Service     | | Service     | | Service     | | Service    |
+-------------+ +-------------+ +-------------+ +------------+
         |
         |
         +----> Notification Service ----> [RabbitMQ] ----> SMS/Email
         |
         v
+------------------------------------------------------------------+
|                         DATA STORES                              |
|                                                                  |
|  +----------------+  +----------------+  +-------------------+   |
|  | PostgreSQL     |  | Redis          |  | Object Storage    |   |
|  | (Primary DB)   |  | (Cache)        |  | (S3/MinIO)        |   |
|  +----------------+  +----------------+  +-------------------+   |
|                                                                  |
+------------------------------------------------------------------+
         |
         v
+------------------+
| EXTERNAL APIs    |
| - Payment GW     |
| - SMS Provider   |
| - Email Provider |
+------------------+
```

### Service Responsibility Matrix

| Service | Primary Responsibility | Key Operations |
|---------|----------------------|----------------|
| **Auth & User** | Identity and access management | Register, login, logout, password reset, profile updates |
| **Product Catalog** | Product lifecycle management | CRUD operations, search, filtering, image management |
| **Savings Goal** | SNBL goal management | Create goal, track progress, cancel, complete |
| **Payment** | Financial transaction handling | Initiate payment, process webhooks, record deposits |
| **Refund** | Cancellation and refund processing | Create request, merchant review, admin approval, execute refund |
| **Merchant** | Merchant account management | Onboarding, product management, payout tracking |
| **Admin** | Platform administration | User/merchant management, configuration, dispute resolution |
| **Notification** | Communication dispatch | Queue and send SMS/emails for OTPs, confirmations, reminders |
| **Reporting** | Analytics and exports | Generate KPIs, dashboard data, CSV/PDF exports |

### Savings Goal Lifecycle (SNBL)

```
SAVINGS GOAL STATE DIAGRAM
==========================

                            +--------+
                            | START  |
                            +---+----+
                                |
                                | Consumer creates goal
                                v
                         +------+------+
                    +--->|   ACTIVE    |<---+
                    |    +------+------+    |
                    |           |           |
                    |    +------+------+    |
                    |    | Make Deposit|    |
                    |    | (increase   |    |
                    +----| amount)     +----+
                         +------+------+
                                |
              +-----------------+------------------+
              |                                    |
              | current_amount                     | Consumer cancels
              | >= target_amount                   | OR Admin override
              v                                    v
       +------+------+                      +------+------+
       |  COMPLETED  |                      |  CANCELLED  |
       +------+------+                      +------+------+
              |                                    |
              | Product delivered,                 | Refund processed
              | Merchant paid out                  | (if applicable)
              v                                    v
          +---+---+                            +---+---+
          |  END  |                            |  END  |
          +-------+                            +-------+


NOTES:
- Progress = current_amount / target_amount x 100%
- v1: No pause/resume feature
- Cancellation triggers refund eligibility check
```

---

## 8. Conceptual Data Model

This Entity-Relationship Diagram (ERD) shows how data entities relate to each other.

```
ENTITY RELATIONSHIP DIAGRAM
===========================

+------------------+          +------------------+          +------------------+
|      USER        |          |    MERCHANT      |          |    PRODUCT       |
+------------------+          +------------------+          +------------------+
| id (PK)          |          | id (PK)          |          | id (PK)          |
| phone (UK)       |          | business_name    |          | merchant_id (FK) |----+
| email (UK)       |          | contact_email    |          | name             |    |
| password_hash    |          | contact_phone    |          | description      |    |
| role             |          | status           |          | category         |    |
| status           |          | bank_details     |          | price            |    |
| first_name       |          | created_at       |          | currency         |    |
| last_name        |          | updated_at       |          | stock_quantity   |    |
| created_at       |          +--------+---------+          | status           |    |
| updated_at       |                   |                    | created_at       |    |
+--------+---------+                   |                    +--------+---------+    |
         |                             |                             |              |
         |                    +--------v---------+                   |              |
         |                    |  MERCHANT_USER   |                   |              |
         |                    +------------------+                   |              |
         |                    | id (PK)          |                   |              |
         +------------------->| user_id (FK)     |                   |              |
                              | merchant_id (FK) |<------------------+              |
                              | role             |                                  |
                              +------------------+                                  |
         |                                                                          |
         |     CREATES                                               LISTS          |
         |                                                                          |
         v                                                                          |
+--------+---------+                    +------------------+                        |
|   SAVINGS_GOAL   |                    |  PRODUCT_IMAGE   |                        |
+------------------+                    +------------------+                        |
| id (PK)          |                    | id (PK)          |                        |
| user_id (FK)     |                    | product_id (FK)  |<-----------------------+
| product_id (FK)  |------------------->| url              |
| target_amount    |   TARGET OF        | sort_order       |
| current_amount   |                    | created_at       |
| frequency        |                    +------------------+
| status           |
| est_completion   |
| created_at       |           ACCUMULATES
| updated_at       |---------------------------+
+--------+---------+                           |
         |                                     v
         |                           +---------+--------+
         | INITIATES                 |  SAVINGS_DEPOSIT |
         |                           +------------------+
         v                           | id (PK)          |
+--------+---------+                 | savings_goal_id  |
|     PAYMENT      |                 | payment_id (FK)  |<------+
+------------------+                 | amount           |       |
| id (PK)          |                 | status           |       |
| user_id (FK)     |                 | created_at       |       |
| external_ref     |                 +------------------+       |
| amount           |                                            |
| currency         |           FUNDS                            |
| method           |--------------------------------------------+
| status           |
| purpose          |
| metadata         |
| created_at       |           MAY REFUND
| updated_at       |---------------------------+
+--------+---------+                           |
         |                                     v
         |                           +---------+--------+
         | SUBMITS                   | REFUND_TRANSACTION|
         |                           +------------------+
         v                           | id (PK)          |
+--------+---------+                 | refund_req_id    |<------+
|  REFUND_REQUEST  |                 | payment_id (FK)  |       |
+------------------+                 | amount           |       |
| id (PK)          |                 | status           |       |
| user_id (FK)     |                 | gateway_response |       |
| savings_goal_id  |                 | created_at       |       |
| merchant_id (FK) |                 +------------------+       |
| reason           |                                            |
| status           |           RESULTS IN                       |
| requested_amount |--------------------------------------------+
| approved_amount  |
| decided_by (FK)  |
| created_at       |
| resolved_at      |
+------------------+


+------------------+          +------------------+
|     PAYOUT       |          |    AUDIT_LOG     |
+------------------+          +------------------+
| id (PK)          |          | id (PK)          |
| merchant_id (FK) |          | actor_type       |
| amount           |          | actor_id         |
| period_start     |          | action           |
| period_end       |          | entity_type      |
| status           |          | entity_id        |
| method           |          | before_state     |
| created_at       |          | after_state      |
| updated_at       |          | ip               |
+------------------+          | user_agent       |
                              | created_at       |
                              +------------------+


LEGEND:
  PK = Primary Key
  FK = Foreign Key
  UK = Unique Key
  --> = Foreign Key Relationship
```

### Key Relationships Explained

| Relationship | Cardinality | Description |
|--------------|-------------|-------------|
| USER --> SAVINGS_GOAL | One-to-Many | A consumer can have multiple savings goals for different products |
| MERCHANT --> PRODUCT | One-to-Many | A merchant can list many products; each product belongs to one merchant (tenant isolation) |
| SAVINGS_GOAL --> SAVINGS_DEPOSIT | One-to-Many | A goal accumulates multiple deposits over time |
| PAYMENT --> SAVINGS_DEPOSIT | One-to-One | Each successful payment creates exactly one deposit record |
| REFUND_REQUEST --> REFUND_TRANSACTION | One-to-Many | A refund may be processed in multiple transactions |

---

## 9. Deployment and Infrastructure

```
DEPLOYMENT ARCHITECTURE
=======================

                              INTERNET
                                 |
                                 v
                    +------------+------------+
                    |           CDN           |
                    |   (CloudFlare / AWS)    |
                    |   - Static Assets       |
                    |   - Edge Caching        |
                    +------------+------------+
                                 |
                                 v
                    +------------+------------+
                    |      LOAD BALANCER      |
                    |   (NGINX / AWS ALB)     |
                    |   - SSL Termination     |
                    |   - Health Checks       |
                    +------------+------------+
                                 |
              +------------------+------------------+
              |                                     |
              v                                     v
    +---------+---------+                 +---------+---------+
    |  NEXT.JS SERVER 1 |                 |  NEXT.JS SERVER 2 |
    |  (Frontend)       |                 |  (Frontend)       |
    +-------------------+                 +-------------------+
              |                                     |
              +------------------+------------------+
                                 |
              +------------------+------------------+------------------+
              |                  |                  |                  |
              v                  v                  v                  v
    +---------+----+   +---------+----+   +---------+----+   +---------+----+
    | API SERVER 1 |   | API SERVER 2 |   | API SERVER 3 |   |   WORKERS    |
    | (Node.js)    |   | (Node.js)    |   | (Node.js)    |   | (Background) |
    +--------------+   +--------------+   +--------------+   +--------------+
              |                  |                  |                  |
              +------------------+------------------+------------------+
                                 |
              +------------------+------------------+------------------+
              |                  |                  |                  |
              v                  v                  v                  v
    +---------+----+   +---------+----+   +---------+----+   +---------+----+
    | PostgreSQL   |   | Redis        |   | RabbitMQ     |   | Object       |
    | (Primary +   |   | (Cluster)    |   | (Message     |   | Storage      |
    |  Replica)    |   |              |   |  Queue)      |   | (S3)         |
    +--------------+   +--------------+   +--------------+   +--------------+
    
                                 |
              +------------------+------------------+
              |                  |                  |
              v                  v                  v
    +---------+----+   +---------+----+   +---------+----+
    | Logging      |   | Metrics      |   | Tracing      |
    | (ELK/Loki)   |   | (Prometheus) |   | (Jaeger)     |
    +--------------+   +--------------+   +--------------+


EXTERNAL SERVICES:
+------------------+   +------------------+   +------------------+
| Payment Gateways |   | SMS Provider     |   | Email Provider   |
| - Paystack       |   | - Twilio         |   | - SendGrid       |
| - Flutterwave    |   | - Africa's Talk  |   | - Mailgun        |
| - MTN MOMO       |   |                  |   |                  |
+------------------+   +------------------+   +------------------+
```

### Environment Strategy

| Environment | Purpose | Infrastructure |
|-------------|---------|---------------|
| **Development** | Local development and testing | Docker Compose, local PostgreSQL, Redis |
| **Staging** | Pre-production testing and QA | Mirrors production, reduced capacity |
| **Production** | Live user traffic | Full redundancy, auto-scaling, monitoring |

### High Availability Features

| Feature | Implementation |
|---------|---------------|
| **Load Balancing** | Multiple API and frontend instances behind a load balancer |
| **Database Replication** | PostgreSQL primary with read replicas |
| **Caching** | Redis cluster for session and data caching |
| **Health Checks** | Automatic restart of unhealthy containers |
| **Auto-Scaling** | Horizontal scaling based on CPU/memory metrics |
| **CI/CD Pipeline** | Automated build, test, and deployment |

---

## 10. Security and Authentication

### Authentication Flow

```
AUTHENTICATION FLOW
===================

  User            Browser           API Server        Auth Service       Database
   |                 |                  |                  |                 |
   | 1. Enter        |                  |                  |                 |
   |    credentials  |                  |                  |                 |
   +---------------->|                  |                  |                 |
                     |                  |                  |                 |
                     | 2. POST          |                  |                 |
                     |    /auth/login   |                  |                 |
                     +----------------->|                  |                 |
                                        |                  |                 |
                                        | 3. Validate      |                 |
                                        +----------------->|                 |
                                                           |                 |
                                                           | 4. Query user   |
                                                           +---------------->|
                                                           |                 |
                                                           | 5. User record  |
                                                           |<----------------+
                                                           |                 |
                                        | 6. Verify password hash            |
                                        |    (bcrypt/Argon2)                 |
                                        |<-----------------+                 |
                                        |                  |                 |
                              +---------+---------+        |                 |
                              | PASSWORD VALID?   |        |                 |
                              +---------+---------+        |                 |
                                   |         |             |                 |
                              YES  |         | NO          |                 |
                                   v         v             |                 |
                     +-------------+    +----+-------+     |                 |
                     | Generate    |    | Return 401 |     |                 |
                     | JWT Token   |    | Unauthorized|    |                 |
                     +------+------+    +------------+     |                 |
                            |                              |                 |
                     | 7. Set HTTP-only                    |                 |
                     |    cookie + user data               |                 |
                     |<-------------------------------------                 |
   | 8. Logged in   |                                                       |
   |<---------------+                                                       |


SUBSEQUENT REQUESTS:
====================

  Browser                API Server
     |                       |
     | Request with JWT      |
     | in cookie             |
     +---------------------->|
                             |
                      +------+------+
                      | Validate    |
                      | JWT Token   |
                      +------+------+
                             |
                      +------+------+
                      | Extract     |
                      | User Context|
                      +------+------+
                             |
     | Response             |
     |<---------------------+
```

### Security Architecture

```
SECURITY LAYERS
===============

+------------------------------------------------------------------+
|                     TRANSPORT SECURITY                            |
|                                                                   |
|    TLS 1.3 - HTTPS Everywhere                                    |
|    All communication encrypted in transit                        |
+------------------------------------------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                     AUTHENTICATION                                |
|                                                                   |
|    +------------------+  +------------------+  +---------------+  |
|    | JWT Tokens       |  | Refresh Tokens   |  | SMS OTP       |  |
|    | (Short-lived,    |  | (Optional for    |  | (For sensitive|  |
|    |  15 min expiry)  |  |  extended session)|  |  operations)  |  |
|    +------------------+  +------------------+  +---------------+  |
|                                                                   |
+------------------------------------------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                AUTHORIZATION - RBAC                               |
|                                                                   |
|    CONSUMER        MERCHANT_USER         ADMIN                    |
|    - Own data      - Own data            - Own data               |
|    - Own goals     - Own products        - All products           |
|    - Own payments  - Own payouts         - All users              |
|                                          - All config             |
+------------------------------------------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                     API SECURITY                                  |
|                                                                   |
|    +------------------+  +------------------+  +---------------+  |
|    | Input Validation |  | Rate Limiting    |  | CORS Policy   |  |
|    | (Schema enforce) |  | (Per IP/User)    |  | (Allowed      |  |
|    |                  |  |                  |  |  origins only)|  |
|    +------------------+  +------------------+  +---------------+  |
|                                                                   |
+------------------------------------------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                     DATA SECURITY                                 |
|                                                                   |
|    +------------------+  +------------------+  +---------------+  |
|    | Password Hashing |  | Encryption at    |  | Audit Logging |  |
|    | (bcrypt/Argon2)  |  | Rest (sensitive  |  | (All critical |  |
|    |                  |  |  fields)         |  |  actions)     |  |
|    +------------------+  +------------------+  +---------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

### Role-Based Access Control (RBAC) Matrix

| Resource | Consumer | Merchant | Admin |
|----------|----------|----------|-------|
| Own profile | Read/Write | Read/Write | Read/Write all |
| All products | Read | Read/Write own | Read/Write all |
| Own savings goals | Full access | None | Read/Override |
| Merchant products | Read | Full access own | Full access all |
| Refund requests | Create/Read own | Approve/Reject own | Full access |
| Payouts | None | Read own | Full access |
| System configuration | None | None | Full access |

---

## 11. Technology Stack Summary

```
TECHNOLOGY STACK
================

FRONTEND                    BACKEND                     DATA
+------------------+        +------------------+        +------------------+
| Next.js 14       |        | Node.js 20 LTS   |        | PostgreSQL 15    |
| React 18         |        | Express.js       |        | Redis 7          |
| Tailwind CSS     |        | Prisma ORM       |        | RabbitMQ         |
| TypeScript       |        | JWT Auth         |        | S3/MinIO         |
+------------------+        +------------------+        +------------------+

DEVOPS                      MONITORING
+------------------+        +------------------+
| Docker           |        | Prometheus       |
| Kubernetes       |        | Grafana          |
| GitHub Actions   |        | Sentry           |
| Terraform        |        | ELK Stack        |
+------------------+        +------------------+
```

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend Framework** | Next.js | 14.x | React framework with SSR/SSG |
| **UI Library** | React | 18.x | Component-based UI |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Language** | TypeScript | 5.x | Type-safe JavaScript |
| **Backend Runtime** | Node.js | 20 LTS | JavaScript runtime |
| **API Framework** | Express | 4.x | Web framework |
| **ORM** | Prisma | 5.x | Database toolkit |
| **Database** | PostgreSQL | 15.x | Relational database |
| **Cache** | Redis | 7.x | In-memory data store |
| **Message Queue** | RabbitMQ | 3.x | Async job processing |
| **Object Storage** | AWS S3 / MinIO | - | File storage |
| **Containerization** | Docker | - | Application packaging |
| **Orchestration** | Kubernetes | - | Container orchestration |
| **CI/CD** | GitHub Actions | - | Automated pipelines |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial enhanced architecture documentation |

---

> **Next Documents:**
> - Database Schema and Migrations
> - API Design Specification
