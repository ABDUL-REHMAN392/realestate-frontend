"use client";

import { MapPin, Building2, Star, BadgeCheck } from "lucide-react";

const CITIES = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi",
  "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
];

const SPECIALIZATIONS = [
  "Residential Expert",
  "Rental Specialist",
  "Investment Expert",
  "Luxury Homes",
  "Commercial Expert",
  "First Time Buyer",
];

const EXP_OPTIONS = [
  { label: "1-3 Years",  value: "1" },
  { label: "3-5 Years",  value: "3" },
  { label: "5-10 Years", value: "5" },
  { label: "10+ Years",  value: "10" },
];

export interface AgentFilters {
  city: string;
  specialization: string;
  minExperience: string;
  minRating: string;
  isVerified: string;
}

interface AgentSidebarProps {
  filters: AgentFilters;
  onChange: (k: keyof AgentFilters, v: string) => void;
  onApply: () => void;
}

export function AgentSidebar({ filters, onChange, onApply }: AgentSidebarProps) {
  function clearAll() {
    onChange("city", "");
    onChange("specialization", "");
    onChange("minExperience", "");
    onChange("minRating", "");
    onChange("isVerified", "");
  }

  return (
    <aside className="w-64 flex-shrink-0">
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
          {/* City */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              City
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
            {/* Quick city pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {CITIES.slice(0, 5).map((c) => (
                <button
                  key={c}
                  onClick={() => onChange("city", filters.city === c ? "" : c)}
                  className={`text-[11px] px-2 py-1 rounded-lg border transition-all ${
                    filters.city === c
                      ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                      : "border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Specialization
            </label>
            <div className="space-y-1">
              {SPECIALIZATIONS.map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    onChange("specialization", filters.specialization === s ? "" : s)
                  }
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all ${
                    filters.specialization === s
                      ? "bg-[#EAF3DE] text-[#3B6D11] font-semibold"
                      : "text-[#6B7280] hover:bg-[#F8FAF6]"
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Experience
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {EXP_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    onChange("minExperience", filters.minExperience === opt.value ? "" : opt.value)
                  }
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                    filters.minExperience === opt.value
                      ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                      : "border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Rating */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Minimum Rating
            </label>
            <div className="flex gap-1.5">
              {["3", "3.5", "4", "4.5", "5"].map((r) => (
                <button
                  key={r}
                  onClick={() =>
                    onChange("minRating", filters.minRating === r ? "" : r)
                  }
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-0.5 ${
                    filters.minRating === r
                      ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                      : "border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11]"
                  }`}
                >
                  <Star className="h-2.5 w-2.5" />{r}
                </button>
              ))}
            </div>
          </div>

          {/* Verified only toggle */}
          <div>
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2 block">
              Verification
            </label>
            <button
              onClick={() =>
                onChange("isVerified", filters.isVerified === "true" ? "" : "true")
              }
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                filters.isVerified === "true"
                  ? "bg-[#EAF3DE] text-[#3B6D11] border-[#3B6D11] font-semibold"
                  : "border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11]"
              }`}
            >
              <BadgeCheck className="h-4 w-4 flex-shrink-0" />
              Verified Agents Only
            </button>
          </div>

          {/* Apply */}
          <button
            onClick={onApply}
            className="w-full bg-[#3B6D11] hover:bg-[#2d5209] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}