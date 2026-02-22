# SaveGoal Infrastructure & Operational Cost Analysis

> **Date:** January 2026
> **Currency:** Costs listed in **USD ($)** for Infrastructure and **GHS (₵)** for Local Operations.

---

## 1. Operational Team Costs (Data Subscription)

**Team Composition:**
*   **Sarkodie** (Frontend)
*   **Jayden** (Frontend)
*   **Theophilus** (Backend)
*   **Nsiah** (Backend)
*   **Pearl** (UI/UX)
*   **Elisha** (UI/UX)

**Monthly Data Cost breakdown:**
*   Cost per member: **₵400.00**
*   Total Members: **6**

| Item | Monthly Cost (GHS) |
| :--- | :--- |
| **Team Data (6 Members)** | **₵ 2,400.00** |

---

## 2. Phase 1: MVP / Launch (Months 1-2)

**Strategy:** Minimize costs by utilizing "Free Tier" services and low-cost shared infrastructure. This set up is sufficient for development, testing, and initial user onboarding (up to ~500 active users).

### Infrastructure Stack (Low Cost)

| Service | Provider & Plan | Monthly Cost (Est.) |
| :--- | :--- | :--- |
| **Frontend Hosting** | Vercel / Netlify (Pro Team) or DigitalOcean App Platform (Basic) | $20.00 |
| **Backend API** | Render.com (Team) or Railway (pay-as-you-go) | $15.00 |
| **Database (Postgres)** | Supabase / Neon (Pro Tier - avoids pausing) | $25.00 |
| **Redis Cache** | Upstash (Pay-as-you-go) | ~$5.00 |
| **Object Storage** | AWS S3 / Cloudflare R2 | ~$5.00 |
| **Domain Name** | Namecheap / GoDaddy (Annual pro-rated) | $2.00 |
| **Message Queue** | CloudAMQP (Lemur/Tiger) | Free / $5.00 |
| **SMS/Email** | Twilio / SendGrid (Pay-as-you-go) | ~$10.00 |
| **Total Infra (USD)** | | **~$87.00 / mo** |

**Total MVP Phase Cost (Per Month):**
*   **Infrastructure:** ~$87.00
*   **Team Data:** ₵ 2,400.00

---

## 3. Phase 2: Business Operation (1 Year Outlook)

**Strategy:** Production-grade infrastructure focused on reliability, uptime, and scaling. Moving away from shared resources to dedicated instances to handle consistent user traffic (active business phase).

### Infrastructure Stack (Scaled)

| Service | Component & Specs | Monthly Cost (Est.) |
| :--- | :--- | :--- |
| **Frontend** | Vercel Ent. or AWS Amplify (Traffic based) | $40.00 |
| **Backend API** | 2x t3.medium Instances (AWS/DigitalOcean) + Load Balancer | $70.00 |
| **Database** | Managed RDS / DigitalOcean Managed DB (High Availability) | $60.00 |
| **Redis** | Managed Redis Cluster (Production) | $30.00 |
| **RabbitMQ** | Dedicated Message Broker | $30.00 |
| **Storage (S3)** | Standard Tier (Assuming 500GB+ traffic/storage) | $25.00 |
| **Monitoring** | Datadog / NewRelic / Sentry | $50.00 |
| **Notifications** | SMS/Email Volume scaling | $50.00 |
| **Security** | WAF / Advanced SSL | $20.00 |
| **Total Infra (USD)** | | **~$375.00 / mo** |

### Annual Projections (1 Year)

| Category | Monthly | Annual Total |
| :--- | :--- | :--- |
| **Infrastructure (USD)** | ~$375.00 | **$4,500.00** |
| **Team Operations (GHS)** | ₵ 2,400.00 | **₵ 28,800.00** |

---

## 4. Cost Saving & Optimization Tips for MVP

1.  **Database:** Use **Supabase** or **Neon**. Their free tiers are generous (500MB storage), and the Pro tier ($25) is far cheaper than a managed AWS RDS instance ($60+) for starting out.
2.  **Hosting:** Stick to **Vercel** for Frontend. It is free for hobby/personal, but for a team of 6, the $20/member/mo cost might apply if using team features. *Hack:* Use a single "Team" account shared or deploy from a personal Pro account to save costs initially (Check Vercel ToS). Alternatively, deploy both FE and BE on a **DigitalOcean Droplet ($12/mo)** using Docker to keep costs flat regardless of seats.
3.  **Notifications:** WhatsApp Business API might be cheaper/more effective than SMS in Ghana. Verify pricing per conversation.
4.  **DevOps:** Don't pay for CI/CD pipelines (CircleCI/Travis) yet; use **GitHub Actions** free tier which is sufficient for a team of 6.

---

## 5. Total Estimated Funding Need

**To survive the first 3 months (2 months MVP + 1 Month Launch):**

*   **Data:** 3 months * ₵ 2,400 = **₵ 7,200**
*   **Infra:** 3 months * $87 = **$261**

> **Exchange Rate Note:** Using **$1 = ₵12** (Contingency Rate).
> $261 ≈ ₵ 3,132

**Total Cash (approx) needed for 3 months runway:**
**~ ₵ 10,332.00**
