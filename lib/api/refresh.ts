/**
 * Silent Token Refresh & Auth Storage Manager
 * Prevents concurrent stampedes using single-flight promise deduplication
 */

import { RefreshResponse, ApiError } from "./types";

const ACCESS_TOKEN_KEY = "vecto_access_token";
const REFRESH_TOKEN_KEY = "vecto_refresh_token";

// Helper to read cookie values safely on the client
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

// Helper to write cookie values
function setCookie(name: string, value: string, maxAgeSec: number = 86400 * 7): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
}

// Helper to delete cookie
function removeCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  setCookie(ACCESS_TOKEN_KEY, token, 86400); // 1 day
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // ignore quota/storage errors
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  setCookie(REFRESH_TOKEN_KEY, token, 86400 * 14); // 14 days
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch {
    // ignore quota/storage errors
  }
}

export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  removeCookie(ACCESS_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // ignore
  }
}

// Mutex promise to deduplicate simultaneous 401 refresh calls
let ongoingRefreshPromise: Promise<string | null> | null = null;

export function isTokenRefreshing(): boolean {
  return ongoingRefreshPromise !== null;
}

/**
 * Silently requests a new access token from /api/v1/auth/refresh (or /auth/refresh)
 * Deduplicates multiple concurrent requests so only one refresh call is dispatched.
 */
export async function refreshAuthToken(): Promise<string | null> {
  // If a refresh is already in-flight, return the existing promise
  if (ongoingRefreshPromise) {
    return ongoingRefreshPromise;
  }

  ongoingRefreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthTokens();
        return null;
      }

      // Execute refresh request using direct native fetch to prevent circular interceptors
      const response = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        let code = "REFRESH_FAILED";
        let message = "Session expired. Please sign in again.";
        try {
          const errBody = await response.json();
          if (errBody?.error?.code) code = errBody.error.code;
          if (errBody?.error?.message) message = errBody.error.message;
        } catch {
          // ignore json parse error
        }

        clearAuthTokens();
        throw new ApiError(response.status, code, message);
      }

      const data: RefreshResponse = await response.json();
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        if (data.refreshToken) {
          setRefreshToken(data.refreshToken);
        }
        return data.accessToken;
      }

      clearAuthTokens();
      return null;
    } catch (error) {
      clearAuthTokens();
      throw error;
    } finally {
      ongoingRefreshPromise = null;
    }
  })();

  return ongoingRefreshPromise;
}
