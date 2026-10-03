/**
 * MSW (Mock Service Worker) REST API Request Handlers
 * Simulates backend endpoints for Authentication, Master Data Users, and Fleet Vehicles
 */

import { http, HttpResponse, delay } from "msw";
import { UserRecord, VehicleRecord } from "@/lib/api/types";

// Realistic dummy users directory
const DUMMY_USERS: UserRecord[] = [
  {
    id: "USR-001",
    name: "Rajesh Sharma",
    email: "rajesh.sharma@vectologistics.in",
    role: "System Admin",
    status: "Active",
    lastActive: "Just now",
    department: "IT Infrastructure",
    phone: "+91 98201 44321",
  },
  {
    id: "USR-002",
    name: "Suresh Patil",
    email: "suresh.patil@vectologistics.in",
    role: "Dispatch Manager",
    status: "Active",
    lastActive: "12 mins ago",
    department: "Regional Operations - Bhiwandi Hub #4",
    phone: "+91 98202 55432",
  },
  {
    id: "USR-003",
    name: "Pooja Mehta",
    email: "pooja.mehta@vectologistics.in",
    role: "Finance Auditor",
    status: "Active",
    lastActive: "45 mins ago",
    department: "Internal Audit & Compliance",
    phone: "+91 98203 66543",
  },
  {
    id: "USR-004",
    name: "Amit Desai",
    email: "amit.desai@vectologistics.in",
    role: "Billing Specialist",
    status: "Active",
    lastActive: "2 hours ago",
    department: "Accounts Receivable & GST",
    phone: "+91 98204 77654",
  },
  {
    id: "USR-005",
    name: "Ramesh Pawar",
    email: "ramesh.pawar@vectologistics.in",
    role: "Fleet Driver",
    status: "Active",
    lastActive: "Online (GPS Active)",
    department: "Long Haul Heavy Fleet",
    phone: "+91 98205 88765",
  },
  {
    id: "USR-006",
    name: "Vikram Malhotra",
    email: "vikram.m@vectologistics.in",
    role: "Dispatch Manager",
    status: "Deactivated",
    lastActive: "14 days ago",
    department: "Regional Operations - Pune DC",
    phone: "+91 98206 99876",
  },
];

// Realistic dummy vehicles fleet registry with telematics
const DUMMY_VEHICLES: VehicleRecord[] = [
  {
    id: "VEH-101",
    regNumber: "MH 12 RN 4920",
    makeModel: "Eicher Pro 3015",
    type: "16-Ton Multi-Axle Truck",
    capacityTonnes: 16.0,
    telematicsImei: "867201948201940",
    assignedDriver: "Ramesh Pawar",
    currentHub: "Bhiwandi Hub #4",
    status: "In Transit",
    currentOdometer: 142380,
    lastPingTimestamp: "2026-10-02T15:45:00Z",
    batteryHealthPercent: 94,
    fuelFuelLevelPercent: 68,
  },
  {
    id: "VEH-102",
    regNumber: "MH 04 GP 8831",
    makeModel: "Tata Signa 2823.K",
    type: "28-Ton Heavy Haulage",
    capacityTonnes: 28.0,
    telematicsImei: "867201948201941",
    assignedDriver: "Ganesh Shinde",
    currentHub: "Navi Mumbai Terminal",
    status: "Unloading",
    currentOdometer: 89450,
    lastPingTimestamp: "2026-10-02T15:43:00Z",
    batteryHealthPercent: 88,
    fuelFuelLevelPercent: 42,
  },
  {
    id: "VEH-103",
    regNumber: "KA 01 AJ 3390",
    makeModel: "Ashok Leyland 1920",
    type: "19-Ton Containerised Box",
    capacityTonnes: 19.0,
    telematicsImei: "867201948201942",
    assignedDriver: "Sunil Verma",
    currentHub: "Bengaluru Whitefield Hub",
    status: "In Transit",
    currentOdometer: 215600,
    lastPingTimestamp: "2026-10-02T15:46:12Z",
    batteryHealthPercent: 91,
    fuelFuelLevelPercent: 80,
  },
  {
    id: "VEH-104",
    regNumber: "DL 1L AA 4421",
    makeModel: "BharatBenz 1617R",
    type: "16-Ton Reefer Temperature Controlled",
    capacityTonnes: 16.0,
    telematicsImei: "867201948201943",
    assignedDriver: "Kavita Rao",
    currentHub: "Delhi NCR Hub",
    status: "Available",
    currentOdometer: 64120,
    lastPingTimestamp: "2026-10-02T15:40:00Z",
    batteryHealthPercent: 98,
    fuelFuelLevelPercent: 95,
  },
  {
    id: "VEH-105",
    regNumber: "MH 14 TC 9901",
    makeModel: "Tata Ultra T.16",
    type: "16-Ton Medium Cargo",
    capacityTonnes: 16.0,
    telematicsImei: "867201948201944",
    assignedDriver: "Unassigned (Service)",
    currentHub: "Pune Chakan Workshop",
    status: "Maintenance",
    currentOdometer: 182300,
    lastPingTimestamp: "2026-10-02T12:15:00Z",
    batteryHealthPercent: 72,
    fuelFuelLevelPercent: 20,
  },
];

export const handlers = [
  // 1. POST /api/v1/auth/login
  http.post("/api/v1/auth/login", async ({ request }) => {
    await delay(300); // Simulate network latency

    let body: { email?: string; password?: string } = {};
    try {
      body = (await request.json()) as { email?: string; password?: string };
    } catch {
      return HttpResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Malformed request payload. JSON object expected.",
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return HttpResponse.json(
        {
          error: {
            code: "VALIDATION_FAILED",
            message: "Email and password are required.",
          },
        },
        { status: 422 }
      );
    }

    // Mock credential check
    if (password === "wrongpassword" || password === "invalid") {
      return HttpResponse.json(
        {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid corporate email or password. Please verify your credentials.",
          },
        },
        { status: 401 }
      );
    }

    // Determine role persona from email
    let role: "admin" | "dispatch" | "auditor" | "billing" | "driver" | "client" = "dispatch";
    let roleLabel = "Dispatch Manager";
    let name = "Suresh Patil";

    if (email.includes("admin")) {
      role = "admin";
      roleLabel = "System Admin";
      name = "Rajesh Sharma";
    } else if (email.includes("audit")) {
      role = "auditor";
      roleLabel = "Finance Auditor";
      name = "Pooja Mehta";
    } else if (email.includes("billing") || email.includes("accounts")) {
      role = "billing";
      roleLabel = "Billing Specialist";
      name = "Amit Desai";
    } else if (email.includes("driver")) {
      role = "driver";
      roleLabel = "Fleet Driver";
      name = "Ramesh Pawar";
    } else if (email.includes("metro") || email.includes("client")) {
      role = "client";
      roleLabel = "Client AP Finance";
      name = "Metro Accounts Payable";
    }

    return HttpResponse.json({
      user: {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name,
        email,
        role,
        roleLabel,
        hub: "Bhiwandi Hub #4",
        avatarUrl: `https://avatar.vercel.sh/${encodeURIComponent(email)}.png`,
      },
      tokens: {
        accessToken: `vecto_jwt_access_${Date.now()}`,
        refreshToken: `vecto_jwt_refresh_${Date.now()}`,
        expiresIn: 86400,
        tokenType: "Bearer",
      },
    });
  }),

  // 2. POST /api/v1/auth/refresh
  http.post("/api/v1/auth/refresh", async ({ request }) => {
    await delay(200);

    let body: { refreshToken?: string } = {};
    try {
      body = (await request.json()) as { refreshToken?: string };
    } catch {
      // ignore
    }

    const { refreshToken } = body;

    // Fail if explicitly simulated bad token
    if (refreshToken === "expired" || refreshToken === "invalid") {
      return HttpResponse.json(
        {
          error: {
            code: "REFRESH_TOKEN_EXPIRED",
            message: "The provided refresh token has expired. Please sign in again.",
          },
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      accessToken: `vecto_jwt_access_refreshed_${Date.now()}`,
      refreshToken: refreshToken || `vecto_jwt_refresh_refreshed_${Date.now()}`,
      expiresIn: 86400,
      tokenType: "Bearer",
    });
  }),

  // 3. GET /api/v1/users
  http.get("/api/v1/users", async ({ request }) => {
    await delay(250);

    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const role = url.searchParams.get("role");
    const status = url.searchParams.get("status");

    let filtered = [...DUMMY_USERS];

    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.role.toLowerCase().includes(search)
      );
    }

    if (role && role !== "All Roles") {
      filtered = filtered.filter((u) => u.role === role);
    }

    if (status && status !== "All") {
      filtered = filtered.filter((u) => u.status.toLowerCase() === status.toLowerCase());
    }

    return HttpResponse.json({
      data: filtered,
      meta: {
        total: filtered.length,
        timestamp: new Date().toISOString(),
      },
    });
  }),

  // 4. GET /api/v1/vehicles
  http.get("/api/v1/vehicles", async ({ request }) => {
    await delay(250);

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const hub = url.searchParams.get("hub");

    let filtered = [...DUMMY_VEHICLES];

    if (status && status !== "All") {
      filtered = filtered.filter((v) => v.status.toLowerCase() === status.toLowerCase());
    }

    if (hub && hub !== "All") {
      filtered = filtered.filter((v) => v.currentHub.toLowerCase().includes(hub.toLowerCase()));
    }

    return HttpResponse.json({
      data: filtered,
      meta: {
        total: filtered.length,
        activeTelematicsCount: filtered.filter((v) => v.status === "In Transit").length,
        timestamp: new Date().toISOString(),
      },
    });
  }),
];
