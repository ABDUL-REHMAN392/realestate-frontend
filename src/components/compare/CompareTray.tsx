"use client";

import Link from "next/link";
import { X, GitCompare, ChevronRight, Building2 } from "lucide-react";
import { useCompareStore, useCompareItems, useCompareCount } from "@/store/compare.store";
import { fmtShort } from "@/lib/constants";

export function CompareTray() {
  const items  = useCompareItems();
  const count  = useCompareCount();
  const remove = useCompareStore((s) => s.remove);
  const clear  = useCompareStore((s) => s.clear);

  if (count === 0) return null;

  const compareUrl = `/compare?${items.map((i) => `id=${i._id}`).join("&")}`;
  const canCompare = count >= 2;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 shadow-2xl">
      {/* Green top border accent */}
      <div className="h-[3px] bg-gradient-to-r from-[#3B6D11] via-[#7BC96F] to-[#3B6D11]" />

      <div className="bg-[#1A2910] border-t border-[#3B6D11]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">

          {/* ── Label ── */}
          <div className="flex-shrink-0 min-w-[110px]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3B6D11]/40 flex items-center justify-center">
                <GitCompare className="h-3.5 w-3.5 text-[#7BC96F]" />
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight">
                  Compare{" "}
                  <span className="text-[#7BC96F]">({count}/4)</span>
                </p>
                <p className="text-[#6B7280] text-[10px]">
                  {!canCompare
                    ? `${2 - count} aur add karo`
                    : "Ready!"}
                </p>
              </div>
            </div>
          </div>

          {/* ── Property Thumbnails ── */}
          <div className="flex-1 flex items-end gap-3 overflow-x-auto">
            {items.map((item) => (
              <div key={item._id} className="relative flex-shrink-0 group/thumb">
                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#3B6D11]/60 bg-[#2A3E18]">
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-[#3B6D11]/50" />
                    </div>
                  )}
                </div>
                <div className="mt-1 w-14">
                  <p className="text-[9px] text-[#9CA3AF] truncate text-center leading-tight">
                    {item.title.split(" ").slice(0, 3).join(" ")}
                  </p>
                  <p className="text-[9px] text-[#7BC96F] font-bold text-center">
                    {fmtShort(item.price)}
                  </p>
                </div>
                {/* Remove button */}
                <button
                  onClick={() => remove(item._id)}
                  className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 w-[18px] h-[18px] bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-md"
                  title="Remove"
                >
                  <X className="h-2.5 w-2.5 text-white" />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {count < 4 && Array.from({ length: Math.max(0, 2 - count) }).map((_, i) => (
              <div
                key={`slot-${i}`}
                className="w-14 h-14 rounded-xl border-2 border-dashed border-[#3B6D11]/25 flex items-center justify-center flex-shrink-0"
              >
                <span className="text-[#3B6D11]/30 text-xl font-light">+</span>
              </div>
            ))}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clear}
              className="text-[11px] text-[#6B7280] hover:text-white transition-colors px-2 py-1.5"
            >
              Clear All
            </button>
            <Link
              href={canCompare ? compareUrl : "#"}
              onClick={(e) => !canCompare && e.preventDefault()}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                canCompare
                  ? "bg-[#3B6D11] hover:bg-[#4a8a16] text-white shadow-lg shadow-[#3B6D11]/30"
                  : "bg-[#3B6D11]/20 text-white/30 cursor-not-allowed"
              }`}
            >
              Compare Now
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
