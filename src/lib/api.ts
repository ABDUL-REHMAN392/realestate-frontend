import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./constants";
import { getSession, signOut } from "next-auth/react";

// ─────────────────────────────────────────────
// Axios instance
// withCredentials: true
// ─────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ─────────────────────────────────────────────
// tokenStore
// ─────────────────────────────────────────────
export const tokenStore = {
  get: (): string | null => null,
  set: (_token: string): void => {},
  clear: (): void => {},
};

// ─────────────────────────────────────────────
// Request Interceptor
// ─────────────────────────────────────────────
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    const session = await getSession();
    if (session?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  } catch {}
  return config;
});

// ─────────────────────────────────────────────
// Response Interceptor
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const req = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !req._retry) {
      req._retry = true;
      try {
        const session = await getSession();
        if (!session || session.error === "RefreshTokenExpired") {
          await signOut({ redirect: false });
          if (typeof window !== "undefined") window.location.href = "/login";
          return Promise.reject(error);
        }

        if (session.accessToken) {
          req.headers.Authorization = `Bearer ${session.accessToken}`;
          return api(req);
        }

        await signOut({ redirect: false });
        if (typeof window !== "undefined") window.location.href = "/login";
      } catch {
        await signOut({ redirect: false });
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// ─────────────────────────────────────────────
// Property endpoints
// ─────────────────────────────────────────────
export const propertyApi = {
  getAll: (params?: object) => api.get("/properties", { params }),
  getById: (id: string) => api.get(`/properties/${id}`),
  create: (payload: object) => api.post("/properties", payload),
  update: (id: string, payload: object) =>
    api.patch(`/properties/${id}`, payload),
  delete: (id: string) => api.delete(`/properties/${id}`),
  getMyListings: (params?: object) =>
    api.get("/properties/my/listings", { params }),
  addImages: (id: string, formData: FormData) =>
    api.post(`/properties/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteImage: (id: string, publicId: string) =>
    api.delete(`/properties/${id}/images/${encodeURIComponent(publicId)}`),
  setPrimary: (id: string, publicId: string) =>
    api.patch(
      `/properties/${id}/images/${encodeURIComponent(publicId)}/primary`,
    ),
  getPending: (params?: object) =>
    api.get("/properties/admin/pending", { params }),
  approve: (id: string) => api.patch(`/properties/${id}/approve`),
  reject: (id: string, rejectionReason: string) =>
    api.patch(`/properties/${id}/reject`, { rejectionReason }),
  toggleFeatured: (id: string) => api.patch(`/properties/${id}/featured`),
  changeStatus: (id: string, status: string) =>
    api.patch(`/properties/${id}/status`, { status }),
};

export default api;
