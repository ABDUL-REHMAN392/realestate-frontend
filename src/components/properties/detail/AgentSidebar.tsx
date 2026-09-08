"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, BadgeCheck,
  Star, Clock, Bell, ExternalLink, MapPin,
} from "lucide-react";
import { agentApi, favoriteApi } from "@/lib/api";
import { useUser } from "@/store/auth.store";
import { PropertyDetail } from "@/lib/types";
import { formatPrice } from "@/lib/constants";
import MortgageCalculatorWidget from "./MortgageCalculatorWidget";
import BookingSchedule from "./BookingSchedule";
import InquiryForm from "./InquiryForm";

const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-white animate-pulse" />,
});

export default function AgentSidebar({ property }: { property: PropertyDetail }) {
  const user = useUser();
  const router = useRouter();

  const [agentProfile, setAgentProfile] = useState<{
    _id: string; isVerified: boolean; licenseNumber: string;
  } | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [priceAlert, setPriceAlert] = useState(false);

  useEffect(() => {
    agentApi.getAgentByUser(property.owner._id)
      .then(({ data }) => setAgentProfile(data.data.agent))
      .catch(() => {});
  }, [property.owner._id]);

  useEffect(() => {
    if (!user) return;
    favoriteApi.check(property._id)
      .then(({ data }) => setIsFav(data.data.isFavorited))
      .catch(() => {});
  }, [property._id, user]);

  function handleContact(type: "phone" | "whatsapp" | "chat") {
    if (!user) { router.push("/login"); return; }
    if (type === "chat")
      router.push(`/dashboard/chat?userId=${property.owner._id}&propertyId=${property._id}`);
    if (type === "whatsapp")
      window.open(`https://wa.me/${property.owner.phone?.replace(/\D/g, "")}`, "_blank");
    if (type === "phone")
      window.location.href = `tel:${property.owner.phone}`;
  }

  const isOwner =
    user &&
    ((user as unknown as { id?: string })?.id === property.owner._id ||
      (user as unknown as { _id?: string })?._id === property.owner._id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-4"
    >
      {/* ── Price Card ── */}
      <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5">
        <p className="text-3xl font-bold text-[#3B6D11] mb-1">
          {formatPrice(property.price)}
          {property.purpose === "rent" && (
            <span className="text-base font-normal text-[#9CA3AF]">/mo</span>
          )}
        </p>
        <p className="text-xs text-[#9CA3AF] mb-4">Demand (Negotiable)</p>

        {/* Quick specs */}
        <div className="grid grid-cols-3 gap-2 mb-5 pb-5 border-b border-[#E2EAD8]">
          {[
            { label: "Area",  val: `${property.area} ${property.areaUnit}` },
            property.bedrooms  !== undefined && { label: "Beds",  val: `${property.bedrooms} Beds` },
            property.bathrooms !== undefined && { label: "Baths", val: `${property.bathrooms} Baths` },
            property.parkingSpaces !== undefined && { label: "Cars", val: `${property.parkingSpaces} Cars` },
          ]
            .filter(Boolean)
            .slice(0, 3)
            .map((s: any) => (
              <div key={s.label} className="text-center">
                <p className="text-sm font-bold text-[#1C1C1C]">{s.val}</p>
                <p className="text-xs text-[#9CA3AF]">{s.label}</p>
              </div>
            ))}
        </div>

        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
          Contact Agent
        </p>

        {/* Agent info */}
        <div className="flex items-center gap-3 mb-4">
          {property.owner.photo ? (
            <img
              src={property.owner.photo} alt={property.owner.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C0DD97]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#3B6D11] flex items-center justify-center text-white font-bold">
              {property.owner.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-[#1C1C1C]">{property.owner.name}</p>
            <p className="text-xs text-[#9CA3AF]">{property.owner.title ?? "Property Consultant"}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-[#374151]">
                {(property.owner.rating ?? 4.8).toFixed(1)}
              </span>
              {agentProfile?.isVerified && (
                <span className="ml-1 flex items-center gap-0.5 text-xs text-[#3B6D11]">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          {property.owner.phone && (
            <button
              onClick={() => handleContact("phone")}
              className="w-full flex items-center justify-center gap-2 bg-[#3B6D11] hover:bg-[#2d5409] text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <Phone className="h-4 w-4" /> Call Now
            </button>
          )}
          {property.owner.phone && (
            <button
              onClick={() => handleContact("whatsapp")}
              className="w-full flex items-center justify-center gap-2 border-2 border-green-500 text-green-700 hover:bg-green-50 font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </button>
          )}
          <button
            onClick={() => handleContact("chat")}
            className="w-full flex items-center justify-center gap-2 border border-[#E2EAD8] hover:border-[#3B6D11] text-[#374151] hover:text-[#3B6D11] font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Send Message
          </button>
        </div>

        <p className="text-xs text-[#9CA3AF] text-center mt-3 flex items-center justify-center gap-1">
          <Clock className="h-3 w-3" />
          {property.owner.responseTime ?? "Typically replies within a few minutes"}
        </p>
      </div>

      {/* ── Price Alert ── */}
      <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#1C1C1C] mb-1">Interested in this property?</p>
        <p className="text-xs text-[#9CA3AF] mb-3">
          Turn on price alerts and get notified when the price changes.
        </p>
        <button
          onClick={() => { if (!user) { router.push("/login"); return; } setPriceAlert(!priceAlert); }}
          className={`flex items-center justify-center gap-2 w-full border font-semibold text-sm py-2.5 rounded-xl transition-all ${
            priceAlert
              ? "bg-[#EAF3DE] border-[#3B6D11] text-[#3B6D11]"
              : "border-[#E2EAD8] text-[#374151] hover:border-[#3B6D11] hover:text-[#3B6D11]"
          }`}
        >
          <Bell className={`h-4 w-4 ${priceAlert ? "fill-[#3B6D11]" : ""}`} />
          {priceAlert ? "Alert Set!" : "Set Price Alert"}
        </button>
      </div>

      {/* ── Location Card ── */}
      <div className="bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2EAD8]">
          <p className="text-sm font-bold text-[#1C1C1C]">Location</p>
          <button className="flex items-center gap-1 text-xs text-[#3B6D11] font-medium hover:underline">
            <ExternalLink className="h-3 w-3" /> View on Map
          </button>
        </div>
        {property.location?.coordinates ? (
          <div className="h-36">
            <PropertyMap
              lat={property.location.coordinates[1]}
              lng={property.location.coordinates[0]}
              title={property.title}
              address={property.address.city}
              price={formatPrice(property.price)}
            />
          </div>
        ) : (
          <div className="h-36 bg-white flex items-center justify-center border-b border-[#E2EAD8]">
            <MapPin className="h-8 w-8 text-[#3B6D11] opacity-40" />
          </div>
        )}
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-[#1C1C1C]">
            {property.address.city}, {property.address.state}
          </p>
          {property.address.street && (
            <p className="text-xs text-[#9CA3AF] mt-0.5">Near {property.address.street}</p>
          )}
          {property.address.nearbyDescription && (
            <p className="text-xs text-[#6B7280] mt-1">{property.address.nearbyDescription}</p>
          )}
        </div>
      </div>

      {/* ── Help & Support ── */}
      <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5">
        <p className="text-sm font-bold text-[#1C1C1C] mb-1">Help & Support</p>
        <p className="text-xs text-[#9CA3AF] mb-3">Need help with this property?</p>
        <button className="flex items-center justify-center gap-2 w-full border border-[#E2EAD8] hover:border-[#3B6D11] text-sm font-semibold text-[#374151] hover:text-[#3B6D11] py-2.5 rounded-xl transition-all">
          Contact Support
        </button>
      </div>

      {/* ── Mortgage Calculator ── */}
      <MortgageCalculatorWidget propertyPrice={property.price} />

      {/* ── Booking & Inquiry ── */}
      {!isOwner && (
        <>
          <BookingSchedule
            propertyId={property._id}
            agentId={property.owner._id}
            propertyTitle={property.title}
          />
          <InquiryForm propertyId={property._id} agentId={property.owner._id} />
        </>
      )}
    </motion.div>
  );
}