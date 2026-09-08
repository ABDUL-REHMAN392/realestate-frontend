"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Users, ArrowRight, Building2 } from "lucide-react";
import type { Filters } from "@/lib/types";
import { TYPE_ICONS, TYPE_COUNTS, fmtShort } from "@/lib/constants";

interface SidebarFiltersProps {
  filters: Filters;
  onChange: (k: string, v: string) => void;
  onApply: () => void;
  total: number;
}

const AMENITIES = [
  "Parking",
  "Swimming Pool",
  "Gym",
  "Garden",
  "Security",
  "Furnished",
];

export function SidebarFilters({
  filters,
  onChange,
  onApply,
  total,
}: SidebarFiltersProps) {
  const [amenities, setAmenities] = useState<string[]>([]);

  const toggleAmenity = (a: string) =>
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  function clearAll() {
    onChange("purpose", "");
    onChange("type", "");
    onChange("city", "");
    onChange("minPrice", "");
    onChange("maxPrice", "");
    onChange("bedrooms", "");
    onChange("bathrooms", "");
    onChange("minArea", "");
    onChange("maxArea", "");
  }

  return (
    <aside className="w-64 flex-shrink-0">
      {/* sticky top, no scroll — just flows naturally */}
      <div className="bg-white border border-[#E8F0DC] rounded-2xl overflow-hidden sticky top-6">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F6E8]">
          <h3 className="font-bold text-[#1C1C1C]">Filters</h3>
          <button
            onClick={clearAll}
            className="text-xs text-[#3B6D11] hover:underline font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Location */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Location
            </label>
            <div className="relative">
              <input
                value={filters.city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="Enter city or area"
                className="w-full border border-[#E8F0DC] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3B6D11] pr-8"
              />
              <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B6D11]" />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Property Type
            </label>
            <div className="space-y-1">
              {Object.entries(TYPE_COUNTS).map(([type, count]) => {
                const Icon = TYPE_ICONS[type] ?? Building2;
                return (
                  <button
                    key={type}
                    onClick={() =>
                      onChange("type", filters.type === type ? "" : type)
                    }
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${
                      filters.type === type
                        ? "bg-[#EAF3DE] text-[#3B6D11] font-semibold"
                        : "text-[#6B7280] hover:bg-[#F8FAF6]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="capitalize">{type}</span>
                    </span>
                    <span
                      className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${
                        filters.type === type
                          ? "bg-[#3B6D11] text-white"
                          : "bg-[#F0F6E8] text-[#6B7280]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Price Range
            </label>
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max="50000000"
                step="500000"
                value={filters.maxPrice || "50000000"}
                onChange={(e) => onChange("maxPrice", e.target.value)}
                className="w-full accent-[#3B6D11]"
              />
              <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                <span>PKR 0</span>
                <span>PKR {fmtShort(Number(filters.maxPrice || 50000000))}+</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 border border-[#E8F0DC] rounded-xl px-3 py-2 text-xs text-[#374151] bg-white">
                PKR {Number(filters.minPrice || 0).toLocaleString() || "0"}
              </div>
              <div className="flex-1 border border-[#E8F0DC] rounded-xl px-3 py-2 text-xs text-[#374151] bg-white text-right">
                PKR {Number(filters.maxPrice || 50000000).toLocaleString()}+
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Bedrooms
            </label>
            <div className="flex gap-1.5">
              {["1", "2", "3", "4", "5+"].map((b) => (
                <button
                  key={b}
                  onClick={() => onChange("bedrooms", filters.bedrooms === b ? "" : b)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    filters.bedrooms === b
                      ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                      : "border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Bathrooms
            </label>
            <div className="flex gap-1.5">
              {["1", "2", "3", "4", "5+"].map((b) => (
                <button
                  key={b}
                  onClick={() => onChange("bathrooms", filters.bathrooms === b ? "" : b)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    filters.bathrooms === b
                      ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                      : "border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Area (Sqft)
            </label>
            <div className="flex items-center gap-2">
              <input
                value={filters.minArea || ""}
                onChange={(e) => onChange("minArea", e.target.value)}
                type="number"
                placeholder="Min Area"
                className="flex-1 w-0 border border-[#E8F0DC] rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#3B6D11]"
              />
              <span className="text-xs text-[#9CA3AF] flex-shrink-0">to</span>
              <input
                value={filters.maxArea || ""}
                onChange={(e) => onChange("maxArea", e.target.value)}
                type="number"
                placeholder="Max Area"
                className="flex-1 w-0 border border-[#E8F0DC] rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#3B6D11]"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Amenities
            </label>
            <div className="space-y-2">
              {AMENITIES.map((a) => (
                <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggleAmenity(a)}
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 cursor-pointer ${
                      amenities.includes(a)
                        ? "bg-[#3B6D11] border-[#3B6D11]"
                        : "border-[#D1E5B8] group-hover:border-[#3B6D11]"
                    }`}
                  >
                    {amenities.includes(a) && (
                      <span className="text-white text-[10px] font-bold">✓</span>
                    )}
                  </div>
                  <span className="text-sm text-[#374151]">{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={onApply}
            className="w-full bg-[#3B6D11] hover:bg-[#2d5209] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Apply Filters
          </button>

          {/* Help box */}
          <div className="bg-[#F8FAF6] border border-[#E8F0DC] rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-[#EAF3DE] rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-[#3B6D11]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C1C1C]">Need Help?</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Our property experts are here to help you.
                </p>
              </div>
            </div>
            <Link
              href="/agents"
              className="flex items-center justify-center gap-2 w-full border border-[#3B6D11] text-[#3B6D11] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#3B6D11] hover:text-white transition-all"
            >
              Contact Agent <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}