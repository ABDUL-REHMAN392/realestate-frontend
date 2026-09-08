"use client";

import { useState, useRef, useEffect } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";
import type { Property, Filters } from "@/lib/types";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { ListCard } from "@/components/properties/ListCard";

// ─── Skeleton ──────────────────────────────────
function PropertySkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0DC] animate-pulse">
      <div className="aspect-[4/3] bg-[#EAF3DE]" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-[#EAF3DE] rounded-lg w-3/4" />
        <div className="h-3 bg-[#EAF3DE] rounded-lg w-1/2" />
        <div className="h-5 bg-[#EAF3DE] rounded-lg w-2/3" />
      </div>
    </div>
  );
}

// ─── Custom Sort Dropdown ──────────────────────
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "views", label: "Most Viewed" },
];

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
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

  const selected = SORT_OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 border border-[#E8F0DC] rounded-xl px-4 py-2 text-sm bg-white text-[#374151] font-medium hover:border-[#3B6D11] transition-colors"
      >
        <span>Sort by: {selected?.label ?? "Newest First"}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
          {SORT_OPTIONS.map((opt) => (
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
      )}
    </div>
  );
}

// ─── Pagination ────────────────────────────────
function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const pages = () => {
    const arr: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2.5 rounded-xl border border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11] disabled:opacity-40 transition bg-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages().map((pg) => (
        <button
          key={pg}
          onClick={() => onPageChange(pg)}
          className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
            page === pg
              ? "bg-[#3B6D11] text-white"
              : "bg-white border border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11]"
          }`}
        >
          {pg}
        </button>
      ))}
      {totalPages > 5 && (
        <>
          <span className="text-[#9CA3AF] px-1">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-xl text-sm font-semibold bg-white border border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11]"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-2.5 rounded-xl border border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11] disabled:opacity-40 transition bg-white"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── PropertyGrid ──────────────────────────────
interface PropertyGridProps {
  properties: Property[];
  total: number;
  loading: boolean;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  filters: Filters;
  updateFilter: (k: string, v: string) => void;
  clearFilters: () => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function PropertyGrid({
  properties,
  total,
  loading,
  viewMode,
  setViewMode,
  filters,
  updateFilter,
  clearFilters,
  page,
  totalPages,
  onPageChange,
}: PropertyGridProps) {
  const activeCount = [
    filters.purpose,
    filters.type,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.bedrooms,
  ].filter(Boolean).length;

  return (
    <div className="flex-1 min-w-0">
      {/* Results header */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-bold text-[#1C1C1C] text-lg">
          {loading ? (
            <span className="text-[#9CA3AF]">Loading...</span>
          ) : (
            <>
              {total.toLocaleString()}{" "}
              <span className="text-[#3B6D11]">Properties Found</span>
            </>
          )}
        </p>

        <div className="flex items-center gap-3">
          {/* Custom Sort */}
          <SortDropdown
            value={filters.sortBy}
            onChange={(v) => updateFilter("sortBy", v)}
          />

          {/* View toggle */}
          <div className="flex border border-[#E8F0DC] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 transition-all ${
                viewMode === "grid"
                  ? "bg-[#3B6D11] text-white"
                  : "text-[#6B7280] hover:bg-[#F8FAF6]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 transition-all ${
                viewMode === "list"
                  ? "bg-[#3B6D11] text-white"
                  : "text-[#6B7280] hover:bg-[#F8FAF6]"
              }`}
            >
              <List className="h-4 w-4" />
            </button>

          </div>
        </div>
      </div>

      {/* Purpose tabs */}
      <div className="flex gap-2 mb-5">
        {(
          [
            ["", "All"],
            ["sale", "For Sale"],
            ["rent", "For Rent"],
          ] as [string, string][]
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => updateFilter("purpose", val)}
            className={`text-sm px-5 py-2 rounded-xl font-semibold transition-all ${
              filters.purpose === val
                ? "bg-[#3B6D11] text-white"
                : "bg-white border border-[#E8F0DC] text-[#6B7280] hover:border-[#3B6D11] hover:text-[#3B6D11]"
            }`}
          >
            {label}
          </button>
        ))}
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
          >
            <X className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E8F0DC] rounded-2xl">
          <Building2 className="h-12 w-12 text-[#D1E5B8] mx-auto mb-3" />
          <p className="font-semibold text-[#374151]">No properties found</p>
          <p className="text-sm text-[#9CA3AF] mt-1">Try changing your filters</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              : "flex flex-col gap-4"
          }
        >
          {properties.map((prop) =>
            viewMode === "grid" ? (
              <PropertyCard key={prop._id} prop={prop} />
            ) : (
              <ListCard key={prop._id} prop={prop} />
            ),
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}