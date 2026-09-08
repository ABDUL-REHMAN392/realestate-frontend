"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin, Heart, Bed, Bath, Maximize2,
  Building2, GitCompare, Star,
} from "lucide-react";
import { favoriteApi } from "@/lib/api";
import { useUser } from "@/store/auth.store";
import { useCompareStore, useHasCompare } from "@/store/compare.store";
import type { Property } from "@/lib/types";
import { fmtPrice, TYPE_ICONS } from "@/lib/constants";

export function PropertyCard({ prop }: { prop: Property }) {
  const cover    = prop.images.find((i) => i.isPrimary)?.url ?? prop.images[0]?.url;
  const TypeIcon = TYPE_ICONS[prop.type] ?? Building2;
  const user     = useUser();

  // ── Favorites ───────────────────────────────────────────────────────────────
  const [isFav,   setIsFav]   = useState(false);
  const [favLoad, setFavLoad] = useState(false);

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
    setFavLoad(true);
    try {
      const { data } = await favoriteApi.toggle(prop._id);
      setIsFav(data.data?.added ?? !isFav);
    } catch { /* silent */ }
    finally { setFavLoad(false); }
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

  // ── Badges ──────────────────────────────────────────────────────────────────
  const now       = Date.now();
  const created   = new Date(prop.createdAt).getTime();
  const isNew     = now - created < 7 * 24 * 3600_000;
  const isHotDeal = prop.price < 5_000_000 && prop.isFeatured;

  return (
    <Link
      href={`/properties/${prop._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E8F0DC] hover:border-[#B8D98A] hover:shadow-xl hover:shadow-[#3B6D11]/10 transition-all duration-300"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={cover || "/property/property-placeholder.png"}
          alt={prop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = "/property/property-placeholder.png"; }}
        />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {prop.isFeatured && !isHotDeal && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#3B6D11] text-white tracking-wide">Featured</span>
          )}
          {isNew && !prop.isFeatured && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500 text-white tracking-wide">New</span>
          )}
          {isHotDeal && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-500 text-white tracking-wide">Hot Deal</span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={toggleFav}
          disabled={favLoad}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-50"
        >
          <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-[#9CA3AF]"}`} />
        </button>

        {/* ── Compare toggle button ── always visible, colored when active ── */}
        <button
          onClick={handleCompare}
          disabled={!inCompare && isFull}
          title={
            inCompare           ? "Compare se hataao"
            : isFull            ? "Max 4 properties selected"
            :                     "Compare mein add karo"
          }
          className={`absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-md transition-all
            ${inCompare
              ? "bg-[#3B6D11] text-white opacity-100 scale-105"
              : isFull
              ? "bg-white/60 text-[#9CA3AF] cursor-not-allowed opacity-70"
              : "bg-white/90 text-[#3B6D11] opacity-0 group-hover:opacity-100"
            }`}
        >
          <GitCompare className="h-3 w-3" />
          {inCompare ? "Added" : "Compare"}
        </button>

        {/* Type chip */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[#374151] capitalize flex items-center gap-1">
            <TypeIcon className="h-3 w-3" />
            {prop.type}
          </span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-4">
        <h3 className="font-semibold text-[#1C1C1C] text-sm leading-snug line-clamp-2 mb-1 group-hover:text-[#3B6D11] transition-colors">
          {prop.title}
        </h3>
        <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mb-2.5">
          <MapPin className="h-3 w-3 flex-shrink-0 text-[#3B6D11]" />
          {prop.address.street ? `${prop.address.street}, ` : ""}
          {prop.address.city}
        </p>
        <p className="text-lg font-bold text-[#3B6D11] mb-3">
          PKR {fmtPrice(prop.price)}
          {prop.purpose === "rent" && (
            <span className="text-xs font-normal text-[#9CA3AF]">/mo</span>
          )}
        </p>

        <div className="flex items-center gap-3 text-xs text-[#6B7280] mb-3 pb-3 border-b border-[#F0F6E8]">
          {prop.bedrooms !== undefined && (
            <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{prop.bedrooms} Beds</span>
          )}
          {prop.bathrooms !== undefined && (
            <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{prop.bathrooms} Baths</span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Maximize2 className="h-3.5 w-3.5" />
            {prop.area} {prop.areaUnit}
          </span>
        </div>

        {/* Agent row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {prop.owner.photo ? (
              <img src={prop.owner.photo} alt={prop.owner.name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#EAF3DE] flex items-center justify-center text-[#3B6D11] font-bold text-xs">
                {prop.owner.name.charAt(0)}
              </div>
            )}
            <span className="text-xs text-[#6B7280] font-medium">{prop.owner.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {(4.5 + Math.random() * 0.5).toFixed(1)}
          </div>
        </div>

        <button className="mt-3 w-full py-2 rounded-xl border border-[#D4EBB8] text-[#3B6D11] text-xs font-semibold hover:bg-[#3B6D11] hover:text-white transition-all duration-200">
          View Details
        </button>
      </div>
    </Link>
  );
}