/**
 * Standardized API Types & Error Envelope Definitions
 * Vecto Logistics B2B & 3PL Platform
 */

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  skipAuth?: boolean;
  skipAutoRefresh?: boolean;
  timeoutMs?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "dispatch" | "auditor" | "billing" | "driver" | "client";
    roleLabel: string;
    avatarUrl?: string;
    hub?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "System Admin" | "Dispatch Manager" | "Finance Auditor" | "Billing Specialist" | "Fleet Driver";
  status: "Active" | "Deactivated";
  lastActive: string;
  department: string;
  phone?: string;
}

export interface VehicleRecord {
  id: string;
  regNumber: string;
  makeModel: string;
  type: string;
  capacityTonnes: number;
  telematicsImei: string;
  assignedDriver: string;
  currentHub: string;
  status: "In Transit" | "Available" | "Maintenance" | "Unloading";
  currentOdometer: number;
  lastPingTimestamp: string;
  batteryHealthPercent: number;
  fuelFuelLevelPercent: number;
}
