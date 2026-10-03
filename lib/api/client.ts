/**
 * Typed API Client Fetch Wrapper
 * Features:
 * - Automatic Bearer token injection (Cookies / localStorage)
 * - Standardized error envelope parsing: { error: { code, message, details } }
 * - 401 interceptor with silent refresh and single request replay
 * - Timeout handling via AbortController
 */

import { ApiError, ApiErrorResponse, RequestOptions } from "./types";
import { getAccessToken, refreshAuthToken, clearAuthTokens } from "./refresh";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function buildUrl(endpoint: string, params?: RequestOptions["params"]): string {
  // If endpoint is already absolute, use it directly; otherwise prepend BASE_URL
  const isAbsolute = /^https?:\/\//i.test(endpoint);
  const path = isAbsolute ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (!params) return path;

  const url = new URL(path, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return isAbsolute ? url.toString() : `${url.pathname}${url.search}`;
}

async function parseResponseError(response: Response): Promise<ApiError> {
  const status = response.status;
  let code = `HTTP_${status}`;
  let message = response.statusText || `Request failed with status ${status}`;
  let details: unknown = undefined;

  try {
    const data: ApiErrorResponse = await response.json();
    if (data && typeof data === "object" && data.error) {
      code = data.error.code || code;
      message = data.error.message || message;
      details = data.error.details;
    }
  } catch {
    // If not JSON, use default status text
  }

  return new ApiError(status, code, message, details);
}

/**
 * Core Request Dispatcher
 */
export async function apiClientRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
  isRetry: boolean = false
): Promise<T> {
  const {
    params,
    body,
    headers: customHeaders = {},
    skipAuth = false,
    skipAutoRefresh = false,
    timeoutMs = 15000,
    ...fetchInit
  } = options;

  const url = buildUrl(endpoint, params);
  const headers = new Headers(customHeaders);

  // Default Accept header
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // Set Content-Type to application/json for standard objects (excluding FormData / Blob)
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const isBlob = typeof Blob !== "undefined" && body instanceof Blob;
  if (body !== undefined && !isFormData && !isBlob && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Attach Bearer token if not skipped
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Setup abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchInit,
      headers,
      body: body !== undefined ? (isFormData || isBlob || typeof body === "string" ? (body as BodyInit) : JSON.stringify(body)) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 Unauthorized with silent token refresh
    if (response.status === 401 && !isRetry && !skipAuth && !skipAutoRefresh) {
      try {
        const newAccessToken = await refreshAuthToken();
        if (newAccessToken) {
          // Retry the original request once with new token
          return await apiClientRequest<T>(endpoint, options, true);
        }
      } catch {
        // Refresh failed, fall through to throwing original or refresh error
        clearAuthTokens();
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = `/login?from=${encodeURIComponent(window.location.pathname)}`;
        }
      }
    }

    if (!response.ok) {
      throw await parseResponseError(response);
    }

    // Handle empty 204 No Content responses cleanly
    if (response.status === 204) {
      return null as T;
    }

    // Try parsing JSON; fallback to text if Content-Type is not JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, "REQUEST_TIMEOUT", `Request exceeded timeout limit of ${timeoutMs}ms`);
    }

    const networkMessage = error instanceof Error ? error.message : "Network error occurred";
    throw new ApiError(0, "NETWORK_ERROR", networkMessage, error);
  }
}

/**
 * Convenient REST API Client instance
 */
export const apiClient = {
  get: <T = unknown>(endpoint: string, options?: Omit<RequestOptions, "body">) =>
    apiClientRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "body">) =>
    apiClientRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "body">) =>
    apiClientRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "body">) =>
    apiClientRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = unknown>(endpoint: string, options?: Omit<RequestOptions, "body">) =>
    apiClientRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
