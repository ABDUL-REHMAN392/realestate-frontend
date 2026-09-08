"use client";

import { BadgeCheck, Users, BarChart3, ShieldCheck } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: BadgeCheck,
    label: "100% Verified Listings",
    sub: "Premium, genuine & updated daily",
  },
  {
    icon: Users,
    label: "Trusted by 50,000+ Users",
    sub: "Pakistan's most trusted platform",
  },
  {
    icon: BarChart3,
    label: "Real-time Price Alerts",
    sub: "Stay updated on latest prices",
  },
  {
    icon: ShieldCheck,
    label: "Secure & Easy Process",
    sub: "Smooth transactions, every time",
  },
];

export function TrustStrip() {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
        <div
          key={label}
          className="bg-white border border-[#E8F0DC] rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
            <Icon className="h-4 w-4 text-[#3B6D11]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1C1C1C]">{label}</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}