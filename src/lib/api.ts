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
// Auth endpoints
// ─────────────────────────────────────────────
export const authApi = {
  register:       (payload: object) => api.post("/auth/register", payload),
  login:          (payload: object) => api.post("/auth/login", payload),
  refresh:        () => api.post("/auth/refresh"),
  logout:         () => api.post("/auth/logout"),
  changePassword: (payload: object) => api.patch("/auth/change-password", payload),
  oauth:          (payload: object) => api.post("/auth/oauth", payload),
};

// ─────────────────────────────────────────────
// User endpoints
// ─────────────────────────────────────────────
export const userApi = {
  getMe:        () => api.get("/users/me"),
  updateMe:     (payload: object) => api.patch("/users/me", payload),
  deleteMe:     (password?: string) =>
    api.delete("/users/me", { data: password ? { password } : {} }),
  uploadAvatar: (formData: FormData) =>
    api.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAvatar: () => api.delete("/users/me/avatar"),
  getAllUsers:       (params?: object) => api.get("/users", { params }),
  getUserById:       (id: string) => api.get(`/users/${id}`),
  toggleUserStatus:  (id: string, isActive: boolean) =>
    api.patch(`/users/${id}/status`, { isActive }),
};

// ─────────────────────────────────────────────
// Agent endpoints
// ─────────────────────────────────────────────
export const agentApi = {
  getApplicationStatus: () => api.get("/agents/application/status"),
  apply: (formData: FormData) =>
    api.post("/agents/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMyProfile:    () => api.get("/agents/profile/me"),
  updateMyProfile: (payload: object) => api.patch("/agents/profile/me", payload),
  deleteMyProfile: () => api.delete("/agents/profile/me"),
  getAllAgents:    (params?: object) => api.get("/agents", { params }),
  getAgentById:   (agentId: string) => api.get(`/agents/${agentId}`),
  getAgentByUser: (userId: string)  => api.get(`/agents/user/${userId}`),
  getListings:    (agentId: string, params?: object) =>
    api.get(`/agents/${agentId}/listings`, { params }),
  getReviews:     (agentId: string, params?: object) =>
    api.get(`/agents/${agentId}/reviews`, { params }),
  addReview:    (agentId: string, payload: object) =>
    api.post(`/agents/${agentId}/reviews`, payload),
  updateReview: (reviewId: string, payload: object) =>
    api.patch(`/agents/reviews/${reviewId}`, payload),
  deleteReview: (reviewId: string) =>
    api.delete(`/agents/reviews/${reviewId}`),
  getAllApplications: (params?: object) =>
    api.get("/agents/applications", { params }),
  verifyAgent: (agentId: string, isVerified: boolean, rejectionReason?: string) =>
    api.patch(`/agents/${agentId}/verify`, { isVerified, rejectionReason }),
  deleteAgent: (agentId: string) => api.delete(`/agents/${agentId}`),
  getAnalytics: () => api.get("/agents/analytics/me"),
};

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

// ─────────────────────────────────────────────
// Favorites
// ─────────────────────────────────────────────
export const favoriteApi = {
  getAll:  (params?: object) => api.get("/favorites", { params }),
  toggle:  (propertyId: string) => api.post(`/favorites/${propertyId}`),
  check:   (propertyId: string) => api.get(`/favorites/${propertyId}/check`),
  remove:  (propertyId: string) => api.delete(`/favorites/${propertyId}`),
};

// ─────────────────────────────────────────────
// Compare Properties 
// ─────────────────────────────────────────────
export const compareApi = {
  // GET /api/v1/compare?ids=id1,id2,id3,id4
  // Returns: { properties[], winners: { price, area, bedrooms, bathrooms }, summary }
  compare: (ids: string[]) =>
    api.get("/compare", { params: { ids: ids.join(",") } }),
};

// ─────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────
export const notificationApi = {
  getAll:      (params?: object) => api.get("/notifications", { params }),
  getUnread:   ()                => api.get("/notifications/unread-count"),
  markRead:    (id: string)      => api.patch(`/notifications/${id}/read`),
  markAllRead: ()                => api.patch("/notifications/read-all"),
  delete:      (id: string)      => api.delete(`/notifications/${id}`),
};

export default api;
