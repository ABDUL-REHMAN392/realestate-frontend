"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Camera, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  images: { url: string; isPrimary: boolean; order: number }[];
}

export default function ImageGallery({ images }: Props) {
  const sorted = [...images]
    .sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : a.order - b.order))
    .slice(0, 6);

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (sorted.length === 0) {
    return (
      <div className="aspect-[16/9] bg-white rounded-2xl flex items-center justify-center border border-[#E2EAD8]">
        <Building2 className="h-16 w-16 text-[#D1E5B8]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      {/* Main image */}
      <div
        className="relative aspect-[16/9] bg-white rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => setLightbox(true)}
      >
        <img src={sorted[active].url} alt="Property" className="w-full h-full object-cover" />

        <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
          <Camera className="h-3 w-3" /> {active + 1} / {sorted.length}
        </span>

        {sorted.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((a) => (a === 0 ? sorted.length - 1 : a - 1)); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-[#374151]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((a) => (a === sorted.length - 1 ? 0 : a + 1)); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-[#374151]" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2">
          {sorted.slice(0, 5).map((img, i) => (
            <button
              key={i} onClick={() => setActive(i)}
              className={`relative flex-1 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                active === i ? "border-[#3B6D11]" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
          {sorted.length > 5 && (
            <button
              onClick={() => setActive(5)}
              className={`relative flex-1 aspect-[4/3] rounded-xl overflow-hidden border-2 ${
                active === 5 ? "border-[#3B6D11]" : "border-transparent opacity-70"
              }`}
            >
              <img src={sorted[5].url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-bold">+{images.length - 5} More</span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(false)}>
            <X className="h-8 w-8" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setActive((a) => (a === 0 ? sorted.length - 1 : a - 1)); }}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <img
            src={sorted[active].url} alt=""
            className="max-h-[85vh] max-w-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setActive((a) => (a === sorted.length - 1 ? 0 : a + 1)); }}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {sorted.map((_, i) => (
              <button
                key={i} onClick={(e) => { e.stopPropagation(); setActive(i); }}
                className={`w-2 h-2 rounded-full transition-all ${active === i ? "bg-white w-6" : "bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}