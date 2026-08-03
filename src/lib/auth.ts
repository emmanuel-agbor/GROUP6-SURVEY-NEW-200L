// src/lib/auth.ts

import { AuthResponse, AuthUser } from "@/types/auth.types";

const TOKEN_KEY = "surveyflow.token";
const USER_KEY = "surveyflow.user";

export function storeAuthResponse(response: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, response.token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null; // SSR-safe default
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false; // SSR-safe default
  return getStoredToken() !== null;
}