"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function SellPropertyBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-[#1C2B0E] rounded-2xl overflow-hidden"
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 px-8 py-10">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2 leading-snug">
            Looking to sell your property?
          </h3>
          <p className="text-sm text-white/60 mb-6 max-w-sm">
            List your property on GharFind and reach thousands of verified buyers.
          </p>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 bg-[#3B6D11] hover:bg-[#4a8a16] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            List Your Property <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex-shrink-0 w-64 h-48 hidden md:block">
          <Image
            src="/property/sell.png"
            alt="Sell Your Property"
            width={256} height={192}
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
    </motion.div>
  );
}