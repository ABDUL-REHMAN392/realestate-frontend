"use client";

import Image from "next/image";
import { GitCompare, Star } from "lucide-react";

export function CompareHero() {
  return (
    <>
    <div className="relative bg-white border-b border-[#E2EAD8] overflow-hidden">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 16px 50px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: "32px" }}>

          {/* ── Left: Text ── */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B6D11] bg-[#EAF3DE] px-3 py-1.5 rounded-full mb-4">
              <Star className="h-3 w-3" /> Smart Property Comparison
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                margin: "0 0 16px",
              }}
            >
              Compare{" "}
              <span style={{ color: "#3b6d11" }}>Properties</span>
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.6, margin: "0 0 24px", fontWeight: 400, maxWidth: "460px" }}>
              Compare up to 4 properties side by side — features, prices, and
              locations — to find the perfect one for you.
            </p>
          </div>

          {/* ── Right: Illustration ── */}
          <div className="hidden lg:flex justify-end">
            <div style={{ position: "relative", width: "100%", height: "380px" }}>
              <Image
                src="/compare/hero-illustrate.png"
                alt="Compare properties illustration"
                fill
                className="object-contain object-center"
                priority
                sizes="50vw"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}