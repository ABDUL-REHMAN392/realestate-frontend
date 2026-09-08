"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, X, Plus, GitCompare, MapPin, Bed, Bath,
  Maximize2, Calendar, Car, CheckCircle, Home,
  Building2, TreePine, Briefcase, Castle,
  Share2, Trash2, Phone, Star, ChevronRight,
  Calculator, BookOpen, Users, Navigation,
  AlertCircle,
} from "lucide-react";
import { propertyApi, compareApi } from "@/lib/api";
import { WhyGharFind } from "@/components/homepage/WhyGharFind";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Testimonials } from "@/components/homepage/Testimonials";
import { TrustedPartners } from "@/components/homepage/TrustedPartners";
import { FAQSection } from "@/components/homepage/FAQSection";
import { CompareHero } from "@/components/compare/Comparehero";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
// ─── TYPES ────────────────────────────────────────────────────────────────────

interface PropertyImage { url: string; isPrimary: boolean }

interface Property {
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
  furnished?: boolean;
  yearBuilt?: number;
  features: string[];
  images: PropertyImage[];
  address: { street?: string; city: string; state: string };
  isFeatured: boolean;
  owner: { name: string; photo?: string; rating?: number };
  createdAt: string;
}

interface CompareWinners {
  price:     string | null;
  area:      string | null;
  bedrooms:  string | null;
  bathrooms: string | null;
}

interface CompareSummary {
  count:           number;
  priceRange:      { min: number; max: number };
  uniqueLocations: number;
  uniqueTypes:     number;
}

interface CompareData {
  properties: Property[];
  winners:    CompareWinners;
  summary:    CompareSummary;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function fmtPrice(p: number) {
  if (p >= 10_000_000) return `${(p / 10_000_000).toFixed(2)} Crore`;
  if (p >= 100_000)    return `${(p / 100_000).toFixed(0)} Lac`;
  return p.toLocaleString();
}

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  house:      Home,
  apartment:  Building2,
  plot:       TreePine,
  commercial: Briefcase,
  villa:      Castle,
};

const PIN_COLORS = ["#3B6D11", "#2563eb", "#7c3aed", "#d97706"];

// ═══════════════════════════════════════════════════════════════════════════════
// PROPERTY SEARCH DROPDOWN
// ═══════════════════════════════════════════════════════════════════════════════
function PropertySearch({
  onSelect,
  excluded,
  disabled,
}: {
  onSelect: (p: Property) => void;
  excluded: string[];
  disabled: boolean;
}) {
  const [q,       setQ]       = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
  const timer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await propertyApi.getAll({ q, limit: 6, status: "active" });
        setResults(
          (data.data ?? []).filter((p: Property) => !excluded.includes(p._id)),
        );
        setOpen(true);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }, 400);
  }, [q, excluded]);

  return (
    <div className="relative" ref={wrapRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF] pointer-events-none" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim() && results.length > 0 && setOpen(true)}
          disabled={disabled}
          placeholder="Search property..."
          className="w-full pl-8 pr-3 h-9 border border-[#E2EAD8] rounded-lg text-xs focus:outline-none focus:border-[#3B6D11] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {loading && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-[#3B6D11] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#E2EAD8] rounded-xl shadow-xl overflow-hidden">
            {results.map((p) => {
              const cover = p.images?.find((i) => i.isPrimary)?.url ?? p.images?.[0]?.url;
              return (
                <button
                  key={p._id}
                  onClick={() => { onSelect(p); setQ(""); setOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-[#F8FAF6] text-left transition-colors border-b border-[#F0F6E8] last:border-0"
                >
                  {cover ? (
                    <img src={cover} alt={p.title} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-[#3B6D11]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1C1C1C] truncate">{p.title}</p>
                    <p className="text-[10px] text-[#9CA3AF] truncate">
                      {p.address.city} · PKR {fmtPrice(p.price)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROPERTY CARD
// ═══════════════════════════════════════════════════════════════════════════════
function PropertyCard({ prop, onRemove }: { prop: Property; onRemove: () => void }) {
  const cover    = prop.images?.find((i) => i.isPrimary)?.url ?? prop.images?.[0]?.url;
  const TypeIcon = TYPE_ICONS[prop.type] ?? Building2;
  const isRent   = prop.purpose === "rent";

  return (
    <div className="flex-1 min-w-[210px] max-w-[260px] bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden flex flex-col">
      <div className="relative h-[150px]">
        {cover ? (
          <img src={cover} alt={prop.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#EAF3DE] flex items-center justify-center">
            <TypeIcon className="h-10 w-10 text-[#3B6D11] opacity-30" />
          </div>
        )}
        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full text-white ${isRent ? "bg-[#3B6D11]" : "bg-blue-600"}`}>
          {isRent ? "For Rent" : "For Sale"}
        </span>
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-white text-[#6B7280] hover:text-red-500 rounded-full flex items-center justify-center shadow-sm transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-bold text-sm text-[#1C1C1C] truncate mb-0.5">{prop.title}</h3>
        <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1 mb-2.5">
          <MapPin className="h-2.5 w-2.5" />{prop.address.city}
        </p>
        <p className="text-base font-bold text-[#1C1C1C] mb-1">
          PKR {fmtPrice(prop.price)}
          {isRent && <span className="text-[11px] font-normal text-[#9CA3AF]">/mo</span>}
        </p>
        <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[10px] text-[#6B7280] mb-3">
          <span className="flex items-center gap-1"><TypeIcon className="h-2.5 w-2.5 text-[#3B6D11]" />{prop.type}</span>
          {prop.area && (
            <span className="flex items-center gap-1"><Maximize2 className="h-2.5 w-2.5 text-[#3B6D11]" />{prop.area} {prop.areaUnit}</span>
          )}
          {prop.bedrooms !== undefined && (
            <span className="flex items-center gap-1"><Bed className="h-2.5 w-2.5 text-[#3B6D11]" />{prop.bedrooms} Beds</span>
          )}
          {prop.bathrooms !== undefined && (
            <span className="flex items-center gap-1"><Bath className="h-2.5 w-2.5 text-[#3B6D11]" />{prop.bathrooms} Baths</span>
          )}
        </div>
        <Link
          href={`/properties/${prop._id}`}
          className="block w-full text-center bg-[#3B6D11] hover:bg-[#2d5409] text-white text-xs font-bold py-2.5 rounded-xl transition-colors mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD SLOT
// ═══════════════════════════════════════════════════════════════════════════════
function AddSlot() {
  return (
    <div className="flex-1 min-w-[180px] border-2 border-dashed border-[#C0DD97] rounded-2xl flex flex-col items-center justify-center gap-2.5 py-12 text-[#9CA3AF] bg-white">
      <div className="w-11 h-11 rounded-full border-2 border-dashed border-[#C0DD97] flex items-center justify-center">
        <Plus className="h-5 w-5 text-[#C0DD97]" />
      </div>
      <p className="text-[11px] text-center px-4">Search above to add property</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARE FEATURES TABLE — uses backend-computed winners
// ═══════════════════════════════════════════════════════════════════════════════
type FeatureRow = {
  key:    string;
  label:  string;
  icon:   React.ElementType;
  winnerKey?: keyof CompareWinners;
  render: (p: Property) => React.ReactNode;
};

const FEATURE_ROWS: FeatureRow[] = [
  {
    key: "price", label: "Price", icon: Home, winnerKey: "price",
    render: (p) => (
      <span className="font-semibold text-sm text-[#1C1C1C]">
        PKR {fmtPrice(p.price)}
        {p.purpose === "rent" && <span className="text-[10px] font-normal text-[#9CA3AF]">/mo</span>}
      </span>
    ),
  },
  {
    key: "type", label: "Property Type", icon: Building2,
    render: (p) => {
      const Icon = TYPE_ICONS[p.type] ?? Building2;
      return (
        <span className="flex items-center justify-center gap-1.5 text-sm text-[#374151] capitalize">
          <Icon className="h-3.5 w-3.5 text-[#3B6D11]" /> {p.type}
        </span>
      );
    },
  },
  {
    key: "area", label: "Area", icon: Maximize2, winnerKey: "area",
    render: (p) => <span className="text-sm text-[#374151]">{p.area} {p.areaUnit}</span>,
  },
  {
    key: "bedrooms", label: "Bedrooms", icon: Bed, winnerKey: "bedrooms",
    render: (p) => <span className="text-sm text-[#374151]">{p.bedrooms !== undefined ? p.bedrooms : "N/A"}</span>,
  },
  {
    key: "bathrooms", label: "Bathrooms", icon: Bath, winnerKey: "bathrooms",
    render: (p) => <span className="text-sm text-[#374151]">{p.bathrooms !== undefined ? p.bathrooms : "N/A"}</span>,
  },
  {
    key: "furnished", label: "Furnished", icon: Home,
    render: (p) =>
      p.furnished !== undefined ? (
        p.furnished ? (
          <span className="flex items-center justify-center gap-1 text-[#3B6D11] text-sm">
            <CheckCircle className="h-3.5 w-3.5" /> Yes
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1 text-red-500 text-sm">
            <X className="h-3.5 w-3.5" /> No
          </span>
        )
      ) : (
        <span className="text-[#9CA3AF] text-sm">N/A</span>
      ),
  },
  {
    key: "parking", label: "Parking", icon: Car,
    render: (p) => (
      <span className="text-sm text-[#374151]">
        {p.parkingSpaces !== undefined ? `${p.parkingSpaces} Car${p.parkingSpaces !== 1 ? "s" : ""}` : "N/A"}
      </span>
    ),
  },
  {
    key: "yearBuilt", label: "Year Built", icon: Calendar,
    render: (p) => <span className="text-sm text-[#374151]">{p.yearBuilt ?? "N/A"}</span>,
  },
  {
    key: "location", label: "Location", icon: MapPin,
    render: (p) => <span className="text-sm text-[#374151]">{p.address.city}, {p.address.state}</span>,
  },
  {
    key: "purpose", label: "Availability", icon: CheckCircle,
    render: (p) => (
      <span className={`text-sm font-bold ${p.purpose === "rent" ? "text-[#3B6D11]" : "text-blue-600"}`}>
        {p.purpose === "rent" ? "For Rent" : "For Sale"}
      </span>
    ),
  },
  {
    key: "addedOn", label: "Added On", icon: Calendar,
    render: (p) => <span className="text-sm text-[#374151]">{timeAgo(p.createdAt)}</span>,
  },
];

function CompareFeaturesTable({ props, winners }: { props: Property[]; winners: CompareWinners }) {
  const colStyle = { gridTemplateColumns: `160px repeat(${props.length}, 1fr)` };

  return (
    <div className="bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid border-b border-[#E2EAD8]" style={colStyle}>
        <div className="px-4 py-3.5 bg-[#F8FAF6]">
          <p className="text-xs font-bold text-[#374151]">Features</p>
        </div>
        {props.map((p) => (
          <div key={p._id} className="px-4 py-3.5 border-l border-[#E2EAD8] text-center">
            <p className="text-xs font-bold text-[#1C1C1C] truncate">
              {p.title.split(" ").slice(0, 5).join(" ")}
            </p>
            <p className="text-[11px] text-[#9CA3AF]">{p.address.city}, {p.address.state}</p>
          </div>
        ))}
      </div>

      {/* Feature rows — winners highlighted using backend data */}
      {FEATURE_ROWS.map((row, idx) => {
        const Icon    = row.icon;
        // Use backend-computed winner ID for this field
        const winnerId = row.winnerKey ? winners[row.winnerKey] : null;

        return (
          <div
            key={row.key}
            className={`grid border-b border-[#E2EAD8] last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFBF8]"}`}
            style={colStyle}
          >
            <div className="px-4 py-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                <Icon className="h-3 w-3 text-[#3B6D11]" />
              </div>
              <span className="text-xs font-medium text-[#374151]">{row.label}</span>
            </div>
            {props.map((p) => (
              <div
                key={p._id}
                className={`px-4 py-3 border-l border-[#E2EAD8] flex items-center justify-center ${winnerId === p._id ? "bg-[#EAF3DE]" : ""}`}
              >
                {row.render(p)}
                {winnerId === p._id && (
                  <span className="ml-1.5 text-[9px] font-bold text-[#3B6D11] bg-[#C0DD97] px-1.5 py-0.5 rounded-full">
                    Best
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      })}

      {/* Agent row */}
      <div className="grid border-t border-[#E2EAD8] bg-white" style={colStyle}>
        <div className="px-4 py-3.5 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
            <Users className="h-3 w-3 text-[#3B6D11]" />
          </div>
          <span className="text-xs font-medium text-[#374151]">Agent</span>
        </div>
        {props.map((p) => (
          <div key={p._id} className="px-4 py-3.5 border-l border-[#E2EAD8] flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {p.owner.photo ? (
                <img src={p.owner.photo} alt={p.owner.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#EAF3DE] flex items-center justify-center text-[10px] font-bold text-[#3B6D11]">
                  {p.owner.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </div>
              )}
              <div>
                <p className="text-[11px] font-bold text-[#1C1C1C]">{p.owner.name}</p>
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] text-[#6B7280]">{(p.owner.rating ?? 4.5).toFixed(1)}</span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-1.5 border border-[#E2EAD8] hover:border-[#3B6D11] text-[#374151] hover:text-[#3B6D11] text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors w-full justify-center">
              <Phone className="h-3 w-3" /> Contact Agent
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCATION OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function LocationOverview({ props }: { props: Property[] }) {
  const leftPos = [22, 47, 66, 82];
  const topPos  = [35, 55, 28, 50];

  return (
    <div className="bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2EAD8]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#EAF3DE] flex items-center justify-center">
            <Navigation className="h-3.5 w-3.5 text-[#3B6D11]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1C1C1C]">Location Overview</h3>
            <p className="text-[11px] text-[#9CA3AF]">See the locations of these properties on map.</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 border border-[#E2EAD8] hover:border-[#3B6D11] text-xs font-medium text-[#374151] hover:text-[#3B6D11] px-3 py-2 rounded-xl transition-colors">
          <MapPin className="h-3 w-3" /> Open in Google Maps
        </button>
      </div>

      <div className="relative h-56 bg-[#E8F0E0] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59,109,17,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(59,109,17,.12) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute top-[40%] left-0 right-0 h-[3px] bg-[#C0DD97]/60" />
        <div className="absolute top-[65%] left-0 right-0 h-[3px] bg-[#C0DD97]/60" />
        <div className="absolute left-[30%] top-0 bottom-0 w-[3px] bg-[#C0DD97]/60" />
        <div className="absolute left-[65%] top-0 bottom-0 w-[3px] bg-[#C0DD97]/60" />

        {props.map((p, i) => (
          <div
            key={p._id}
            className="absolute flex flex-col items-center"
            style={{ left: `${leftPos[i]}%`, top: `${topPos[i]}%`, transform: "translateX(-50%)" }}
          >
            <div
              className="text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md whitespace-nowrap"
              style={{ background: PIN_COLORS[i] }}
            >
              {p.address.city}
            </div>
            <div
              className="w-0 h-0"
              style={{
                borderLeft:  "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop:   `5px solid ${PIN_COLORS[i]}`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="px-5 py-4 flex flex-wrap gap-4">
        {props.map((p, i) => (
          <div key={p._id} className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: PIN_COLORS[i] }}
            >
              <Home className="h-2.5 w-2.5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#1C1C1C]">{p.title.split(" ").slice(0, 3).join(" ")}</p>
              <p className="text-[10px] text-[#9CA3AF]">{p.address.city}, {p.address.state}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEED HELP BANNER
// ═══════════════════════════════════════════════════════════════════════════════
function NeedHelpBanner() {
  return (
    <div className="relative bg-[#1C2B0E] rounded-2xl overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 px-8 py-10">
        <div className="flex-1">
          <p className="text-[#7BC96F] text-[11px] font-bold mb-2 flex items-center gap-1.5">
            <Star className="h-3 w-3" /> Need Help Deciding?
          </p>
          <h3 className="text-xl font-bold text-white mb-2.5 leading-snug">
            Not sure which property<br />is best for you?
          </h3>
          <p className="text-xs text-white/55 mb-5 max-w-sm leading-relaxed">
            Our property experts can help you choose the best option based on your needs and budget.
          </p>
          <button className="flex items-center gap-2 bg-[#3B6D11] hover:bg-[#4a8a16] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors">
            Get Free Consultation <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-white/5 rounded-full translate-y-1/2" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// YOU MAY ALSO LIKE
// ═══════════════════════════════════════════════════════════════════════════════
const SUGGESTIONS = [
  { icon: Calculator, label: "Mortgage Calculator",    sub: "Calculate monthly payments and plan your budget.", cta: "Calculate Now",  href: "/calculator",   iconBg: "bg-blue-50",   iconColor: "text-blue-600" },
  { icon: Home,       label: "Affordability Calculator", sub: "Check how much property you can afford.",         cta: "Check Now",      href: "/calculator",   iconBg: "bg-green-50",  iconColor: "text-[#3B6D11]" },
  { icon: BookOpen,   label: "Area Guide",             sub: "Explore neighborhood insights and market trends.", cta: "Explore Now",    href: "/area-guide",   iconBg: "bg-amber-50",  iconColor: "text-amber-600" },
  { icon: Users,      label: "Agent Directory",        sub: "Connect with trusted real estate agents.",         cta: "Browse Agents",  href: "/agents",       iconBg: "bg-purple-50", iconColor: "text-purple-600" },
];

function YouMayAlsoLike() {
  return (
    <div>
      <h2 className="text-base font-bold text-[#1C1C1C] mb-4">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white border border-[#E2EAD8] rounded-2xl p-4 hover:border-[#3B6D11]/40 hover:shadow-sm transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconBg}`}>
                <Icon className={`h-4.5 w-4.5 ${s.iconColor}`} />
              </div>
              <p className="text-xs font-bold text-[#1C1C1C] mb-1">{s.label}</p>
              <p className="text-[11px] text-[#9CA3AF] mb-3 leading-snug">{s.sub}</p>
              <span className="text-[11px] font-bold text-[#3B6D11] flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                {s.cta} <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ComparePage() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  // Current property IDs in comparison (source of truth)
  const [ids,     setIds]     = useState<string[]>([]);
  // Backend-loaded compare data
  const [data,    setData]    = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [copied,  setCopied]  = useState(false);

  // ── Fetch from backend whenever IDs change ───────────────────────────────────
  const fetchCompare = useCallback(async (compareIds: string[]) => {
    if (compareIds.length < 2) {
      setData(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await compareApi.compare(compareIds);
      setData(res.data as CompareData);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Properties load nahi ho saki. Dobara try karein.";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Initialise from URL params ───────────────────────────────────────────────
  useEffect(() => {
    const urlIds = searchParams.getAll("id");
    if (urlIds.length >= 2) {
      setIds(urlIds);
      fetchCompare(urlIds);
    } else if (urlIds.length === 1) {
      // Only one ID in URL — load it so the user can see it and add more
      setIds(urlIds);
      setData(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync URL whenever ids change ─────────────────────────────────────────────
  function syncUrl(updated: string[]) {
    const base = window.location.pathname;
    router.replace(
      updated.length > 0 ? `${base}?${updated.map((id) => `id=${id}`).join("&")}` : base,
      { scroll: false },
    );
  }

  // ── Add property (from search dropdown) ─────────────────────────────────────
  async function addProperty(p: Property) {
    if (ids.length >= 4) return;
    if (ids.includes(p._id)) return;

    const updated = [...ids, p._id];
    setIds(updated);
    syncUrl(updated);

    // If we now have 2+, fetch the backend compare
    if (updated.length >= 2) {
      await fetchCompare(updated);
    } else {
      // Still only 1 property — show it as a card using property data directly
      setData({
        properties: [p, ...(data?.properties.filter((x) => x._id !== p._id) ?? [])],
        winners:    { price: null, area: null, bedrooms: null, bathrooms: null },
        summary:    { count: 1, priceRange: { min: p.price, max: p.price }, uniqueLocations: 1, uniqueTypes: 1 },
      });
    }
  }

  // ── Remove property ──────────────────────────────────────────────────────────
  async function removeProperty(id: string) {
    const updated = ids.filter((x) => x !== id);
    setIds(updated);
    syncUrl(updated);

    if (updated.length === 0) {
      setData(null);
    } else if (updated.length === 1) {
      // 1 remaining — remove from compare data but keep the card visible
      const remaining = data?.properties.filter((p) => p._id !== id) ?? [];
      setData({
        properties: remaining,
        winners:    { price: null, area: null, bedrooms: null, bathrooms: null },
        summary:    {
          count:           remaining.length,
          priceRange:      { min: remaining[0]?.price ?? 0, max: remaining[0]?.price ?? 0 },
          uniqueLocations: 1,
          uniqueTypes:     1,
        },
      });
    } else {
      await fetchCompare(updated);
    }
  }

  // ── Clear all ────────────────────────────────────────────────────────────────
  function clearAll() {
    setIds([]);
    setData(null);
    setError(null);
    router.replace(window.location.pathname, { scroll: false });
  }

  // ── Share comparison ─────────────────────────────────────────────────────────
  function shareComparison() {
    const base = window.location.href.split("?")[0];
    const url  = ids.length > 0 ? `${base}?${ids.map((id) => `id=${id}`).join("&")}` : base;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displayProps = data?.properties ?? [];
  const winners      = data?.winners ?? { price: null, area: null, bedrooms: null, bathrooms: null };
  const summary      = data?.summary ?? null;
  const canCompare   = displayProps.length >= 2;

  return (
    <div className="min-h-screen bg-white">
    {/* ── COMPARE HERO ── */}
    <CompareHero />
      {/* ── PAGE HEADER ── */}
      <div className="bg-white border-b border-[#E2EAD8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1C1C1C]">Compare Properties</h1>
              <p className="text-sm text-[#9CA3AF] mt-0.5">
                Compare features, prices and locations to find the perfect property.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={shareComparison}
                className="flex items-center gap-1.5 border border-[#E2EAD8] hover:border-[#3B6D11] text-sm font-medium text-[#374151] hover:text-[#3B6D11] px-4 py-2 rounded-xl transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Share Comparison"}
              </button>
              {ids.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 border border-[#E2EAD8] hover:border-red-300 text-sm font-medium text-[#374151] hover:text-red-500 px-4 py-2 rounded-xl transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── ERROR BANNER ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => fetchCompare(ids)}
              className="ml-auto text-xs font-bold text-red-600 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── TOP SECTION ── */}
        <div className="flex gap-4 items-stretch">
          {/* Left panel */}
          <div className="w-44 flex-shrink-0 bg-white border border-[#E2EAD8] rounded-2xl p-4 flex flex-col">
            <h3 className="text-xs font-bold text-[#1C1C1C] mb-1">Add More Properties</h3>
            <p className="text-[11px] text-[#9CA3AF] mb-3 leading-snug">
              Add more properties to compare up to 4 at a time.
            </p>

            <PropertySearch
              onSelect={addProperty}
              excluded={ids}
              disabled={ids.length >= 4}
            />

            {ids.length >= 4 && (
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                <p className="text-[10px] text-amber-700">Max 4 properties reached.</p>
              </div>
            )}

            {displayProps.length === 0 ? (
              <Link
                href="/properties"
                className="mt-auto flex items-center justify-center gap-1.5 border border-[#3B6D11] text-[#3B6D11] hover:bg-[#3B6D11] hover:text-white text-[11px] font-bold px-3 py-2 rounded-xl transition-all"
              >
                Browse Properties <ChevronRight className="h-3 w-3" />
              </Link>
            ) : (
              <div className="mt-4 pt-3 border-t border-[#E2EAD8]">
                <p className="text-[11px] font-bold text-[#1C1C1C] mb-2.5">Quick Summary</p>
                {[
                  { label: "Properties",   value: String(ids.length) },
                  {
                    label: "Price Range",
                    value: summary
                      ? `PKR ${fmtPrice(summary.priceRange.min)} – ${fmtPrice(summary.priceRange.max)}`
                      : "—",
                  },
                  { label: "Locations",    value: String(summary?.uniqueLocations ?? "—") },
                  { label: "Types",        value: String(summary?.uniqueTypes ?? "—") },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between py-1.5 border-b border-[#F0F6E8] last:border-0">
                    <span className="text-[10px] text-[#9CA3AF]">{s.label}</span>
                    <strong className="text-[10px] font-bold text-[#1C1C1C]">{s.value}</strong>
                  </div>
                ))}
                <Link
                  href="/properties"
                  className="mt-2.5 flex items-center justify-center gap-1 border border-[#E2EAD8] text-[11px] font-medium text-[#374151] hover:text-[#3B6D11] hover:border-[#3B6D11] py-1.5 rounded-xl transition-colors"
                >
                  Browse <ChevronRight className="h-2.5 w-2.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Property Cards */}
          <div className="flex-1 flex gap-3 overflow-x-auto">
            {loading && displayProps.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <LoadingSpinner size="md" text="Loading Properties..." />
              </div>
            ) : (
              <>
                {displayProps.map((p) => (
                  <PropertyCard key={p._id} prop={p} onRemove={() => removeProperty(p._id)} />
                ))}
                {ids.length < 4 && <AddSlot />}
              </>
            )}
          </div>
        </div>

        {/* ── Loading overlay for re-fetches ── */}
        {loading && displayProps.length > 0 && (
          <div className="flex items-center justify-center gap-2 py-3">
            <LoadingSpinner size="sm" text="Comparison update ho rahi hai..." />
          </div>
        )}

        {/* ── COMPARE FEATURES TABLE — only when 2+ properties ── */}
        {canCompare && !loading && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#EAF3DE] flex items-center justify-center">
                <GitCompare className="h-3.5 w-3.5 text-[#3B6D11]" />
              </div>
              <h2 className="text-base font-bold text-[#1C1C1C]">Compare Features</h2>
              <span className="text-[10px] text-[#9CA3AF] bg-[#F0F6E8] px-2.5 py-1 rounded-full">
                Winners highlighted by server
              </span>
            </div>
            <div className="overflow-x-auto">
              <div style={{ minWidth: `${160 + displayProps.length * 220}px` }}>
                <CompareFeaturesTable props={displayProps} winners={winners} />
              </div>
            </div>
          </div>
        )}

        {/* ── Hint: add one more property ── */}
        {!canCompare && displayProps.length === 1 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
            <Plus className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-600">
              Compare table dekhne ke liye search bar se <strong>ek aur property</strong> add karein.
            </p>
          </div>
        )}

        {/* ── LOCATION OVERVIEW ── */}
        {canCompare && !loading && <LocationOverview props={displayProps} />}

        {/* ── NEED HELP DECIDING ── */}
        <NeedHelpBanner />

        {/* ── YOU MAY ALSO LIKE ── */}
        <YouMayAlsoLike />

        {/* ── EMPTY STATE ── */}
        {displayProps.length === 0 && !loading && (
          <div className="text-center py-16 bg-white border border-[#E2EAD8] rounded-2xl">
            <GitCompare className="h-12 w-12 mx-auto mb-4 text-[#9CA3AF] opacity-30" />
            <h2 className="text-base font-bold text-[#374151] mb-2">No properties to compare</h2>
            <p className="text-sm text-[#9CA3AF] mb-6">
              Search and add properties using the panel above to start comparing
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-[#3B6D11] hover:bg-[#2d5209] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Search className="h-3.5 w-3.5" /> Browse Properties
            </Link>
          </div>
        )}
      </div>

      {/* Homepage sections */}
      <WhyGharFind />
      <HowItWorks />
      <Testimonials />
      <TrustedPartners />
      <FAQSection />
    </div>
  );
}