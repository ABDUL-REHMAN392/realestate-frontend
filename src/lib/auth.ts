import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api/v1";

// ─────────────────────────────────────────────
// Access token
// ─────────────────────────────────────────────
const ACCESS_TOKEN_LIFETIME_MS = 14 * 60 * 1000;
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", error: "/login" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        try {
          const { data } = await axios.post(`${API}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });
          const { user, accessToken, refreshToken } = data.data;
          return {
            ...user,
            accessToken,
            refreshToken,
            provider: "credentials",
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          const { data } = await axios.post(`${API}/auth/oauth`, {
            provider: account.provider,
            providerAccountId: account.providerAccountId ?? account.id,
            email: user.email,
            name: user.name,
            photo: user.image ?? undefined,
          });
          user.accessToken = data.data.accessToken;
          user.refreshToken = data.data.refreshToken;
          user.role = data.data.user.role;
          user.id = String(data.data.user.id);
          user.photo = data.data.user.photo ?? null;
          user.provider = account.provider; // ← OAuth provider store karo
        } catch {
          return false;
        }
      }
      return true;
    },

    // ─────────────────────────────────────────────
    // JWT Callback — TOKEN REFRESH LOGIC
    // ─────────────────────────────────────────────
    async jwt({ token, user, account }) {
      // ── Step 1: First login — save everything ──
      if (user) {
        const u = user as unknown as Record<string, unknown>;
        token.accessToken = u.accessToken as string;
        token.refreshToken = u.refreshToken as string;
        token.accessTokenExpiresAt = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
        token.role = u.role as string;
        token.photo = u.photo as string | null;
        token.userId = user.id;
        token.name = user.name ?? "";
        token.email = user.email ?? "";
        token.provider =
          (u.provider as string) ?? account?.provider ?? "credentials";
        token.error = undefined; // Clear any previous error
        return token;
      }

      // ── Step 2: Access token still valid? ──
      if (Date.now() < (token.accessTokenExpiresAt ?? 0)) {
        return token; // All good — nothing to do
      }

      // ── Step 3: Access token expired — try refresh ──
      try {
        const { data } = await axios.post(`${API}/auth/refresh`, {
          refreshToken: token.refreshToken,
        });

        // Backend se naya access token (aur shayad naya refresh token bhi) mila
        token.accessToken = data.data.accessToken;
        token.refreshToken = data.data.refreshToken ?? token.refreshToken;
        token.accessTokenExpiresAt = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
        token.error = undefined; // Success — clear error
        return token;
      } catch {
        // ── Step 4: Refresh failed — both tokens dead ──
        token.error = "RefreshTokenExpired";
        return token;
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user.id = token.userId as string;
      session.user.role = token.role as string;
      session.user.photo = token.photo as string | null;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.provider = token.provider as string; // ← client ko bhejna

      // ── Propagate token error to client ──
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },
};
