# Enterprise B2B & 3PL Multi-Stakeholder Dispatch, Audit, and Invoice Settlement Platform

A Next.js, Tailwind CSS, and shadcn/ui frontend platform digitizing the complete **"Proof of Delivery (POD) to Cash"** lifecycle for enterprise logistics and supply chain operations.

---

## Live Role Navigation Map

The application is organized into 5 distinct stakeholder views:

| Role | Route | Description |
| :--- | :--- | :--- |
| **1. Dispatch Manager Dashboard** | [`/`](http://localhost:3000) | Live fleet telematics grid, driver advance float tracking, and EOD tally closures |
| **2. Driver Mobile-Web App** | [`/driver`](http://localhost:3000/driver) | Outdoor glare-resistant GPS navigation HUD, LR camera capture, and digital signing |
| **3. Internal Audit Workspace** | [`/audit`](http://localhost:3000/audit) | 50/50 split-pane document viewer (zoom/rotate), telematics match, and audit checklist |
| **4. Logistics Accounts & Billing** | [`/accounts`](http://localhost:3000/accounts) | Unbilled consignment batching, GST tax calculator (18%), and consolidated tax invoice drafting |
| **5. Client / Vendor AP Portal** | [`/client-portal`](http://localhost:3000/client-portal) | Customer-facing invoice review, digital POD inspection, and inline line-item dispute drawer |

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Primitives**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the Dispatch Manager Dashboard. Use the navigation buttons in the top header or sidebar to switch across all 5 roles.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## Documentation

Full architectural and functional documentation covering design rationales, components, and state management for each of the 5 views is available in [**DOCUMENTATION.md**](./DOCUMENTATION.md).
