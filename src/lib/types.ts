// ─────────────────────────────────────────────
// Auth + User Types
// ─────────────────────────────────────────────

export interface User {
  id:       string;
  name:     string;
  email:    string;
  role:     "buyer" | "agent" | "admin";
  photo:    string | null;
  phone?:   string;
  isActive?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken:  string;
    refreshToken: string;
    user:         User;
  };
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface RegisterPayload {
  name:      string;
  email:     string;
  password:  string;
  phone?:    string;
  role?:     "buyer" | "agent";
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface AvatarResponse {
  success: boolean;
  message: string;
  data: {
    photo: string;
  };
}

export interface ApiSuccess<T = null> {
  success: boolean;
  message: string;
  data:    T;
}

// ─────────────────────────────────────────────
//  Property List Types
// ─────────────────────────────────────────────

export interface Property {
  _id: string;
  title: string;
  type: string;
  purpose: "sale" | "rent";
  price: number;
  area: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  address: { street?: string; city: string; state: string };
  images: { url: string; isPrimary: boolean }[];
  isFeatured: boolean;
  isNew?: boolean;
  isHotDeal?: boolean;
  owner: { name: string; photo?: string; rating?: number };
  createdAt: string;
}

export interface Filters {
  search:   string;
  purpose:  string;
  type:     string;
  city:     string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  minArea:  string;
  maxArea:  string;
  sortBy:   string;
}

// ─────────────────────────────────────────────
//  Property Detail Types
// ─────────────────────────────────────────────

export interface PropertyDetail {
  _id: string;
  title: string;
  description: string;
  type: string;
  purpose: "sale" | "rent";
  price: number;
  area: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  kitchens?: number;
  tvLounge?: number;
  drawingRoom?: number;
  diningRoom?: number;
  floorNumber?: number;
  totalFloors?: number;
  yearBuilt?: number;
  parkingSpaces?: number;
  furnished?: string;
  facing?: string;
  propertyId?: string;
  features: string[];
  images: { url: string; isPrimary: boolean; order: number }[];
  address: {
    street?: string;
    city: string;
    state: string;
    country: string;
    nearbyDescription?: string;
  };
  location?: { type: string; coordinates: [number, number] };
  isFeatured: boolean;
  isNew?: boolean;
  isHotDeal?: boolean;
  views: number;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    photo?: string;
    phone?: string;
    title?: string;
    rating?: number;
    responseTime?: string;
  };
}

export interface SimilarProperty {
  _id: string;
  title: string;
  price: number;
  area: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  type: string;
  purpose: "sale" | "rent";
  images: { url: string; isPrimary: boolean }[];
  address: { city: string; state: string };
  isFeatured?: boolean;
  isNew?: boolean;
  isHotDeal?: boolean;
}