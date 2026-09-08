import { create } from "zustand";
import { getSession, signOut } from "next-auth/react";
import { userApi } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthState {
  user:      User | null;
  isLoading: boolean;
  setUser:   (user: User | Partial<User> | null) => void;
  syncFromSession: () => Promise<void>;
  logout:    () => Promise<void>;
  refreshMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user:      null,
  isLoading: false,

  setUser: (user) =>
    set((state) => ({
      user: user === null
        ? null
        : { ...(state.user ?? {}), ...user } as User,
    })),


  syncFromSession: async () => {
    set({ isLoading: true });
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        set({ user: null, isLoading: false });
        return;
      }
      const { data } = await userApi.getMe();
      set({ user: data.data.user ?? data.data, isLoading: false });
    } catch {
      await signOut({ redirect: false });
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      const { authApi } = await import("@/lib/api");
      await authApi.logout();
    } catch { /* silent */ }
    // NextAuth session + cookie clear
    await signOut({ redirect: false });
    set({ user: null });
    window.location.href = "/login";
  },

  refreshMe: async () => {
    try {
      const { data } = await userApi.getMe();
      set({ user: data.data.user ?? data.data });
    } catch {
      await signOut({ redirect: false });
      set({ user: null });
    }
  },
}));

export const useUser       = () => useAuthStore((s) => s.user);
export const useIsLoggedIn = () => useAuthStore((s) => !!s.user);