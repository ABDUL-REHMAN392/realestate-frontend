"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-10 overflow-hidden">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10">

        {/* ───── LEFT SIDE ───── */}
        <motion.div
          className="flex-1 flex flex-col items-start gap-6"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Oops heading */}
          <div>
            <p className="text-[#2d6a2d] font-semibold text-lg mb-1">
              Oops! Page Not Found
            </p>
            <div className="w-10 h-[3px] bg-[#2d6a2d] rounded-full" />
          </div>

          {/* 404 — 4 text + arch image + 4 text */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* 4 - left */}
            <span
              className="text-[130px] md:text-[160px] font-black text-gray-900 leading-none select-none"
              style={{ fontFamily: "Arial Black, sans-serif" }}
            >
              4
            </span>

            {/* Arch/Door Image - middle (0 ki jagah) */}
            <div className="w-[100px] md:w-[130px] mx-[-8px] mt-4">
              <Image
                src="/not-found/404.png"
                alt="0"
                width={130}
                height={160}
                className="object-contain"
                priority
              />
            </div>

            {/* 4 - right */}
            <span
              className="text-[130px] md:text-[160px] font-black text-gray-900 leading-none select-none"
              style={{ fontFamily: "Arial Black, sans-serif" }}
            >
              4
            </span>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              We can't seem to find <br />
              the page you're looking for.
            </h1>
            <p className="text-gray-500 text-sm max-w-sm">
              The page you requested might have been moved, deleted,
              or never existed in the first place.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <Link href="/">
              <button className="flex items-center gap-2 bg-[#2d6a2d] hover:bg-[#245724] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg">
                <Home size={16} />
                Back to Home
              </button>
            </Link>

            <Link href="/properties">
              <button className="flex items-center gap-2 border-2 border-[#2d6a2d] text-[#2d6a2d] hover:bg-[#2d6a2d] hover:text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300">
                Browse Properties
              </button>
            </Link>
          </motion.div>
        </motion.div>

{/* ───── RIGHT SIDE ───── */}
<motion.div
  className="flex-1 flex justify-center items-center"
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
>
  <div
    className="relative"
    style={{
      WebkitMaskImage: `radial-gradient(ellipse 85% 85% at 50% 50%, black 25%, rgba(0,0,0,0.3) 65%, transparent 100%)`,
      maskImage: `radial-gradient(ellipse 85% 85% at 50% 50%, black 25%, rgba(0,0,0,0.3) 65%, transparent 100%)`,
    }}
  >
    <Image
      src="/not-found/house-sign.png"
      alt="House with direction signs"
      width={600}
      height={500}
      className="object-contain"
      priority
    />
  </div>
</motion.div>
      </div>
    </div>
  );
}