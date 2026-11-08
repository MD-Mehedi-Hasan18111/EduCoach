# EduCoach Master — Multi-Tenant Coaching SaaS & Accessibility Hub

**EduCoach Master** is a centralized master web application built with **Next.js** (App Router & Turbopack), **TypeScript**, **Tailwind CSS**, and **MongoDB (Mongoose)** designed to orchestrate, license, provision, and control accessibility for separate coaching management systems (such as *Al Hikma Coaching Center*, *Shikkhon Coaching System*, and newly registered coaching institutes).

---

## 🌟 Why EduCoach?

Previously, coaching management systems ran as separate, isolated projects with separate MongoDB databases. EduCoach Master acts as the unified platform to:
1. **Manage Existing Coaching Systems**: Central directory of connected systems, live health checks, and database assignments.
2. **Instant Accessibility Control**: Single-click master switch to set any coaching center to `ACTIVE`, `MAINTENANCE` (with custom notice), or `SUSPENDED` (license hold).
3. **Public Onboarding & Registration**: Prospective coaching centers submit website requests with preferred subdomains, capacity, and plan tiers.
4. **Instant Provisioning Workflow**: Master Admin reviews applications and provisions new dedicated websites, assigns isolated MongoDB databases, and generates initial director credentials in one click.
5. **Subscription & Billing Hub**: Subscription plans (Starter, Standard, Pro, Enterprise), monthly & yearly billing cycles, renewal extensions, and digital invoice generation (bKash, Nagad, Bank, Manual).
6. **Coaching Director Self-Service Portal**: Coaching owners can log in to check their subscription validity, view invoices, submit payment transaction IDs, and launch their systems.
7. **Remote Licensing API (`/api/v1/license/verify`)**: Real-time license verification endpoint that child coaching systems can call to verify accessibility and feature flags.

---

## 🏗️ Architecture & Multi-Tenancy

```
                              ┌───────────────────────────────────┐
                              │     EduCoach Master Hub (Next.js) │
                              │          (Port :3050)             │
                              │    Database: educoach_master      │
                              └─────────────────┬─────────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 │ Remote Health / API Ping     │ License Verification API     │ Webhook / Provision
                 ▼                              ▼                              ▼
    ┌──────────────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────┐
    │ Al Hikma Coaching Center │   │ Shikkhon Coaching System │   │ New Provisioned Coaching │
    │       (Port :3000)       │   │       (Port :3001)       │   │   (Subdomain / Port)     │
    │  DB: coaching_mgmt_sys   │   │  DB: shikkhon_coaching   │   │  DB: {slug}_coaching_db  │
    └──────────────────────────┘   └──────────────────────────┘   └──────────────────────────┘
```

- **Separate MongoDB Databases**: Each coaching system maintains 100% data sovereignty. Student records, fees, and exams are completely isolated.
- **Master Metadata Database**: `educoach_master` stores tenant registries, admin credentials, registration requests, plans, subscriptions, and invoices.

---

## 🚀 Getting Started

### 1. Requirements
- Node.js `v20+` or `v24+`
- MongoDB local instance or MongoDB Atlas URI

### 2. Environment Configuration
Inspect or adjust `.env.local`:
```env
PORT=3050
NEXT_PUBLIC_APP_URL=http://localhost:3050
MONGODB_URI=mongodb://127.0.0.1:27017/educoach_master
JWT_SECRET=your_master_secret_jwt_key
ADMIN_EMAIL=admin@educoach.com
ADMIN_PASSWORD=EduCoach@2026
```

### 3. Seed Master Database
Run the pre-configured database seeder:
```bash
cd EduCoach
npm run seed
```
This populates:
- **Master Super Admin**: `admin@educoach.com` / `EduCoach@2026`
- **Subscription Plans**: Starter, Standard, Pro, Enterprise
- **Pre-linked Coaching Systems**:
  - `Al Hikma Coaching Center` (Port :3000, DB: `coaching_management_system`)
  - `Shikkhon Coaching System` (Port :3001, DB: `shikkhon_coaching_db`)
- **Sample Registration Requests & Invoices**

### 4. Run Development Server
```bash
npm run dev
```
The master application starts on **`http://localhost:3050`**.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🔑 Key Portals & URLs

| Route | Description | Access |
|---|---|---|
| `/` | Modern SaaS Landing Page with live directory of connected systems & pricing | Public |
| `/register` | Onboarding application for new coaching centers to request a website | Public |
| `/track` | Real-time application tracker by Reference ID (e.g. `REQ-XXXXXX`) or Email | Public |
| `/login` | Unified authentication with one-click demo autofill | Public |
| `/admin` | Super Admin Master Console with analytics, revenue & alerts | Super Admin |
| `/admin/systems` | Coaching systems directory, DB info, health pings & accessibility switch | Super Admin |
| `/admin/requests` | Applications review queue with one-click Approve & Provision | Super Admin |
| `/admin/subscriptions` | Subscription plans, validities, renewals, and invoice management | Super Admin |
| `/admin/logs` | Security & audit logs of accessibility and account changes | Super Admin |
| `/portal` | Client Self-Service Portal for institute directors (renewals, invoices, launch) | Tenant Owner |
| `/api/v1/license/verify` | Child system verification endpoint (`?slug=alhikma`) | API / Child Apps |

---

## 🔌 Child Systems Integration Guide

To connect child coaching systems (like `Al Hikma` or `Shikkhon`) to EduCoach Master, use the lightweight client in `src/lib/child-license-client.ts` or add this check in the child's `middleware.ts`:

```typescript
// In child project (e.g. Al Hikma or Shikkhon src/middleware.ts):
const res = await fetch("http://localhost:3050/api/v1/license/verify?slug=alhikma");
const data = await res.json();

if (!data.allowed) {
  // If Master admin set status to MAINTENANCE or SUSPENDED:
  return new NextResponse(
    `<html><body style="font-family:sans-serif;text-align:center;padding:50px;">
       <h1>${data.status === "MAINTENANCE" ? "Scheduled Maintenance" : "System Access Suspended"}</h1>
       <p>${data.message}</p>
     </body></html>`,
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
```

---

## 🛡️ License
Private & Proprietary. Created for Multi-Tenant Coaching Management Operations.

