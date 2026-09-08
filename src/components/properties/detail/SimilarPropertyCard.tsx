import Link from "next/link";
import { MapPin, Bed, Bath, Maximize2, Heart, Building2 } from "lucide-react";
import { SimilarProperty } from "@/lib/types";
import { TYPE_ICONS, formatPrice } from "@/lib/constants";

export default function SimilarPropertyCard({ prop }: { prop: SimilarProperty }) {
  const cover = prop.images.find((i) => i.isPrimary)?.url ?? prop.images[0]?.url;
  const TypeIcon = TYPE_ICONS[prop.type] ?? Building2;

  return (
    <Link
      href={`/properties/${prop._id}`}
      className="bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#3B6D11]/30 transition-all group"
    >
      <div className="relative">
        <img
          src={cover || "/property/property-placeholder.png"}
          alt={prop.title}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.src = "/property/property-placeholder.png"; }}
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {prop.isFeatured && (
            <span className="bg-[#3B6D11] text-white text-xs font-semibold px-2 py-0.5 rounded-full">Featured</span>
          )}
          {prop.isNew && (
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">New</span>
          )}
          {prop.isHotDeal && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Hot Deal</span>
          )}
        </div>
        <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <Heart className="h-3.5 w-3.5 text-[#6B7280]" />
        </button>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-[#1C1C1C] line-clamp-2 mb-1 leading-snug">
          {prop.title}
        </h3>
        <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mb-2">
          <MapPin className="h-3 w-3" />
          {prop.address.city}, {prop.address.state}
        </p>
        <p className="text-base font-bold text-[#1C1C1C] mb-2">
          {formatPrice(prop.price)}
          {prop.purpose === "rent" && (
            <span className="text-xs font-normal text-[#9CA3AF]">/mo</span>
          )}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#6B7280]">
          {prop.bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="h-3 w-3 text-[#3B6D11]" />{prop.bedrooms} Beds
            </span>
          )}
          {prop.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="h-3 w-3 text-[#3B6D11]" />{prop.bathrooms} Baths
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 className="h-3 w-3 text-[#3B6D11]" />{prop.area} {prop.areaUnit}
          </span>
        </div>
      </div>
    </Link>
  );
}