import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { setBearerToken } from "./client";

/** Normalized user shape used across the app */
export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: boolean;
};

export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

export type CurrentUserState = {
  user: AppUser | null;
  isPending: boolean;
};

/**
 * Current user + loading state powered by Supabase Auth.
 * Automatically synchronizes bearer tokens and listens for auth changes.
 */
export function useCurrentUserState(): CurrentUserState {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. Initial session check
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        if (session?.user) {
          setBearerToken(session.access_token);
          const meta = session.user.user_metadata || {};
          setUser({
            id: session.user.id,
            displayName: meta.full_name || meta.name || session.user.email?.split("@")[0] || "Staff",
            primaryEmail: session.user.email || null,
            profileImageUrl: meta.avatar_url || null,
            isDevFallback: false,
          });
        } else {
          setBearerToken(null);
          setUser(null);
        }
        setIsPending(false);
      })
      .catch(() => {
        if (mounted) setIsPending(false);
      });

    // 2. Auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setBearerToken(session.access_token);
        const meta = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          displayName: meta.full_name || meta.name || session.user.email?.split("@")[0] || "Staff",
          primaryEmail: session.user.email || null,
          profileImageUrl: meta.avatar_url || null,
          isDevFallback: false,
        });
      } else {
        setBearerToken(null);
        setUser(null);
      }
      setIsPending(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, isPending };
}

export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}
