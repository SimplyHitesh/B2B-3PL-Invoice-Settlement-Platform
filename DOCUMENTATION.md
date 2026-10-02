# Enterprise B2B & 3PL Multi-Stakeholder Dispatch, Audit, and Invoice Settlement Platform
## Frontend Technical & Functional Documentation

---

### Executive Overview & System Architecture

This platform digitizes and automates the end-to-end **"Proof of Delivery (POD) to Cash"** lifecycle across modern enterprise supply chains and third-party logistics (3PL) operations. In traditional logistics ecosystems, paper-based Lorry Receipts (LRs), unverified cash floats, delayed gate stamps, and invoice reconciliation lag lead to high Days Sales Outstanding (DSO), friction between consignees and carriers, and revenue leakage.

The frontend is architected using **Next.js 14 (App Router)**, **Tailwind CSS**, and **shadcn/ui** primitives to support distinct, interconnected roles governed by an edge route-guard middleware and administrative governance:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        LOGISTICS POD-TO-CASH PLATFORM ECOSYSTEM                        │
└────────────────────────────────────────────────────────────────────────────────────────┘

                       [Edge Route Guard: middleware.ts]
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
     [/login Portal]                                     [/invite/accept]
  SSO / Credentials / Presets                         Token Validation & 5-Rule
  Session Cookie (vecto_access_token)                 Password Policy Engine
            │
            ├─────────────────────────────────────────────────────┐
            ▼                                                     ▼
   [1. Dispatch Ops] ──────▶ [2. Driver Mobile] ──────▶ [3. Internal Audit]
    Live GPS Telematics       Outdoor HUD & Nav           50/50 Split-Pane Review
    Driver Advance Float       Camera POD Capture          Digital Stamp & Sign Match
    Odometer Gate Tracking     Glass Digital Sign          Financial Variance Check
             │                         │                              │
             │                         │                              ▼
             │                         │                   [4. Accounts & Billing]
             │                         │                    Unbilled Trips Queue
             │                         │                    Consolidated GST Tax Inv
             │                         │                    18% IGST / SAC 996511
             │                         │                              │
             │                         │                              ▼
             └─────────────────────────┴──────────────────▶ [5. Client AP Portal]
                                                            Invoice Inbox & Review
                                                            Interactive POD Proof
                                                            Inline Trip Dispute Flagging
                                                                      │
                                                                      ▼
                                                            [6. Admin Master Data]
                                                            Users & Roles Directory
                                                            Status & Invite Management
                                                            Vehicles / Drivers / Rates
```

---

## 1. Dispatch Manager Dashboard (`/` & `/dispatch`)

### 1.1 Core Objective
To grant regional dispatch superintendents real-time situational awareness over active fleet deployments, monitor route progress, manage driver cash/fuel floats, and execute End-of-Day (EOD) financial closures at hub terminals.

### 1.2 Architectural & UI/UX Design Rationale
* **High-Density SaaS Grid (Retool/Linear Style)**: Dispatchers manage tens to hundreds of live vehicles simultaneously. Every screen pixel is utilized with tight padding (`py-2.5`), compact headers (`h-8`), and `text-xs` typography to prevent excessive vertical scrolling.
* **Monochromatic Slate Foundation**: Built on `bg-white` cards with `bg-slate-50` backdrop, `border-slate-200`, and `text-slate-800` typography. High saturation colors are strictly reserved for operational exceptions (e.g. amber for `Delayed` trips, red for cash deficits).
* **Tabular Monospace Alignment**: Registration numbers (`MH 12 RN 4920`), odometers (`142,380 km`), and currency figures utilize monospace font variants (`font-mono`) to guarantee vertical decimal alignment for rapid visual auditing.

### 1.3 Key Features & Components
1. **Collapsible Operational Left Sidebar**: Fixed-width navigation with company branding (`VECTO LOGISTICS - POD-TO-CASH ENGINE`), active shift profile (`DIS-04 - Bhiwandi Hub #4`), and system health indicator (`ISO-28000 / POD-2PL Synced`).
2. **Top Operational Header**: Search input with real-time substring filtering across Vehicle Reg No, Driver Name, Destination, and Trip ID; simulated shift/date picker (`02-Oct-2026 (Shift 1)`); and live fleet metric pill (`Active | Delayed | Total Fleet`).
3. **Executive KPI Strip**: 4 compact summary cards tracking **Live Dispatched**, **Expected COD Inbound (₹)**, **Dispatched Advances (₹)**, and **Pending EOD Audit**.
4. **Live Vehicle & Trip Grid (`<Table>`, `<Card>`)**: Displays Vehicle Reg No, Driver Contact, Destination Corridor, Start/Current Odometer, Trip Status badge (`In Transit`, `Unloading`, `Delayed`), and action buttons:
   * **"Log Expense"**: Initiates interim expense logging.
   * **"Close Trip"**: Triggers full trip reconciliation.
5. **EOD Cash & Expense Modal (`<Dialog>`)**: Form input fields for FASTag tolls, driver daily allowance (bhatta), emergency fuel slips, and total COD collected.

### 1.4 State & Data Flow (Frontend Logic)
* **Real-time Filter & Search State**: Driven by `searchQuery` and `selectedStatusFilter` hooks feeding a memoized `useMemo` pipeline that filters `INITIAL_FLEET_DATA` without server round-trips.
* **EOD Tally Mathematical Model**: When the modal opens for trip $T$, it computes:
  $$\text{Total Expenses } (E) = \text{Toll} + \text{Allowance} + \text{Fuel}$$
  $$\text{Advance Balance } (B) = \text{Trip Advance} - E$$
  $$\text{Net Expected Remittance } (R_{\text{expected}}) = \text{Expected COD} + B$$
  $$\text{Discrepancy } (\Delta) = \text{Actual Cash Collected} - R_{\text{expected}}$$
* **Discrepancy Visual Feedback**: A dynamic conditional container highlights:
  * $\Delta = 0$: `bg-emerald-50` "Balanced (Zero Discrepancy)"
  * $\Delta > 0$: `bg-blue-50` "Surplus Cash (+₹$\Delta$)"
  * $\Delta < 0$: `bg-red-50` "Deficit / Shortage Action Required (-₹$|\Delta|$)"

---

## 2. Driver Mobile-Web App (`/driver`)

### 2.1 Core Objective
To provide long-haul and hub-and-spoke truck drivers with an outdoor-glare-resistant, touch-optimized mobile interface to navigate delivery stops, capture physical Lorry Receipts (LR), record receiver digital signatures, and collect COD remittances.

### 2.2 Architectural & UI/UX Design Rationale
* **Centered Mobile-First Shell**: Wrapped in a constrained viewport container (`max-w-md mx-auto min-h-screen border-x border-slate-300 pb-24`) simulating native iOS/Android handheld operating behavior.
* **Outdoor Glare & Glove Optimization**: High-contrast dark status headers, bold high-contrast text (`text-slate-900`, `font-black`), stark 2px solid borders, and massive action buttons (`py-7`, `text-lg`) with high-visibility corporate blue (`bg-blue-700`) and emerald green (`bg-emerald-600`).
* **Tactile Hierarchy**: Prevents accidental taps while driving by requiring deliberate thumb gestures on prominent touch zones.

### 2.3 Key Features & Components
1. **Rugged Device Status Header**: Duty toggle button ("Start Shift" / "End Shift"), live 4G LTE and battery indicators, vehicle registration badge (`MH 12 RN 4920 - 16T Eicher Pro`), and quick link to Dispatch UI.
2. **Current Active Delivery Card**: Displays primary destination (`Metro Cash & Carry - Whitefield Distribution Hub`), client name, cargo specifications (`12 Pallets FMCG`, `3.8 Tonnes`, `₹24,500 COD`), and direct one-tap telephone dialer to the consignee gate manager.
3. **Simulated GPS Routing HUD**: Dark-mode GPS display showing speed (48 km/h), distance remaining (45 km), ETA countdown (52 mins), route corridor (NH-48 via Outer Ring Road), and turn-by-turn guidance.
4. **Up Next Stop Queue**: Preview cards for subsequent stops in the route (`Stop #2: Reliance Retail Central DC`, `Stop #3: Flipkart Wholesale Hub`) showing distance and load count.
5. **Digital POD & Payment Collection Modal (`<Dialog>`)**: Full-screen modal housing:
   * **LR Photo Camera Dropzone**: Simulates physical camera capture with geotagging and preview/retake toggles.
   * **HTML5 Canvas "Sign on Glass"**: Touch/mouse interactive signature capture allowing finger signatures with clear reset.
   * **COD Payment Method Toggle**: High-contrast radio toggle between **Cash** and **UPI QR** (with truck UPI ID preview) and exact remittance number input.

### 2.4 State & Data Flow (Frontend Logic)
* **Trip Stage Machine**: State transitions between `"driving"` $\rightarrow$ `"arrived"` $\rightarrow$ `"completed"`. Tapping "Reached Destination" advances the button state to "Complete Delivery & POD", which opens the POD modal.
* **Canvas Touch Drawing State**: Managed via HTML5 2D Canvas context (`canvasRef`). Captures both `onTouchStart`/`onTouchMove` (mobile devices) and `onMouseDown`/`onMouseMove` (desktop browser emulation), setting `isSigned = true` upon stroke detection.
* **Validation Gating**: Form submission validates that `hasCapturedPhoto` is true before committing; upon confirmation, a state alert confirms settlement and updates the active stop.

---

## 3. Internal Audit Workspace (`/audit`)

### 3.1 Core Objective
To enable secondary-level freight auditors to cross-verify physical delivery documents against telematics data, inspect consignee stamps and signatures, detect freight/toll variances, and either certify invoices for billing or log disputes.

### 3.2 Architectural & UI/UX Design Rationale
* **50/50 Split-Pane Layout**: Eliminates tab-switching cognitive load by placing the physical document on the Left Pane and the digital system data on the Right Pane side-by-side.
* **High-Density Verification Workspace**: Clean white cards, muted slate accents, and monospace financial/mileage comparisons designed for rapid verification throughput (< 2 minutes per consignment).

### 3.3 Key Features & Components
1. **Interactive Document Viewer (Left Pane)**:
   * **Viewer Controls**: Interactive Zoom In (+25%), Zoom Out (-25%), Rotate 90° clockwise, and 1-click Reset.
   * **Digital LR Consignment Note Canvas**: Renders high-fidelity consignment metadata (Consignor, Consignee, Truck No, Material breakdown, gate inward timestamp, and physical warehouse stamp).
   * **Sign-on-Glass Digital Verification Sub-Panel**: Displays the cryptographic auth hash (`#a98f-44e2-9b01`), receiver signatory credentials, and dock GPS verification tag.
2. **Audit Telematics & Financial Pane (Right Pane)**:
   * **Trip Details Card**: Driver/Vehicle metadata, departure vs. arrival timestamps, and System GPS vs. Odometer distance variance calculator.
   * **Financial Tally Table**: Line-item variance matrix comparing Driver Reported vs. System Policy amounts for Toll Payments, Fuel & AdBlue, Driver Allowance, and Total COD Cash Remitted.
   * **Interactive 5-Gate Checklist**: Interactive checkboxes for:
     1. *Distance Match (GPS vs Odometer within ±3%)*
     2. *Cash Match (Remitted vs Expected COD)*
     3. *Signature Present (Valid glass sign captured)*
     4. *Consignee Stamp Verified (Official dock stamp legible)*
     5. *Document Legibility (Serials & quantities verified)*
3. **Sticky Action Footer**:
   * **"Raise Discrepancy" (Red Outline)**: Triggers an audit dispute modal with justification textarea to freeze invoice generation.
   * **"Verify & Send to Billing" (Dark Solid)**: Certifies the trip and transmits it to Accounts Payable.

### 3.4 State & Data Flow (Frontend Logic)
* **Transform Matrix Manipulation**: `zoomLevel` and `rotation` states directly manipulate CSS `transform: scale(...) rotate(...)` on the document element with smooth CSS hardware acceleration.
* **Multi-Trip Queue Switching**: State variable `selectedTripId` drives reactive memoization to swap active documents, telematics, and financial tables on demand (`TRIP-8842`, `TRIP-8841`, `TRIP-8846`).
* **Checklist State Engine**: An object state dictionary `checklist` toggles between boolean passes (`CheckCircle2`) and failures (`XCircle`), dynamically updating row styles.

---

## 4. Logistics Accounts & Billing (`/accounts`)

### 4.1 Core Objective
To allow the 3PL finance and billing team to pool audit-cleared trips, compute accessorial charges (toll, demurrage), calculate statutory Indian GST taxes (18% under SAC 996511), and generate consolidated tax invoices.

### 4.2 Architectural & UI/UX Design Rationale
* **Tabular ERP Data Density**: Built for accounting clerks handling multi-trip consignment statements. Monospaced numeric alignment guarantees readability across high-value invoices.
* **Dual-Tab Perspective**: Distinguishes between unbilled inventory (`Pending Billing`) and committed receivables (`Accounts Receivable Ledger`).

### 4.3 Key Features & Components
1. **Executive Accounts Header**: Search bar across Client, Invoice, and Trip ID, paired with real-time financial KPI metrics: **Outstanding AR (₹12,50,000)**, **Overdue (₹2,10,040)**, and **Ready to Bill (₹2,08,500)**.
2. **Tab 1: Pending Billing (Unbilled Trips Queue)**:
   * Multi-select checkboxes with a global "Select All" header toggle.
   * Columns: Trip ID & LR No, Client & Consignee GSTIN, Route & Delivery Date, Base Freight, Accessorial Charges (Toll + Demurrage breakdown), and Total Net Billable.
3. **Floating Sticky Bottom Action Bar**:
   * Automatically slides up from the bottom when one or more rows are checked.
   * Displays dynamic live counts: `X Trips Selected | Subtotal: ₹Y | Est. GST (18%): ₹Z | Grand Total: ₹W`.
   * Action buttons: "Clear Selection" and "Generate Consolidated Invoice".
4. **Tab 2: Accounts Receivable Ledger**:
   * Tracks published invoices, issuance/due dates, trip counts, subtotal, 18% GST, grand total, and payment status badges (`Paid`, `Pending`, `Overdue`).
   * "Download PDF" action trigger for invoice archiving.
5. **Widget: Formal GST Tax Invoice Draft Generator (`<Dialog>`)**:
   * Complies with Indian Rule 46 GST Tax Invoice specifications.
   * Displays seller credentials (Vecto Logistics, GSTIN 27AABCV1234F1Z5, PAN, State Code 27) vs. client bill-to details (GSTIN, Address, Place of Supply Code 29).
   * Itemized SAC 996511 freight consignment breakdown table.
   * Remittance bank instructions (ICICI Bank A/C, IFSC Code, UPI VPA).
   * Subtotal, 18% IGST calculation, and Grand Total with currency notation.

### 4.4 State & Data Flow (Frontend Logic)
* **Multi-Selection Array State**: Managed via `selectedTripIds: string[]`. Toggling row checkboxes adds/removes IDs; header checkbox toggles all IDs in `filteredUnbilledTrips`.
* **Dynamic GST Tax Math**:
  $$\text{Subtotal } (S) = \sum_{i \in \text{selected}} (\text{Freight}_i + \text{Toll}_i + \text{Demurrage}_i)$$
  $$\text{GST } (18\%) = \text{round}(S \times 0.18)$$
  $$\text{Grand Total } = S + \text{GST}$$
* **Publishing Pipeline**: Submitting the draft generates a simulated invoice ID (`VEC-INV-2026-XXXX`), resets selection arrays, and posts an alert confirmation.

---

## 5. Client / Vendor Accounts Payable Portal (`/client-portal`)

### 5.1 Core Objective
An external, client-facing self-service portal for enterprise customers (e.g. Metro Cash & Carry) to inspect inbound freight invoices, examine digital POD receipts, raise itemized line disputes, and approve settlements.

### 5.2 Architectural & UI/UX Design Rationale
* **Differentiated Client Branding**: Features a light-slate/white sidebar with client corporate insignia (**Metro Cash & Carry**, Consignee ID `AP-IND-01`), establishing trust for an external portal.
* **Non-Destructive Inline Dispute Design**: Rather than rejecting an entire invoice over a single damaged pallet, client managers can dispute specific line items while approving clean lines, preventing carrier cash flow disruption.

### 5.3 Key Features & Components
1. **Client AP Header**: Welcome banner (`Welcome, Metro Finance Team`), vendor reference (`Vecto Logistics India`), and financial metrics pill (`Total Outstanding: ₹94,105 | Due This Week: ₹31,270`).
2. **Invoice Inbox Grid**: Table displaying incoming freight invoices, issue dates, payment due dates, gross amounts, and status badges (`Pending Approval`, `Partially Disputed`, `Approved`, `Paid`).
3. **Invoice Deep-Dive Modal (`<Dialog>`)**:
   * Wide modal displaying invoice header summary and an itemized breakdown of trips.
   * **"View POD" Action**: Expands a verified delivery card showing the warehouse gate dock stamp and the receiver's glass digital signature.
   * **Flag Dispute Action**: Flag icon button that opens the inline dispute drawer.
4. **Interactive Inline Dispute Drawer**:
   * Expands seamlessly beneath the target consignment row.
   * Dropdown selector for dispute grounds (*Damaged Goods in Transit*, *Late Delivery SLA Penalty*, *Missing Quantity / Shortage*, *Incorrect Demurrage / Waiting*, *POD Signature Missing*).
   * Currency input for deduction amount (₹).
   * Textarea for formal dispute justification and debit note cross-references.
   * Real-time recalculation bar displaying Gross Invoice Amount, Disputed Deductions, and Authorized Net Payable.
5. **Approval Action Button**: Dynamically adapts its label based on dispute state:
   * Without disputes: `"Approve Invoice for Payment"`
   * With disputes: `"Approve with Debit Note (₹90,605)"`

### 5.4 State & Data Flow (Frontend Logic)
* **Hierarchical Immutability**: Invoice line modifications update nested trip structures through immutable state mappings, ensuring parent table and modal metrics remain synchronized.
* **Net Payable Calculation Engine**:
  $$\text{Net Payable Authorized} = \max\left(0, \text{Gross Amount} - \sum \text{Dispute Amounts}\right)$$
* **Conditional Badge State**: When any line item contains `isDisputed: true`, the invoice status automatically updates from `"Pending Approval"` to `"Partially Disputed"`.

---

## 6. Authentication & Route Guard Middleware (`/login` & `middleware.ts`)

### 6.1 Core Objective
To secure the enterprise platform through edge-based session verification, control unauthenticated routing, and provide operational roles with rapid, persona-based access to their respective dashboards.

### 6.2 Architectural & Security Design Rationale
* **Zero-Flash Edge Route Protection**: Next.js `middleware.ts` runs directly on edge workers ahead of page rendering. Unauthenticated HTTP requests to protected routes receive a clean `307 Temporary Redirect` before server component tree compilation begins, eliminating layout flashing or data leaks.
* **Deep Linking Preservation**: When redirecting unauthenticated traffic to `/login`, the middleware appends the origin path as a query parameter (`/login?from=/accounts`), allowing seamless resumption post-login.
* **Brute-Force & Credential Stuffing Prevention**: The `/login` form implements client-side rate limiting that locks submission for 30 seconds upon 3 consecutive failed attempts, displaying an active countdown timer.

### 6.3 Key Features & Components
1. **SSO / Enterprise Credentials Form**:
   * Email and password inputs with field-level validation and animated loading state (`<Loader2>`).
   * **Show / Hide Password Toggle**: Eye icon switcher preventing password masking errors.
   * **Hardware Caps Lock Detection**: Alert indicator warning users when Caps Lock is active during password entry.
   * **Remember Me**: Checkbox persisting authentication across sessions.
2. **Demo Persona Quick-Access Strip**:
   * Instant preset chips for **System Admin** (`admin@vecto.com`), **Dispatch Manager** (`demo@vecto.com`), **Finance Auditor** (`audit@vecto.com`), **Billing Specialist** (`billing@vecto.com`), and **Fleet Driver** (`driver@vecto.com`).
   * Clicking a persona automatically populates credentials, establishes the `vecto_access_token` session cookie, and navigates to the respective module.
3. **Session Cookie Management**: Sets `vecto_access_token=demo_session_token_<timestamp>; path=/; max-age=86400; SameSite=Lax`.

### 6.4 State & Data Flow (Frontend Logic)
* **Authentication State Machine**: Tracks `idle` $\rightarrow$ `authenticating` $\rightarrow$ `authenticated` or `locked_out`.
* **Lockout Timer**: An active `setInterval` decrements `lockoutTimer` from 30 to 0 seconds, disabling form submission while active.

---

## 7. User Invitation & Password Policy Engine (`/invite/accept`)

### 7.1 Core Objective
To provide a secure onboarding interface where newly provisioned personnel arrive via an email invitation token to establish their corporate credentials in compliance with enterprise password security policies.

### 7.2 Architectural & UI/UX Design Rationale
* **Zero-Distraction Onboarding Container**: Focused single-card container centered vertically on a clean slate background (`bg-slate-50`).
* **Real-time 5-Point Policy Checklist**: Rather than waiting for a form submission error, users receive instantaneous real-time visual feedback against each password rule as they type.

### 7.3 Key Features & Components
1. **Token Authentication Header**: Checks the `?token=<invite_token>` parameter and displays the user's assigned organization role and corporate email.
2. **5-Point Dynamic Password Policy Validator**:
   * Minimum 10 characters length (`password.length >= 10`)
   * At least 1 uppercase letter (`/[A-Z]/.test(password)`)
   * At least 1 lowercase letter (`/[a-z]/.test(password)`)
   * At least 1 numeric digit (`/[0-9]/.test(password)`)
   * At least 1 special character (`/[!@#$%^&*(),.?":{}|<>]/.test(password)`)
   * Visual indicators transition between green checkmarks (`CheckCircle2`) and slate dots (`Circle`).
3. **Password Strength Meter**: Real-time progress bar computing score (0–5) with contextual color transitions (`Weak` in red, `Fair` in amber, `Good` in blue, `Strong` in emerald).
4. **Password Match Validation**: Confirms that "Confirm Password" strictly matches "New Password", displaying an inline warning upon mismatch.

---

## 8. Admin Master Data Management (`/admin`)

### 8.1 Core Objective
To provide platform administrators with a centralized control center to manage user permissions, activate/deactivate personnel, generate onboarding invitations, and maintain master data definitions (Vehicles, Drivers, Clients, and Freight Rate Cards).

### 8.2 Architectural & UI/UX Design Rationale
* **High-Density ERP Administration**: Retool/Linear-style compact layout maximizing information density for organizational directory management.
* **Instant Inline Status Governance**: Direct toggle switches allowing instant deactivation of former employees or compromised accounts without navigating away from the table.

### 8.3 Key Features & Components
1. **Admin Master Navigation Sidebar**:
   * Left navigation menu: *Users & Roles* (Active Default), *Vehicles*, *Drivers*, *Clients & Vendors*, *Rate Cards*, *Security & Audit Logs*, and *System Config*.
2. **Users & Roles Directory Table**:
   * Displays User Profile (Avatar + Full Name), Work Email, Role Badge (`System Admin`, `Dispatch Manager`, `Finance Auditor`, `Billing Specialist`, `Fleet Driver`), Account Status (`Active` / `Deactivated`), Last Active Timestamp, and Action Menu.
   * **Inline Status Switch**: Interactive toggle switch updating active user permissions in place.
   * **Role Badges**: Color-coded badges indicating role authorization scope.
3. **Search & Role Filter Bar**:
   * Instant substring search matching user names, emails, and roles.
   * Role selector filter to isolate specific team disciplines.
4. **Interactive "Invite User" Modal (`<Dialog>`)**:
   * Form capturing Full Name, Corporate Email Address, and Role.
   * Generates a cryptographic invitation token link (`/invite/accept?token=inv_...`).
   * **1-Click Copy Link**: Copies the generated URL to the system clipboard.
   * Appends the new user record to the live directory in an active state.
5. **Master Data Tabbed Views**:
   * **Vehicles**: Fleet registry tracking registration numbers, vehicle makes (Eicher Pro, Tata Signa), payload capacities, and telematics device IDs.
   * **Drivers**: Driver licenses, badge credentials, linked vehicles, and contact numbers.
   * **Clients & Vendors**: Consignee corporate entities (Metro Cash & Carry, Reliance Retail), GSTINs, and billing terms.
   * **Rate Cards**: Base freight rates per corridor, fuel surcharges, detention/demurrage hourly penalties, and toll reimbursement policies.

---

## Summary of Frontend Technologies & Standards

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | File-based routing (`/login`, `/invite/accept`, `/dispatch`, `/driver`, `/audit`, `/accounts`, `/client-portal`, `/admin`) |
| **Edge Security** | Next.js Middleware (`middleware.ts`) | Edge runtime cookie verification and zero-latency route redirection |
| **Styling** | Tailwind CSS | Utility-first, enterprise high-density layouts, border systems, responsive breakpoints |
| **Component Primitives** | shadcn/ui (Radix UI) | Accessible Dialog, Table, Card, Badge, Checkbox, Tabs, Textarea, Separator, Switch |
| **Iconography** | `lucide-react` | Standardized vector icons for logistics, navigation, telematics, and security |
| **Typography** | Inter + Monospace | Standard sans-serif for UI scanning, tabular monospaced numbers for currencies, odometers, and tokens |
| **State Paradigm** | React Hooks (`useState`, `useMemo`, `useRef`) | Zero-latency client-side filtering, live GST tax calculations, canvas drawing, and password validation |
