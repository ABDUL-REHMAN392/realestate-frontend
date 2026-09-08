import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken:  string;
    refreshToken: string;
    error?:       string; 
    user: DefaultSession["user"] & {
      id:       string;
      role:     string;
      photo:    string | null;
      provider: string; 
    };
  }
  interface User {
    accessToken?:  string;
    refreshToken?: string;
    role?:         string;
    photo?:        string | null;
    provider?:     string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?:          string;
    refreshToken?:         string;
    accessTokenExpiresAt?: number; 
    role?:                 string;
    photo?:                string | null;
    userId?:               string;
    provider?:             string;
    error?:                string; // "RefreshTokenExpired"
  }
}