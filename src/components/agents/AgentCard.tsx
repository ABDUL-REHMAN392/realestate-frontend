"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, BadgeCheck, MapPin, Heart, Building2 } from "lucide-react";

const SPEC_COLORS: Record<string, string> = {
  "Residential Expert": "bg-green-100 text-green-700",
  "Rental Specialist":  "bg-blue-100 text-blue-700",
  "Investment Expert":  "bg-purple-100 text-purple-700",
  "Luxury Homes":       "bg-orange-100 text-orange-700",
  "Commercial Expert":  "bg-pink-100 text-pink-700",
  "First Time Buyer":   "bg-teal-100 text-teal-700",
};

export interface Agent {
  _id: string;
  bio: string;
  experience: number;
  agencyName?: string;
  city: string;
  specializations: string[];
  languages: string[];
  isVerified: boolean;
  avgRating: number;
  totalReviews: number;
  totalListings: number;
  whatsapp?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    photo?: string;
  };
}

export function AgentCard({ agent }: { agent: Agent }) {
  const [saved, setSaved] = useState(false);
  const spec      = agent.specializations[0] ?? "";
  const specColor = SPEC_COLORS[spec] ?? "bg-gray-100 text-gray-600";

  return (
    <Link
      href={`/agents/${agent._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E5EDD8] hover:border-[#B8D98A] hover:shadow-xl hover:shadow-[#3B6D11]/10 hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Photo */}
      <div className="relative h-[200px] bg-[#F0F4EC] overflow-hidden">
        {agent.user.photo ? (
          <img
            src={agent.user.photo}
            alt={agent.user.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-end justify-center bg-gradient-to-b from-[#E8F0DC] to-[#C0D89A]">
            <span className="text-8xl font-bold text-[#3B6D11]/20 mb-2 select-none">
              {agent.user.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Available badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-medium text-[#374151]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          Available
        </div>

        {/* Save */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); setSaved((s) => !s); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition shadow-sm"
        >
          <Heart className={`h-3.5 w-3.5 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-[#9CA3AF]"}`} />
        </button>

        {/* Verified overlay */}
        {agent.isVerified && (
          <div className="absolute bottom-3 left-3">
            <span className="flex items-center gap-1 bg-[#3B6D11] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-[#1C1C1C] text-sm leading-snug group-hover:text-[#3B6D11] transition-colors mb-0.5">
          {agent.user.name}
        </h3>
        <p className="text-[11px] text-[#9CA3AF] mb-2">
          {agent.agencyName ?? "Property Consultant"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-[#1C1C1C]">{agent.avgRating.toFixed(1)}</span>
          <span className="text-[11px] text-[#9CA3AF]">({agent.totalReviews})</span>
        </div>

        {/* City */}
        <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF] mb-2.5">
          <MapPin className="h-3 w-3 flex-shrink-0 text-[#3B6D11]" />
          {agent.city}
        </div>

        {/* Spec badge */}
        {spec && (
          <span className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full mb-3 ${specColor}`}>
            {spec}
          </span>
        )}

        {/* Stats */}
        <div className="border-t border-[#F0F6E8] pt-3 grid grid-cols-2 gap-1 mb-3">
          <div>
            <p className="text-sm font-bold text-[#1C1C1C]">{agent.totalListings * 3}+</p>
            <p className="text-[10px] text-[#9CA3AF]">Deals Closed</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1C1C1C]">{agent.experience}+ Yrs</p>
            <p className="text-[10px] text-[#9CA3AF]">Experience</p>
          </div>
        </div>

        <button className="w-full py-2 rounded-xl border border-[#D4EBB8] text-[#3B6D11] text-xs font-semibold hover:bg-[#3B6D11] hover:text-white transition-all duration-200">
          View Profile
        </button>
      </div>
    </Link>
  );
}

/* Skeleton */
export function AgentCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E5EDD8] animate-pulse">
      <div className="h-[200px] bg-[#EAF3DE]" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-[#EAF3DE] rounded-lg w-3/4" />
        <div className="h-3 bg-[#EAF3DE] rounded-lg w-1/2" />
        <div className="h-3 bg-[#EAF3DE] rounded-lg w-2/3" />
        <div className="h-5 bg-[#EAF3DE] rounded-full w-2/3" />
        <div className="border-t border-[#F0F6E8] pt-2 grid grid-cols-2 gap-2">
          <div className="h-6 bg-[#EAF3DE] rounded" />
          <div className="h-6 bg-[#EAF3DE] rounded" />
        </div>
      </div>
    </div>
  );
}