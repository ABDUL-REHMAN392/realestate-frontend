"use client";

import { useEffect, useCallback } from "react";
import { SessionProvider as NextAuthSessionProvider, useSession, signOut } from "next-auth/react";
import { useAuthStore } from "@/store/auth.store";

const SESSION_CHECK_INTERVAL_MS = 60 * 1000; // 1 min
function AuthSync() {
  const { data: session, status } = useSession();
  const { refreshMe, logout, user } = useAuthStore();

  // ── Auto-logout handler ──
  const handleAutoLogout = useCallback(async () => {
    try {
      // Backend ko batao (refresh token revoke)
      const { authApi } = await import("@/lib/api");
      await authApi.logout();
    } catch { /* silent — token already dead */ }
    await signOut({ redirect: false });
    useAuthStore.getState().setUser(null);
    if (typeof window !== "undefined") window.location.href = "/login";
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      // ── Check: Dono tokens expire ho gaye? ──
      if (session?.error === "RefreshTokenExpired") {
        handleAutoLogout();
        return;
      }
      // Session valid hai — backend se fresh user data load karo
      refreshMe();
    } else if (status === "unauthenticated") {
      // Session nahi → store clear karo
      if (user !== null) logout();
    }
  }, [status, session?.error]); // eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
    if (status !== "authenticated") return;

    const interval = setInterval(async () => {
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
    }, SESSION_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [status]);

  return null;
}

// ─── Provider ────────────────────────────────────────────────────────────────
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      refetchInterval={60}
      refetchOnWindowFocus={true}
    >
      <AuthSync />
      {children}
    </NextAuthSessionProvider>
  );
}