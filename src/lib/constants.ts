import {
  Home, Building2, TreePine, Briefcase, Castle,
  Layers, Car, Zap, Droplets, Flame, Shield,
  Camera, Thermometer,
} from "lucide-react";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api/v1";

// ─────────────────────────────────────────────
// Formatters
// ─────────────────────────────────────────────

export function fmtPrice(p: number) {
  if (p >= 10_000_000)
    return `${(p / 10_000_000).toFixed(0)},${((p % 10_000_000) / 100_000)
      .toFixed(0)
      .padStart(2, "0")},000`;
  if (p >= 100_000)
    return `${(p / 100_000).toFixed(0)},${((p % 100_000) / 1000)
      .toFixed(0)
      .padStart(2, "0")},000`;
  return p.toLocaleString();
}

export function fmtShort(p: number) {
  if (p >= 10_000_000) return `${(p / 10_000_000).toFixed(0)} Crore`;
  if (p >= 100_000) return `${(p / 100_000).toFixed(0)} Lac`;
  return p.toLocaleString();
}

export function formatPrice(p: number) {
  if (p >= 10_000_000) return `PKR ${(p / 10_000_000).toFixed(2)} Crore`;
  if (p >= 100_000) return `PKR ${(p / 100_000).toFixed(0)} Lac`;
  return `PKR ${p.toLocaleString()}`;
}

// ─────────────────────────────────────────────
// Cities
// ─────────────────────────────────────────────

export const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
];

// ─────────────────────────────────────────────
// Property Type Icons
// ─────────────────────────────────────────────

export const TYPE_ICONS: Record<string, React.ElementType> = {
  house:      Home,
  apartment:  Building2,
  plot:       TreePine,
  commercial: Briefcase,
  villa:      Castle,
};

export const TYPE_COUNTS: Record<string, number> = {
  house:      120,
  apartment:  340,
  villa:      85,
  commercial: 60,
  plot:       95,
};

// ─────────────────────────────────────────────
// Feature Icons (Property Detail)
// ─────────────────────────────────────────────

export const FEATURE_ICONS: Record<string, React.ElementType> = {
  "Lawn":                  Home,
  "Terrace":               Layers,
  "Balcony":               Layers,
  "Parking":               Car,
  "Electricity":           Zap,
  "Water Supply":          Droplets,
  "Gas Supply":            Flame,
  "Sewerage":              Droplets,
  "Security":              Shield,
  "CCTV Surveillance":     Camera,
  "Servant Room":          Home,
  "Store Room":            Home,
  "Laundry Room":          Home,
  "Powder Room":           Home,
  "Study Room":            Home,
  "Built in Wardrobes":    Home,
  "Double Glazed Windows": Home,
  "Central Heating":       Thermometer,
  "Home Automation":       Zap,
  "Fireplace":             Flame,
};

// ─────────────────────────────────────────────
// Booking Time Slots (Property Detail)
// ─────────────────────────────────────────────

export const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

// ─────────────────────────────────────────────
// Nearby Places (Property Detail — static mock)
// ─────────────────────────────────────────────

export const NEARBY_PLACES = [
  { name: "Park Lane Shopping Mall", dist: "1.2 km" },
  { name: "DHA Phase 6 Park",        dist: "350 m"  },
  { name: "Lahore Grammar School",   dist: "2.5 km" },
  { name: "DHA Medical Center",      dist: "1.8 km" },
  { name: "Masjid-e-Ayesha",         dist: "900 m"  },
  { name: "McDonald's DHA",          dist: "2.1 km" },
];