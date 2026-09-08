"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Heart, MessageCircle, Menu, X, ChevronDown, ChevronRight,
  LogOut, Settings, LayoutDashboard, Building2, Bell,
  BadgeCheck, UserCheck,
  MapPin, TrendingUp, ShieldCheck, Users, ClipboardList,
  Calendar, BarChart2, FileText, Clock, ArrowRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { useAuthStore, useUser } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/notifications/NotificationBell";
import { propertyApi } from "@/lib/api";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" className="flex items-center flex-shrink-0">
      <img src="/logo.png" alt="GharFind" className="w-[150px] h-[56px] object-contain" />
    </Link>
  );
}

// ─── Single Nav Link ───────────────────────────────────────────────────────────
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium px-3.5 py-2 rounded-xl transition-all duration-200",
        isActive
          ? "text-[#3B6D11] bg-[#EAF3DE]"
          : "text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#F0F6E8]"
      )}
    >
      {children}
    </Link>
  );
}

// ─── Admin Nav Link ────────────────────────────────────────────────────────────
function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium px-3.5 py-2 rounded-xl transition-all duration-200",
        isActive
          ? "text-[#3B6D11] bg-[#EAF3DE]"
          : "text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE]"
      )}
    >
      {children}
    </Link>
  );
}

// ─── Tab definitions for the Properties Dropdown ──────────────────────────────
type DropdownTab = "sale" | "rent" | "all";

const SALE_TYPES = [
  { label: "Houses",       href: "/properties?purpose=sale&type=house",      img: "/layout/navbar/property-icons/houses-for-rent.svg",            desc: "Makan aur kothi",       count: "3,400+" },
  { label: "Apartments",   href: "/properties?purpose=sale&type=apartment",  img: "/layout/navbar/property-icons/apartments.svg",        desc: "Flat aur apartment",    count: "2,850+" },
  { label: "Plots & Land", href: "/properties?purpose=sale&type=plot",       img: "/layout/navbar/property-icons/plots-and-land.svg",    desc: "Residential plots",     count: "2,600+" },
  { label: "Commercial",   href: "/properties?purpose=sale&type=commercial", img: "/layout/navbar/property-icons/commercial.svg",        desc: "Dukaan aur office",     count: "1,520+" },
  { label: "Villas",       href: "/properties?purpose=sale&type=villa",      img: "/layout/navbar/property-icons/villas.svg",            desc: "Luxury farmhouses",     count: "980+"   },
  { label: "Portions",     href: "/properties?purpose=sale&type=portion",    img: "/layout/navbar/property-icons/portions.svg",          desc: "Portion aur flat",      count: "1,450+" },
  { label: "Rooms",        href: "/properties?purpose=sale&type=room",       img: "/layout/navbar/property-icons/rooms.svg",             desc: "Single rooms",          count: "740+"   },
  { label: "Industrial",   href: "/properties?purpose=sale&type=industrial", img: "/layout/navbar/property-icons/industrial.svg",        desc: "Factories aur plants",  count: "320+"   },
  { label: "Other",        href: "/properties?purpose=sale",                 img: "/layout/navbar/property-icons/other-properties.svg",  desc: "Sab qism ki properties",count: "210+"   },
];

const RENT_TYPES = [
  { label: "Houses for Rent",     href: "/properties?purpose=rent&type=house",      img: "/layout/navbar/property-icons/houses-for-rent.svg",      desc: "Makan kiraye par",  count: "1,200+" },
  { label: "Apartments for Rent", href: "/properties?purpose=rent&type=apartment",  img: "/layout/navbar/property-icons/apartments-for-rent.svg",  desc: "Flat kiraye par",   count: "2,100+" },
  { label: "Portions for Rent",   href: "/properties?purpose=rent&type=portion",    img: "/layout/navbar/property-icons/portions-for-rent.svg",    desc: "Portion kiraye par",count: "890+"   },
  { label: "Commercial for Rent", href: "/properties?purpose=rent&type=commercial", img: "/layout/navbar/property-icons/commercial-for-rent.svg",  desc: "Dukaan aur office", count: "560+"   },
  { label: "Rooms for Rent",      href: "/properties?purpose=rent&type=room",       img: "/layout/navbar/property-icons/rooms-for-rent.svg",       desc: "Room kiraye par",   count: "1,450+" },
  { label: "Shared & PG",         href: "/properties?purpose=rent&type=shared",     img: "/layout/navbar/property-icons/shared-and-pg.svg",        desc: "Shared rooms & PG", count: "320+"   },
];

const ALL_TYPES = [
  { label: "Houses",       href: "/properties?type=house",      img: "/layout/navbar/property-icons/houses-for-rent.svg",           desc: "Makan aur kothi",        count: "3,400+" },
  { label: "Apartments",   href: "/properties?type=apartment",  img: "/layout/navbar/property-icons/apartments.svg",       desc: "Flat aur apartment",     count: "2,850+" },
  { label: "Plots & Land", href: "/properties?type=plot",       img: "/layout/navbar/property-icons/plots-and-land.svg",   desc: "Residential plots",      count: "2,600+" },
  { label: "Commercial",   href: "/properties?type=commercial", img: "/layout/navbar/property-icons/commercial.svg",       desc: "Dukaan aur office",      count: "1,520+" },
  { label: "Villas",       href: "/properties?type=villa",      img: "/layout/navbar/property-icons/villas.svg",           desc: "Luxury farmhouses",      count: "980+"   },
  { label: "Portions",     href: "/properties?type=portion",    img: "/layout/navbar/property-icons/portions.svg",         desc: "Portion aur flat",       count: "1,450+" },
  { label: "Rooms",        href: "/properties?type=room",       img: "/layout/navbar/property-icons/rooms.svg",            desc: "Single rooms",           count: "740+"   },
  { label: "Industrial",   href: "/properties?type=industrial", img: "/layout/navbar/property-icons/industrial.svg",       desc: "Factories aur plants",   count: "320+"   },
  { label: "Other",        href: "/properties",                 img: "/layout/navbar/property-icons/other-properties.svg", desc: "Sab qism ki properties", count: "210+"   },
];

// Quick browse types for Search Overlay (uses same image files)
const QUICK_BROWSE_TYPES = [
  { label: "Houses",     img: "/layout/navbar/property-icons/houses.svg",        href: "/properties?type=house"      },
  { label: "Apartments", img: "/layout/navbar/property-icons/apartments.svg",    href: "/properties?type=apartment"  },
  { label: "Plots",      img: "/layout/navbar/property-icons/plots-and-land.svg",href: "/properties?type=plot"       },
  { label: "Commercial", img: "/layout/navbar/property-icons/commercial.svg",    href: "/properties?type=commercial" },
  { label: "Villas",     img: "/layout/navbar/property-icons/villas.svg",        href: "/properties?type=villa"      },
  { label: "Map View",   img: "/layout/navbar/property-icons/map-view.svg",      href: "/properties?view=map"        },
];

// Sidebar content per tab
const TAB_SIDEBAR: Record<DropdownTab, {
  heading: string;
  headingHighlight: string;
  desc: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  viewAllHref: string;
  viewAllLabel: string;
}> = {
  sale: {
    heading: "Find the perfect",
    headingHighlight: "property for you",
    desc: "Explore thousands of verified listings across Pakistan.",
    bullets: ["Verified Listings", "Best Market Prices", "Trusted by Thousands"],
    ctaLabel: "Compare properties",
    ctaHref: "/compare",
    viewAllHref: "/properties?purpose=sale",
    viewAllLabel: "View all listings",
  },
  rent: {
    heading: "Find the right",
    headingHighlight: "rental property",
    desc: "Discover quality rental properties across Pakistan.",
    bullets: ["Verified Rentals", "Fair Rental Prices", "Easy & Secure Process"],
    ctaLabel: "Refine your search",
    ctaHref: "/properties?purpose=rent",
    viewAllHref: "/properties?purpose=rent",
    viewAllLabel: "View all rentals",
  },
  all: {
    heading: "Explore all",
    headingHighlight: "properties",
    desc: "Browse all types of properties for sale or rent in one place.",
    bullets: ["Verified Listings", "Best Market Prices", "Expert Support"],
    ctaLabel: "Open Advanced Filters",
    ctaHref: "/properties",
    viewAllHref: "/properties",
    viewAllLabel: "View all properties",
  },
};

// Property type card with image icon
function PropTypeCard({ label, href, img, desc, onClose }: {
  label: string; href: string; img: string; desc: string; count: string; onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF3DE] transition-all duration-150 border border-transparent hover:border-[#D1E5B8]"
    >
      <div className="w-12 h-12 rounded-xl  flex items-center justify-center flex-shrink-0 overflow-hidden  transition-colors">
        <img src={img} alt={label} className="w-10 h-10 object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1C1C1C] group-hover:text-[#3B6D11] transition-colors leading-tight truncate">{label}</p>
        <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{desc}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <ArrowRight className="h-3.5 w-3.5 text-[#C0DD97] group-hover:text-[#3B6D11] group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

// ─── Redesigned Properties Dropdown ───────────────────────────────────────────
function PropertiesDropdown({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<DropdownTab>("sale");

  const tabs: { key: DropdownTab; label: string; sublabel: string; icon: React.ReactNode }[] = [
    {
      key: "sale",
      label: "For Sale",
      sublabel: "Buy your dream property",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      key: "rent",
      label: "For Rent",
      sublabel: "Find rental properties",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 2C7.582 2 4 5.582 4 10c0 5.25 8 14 8 14s8-8.75 8-14c0-4.418-3.582-8-8-8z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      key: "all",
      label: "All Properties",
      sublabel: "Explore every type",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
  ];

  const sidebar = TAB_SIDEBAR[activeTab];
  const types = activeTab === "sale" ? SALE_TYPES : activeTab === "rent" ? RENT_TYPES : ALL_TYPES;
  const cols = activeTab === "rent" ? "grid-cols-2" : "grid-cols-3";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-full left-0 mt-3 w-[820px] max-w-[calc(100vw-2rem)] bg-white border border-[#E2EAD8] rounded-2xl shadow-2xl shadow-[#3B6D11]/10 overflow-hidden z-50"
    >
      {/* ── Top Tab Bar ── */}
      <div className="grid grid-cols-3 border-b border-[#E2EAD8] bg-[#F8FAF6]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-3 px-5 py-3.5 transition-all duration-200 border-b-2 group",
              activeTab === tab.key
                ? "border-[#3B6D11] bg-white text-[#3B6D11]"
                : "border-transparent text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#F0F6E8]"
            )}
          >
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
              activeTab === tab.key ? "bg-[#EAF3DE]" : "bg-[#F0F0F0] group-hover:bg-[#EAF3DE]"
            )}>
              {tab.icon}
            </div>
            <div className="text-left">
              <p className={cn("text-sm font-bold leading-tight", activeTab === tab.key ? "text-[#1C1C1C]" : "text-[#374151]")}>
                {tab.label}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">{tab.sublabel}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Body: Sidebar + Grid ── */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-[230px] flex-shrink-0 p-5 bg-gradient-to-b from-[#F8FAF6] to-white border-r border-[#E2EAD8] flex flex-col justify-between">
          <div>
            <h3 className="text-[17px] font-bold text-[#1C1C1C] leading-snug">
              {sidebar.heading}{" "}
              <span className="text-[#3B6D11]">{sidebar.headingHighlight}</span>
            </h3>
            <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">{sidebar.desc}</p>

            <div className="mt-3 space-y-1.5">
              {sidebar.bullets.map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#EAF3DE] border border-[#C0DD97] flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-[#3B6D11]" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-xs text-[#374151] font-medium">{b}</span>
                </div>
              ))}
            </div>

            {/* City illustration */}
            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src="/layout/navbar/city-illustration.png"
                alt="Pakistan cities"
                className="w-full object-contain opacity-90"
              />
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href={sidebar.ctaHref}
            onClick={onClose}
            className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#3B6D11] text-white text-xs font-bold hover:bg-[#2d5209] transition-colors"
          >
            <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{sidebar.ctaLabel}</span>
            <ArrowRight className="h-3 w-3 ml-auto" />
          </Link>
        </div>

        {/* Right: Property Type Grid */}
        <div className="flex-1 p-4 flex flex-col">
          <div className={cn("grid gap-1 flex-1", cols)}>
            {types.map((t) => (
              <PropTypeCard key={t.href} {...t} onClose={onClose} />
            ))}
          </div>

          {/* Footer bar */}
          <div className="mt-3 pt-3 border-t border-[#E2EAD8] flex items-center justify-between">
            <div className="flex items-center gap-4">
              {[
                { icon: <ShieldCheck className="h-3.5 w-3.5 text-[#3B6D11]" />, label: "Verified & Trusted", sub: "Only verified listings" },
                { icon: <TrendingUp className="h-3.5 w-3.5 text-[#3B6D11]" />,  label: "Best Prices",        sub: "Fair & competitive rates" },
                { icon: <Users className="h-3.5 w-3.5 text-[#3B6D11]" />,       label: "Expert Support",     sub: "We're here to help" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  {item.icon}
                  <div>
                    <p className="text-[10px] font-bold text-[#1C1C1C] leading-none">{item.label}</p>
                    <p className="text-[9px] text-[#9CA3AF] mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={sidebar.viewAllHref}
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-bold text-[#3B6D11] border border-[#C0DD97] px-3 py-2 rounded-xl hover:bg-[#EAF3DE] transition-colors flex-shrink-0"
            >
              {sidebar.viewAllLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Professional Search Overlay ──────────────────────────────────────────────
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches] = useState(["DHA Karachi", "Bahria Town Lahore", "F-7 Islamabad"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await propertyApi.getAll({ search: q, limit: 6, status: "approved" });
      setResults(res.data?.properties ?? res.data?.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(query), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchResults]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/properties?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  }

  function goToProperty(id: string) {
    router.push(`/properties/${id}`);
    onClose();
  }

  function goToRecent(term: string) {
    router.push(`/properties?search=${encodeURIComponent(term)}`);
    onClose();
  }

  const showRecent = !query && recentSearches.length > 0;
  const showResults = query.trim().length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex flex-col items-center"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.97 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full max-w-2xl mx-4 mt-20 bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <form onSubmit={handleSearch} className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F0]">
            <Search className="h-5 w-5 text-[#3B6D11] flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by area, city, type... (e.g. DHA Karachi house)"
              className="flex-1 text-base text-[#1C1C1C] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent"
            />
            <div className="flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 text-[#3B6D11] animate-spin" />}
              {query && (
                <button type="button" onClick={() => setQuery("")}
                  className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button" onClick={onClose}
                className="flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors px-2 py-1.5 rounded-lg hover:bg-[#F3F4F6] font-medium"
              >
                <kbd className="text-[10px] bg-[#F3F4F6] px-1.5 py-0.5 rounded border border-[#E5E7EB] font-mono">ESC</kbd>
              </button>
            </div>
          </form>

          {/* Results / Recent / Quick filters */}
          <div className="max-h-[420px] overflow-y-auto">
            {/* Recent searches */}
            {showRecent && (
              <div className="p-4">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Recent Searches</p>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <button key={term} onClick={() => goToRecent(term)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F8FAF6] text-left transition-colors group"
                    >
                      <Clock className="h-4 w-4 text-[#C4C4C4] group-hover:text-[#3B6D11] transition-colors flex-shrink-0" />
                      <span className="text-sm text-[#6B7280] group-hover:text-[#1C1C1C] transition-colors">{term}</span>
                    </button>
                  ))}
                </div>

                {/* Quick browse by type — now using image files */}
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mt-5 mb-3">Browse by Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_BROWSE_TYPES.map(({ label, img, href }) => (
                    <Link key={href} href={href} onClick={onClose}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#E2EAD8] hover:border-[#C0DD97] hover:bg-[#F0F6E8] transition-all group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#EAF3DE] flex items-center justify-center flex-shrink-0 group-hover:bg-[#3B6D11] transition-colors overflow-hidden">
                        <img
                          src={img}
                          alt={label}
                          className="w-5 h-5 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#374151] group-hover:text-[#3B6D11] transition-colors">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Live search results */}
            {showResults && (
              <div className="p-4">
                {loading && results.length === 0 && (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="sm" text="Searching properties..." />
                  </div>
                )}

                {!loading && results.length === 0 && query.trim().length > 1 && (
                  <div className="flex flex-col items-center py-8 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8FAF6] border border-[#E2EAD8] flex items-center justify-center">
                      <Search className="h-5 w-5 text-[#C4C4C4]" />
                    </div>
                    <p className="text-sm text-[#9CA3AF] text-center">No properties found for <span className="font-semibold text-[#6B7280]">"{query}"</span></p>
                    <button onClick={handleSearch}
                      className="text-xs text-[#3B6D11] font-semibold hover:underline"
                    >
                      See all results →
                    </button>
                  </div>
                )}

                {results.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Properties</p>
                    <div className="space-y-1">
                      {results.map((prop: any) => (
                        <button key={prop._id || prop.id} onClick={() => goToProperty(prop._id || prop.id)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F8FAF6] text-left transition-colors group"
                        >
                          {/* Thumbnail */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#F3F4F6]">
                            {prop.images?.[0]?.url ? (
                              <img src={prop.images[0].url} alt={prop.title}
                                className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-[#C4C4C4]" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1C1C1C] truncate group-hover:text-[#3B6D11] transition-colors">
                              {prop.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <MapPin className="h-3 w-3 text-[#9CA3AF] flex-shrink-0" />
                              <p className="text-xs text-[#9CA3AF] truncate">
                                {prop.location?.area}, {prop.location?.city}
                              </p>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-[#3B6D11]">
                              PKR {prop.price?.toLocaleString("en-PK")}
                            </p>
                            <p className="text-[10px] text-[#9CA3AF] capitalize mt-0.5">
                              {prop.purpose} · {prop.type}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* View all */}
                    <button onClick={handleSearch}
                      className="w-full mt-3 py-2.5 rounded-xl border border-[#D1E5B8] text-sm font-semibold text-[#3B6D11] hover:bg-[#EAF3DE] transition-colors flex items-center justify-center gap-2"
                    >
                      View all results for "{query}" <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-5 py-2.5 bg-[#F8FAF6] border-t border-[#F0F0F0] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">
              Press <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB] font-mono mx-0.5">↵</kbd> to search all results
            </p>
            <Link href="/properties" onClick={onClose}
              className="text-xs font-semibold text-[#639922] hover:text-[#3B6D11] transition-colors flex items-center gap-1"
            >
              Browse all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Role-based User Dropdown ──────────────────────────────────────────────────
function UserDropdown({ user }: { user: NonNullable<ReturnType<typeof useUser>> }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuthStore();

  async function handleLogout() {
    await logout();
    await signOut({ callbackUrl: "/" });
  }

  const buyerItems = [
    { href: "/dashboard",           icon: LayoutDashboard, label: "My Dashboard",     badge: null },
    { href: "/dashboard/favorites", icon: Heart,           label: "Saved Properties", badge: null },
    { href: "/dashboard/inquiries", icon: FileText,        label: "My Inquiries",     badge: null },
    { href: "/dashboard/bookings",  icon: Calendar,        label: "Tour Bookings",    badge: null },
    { href: "/dashboard/chat",      icon: MessageCircle,   label: "Messages",         badge: null },
    { href: "/dashboard/alerts",    icon: Bell,            label: "Price Alerts",     badge: null },
    { href: "/dashboard/profile",   icon: Settings,        label: "Profile Settings", badge: null },
  ];

  const agentItems = [
    { href: "/dashboard",            icon: LayoutDashboard, label: "Agent Workspace", badge: "Pro" },
    { href: "/dashboard/listings",   icon: Building2,       label: "My Listings",     badge: null },
    { href: "/dashboard/analytics",  icon: BarChart2,       label: "Performance Hub", badge: null },
    { href: "/dashboard/inquiries",  icon: ClipboardList,   label: "Buyer Inquiries", badge: null },
    { href: "/dashboard/bookings",   icon: Calendar,        label: "Site Visits",     badge: null },
    { href: "/dashboard/chat",       icon: MessageCircle,   label: "Messages",        badge: null },
    { href: "/dashboard/profile",    icon: Settings,        label: "Profile Settings",badge: null },
  ];

  const adminItems = [
    { href: "/admin",             icon: ShieldCheck, label: "Admin Console",    badge: "Root" },
    { href: "/admin/agents",      icon: UserCheck,   label: "Agent KYC Queue",  badge: null },
    { href: "/admin/users",       icon: Users,       label: "Manage Users",     badge: null },
    { href: "/admin/properties",  icon: Building2,   label: "Property Catalog", badge: null },
    { href: "/admin/analytics",   icon: BarChart2,   label: "Platform Metrics", badge: null },
    { href: "/admin/profile",     icon: Settings,    label: "Security Settings",badge: null },
  ];

  const items =
    user.role === "admin" ? adminItems :
    user.role === "agent" ? agentItems :
    buyerItems;

  const roleBadge =
    user.role === "admin" ? (
      <span className="inline-flex items-center gap-1 text-[11px] bg-[#EAF3DE] text-[#3B6D11] border border-[#C0DD97] px-2.5 py-0.5 rounded-full font-bold">
        <ShieldCheck className="h-3 w-3 text-[#3B6D11]" /> Super Admin
      </span>
    ) : user.role === "agent" ? (
      <span className="inline-flex items-center gap-1 text-[11px] bg-[#EAF3DE] text-[#3B6D11] border border-[#C0DD97] px-2.5 py-0.5 rounded-full font-bold">
        <BadgeCheck className="h-3 w-3 text-[#3B6D11]" /> Verified Agent
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[11px] bg-[#EAF3DE] text-[#3B6D11] border border-[#C0DD97] px-2.5 py-0.5 rounded-full font-bold">
        Buyer Account
      </span>
    );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-[#EAF3DE] transition-all duration-200 border border-transparent hover:border-[#D1E5B8] group"
      >
        {user.photo ? (
          <img src={user.photo} alt={user.name ?? ""} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#C0DD97] group-hover:ring-[#3B6D11] transition-all" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B6D11] to-[#639922] flex items-center justify-center ring-2 ring-[#C0DD97] group-hover:ring-[#3B6D11] transition-all shadow-xs">
            <span className="text-white text-xs font-bold">{(user.name ?? "?").charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-[#1C1C1C] leading-tight truncate max-w-[100px]">{(user.name ?? "").split(" ")[0] || "User"}</p>
          <p className="text-[10px] text-[#6B7280] font-medium capitalize mt-0.5">{user.role}</p>
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-[#9CA3AF] transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-64 z-50 bg-white border border-[#E2EAD8] rounded-2xl shadow-xl shadow-[#3B6D11]/10 overflow-hidden"
            >
              {/* Header User Identity Card */}
              <div className="p-3 bg-gradient-to-br from-[#F8FAF6] to-white border-b border-[#E2EAD8]">
                <div className="flex items-center gap-2.5">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name ?? ""} className="w-9 h-9 rounded-full object-cover ring-2 ring-[#C0DD97] shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B6D11] to-[#639922] flex items-center justify-center ring-2 ring-[#C0DD97] shrink-0">
                      <span className="text-white text-xs font-bold">{(user.name ?? "?").charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#1C1C1C] truncate">{user.name ?? "User"}</p>
                    <p className="text-[11px] text-[#6B7280] truncate mt-0.5">{user.email}</p>
                    <div className="mt-1">{roleBadge}</div>
                  </div>
                </div>
              </div>

              {/* Menu Navigation Items */}
              <div className="p-1.5 space-y-0.5">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#4B5563] hover:text-[#3B6D11] hover:bg-[#EAF3DE] transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#F8FAF6] border border-[#E2EAD8] group-hover:bg-white group-hover:border-[#C0DD97] flex items-center justify-center transition-colors shrink-0">
                        <item.icon className="h-3 w-3 text-[#6B7280] group-hover:text-[#3B6D11] transition-colors" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="text-[9px] font-bold bg-[#3B6D11] text-white px-1.5 py-0.2 rounded-md">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="h-3 w-3 text-[#C4C4C4] group-hover:text-[#3B6D11] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Sign Out Footer */}
              <div className="p-1.5 border-t border-[#E2EAD8] bg-[#F8FAF6]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                    <LogOut className="h-3 w-3 text-rose-600" />
                  </div>
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Action Icons ──────────────────────────────────────────────────────────────
function ActionIcons({ user }: { user: NonNullable<ReturnType<typeof useUser>> }) {
  if (user.role === "admin") {
    return (
      <>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B6D11] bg-[#EAF3DE] border border-[#C0DD97] px-3 py-1.5 rounded-full">
          <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
        </span>
        <NotificationBell />
      </>
    );
  }
  if (user.role === "agent") {
    return (
      <>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B6D11] bg-[#EAF3DE] border border-[#C0DD97] px-3 py-1.5 rounded-full">
          <BadgeCheck className="h-3.5 w-3.5" /> Verified Agent
        </span>
        {/* Message + Bell: always visible including mobile */}
        <Link href="/dashboard/chat" className="relative p-2 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] transition-all">
          <MessageCircle className="h-5 w-5" />
        </Link>
        <NotificationBell />
      </>
    );
  }
  return (
    <>
      <Link
        href="/become-agent"
        className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#3B6D11] to-[#639922] hover:from-[#2d5209] hover:to-[#3B6D11] px-4 py-2 rounded-full transition-all shadow-sm"
      >
        <UserCheck className="h-3.5 w-3.5" /> Become an Agent
      </Link>
      {/* Message + Bell: always visible including mobile */}
      <Link href="/dashboard/chat" className="relative p-2 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] transition-all">
        <MessageCircle className="h-5 w-5" />
      </Link>
      <NotificationBell />
      <Link href="/dashboard/favorites" className="hidden sm:flex p-2 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] transition-all">
        <Heart className="h-5 w-5" />
      </Link>
    </>
  );
}

// ─── Desktop Nav ───────────────────────────────────────────────────────────────
function DesktopNav({ user, propsOpen, setPropsOpen }: {
  user: ReturnType<typeof useUser>;
  propsOpen: boolean;
  setPropsOpen: (v: boolean) => void;
}) {
  if (user?.role === "admin") {
    return (
      <div className="hidden md:flex items-center gap-0.5">
        <AdminNavLink href="/admin">Admin Overview</AdminNavLink>
        <AdminNavLink href="/admin/agents">Agent Applications</AdminNavLink>
        <AdminNavLink href="/admin/users">Users</AdminNavLink>
        <AdminNavLink href="/admin/properties">Properties</AdminNavLink>
      </div>
    );
  }

  const PropsButton = (
    <div
      className="relative"
      onMouseEnter={() => setPropsOpen(true)}
      onMouseLeave={() => setPropsOpen(false)}
    >
      <button className={cn(
        "flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl transition-all duration-200",
        propsOpen ? "text-[#3B6D11] bg-[#EAF3DE]" : "text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#F0F6E8]"
      )}>
        Properties
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", propsOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {propsOpen && <PropertiesDropdown onClose={() => setPropsOpen(false)} />}
      </AnimatePresence>
    </div>
  );

  if (user?.role === "agent") {
    return (
      <div className="hidden md:flex items-center gap-0.5 relative">
        {PropsButton}
        <NavLink href="/dashboard/listings">My Listings</NavLink>
        <NavLink href="/dashboard/analytics">Analytics</NavLink>
        <NavLink href="/dashboard/bookings">Visits</NavLink>
        <NavLink href="/agents">Agents</NavLink>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-0.5 relative">
      {PropsButton}
      <NavLink href="/agents">Agents</NavLink>
      <NavLink href="/calculator">Calculator</NavLink>
      <NavLink href="/compare">Compare</NavLink>
    </div>
  );
}

// ─── Mobile Menu ───────────────────────────────────────────────────────────────
function MobileMenuContent({
  user, onClose, onSearchOpen,
}: {
  user: ReturnType<typeof useUser>;
  onClose: () => void;
  onSearchOpen: () => void;
}) {
  const router = useRouter();
  const { logout } = useAuthStore();

  async function handleLogout() {
    await logout();
    await signOut({ callbackUrl: "/" });
    onClose();
  }

  const OpenSearchBtn = (
    <button
      onClick={() => { onClose(); onSearchOpen(); }}
      className="w-full flex items-center gap-3 px-4 py-3 mb-3 bg-[#F8FAF6] border border-[#E2EAD8] rounded-xl text-[#9CA3AF] text-sm"
    >
      <Search className="h-4 w-4" />
      Search properties...
    </button>
  );

  // ── Shared: User identity card (shown at top for logged-in users) ──
  const UserCard = user ? (
    <div className="mx-4 mt-4 mb-2 p-3 bg-[#F8FAF6] border border-[#E2EAD8] rounded-2xl flex items-center gap-3">
      {user.photo ? (
        <img src={user.photo} alt={user.name ?? ""} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C0DD97] flex-shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B6D11] to-[#639922] flex items-center justify-center ring-2 ring-[#C0DD97] flex-shrink-0">
          <span className="text-white text-sm font-bold">{(user.name ?? "?").charAt(0).toUpperCase()}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1C1C1C] truncate">{user.name ?? "User"}</p>
        <p className="text-xs text-[#9CA3AF] truncate">{user.email}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-[10px] bg-[#EAF3DE] text-[#3B6D11] border border-[#C0DD97] px-2 py-1 rounded-full font-bold capitalize flex-shrink-0">
        {user.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : user.role === "agent" ? <BadgeCheck className="h-3 w-3" /> : null}
        {user.role}
      </span>
    </div>
  ) : null;

  // ── Shared: Logout button ──
  const LogoutBtn = (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 mt-2 mx-0 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
    >
      <LogOut className="h-4 w-4" /> Sign Out
    </button>
  );

  if (user?.role === "admin") {
    return (
      <div className="pb-4 space-y-1">
        {UserCard}
        <div className="px-4 space-y-1">
          {[
            { href: "/admin",            icon: ShieldCheck, label: "Admin Overview"     },
            { href: "/admin/agents",     icon: UserCheck,   label: "Agent Applications" },
            { href: "/admin/users",      icon: Users,       label: "Manage Users"       },
            { href: "/admin/properties", icon: Building2,   label: "Properties"         },
            { href: "/admin/profile",    icon: Settings,    label: "Profile Settings"   },
            { href: "/properties",       icon: Building2,   label: "Browse Properties"  },
            { href: "/agents",           icon: UserCheck,   label: "Agent Directory"    },
          ].map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-[#E2EAD8] mt-2 pt-1">{LogoutBtn}</div>
        </div>
      </div>
    );
  }

  if (user?.role === "agent") {
    return (
      <div className="pb-4 space-y-1">
        {UserCard}
        <div className="px-4 space-y-1">
          {OpenSearchBtn}
          {[
            { href: "/dashboard",           icon: LayoutDashboard, label: "Dashboard",       primary: false },
            { href: "/dashboard/listings",  icon: Building2,       label: "My Listings",     primary: true  },
            { href: "/dashboard/analytics", icon: BarChart2,       label: "Analytics",       primary: false },
            { href: "/dashboard/inquiries", icon: ClipboardList,   label: "Buyer Inquiries", primary: false },
            { href: "/dashboard/bookings",  icon: Calendar,        label: "Property Visits", primary: false },
            { href: "/dashboard/chat",      icon: MessageCircle,   label: "Messages",        primary: false },
            { href: "/dashboard/alerts",    icon: Bell,            label: "Price Alerts",    primary: false },
            { href: "/dashboard/profile",   icon: Settings,        label: "Profile Settings",primary: false },
          ].map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium",
                item.primary ? "bg-[#3B6D11] text-white" : "text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Link href="/properties" onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium">
            <Building2 className="h-4 w-4" /> Browse Properties
          </Link>
          <div className="border-t border-[#E2EAD8] mt-2 pt-1">{LogoutBtn}</div>
        </div>
      </div>
    );
  }

  // ── Buyer (logged-in) ──
  if (user) {
    return (
      <div className="pb-4 space-y-1">
        {UserCard}
        <div className="px-4 space-y-1">
          {OpenSearchBtn}
          <Link href="/dashboard" onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium">
            <LayoutDashboard className="h-4 w-4" /> My Dashboard
          </Link>
          <Link href="/properties" onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#1C1C1C] hover:bg-[#EAF3DE] text-sm font-semibold">
            <Building2 className="h-4 w-4 text-[#3B6D11]" /> All Properties
          </Link>
          <Link href="/agents" onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium">
            <UserCheck className="h-4 w-4" /> Find Agents
          </Link>
          <Link href="/calculator" onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium">
            <TrendingUp className="h-4 w-4" /> Calculator
          </Link>
          <Link href="/compare" onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium">
            <BarChart2 className="h-4 w-4" /> Compare Properties
          </Link>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {[
              { href: "/dashboard/favorites", icon: Heart,    label: "Saved",     bg: "bg-[#FFF5F5] border-red-100   text-red-600"   },
              { href: "/dashboard/bookings",  icon: Calendar, label: "Bookings",  bg: "bg-[#EAF3DE] border-[#C0DD97] text-[#3B6D11]" },
              { href: "/dashboard/inquiries", icon: FileText, label: "Inquiries", bg: "bg-[#EAF3DE] border-[#C0DD97] text-[#3B6D11]" },
              { href: "/dashboard/alerts",    icon: Bell,     label: "Alerts",    bg: "bg-amber-50  border-amber-100 text-amber-600"  },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold ${item.bg}`}
              >
                <item.icon className="h-3.5 w-3.5" /> {item.label}
              </Link>
            ))}
          </div>

          <Link href="/dashboard/profile" onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium">
            <Settings className="h-4 w-4" /> Profile Settings
          </Link>
          <div className="border-t border-[#E2EAD8] mt-2 pt-1">{LogoutBtn}</div>
        </div>
      </div>
    );
  }

  // ── Guest (not logged in) ──
  return (
    <div className="px-4 py-4 space-y-1">
      {OpenSearchBtn}
      <Link href="/properties" onClick={onClose}
        className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#1C1C1C] hover:bg-[#EAF3DE] text-sm font-semibold">
        <Building2 className="h-4 w-4 text-[#3B6D11]" /> All Properties
      </Link>
      <Link href="/agents" onClick={onClose}
        className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium">
        <UserCheck className="h-4 w-4" /> Find Agents
      </Link>
      <Link href="/calculator" onClick={onClose}
        className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium">
        <TrendingUp className="h-4 w-4" /> Calculator
      </Link>
      <Link href="/compare" onClick={onClose}
        className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] text-sm font-medium">
        <BarChart2 className="h-4 w-4" /> Compare Properties
      </Link>

      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { label: "Houses",     href: "/properties?type=house"     },
          { label: "Apartments", href: "/properties?type=apartment" },
          { label: "Plots",      href: "/properties?type=plot"      },
        ].map((l) => (
          <Link key={l.href} href={l.href} onClick={onClose}
            className="text-center text-xs bg-[#EAF3DE] border border-[#C0DD97] rounded-xl py-2.5 text-[#3B6D11] font-semibold">
            {l.label}
          </Link>
        ))}
      </div>

      <Link href="/become-agent" onClick={onClose}
        className="flex items-center gap-2 px-3 py-3 rounded-xl bg-[#3B6D11] text-white text-sm font-bold mt-1">
        <UserCheck className="h-4 w-4" /> Become an Agent
      </Link>

      <div className="pt-3 flex flex-col gap-2 border-t border-[#E2EAD8] mt-2">
        <Button variant="outline" className="border-[#D1E5B8] text-[#3B6D11]"
          onClick={() => { router.push("/login"); onClose(); }}>Sign In</Button>
        <Button className="bg-[#3B6D11] hover:bg-[#2d5209] text-white"
          onClick={() => { router.push("/register"); onClose(); }}>Get Started Free</Button>
      </div>
    </div>
  );
}

// ─── MAIN NAVBAR ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [propsOpen,   setPropsOpen]   = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const user   = useUser();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const showAnnouncement = user?.role !== "admin";

  return (
    <>
      <header className={cn(
        "sticky top-0 z-30 w-full transition-all duration-300",
        scrolled
          ? "bg-white/98 backdrop-blur-lg border-b border-[#E2EAD8] shadow-sm"
          : "bg-white border-b border-[#E2EAD8]"
      )}>
        {showAnnouncement && (
          <div className="bg-gradient-to-r from-[#3B6D11] to-[#639922] py-1.5 text-center">
            <p className="text-xs text-white/90 font-medium">
              Pakistan ka #1 Real Estate Platform — 10,000+ verified listings
              <Link href="/properties" className="ml-2 underline underline-offset-2 font-bold">
                Explore Now →
              </Link>
            </p>
          </div>
        )}

        {user?.role === "admin" && (
          <div className="bg-gradient-to-r from-[#3B6D11] to-[#639922] py-1.5 text-center">
            <p className="text-xs text-white/90 font-medium">
              🛡️ Admin Mode — You are managing the GharFind platform
              <Link href="/admin" className="ml-2 underline underline-offset-2 font-bold">
                Go to Admin Panel →
              </Link>
            </p>
          </div>
        )}

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Logo />
          <DesktopNav user={user} propsOpen={propsOpen} setPropsOpen={setPropsOpen} />

          <div className="flex items-center gap-1">
            {/* Desktop-only: search bar */}
            {user?.role !== "admin" && (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] transition-all border border-transparent hover:border-[#D1E5B8] group"
                aria-label="Search properties"
              >
                <Search className="h-5 w-5 group-hover:scale-105 transition-transform" />
                <span className="hidden lg:block text-sm text-[#9CA3AF] group-hover:text-[#3B6D11] transition-colors">
                  Search...
                </span>
                <span className="hidden lg:flex items-center gap-0.5 text-[10px] text-[#C4C4C4] bg-[#F3F4F6] px-1.5 py-0.5 rounded border border-[#E5E7EB] font-mono group-hover:bg-[#EAF3DE] group-hover:border-[#C0DD97] transition-colors">
                  ⌘K
                </span>
              </button>
            )}

            {/* Mobile-only: search icon */}
            {user?.role !== "admin" && (
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 rounded-xl text-[#6B7280] hover:bg-[#EAF3DE] transition-all"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* Action icons (message + bell) — always visible for logged-in users */}
            {user && <ActionIcons user={user} />}

            {/* Desktop-only: user dropdown */}
            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <UserDropdown user={user} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE]"
                  onClick={() => router.push("/login")}>
                  Sign In
                </Button>
                <Button size="sm" className="bg-[#3B6D11] hover:bg-[#2d5209] text-white rounded-xl px-5"
                  onClick={() => router.push("/register")}>
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl text-[#6B7280] hover:bg-[#EAF3DE] transition-all"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Side Drawer (mobile) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-[300px] max-w-[90vw] bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2EAD8] bg-[#F8FAF6]">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <img src="/logo.png" alt="GharFind" className="h-10 object-contain" />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-[#6B7280] hover:bg-[#EAF3DE] hover:text-[#3B6D11] transition-all"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <MobileMenuContent
                  user={user}
                  onClose={() => setMobileOpen(false)}
                  onSearchOpen={() => { setMobileOpen(false); setSearchOpen(true); }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}