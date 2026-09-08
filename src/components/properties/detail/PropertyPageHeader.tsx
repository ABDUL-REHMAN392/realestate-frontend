"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Heart, GitCompare, Star, MapPin } from "lucide-react";
import { favoriteApi } from "@/lib/api";
import { useUser } from "@/store/auth.store";
import { useCompareStore, useHasCompare } from "@/store/compare.store";
import { PropertyDetail } from "@/lib/types";
import { formatPrice } from "@/lib/constants";
import SocialShare from "./SocialShare";

export default function PropertyPageHeader({ property }: { property: PropertyDetail }) {
  const user   = useUser();
  const router = useRouter();

  // ── Favorite state ──────────────────────────────────────────────────────────
  const [isFav,   setIsFav]   = useState(false);
  const [favLoad, setFavLoad] = useState(false);

  useEffect(() => {
    if (!user) return;
    favoriteApi
      .check(property._id)
      .then(({ data }) => setIsFav(data.data?.isFavorited ?? false))
      .catch(() => {});
  }, [property._id, user]);

  async function toggleFav() {
    if (!user) { router.push("/login"); return; }
    setFavLoad(true);
    try {
      const { data } = await favoriteApi.toggle(property._id);
      setIsFav(data.data?.added ?? !isFav);
    } catch { /**/ }
    finally { setFavLoad(false); }
  }

  // ── Compare store ───────────────────────────────────────────────────────────
  const inCompare = useHasCompare(property._id);
  const isFull    = useCompareStore((s) => s.isFull());
  const toggle    = useCompareStore((s) => s.toggle);

  function handleCompare() {
    const cover = property.images?.find((i) => i.isPrimary)?.url
      ?? property.images?.[0]?.url
      ?? null;
    toggle({
      _id:   property._id,
      title: property.title,
      cover,
      price: property.price,
      city:  property.address.city,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 mb-4"
    >
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#3B6D11]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/properties" className="hover:text-[#3B6D11]">Buy</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/properties?city=${property.address.city}`} className="hover:text-[#3B6D11]">
            {property.address.city}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#374151] truncate max-w-[200px]">{property.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <SocialShare title={property.title} price={formatPrice(property.price)} />

          {/* ── Favorite button — with real saved state ── */}
          <button
            onClick={toggleFav}
            disabled={favLoad}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all bg-white disabled:opacity-50
              ${isFav
                ? "border-red-200 text-red-500 bg-red-50"
                : "border-[#E2EAD8] text-[#6B7280] hover:border-red-200 hover:text-red-500"
              }`}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
            {isFav ? "Saved" : "Save"}
          </button>

          {/* ── Compare button — store toggle ── */}
          <button
            onClick={handleCompare}
            disabled={!inCompare && isFull}
            title={
              inCompare ? "Compare se hataao"
              : isFull  ? "Max 4 properties already selected"
              :            "Compare mein add karo"
            }
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all disabled:opacity-50
              ${inCompare
                ? "border-[#3B6D11] bg-[#3B6D11] text-white"
                : "border-[#C0DD97] bg-[#EAF3DE] text-[#3B6D11] hover:bg-[#D4EBB8]"
              }`}
          >
            <GitCompare className="h-4 w-4" />
            {inCompare ? "Added ✓" : "Compare"}
          </button>
        </div>
      </div>

      {/* Title row */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {property.isFeatured && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#3B6D11] text-white">
              Featured
            </span>
          )}
          {property.isNew && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600 text-white">
              New
            </span>
          )}
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            property.purpose === "sale" ? "bg-[#EAF3DE] text-[#3B6D11]" : "bg-blue-50 text-blue-600"
          }`}>
            {property.purpose === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-2">{property.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#3B6D11]" />
            {property.address.city}, {property.address.state}
          </span>
          {(property.rating ?? 4.8) > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-[#374151]">
                {(property.rating ?? 4.8).toFixed(1)}
              </span>
              <span className="text-[#9CA3AF]">
                ({property.reviewCount ?? 120} Reviews)
              </span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}