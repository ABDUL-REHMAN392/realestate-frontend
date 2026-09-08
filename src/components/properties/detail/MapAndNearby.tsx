"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Navigation, Clock, Coffee, School,
  ShoppingBag, Hospital, Landmark, ChevronRight,
  ExternalLink, Layers,
} from "lucide-react";
import { PropertyDetail } from "@/lib/types";
import { formatPrice, NEARBY_PLACES } from "@/lib/constants";

const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-[#EAF3DE] to-[#F8FAF6] animate-pulse rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#3B6D11]/20 flex items-center justify-center animate-bounce">
          <MapPin className="h-5 w-5 text-[#3B6D11]" />
        </div>
        <p className="text-xs text-[#6B7280]">Loading map...</p>
      </div>
    </div>
  ),
});

// ─── Category Icons ───────────────────────────
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  mall: ShoppingBag,
  park: Landmark,
  school: School,
  hospital: Hospital,
  mosque: Landmark,
  restaurant: Coffee,
};

function getCategoryIcon(name: string): React.ElementType {
  const lower = name.toLowerCase();
  if (lower.includes("mall") || lower.includes("shop")) return ShoppingBag;
  if (lower.includes("park") || lower.includes("garden")) return Landmark;
  if (lower.includes("school") || lower.includes("college") || lower.includes("university")) return School;
  if (lower.includes("hospital") || lower.includes("clinic") || lower.includes("medical")) return Hospital;
  if (lower.includes("masjid") || lower.includes("mosque") || lower.includes("church")) return Landmark;
  if (lower.includes("restaurant") || lower.includes("cafe") || lower.includes("food")) return Coffee;
  return MapPin;
}

function getDistColor(dist: string) {
  const meters = dist.includes("km")
    ? parseFloat(dist) * 1000
    : parseFloat(dist);
  if (meters <= 500) return { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" };
  if (meters <= 1500) return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" };
  return { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" };
}

// ─── Tab Types ────────────────────────────────
type TabType = "nearby" | "travel";

export default function MapAndNearby({ property }: { property: PropertyDetail }) {
  const [activeTab, setActiveTab] = useState<TabType>("nearby");
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);

  const fullAddress = [
    property.address.street,
    property.address.city,
    property.address.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white border border-[#E2EAD8] rounded-3xl overflow-hidden shadow-sm"
    >
      {/* ── Header ── */}
      <div className="px-6 py-5 border-b border-[#E2EAD8] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EAF3DE] flex items-center justify-center">
            <Layers className="h-4.5 w-4.5 text-[#3B6D11]" />
          </div>
          <div>
            <h2 className="font-bold text-[#1C1C1C] text-base">Location & Nearby</h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {property.address.city}, {property.address.state}
            </p>
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#3B6D11] hover:text-[#2d5409] bg-[#EAF3DE] hover:bg-[#D4EBB8] px-3 py-2 rounded-xl transition-all"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open in Maps
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">

        {/* ── Map Side (3/5) ── */}
        <div className="lg:col-span-3 p-5">
          {/* Map Container */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E2EAD8] shadow-sm"
            style={{ height: "280px" }}>
            {property.location?.coordinates ? (
              <PropertyMap
                lat={property.location.coordinates[1]}
                lng={property.location.coordinates[0]}
                title={property.title}
                address={fullAddress}
                price={formatPrice(property.price)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#EAF3DE] via-[#F0F7E6] to-[#F8FAF6] flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-[#3B6D11]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#374151]">Location Not Available</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">Exact coordinates not provided</p>
                </div>
              </div>
            )}

            {/* Map overlay badge */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-[#E2EAD8] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B6D11] animate-pulse" />
              <span className="text-xs font-semibold text-[#1C1C1C]">
                {property.address.city}
              </span>
            </div>
          </div>

          {/* Address Info Cards */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Address */}
            <div className="flex items-start gap-3 bg-[#F8FAF6] rounded-xl p-3 border border-[#E2EAD8]">
              <div className="w-8 h-8 rounded-lg bg-[#EAF3DE] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="h-4 w-4 text-[#3B6D11]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#374151]">Address</p>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  {property.address.street
                    ? `Near ${property.address.street}, `
                    : ""}
                  {property.address.city}, {property.address.state}
                </p>
              </div>
            </div>

            {/* Directions */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#EAF3DE] rounded-xl p-3 border border-[#C0DD97] hover:bg-[#D4EBB8] transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#3B6D11] flex items-center justify-center flex-shrink-0">
                <Navigation className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#3B6D11]">Get Directions</p>
                <p className="text-xs text-[#3B6D11]/70 mt-0.5 flex items-center gap-1">
                  Open Google Maps
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </div>
            </a>
          </div>

          {/* Nearby Description */}
          {property.address.nearbyDescription && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-semibold">Area Note:</span>{" "}
                {property.address.nearbyDescription}
              </p>
            </div>
          )}
        </div>

        {/* ── Nearby Side (2/5) ── */}
        <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-[#E2EAD8] flex flex-col">

          {/* Tabs */}
          <div className="flex border-b border-[#E2EAD8] px-4 pt-4">
            {(["nearby", "travel"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex items-center gap-1.5 pb-3 pr-5 text-xs font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-[#3B6D11]"
                    : "text-[#9CA3AF] hover:text-[#6B7280]"
                }`}
              >
                {tab === "nearby" ? (
                  <><MapPin className="h-3.5 w-3.5" /> Nearby Places</>
                ) : (
                  <><Clock className="h-3.5 w-3.5" /> Travel Time</>
                )}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-4 h-0.5 bg-[#3B6D11] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Places List */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {NEARBY_PLACES.map((place, i) => {
                  const Icon = getCategoryIcon(place.name);
                  const colors = getDistColor(place.dist);
                  const isHovered = hoveredPlace === place.name;

                  return (
                    <motion.div
                      key={place.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onHoverStart={() => setHoveredPlace(place.name)}
                      onHoverEnd={() => setHoveredPlace(null)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-default ${
                        isHovered
                          ? "border-[#C0DD97] bg-[#F8FAF6] shadow-sm"
                          : "border-transparent hover:border-[#E2EAD8]"
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isHovered ? "bg-[#EAF3DE]" : "bg-[#F8FAF6]"
                      }`}>
                        <Icon className="h-4 w-4 text-[#3B6D11]" />
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#374151] truncate">
                          {place.name}
                        </p>
                        {activeTab === "travel" && (
                          <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {/* Estimate travel time from dist */}
                            {place.dist.includes("km")
                              ? `~${Math.round(parseFloat(place.dist) * 3)} min drive`
                              : `~${Math.round(parseFloat(place.dist) / 80)} min walk`
                            }
                          </p>
                        )}
                      </div>

                      {/* Distance Badge */}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${colors.bg} ${colors.text}`}>
                        {place.dist}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Distance Legend */}
          <div className="px-4 py-3 border-t border-[#E2EAD8] bg-[#F8FAF6]">
            <p className="text-xs text-[#9CA3AF] font-medium mb-2">Distance Guide</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> &lt; 500m
              </span>
              <span className="flex items-center gap-1 text-xs text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> &lt; 1.5km
              </span>
              <span className="flex items-center gap-1 text-xs text-orange-700">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> &gt; 1.5km
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}