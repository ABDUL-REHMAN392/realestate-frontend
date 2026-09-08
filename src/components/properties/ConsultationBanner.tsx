"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ConsultationBanner() {
  return (
    <div className="mt-12 rounded-3xl overflow-hidden bg-[#1A3A0A] relative">
      <div className="flex items-center gap-8 px-8 py-8 sm:px-12">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Not sure which property
            <br />
            is best for you?
          </h2>
          <p className="text-[#B8D98A] text-sm sm:text-base mb-6">
            Let our experts help you find the perfect property.
          </p>
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 bg-[#3B6D11] hover:bg-[#4a8a16] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Get Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Center image */}
        <div className="hidden sm:flex flex-col items-center relative">
          <img
            src="/property/consultation.png"
            alt="Property"
            className="h-40 sm:h-48 object-contain relative z-10 drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}