import { supabase } from "@/lib/supabase";
import { GROK_PROVIDERS } from "./providers";

export const authEnabled = true;
export { GROK_PROVIDERS };

const BEARER_KEY = "sb-access-token";

/**
 * Get the current Supabase access token (bearer token).
 * Synchronously checks memory, sessionStorage, localStorage, or Supabase default storage.
 */
export function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const sessionToken = window.sessionStorage.getItem(BEARER_KEY);
    if (sessionToken) return sessionToken;

    const localToken = window.localStorage.getItem(BEARER_KEY);
    if (localToken) return localToken;

    // Check Supabase default storage
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.access_token) return parsed.access_token;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Store or clear the bearer token.
 */
export function setBearerToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.sessionStorage.setItem(BEARER_KEY, token);
      window.localStorage.setItem(BEARER_KEY, token);
    } else {
      window.sessionStorage.removeItem(BEARER_KEY);
      window.localStorage.removeItem(BEARER_KEY);
    }
  } catch {}
}

/**
 * Sign out of Supabase Auth completely, clear tokens, and redirect.
 */
export async function signOut(redirectTo = "/login"): Promise<void> {
  try {
    setBearerToken(null);
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Sign out error:", err);
  } finally {
    setBearerToken(null);
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  }
}

/** Fallback signIn stub if called from legacy components */
export async function signIn(
  _providerId?: string,
  _opts: { callbackURL?: string } = {},
): Promise<void> {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
