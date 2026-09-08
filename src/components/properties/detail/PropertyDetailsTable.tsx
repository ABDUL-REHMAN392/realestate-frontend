"use client";

import { motion } from "framer-motion";
import {
  Maximize2, Bed, Bath, Utensils, Tv, Sofa,
  Car, Layers, Calendar, Navigation, Home, Building2,
} from "lucide-react";
import { PropertyDetail } from "@/lib/types";
import { TYPE_ICONS } from "@/lib/constants";

export default function PropertyDetailsTable({ property }: { property: PropertyDetail }) {
  const TypeIcon = TYPE_ICONS[property.type] ?? Building2;

  const rows = [
    { icon: TypeIcon,   label: "Property Type", value: property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : "—" },
    { icon: Maximize2,  label: "Area",           value: `${property.area} ${property.areaUnit}` },
    { icon: Bed,        label: "Bedrooms",       value: property.bedrooms ?? "—" },
    { icon: Bath,       label: "Bathrooms",      value: property.bathrooms ?? "—" },
    { icon: Utensils,   label: "Kitchens",       value: property.kitchens ?? "—" },
    { icon: Tv,         label: "TV Lounge",      value: property.tvLounge ?? "—" },
    { icon: Sofa,       label: "Drawing Room",   value: property.drawingRoom ?? "—" },
    { icon: Utensils,   label: "Dining Room",    value: property.diningRoom ?? "—" },
    { icon: Car,        label: "Parking",        value: property.parkingSpaces ? `${property.parkingSpaces} Cars` : "—" },
    { icon: Layers,     label: "Floors",         value: property.totalFloors ?? "—" },
    { icon: Calendar,   label: "Year Built",     value: property.yearBuilt ?? "—" },
    { icon: Navigation, label: "Facing",         value: property.facing ?? "—" },
    { icon: Sofa,       label: "Furnished",      value: property.furnished ?? "—" },
    { icon: Home,       label: "Property ID",    value: property.propertyId ?? property._id.slice(-8).toUpperCase() },
  ].filter(
    (r) => r.value !== "—" || ["Property Type", "Area", "Bedrooms", "Bathrooms"].includes(r.label)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-[#E2EAD8]">
        <h2 className="font-bold text-[#1C1C1C]">Property Details</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0">
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className={`flex items-center gap-3 px-5 py-3.5 bg-white
                ${i % 3 !== 2 ? "sm:border-r border-[#E2EAD8]" : ""}
                ${Math.floor(i / 3) > 0 ? "border-t border-[#E2EAD8]" : ""}
              `}
            >
              <div className="w-8 h-8 rounded-lg bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                <Icon className="h-3.5 w-3.5 text-[#3B6D11]" />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">{row.label}</p>
                <p className="text-sm font-semibold text-[#1C1C1C]">{row.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}