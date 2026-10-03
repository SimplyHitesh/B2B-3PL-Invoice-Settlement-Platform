# Enterprise B2B & 3PL Multi-Stakeholder Dispatch, Audit, and Invoice Settlement Platform

A production-ready Next.js 14, Tailwind CSS, and shadcn/ui frontend platform digitizing the complete **"Proof of Delivery (POD) to Cash"** lifecycle for enterprise logistics, fleet telematics, and third-party logistics (3PL) operations. Powered by **Bun** for rapid package management and compilation.

---

## Complete Role & Route Navigation Map

The platform is fortified with Next.js edge route guards (`middleware.ts`) and structured across 8 dedicated stakeholder portals and authentication flows:

| Role / Module | Route | Access Type | Description |
| :--- | :--- | :--- | :--- |
| **Authentication Portal** | [`/login`](http://localhost:3000/login) | Public / Guest | Enterprise login with role-based demo presets, rate limiting, and session cookie generation |
| **Invite & Password Setup** | [`/invite/accept`](http://localhost:3000/invite/accept) | Public / Token-gated | Token-verified new user onboarding with a 5-point live password policy validator |
| **1. Dispatch Manager Dashboard** | [`/dispatch`](http://localhost:3000/dispatch) (or `/`) | Protected | Live fleet telematics grid, driver advance float tracking, and EOD financial reconciliation |
| **2. Driver Mobile-Web App** | [`/driver`](http://localhost:3000/driver) | Protected | Outdoor glare-resistant GPS navigation HUD, camera LR capture, and digital glass signing |
| **3. Internal Audit Workspace** | [`/audit`](http://localhost:3000/audit) | Protected | 50/50 split-pane document viewer (zoom/rotate), GPS telematics match, and 5-gate audit checklist |
| **4. Logistics Accounts & Billing** | [`/accounts`](http://localhost:3000/accounts) | Protected | Unbilled consignment batching, 18% statutory GST tax calculator (SAC 996511), and invoice draft generator |
| **5. Client / Vendor AP Portal** | [`/client-portal`](http://localhost:3000/client-portal) | Protected | External client portal for Metro Cash & Carry with digital POD review and inline line-item dispute drawer |
| **6. Admin Master Data Shell** | [`/admin`](http://localhost:3000/admin) | Protected | Enterprise directory for Users & Roles, status toggling, invite generation, and master data records |

---

## Security & Route Protection (`middleware.ts`)

All operational modules (`/dispatch`, `/audit`, `/accounts`, `/driver`, `/client-portal`, `/admin`) are protected at the edge by Next.js `middleware.ts`:
- **Unauthenticated Access**: Requests missing the `vecto_access_token` session cookie are redirected with HTTP 307 to `/login?from=<target_path>`.
- **Authenticated Access**: Authenticated users visiting `/login` are automatically forwarded to `/dispatch`.
- **Fast-Track Testing**: The login screen provides 1-click persona quick-fill buttons (`Admin`, `Dispatch`, `Auditor`, `Billing`, `Driver`) that automatically write the session cookie and navigate to the target portal.

---

## API Client Layer & Mock Service Worker (MSW)

- **API Client (`lib/api/client.ts`)**: Strictly typed fetch wrapper with automatic Bearer token injection (from cookies or `localStorage`), timeout handling (`AbortController`), and standardized error envelope parsing (`{ error: { code, message, details } }`).
- **Silent Refresh Interceptor (`lib/api/refresh.ts`)**: Intercepts `401 Unauthorized` responses and silently requests a new access token from `/api/v1/auth/refresh` using single-flight mutex deduplication to eliminate race conditions before replaying the original request.
- **Mock Service Worker (`mocks/handlers.ts`)**: Client-side mocking layer for realistic backend testing:
  - `POST /api/v1/auth/login`: Credential validation & JWT token generation.
  - `POST /api/v1/auth/refresh`: Refresh token renewal.
  - `GET /api/v1/users`: Master directory with role/status filters.
  - `GET /api/v1/vehicles`: Live fleet registry with telematics metrics.

---

## Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/) (Fast native bundler and package manager)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Client Interactivity)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Primitives**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Mocking**: [Mock Service Worker (MSW v3)](https://mswjs.io/)
- **Edge Middleware**: Next.js Server Runtime
- **Language**: TypeScript

---

## Quick Start (Powered by Bun)

### 1. Install Dependencies
```bash
bun install
```

### 2. Run Development Server
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. If not authenticated, the route guard will direct you to `/login`. Use the demo persona credentials or click any demo preset to log in immediately.

### 3. Build for Production
```bash
bun run build
bun run start
```

---

## Documentation

Full architectural and functional specifications covering design rationales, components, security flows, and state management across all views are available in:
- [**DOCUMENTATION.md**](./DOCUMENTATION.md) (Complete Markdown Specification)
- [**DOCUMENTATION.docx**](./DOCUMENTATION.docx) (Formatted Microsoft Word Document)
