"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, X, Users } from "lucide-react";
import { AgentCard, AgentCardSkeleton, type Agent } from "./AgentCard";
import type { AgentFilters } from "./AgentSidebar";

// ─── Sort Dropdown ─────────────────────────────
const SORT_OPTIONS = [
  { value: "rating",     label: "Top Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "listings",   label: "Most Listings" },
  { value: "newest",     label: "Newest" },
];

function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = SORT_OPTIONS.find((o) => o.value === value);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 border border-[#E8F0DC] rounded-xl px-4 py-2 text-sm bg-white text-[#374151] font-medium hover:border-[#3B6D11] transition-colors"
      >
        <span>Sort: {selected?.label ?? "Top Rated"}</span>
        <ChevronDown className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
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
  page, totalPages, onPageChange,
}: {
  page: number; totalPages: number; onPageChange: (p: number) => void;
}) {
  const pages = () => {
    const arr: number[] = [];
    const start = Math.max(1, page - 2);
    const end   = Math.min(totalPages, start + 4);
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

// ─── AgentGrid ─────────────────────────────────
interface AgentGridProps {
  agents: Agent[];
  total: number;
  loading: boolean;
  filters: AgentFilters;
  sortBy: string;
  setSortBy: (v: string) => void;
  clearFilters: () => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function AgentGrid({
  agents, total, loading, filters, sortBy, setSortBy,
  clearFilters, page, totalPages, onPageChange,
}: AgentGridProps) {
  const activeCount = [
    filters.city,
    filters.specialization,
    filters.minExperience,
    filters.minRating,
    filters.isVerified,
  ].filter(Boolean).length;

  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-bold text-[#1C1C1C] text-lg">
          {loading ? (
            <span className="text-[#9CA3AF]">Loading...</span>
          ) : (
            <>
              {total.toLocaleString()}{" "}
              <span className="text-[#3B6D11]">Agents Found</span>
            </>
          )}
        </p>
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      {/* Active filters clear */}
      {activeCount > 0 && (
        <div className="mb-4">
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
          >
            <X className="h-3.5 w-3.5" /> Clear all filters
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <AgentCardSkeleton key={i} />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E8F0DC] rounded-2xl">
          <Users className="h-12 w-12 text-[#D1E5B8] mx-auto mb-3" />
          <p className="font-semibold text-[#374151]">No agents found</p>
          <p className="text-sm text-[#9CA3AF] mt-1">Try changing your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <AgentCard key={agent._id} agent={agent} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}