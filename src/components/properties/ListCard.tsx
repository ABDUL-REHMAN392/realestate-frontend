"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin, Heart, Bed, Bath, Maximize2,
  Building2, GitCompare,
} from "lucide-react";
import { favoriteApi } from "@/lib/api";
import { useUser } from "@/store/auth.store";
import { useCompareStore, useHasCompare } from "@/store/compare.store";
import type { Property } from "@/lib/types";
import { fmtPrice, TYPE_ICONS } from "@/lib/constants";

export function ListCard({ prop }: { prop: Property }) {
  const cover    = prop.images.find((i) => i.isPrimary)?.url ?? prop.images[0]?.url;
  const TypeIcon = TYPE_ICONS[prop.type] ?? Building2;
  const user     = useUser();

  // ── Favorites ───────────────────────────────────────────────────────────────
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (!user) return;
    favoriteApi
      .check(prop._id)
      .then(({ data }) => setIsFav(data.data?.isFavorited ?? false))
      .catch(() => {});
  }, [prop._id, user]);

  async function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { window.location.href = "/login"; return; }
    try {
      const { data } = await favoriteApi.toggle(prop._id);
      setIsFav(data.data?.added ?? !isFav);
    } catch { /* silent */ }
  }

  // ── Compare (Zustand store) ──────────────────────────────────────────────────
  const inCompare = useHasCompare(prop._id);
  const isFull    = useCompareStore((s) => s.isFull());
  const toggle    = useCompareStore((s) => s.toggle);

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle({
      _id:   prop._id,
      title: prop.title,
      cover: cover ?? null,
      price: prop.price,
      city:  prop.address.city,
    });
  }

  return (
    <Link
      href={`/properties/${prop._id}`}
      className="group bg-white border border-[#E8F0DC] rounded-2xl overflow-hidden hover:border-[#B8D98A] hover:shadow-lg transition-all flex"
    >
      {/* ── Image ── */}
      <div className="relative w-52 flex-shrink-0">
        <img
          src={cover || "/property/property-placeholder.png"}
          alt={prop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = "/property/property-placeholder.png"; }}
        />
        <button
          onClick={toggleFav}
          className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-red-500 text-red-500" : "text-[#9CA3AF]"}`} />
        </button>
        {prop.isFeatured && (
          <span className="absolute top-3 left-3 text-[10px] font-bold bg-[#3B6D11] text-white px-2 py-0.5 rounded-md">
            Featured
          </span>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#3B6D11] transition-colors">
            {prop.title}
          </h3>
          <p className="text-xl font-bold text-[#3B6D11] flex-shrink-0">
            PKR {fmtPrice(prop.price)}
            {prop.purpose === "rent" && (
              <span className="text-xs font-normal text-[#9CA3AF]">/mo</span>
            )}
          </p>
        </div>

        <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mb-3">
          <MapPin className="h-3 w-3 text-[#3B6D11]" />
          {prop.address.city}, {prop.address.state}
        </p>

        <div className="flex items-center gap-4 text-xs text-[#6B7280] mt-auto pt-3 border-t border-[#F0F6E8]">
          <span className="flex items-center gap-1 capitalize">
            <TypeIcon className="h-3.5 w-3.5" />{prop.type}
          </span>
          {prop.bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />{prop.bedrooms} Beds
            </span>
          )}
          {prop.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />{prop.bathrooms} Baths
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5" />{prop.area} {prop.areaUnit}
          </span>

          {/* ── Compare button in list card ── */}
          <button
            onClick={handleCompare}
            disabled={!inCompare && isFull}
            title={
              inCompare ? "Compare se hataao"
              : isFull  ? "Max 4 properties"
              :            "Compare mein add karo"
            }
            className={`ml-auto flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-lg transition-all text-[11px]
              ${inCompare
                ? "bg-[#3B6D11] text-white"
                : isFull
                ? "text-[#9CA3AF] cursor-not-allowed"
                : "text-[#3B6D11] hover:bg-[#EAF3DE]"
              }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            {inCompare ? "Added ✓" : "Compare"}
          </button>
        </div>
      </div>
    </Link>
  );
}