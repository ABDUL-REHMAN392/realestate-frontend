"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { FEATURE_ICONS } from "@/lib/constants";

export default function AmenitiesSection({ features }: { features: string[] }) {
  if (!features.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-[#E2EAD8] rounded-2xl p-5"
    >
      <h2 className="font-bold text-[#1C1C1C] mb-4">Amenities & Features</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {features.map((f) => {
          const Icon = FEATURE_ICONS[f] ?? CheckCircle;
          return (
            <div key={f} className="flex items-center gap-2.5 py-2">
              <div className="w-7 h-7 rounded-lg bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                <Icon className="h-3.5 w-3.5 text-[#3B6D11]" />
              </div>
              <span className="text-sm text-[#374151]">{f}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}