"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import type { Filters } from "@/lib/types";
import { CITIES } from "@/lib/constants";

interface HeroSectionProps {
  filters: Filters;
  updateFilter: (k: string, v: string) => void;
  onSearch: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

// ─── Custom Dropdown ───────────────────────────
interface DropdownOption {
  value: string;
  label: string;
}

function CustomDropdown({
  label,
  value,
  options,
  placeholder,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  placeholder: string;
  icon?: React.ReactNode;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value && o.value !== "");

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <label className="text-sm font-semibold text-[#1F2937] mb-2 block">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-2 bg-[#F9FAFB] hover:bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#6B7280] text-sm focus:outline-none cursor-pointer py-3 px-4 transition-all rounded-lg"
      >
        <div className="flex items-center gap-2 truncate">
           {icon && <span className="text-[#3B6D11]">{icon}</span>}
           <span className={selected ? "text-[#1C1C1C] font-medium truncate" : "truncate"}>
              {selected ? selected.label : placeholder}
            </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#9CA3AF] flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-[220px] overflow-y-auto py-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  value === opt.value
                    ? "bg-[#EAF3DE] text-[#3B6D11] font-semibold"
                    : "text-[#374151] hover:bg-[#F8FAF6]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HeroSection ──────────────────────────────
export function HeroSection({
  filters,
  updateFilter,
  onSearch,
  onToggleSidebar,
  sidebarOpen,
}: HeroSectionProps) {
  const cityOptions: DropdownOption[] = [
    { value: "", label: "City, Area or Landmark" },
    ...CITIES.map((c) => ({ value: c, label: c })),
  ];
  const typeOptions: DropdownOption[] = [
    { value: "", label: "All Types" },
    ...["house", "apartment", "plot", "commercial", "villa"].map((t) => ({
      value: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    })),
  ];
  const priceOptions: DropdownOption[] = [
    { value: "", label: "Any Price" },
    { value: "5000000", label: "Up to 50 Lac" },
    { value: "10000000", label: "Up to 1 Crore" },
    { value: "25000000", label: "Up to 2.5 Crore" },
    { value: "50000000", label: "Up to 5 Crore" },
  ];
  const bedroomOptions: DropdownOption[] = [
    { value: "", label: "Any" },
    ...["1", "2", "3", "4", "5"].map((b) => ({ value: b, label: `${b}+` })),
  ];

  return (
    <section className="bg-white relative overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero content row */}
        <div className="flex items-center gap-8 pt-8 pb-6">
          {/* Left: text */}
          <div className="flex-1 max-w-xl flex flex-col justify-center">
            {/* Heading: One line */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#1C1C1C] leading-tight mb-4">
              Find Your Perfect{" "}
              <span className="text-[#2D5A1E] whitespace-nowrap">Property</span>
            </h1>
            
            {/* Description */}
            <p className="text-[#6B7280] text-base leading-relaxed max-w-lg">
              Explore our wide range of properties and find the perfect place
              that fits your lifestyle and budget.
            </p>
          </div>

          {/* Right: house image */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative h-[300px]">
             {/* Removed decorative dots grid completely as requested */}
            <img
              src="/property/herosection.png"
              alt="Modern Property"
              className="h-full w-full max-w-[600px] object-contain relative z-10"
            />
          </div>
        </div>

        {/* Search bar */}
        <div className="pb-8">
          <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-[#F0F0F0] p-2">
            <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#F0F0F0]">
              
              {/* Location */}
              <div className="flex-1 px-4 py-2">
                <CustomDropdown
                  label="Location"
                  value={filters.city}
                  options={cityOptions}
                  placeholder="City, Area or Landmark"
                  icon={<MapPin className="h-4 w-4 text-[#3B6D11]" />}
                  onChange={(v) => updateFilter("city", v)}
                />
              </div>

              {/* Property Type */}
              <div className="flex-1 px-4 py-2">
                <CustomDropdown
                  label="Property Type"
                  value={filters.type}
                  options={typeOptions}
                  placeholder="All Types"
                  onChange={(v) => updateFilter("type", v)}
                />
              </div>

              {/* Price Range */}
              <div className="flex-1 px-4 py-2">
                <CustomDropdown
                  label="Price Range"
                  value={filters.maxPrice}
                  options={priceOptions}
                  placeholder="Any Price"
                  onChange={(v) => updateFilter("maxPrice", v)}
                />
              </div>

              {/* Bedrooms */}
              <div className="flex-1 px-4 py-2">
                <CustomDropdown
                  label="Bedrooms"
                  value={filters.bedrooms}
                  options={bedroomOptions}
                  placeholder="Any"
                  onChange={(v) => updateFilter("bedrooms", v)}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 px-4 py-2">
                <button
                  onClick={onToggleSidebar}
                  className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg border transition-all whitespace-nowrap font-medium ${
                    sidebarOpen
                      ? "bg-[#EAF3DE] text-[#3B6D11] border-[#3B6D11]"
                      : "text-[#6B7280] border-[#E5E7EB] hover:text-[#3B6D11] hover:border-[#3B6D11]"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  More Filters
                </button>
                <button
                  onClick={onSearch}
                  className="flex items-center gap-2 bg-[#2D5A1E] hover:bg-[#244A17] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap shadow-lg shadow-green-900/20"
                >
                  <Search className="h-4 w-4" />
                  Search Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}