// components/homepage/FeaturedProperties.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Star, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { PropCard, Property } from "./PropCard";

interface FeaturedPropertiesProps {
  properties: Property[];
  loading: boolean;
}

export function FeaturedProperties({ properties, loading }: FeaturedPropertiesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const t = setTimeout(checkScroll, 50);
    return () => clearTimeout(t);
  }, [properties, checkScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        .fp-section {
          background: #ffffff;
          padding: 80px 0 72px;
          overflow: hidden;
          width: 100%;
        }

        /* Header matching Testimonials max-width 1160px */
        .fp-head {
          max-width: 1160px;
          margin: 0 auto 36px;
          padding: 0 24px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }

        .fp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #f59e0b;
          margin-bottom: 8px;
        }
        .fp-eyebrow-icon { width: 12px; height: 12px; fill: #f59e0b; color: #f59e0b; }
        .fp-title { font-size: clamp(22px, 3vw, 32px); font-weight: 800; color: #0a0a0a; letter-spacing: -0.02em; line-height: 1.15; margin: 0; }
        .fp-sub { font-size: 14px; color: #6b7280; margin: 6px 0 0; }

        .fp-head-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .fp-nav-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid #c0dd97; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s; color: #3b6d11;
          padding: 0;
        }
        .fp-nav-btn:hover:not(:disabled) { background: #f0f7e8; border-color: #3b6d11; }
        .fp-nav-btn:disabled { opacity: 0.3; cursor: default; }

        .fp-view-all {
          display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700;
          color: #3b6d11; text-decoration: none; white-space: nowrap; padding: 9px 18px;
          border: 1.5px solid #c0dd97; border-radius: 10px; transition: all 0.15s;
        }
        .fp-view-all:hover { background: #f0f7e8; }

        /* Full width row with mask-image matching Testimonials */
        .fp-scroll-outer {
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
        }

        .fp-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px calc(max(24px, (100vw - 1160px) / 2 + 24px)) 16px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .fp-scroll::-webkit-scrollbar { display: none; }
        .fp-scroll > * { scroll-snap-align: start; }

        /* Card width matching Testimonials card (320px) */
        .fp-scroll > .prop-card {
          flex-shrink: 0;
          width: 320px;
        }
        @media (max-width: 640px) {
          .fp-scroll > .prop-card {
            width: 280px;
          }
        }

        /* empty & skeleton */
        .fp-empty {
          max-width: 1160px;
          margin: 0 auto;
          padding: 48px 24px;
          text-align: center;
          background: #fafafa;
          border-radius: 16px;
          border: 1px dashed #e5e7eb;
        }
        .fp-skel-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px calc(max(24px, (100vw - 1160px) / 2 + 24px)) 16px;
        }
        .fp-skel-row::-webkit-scrollbar { display: none; }
        .fp-skel {
          flex-shrink: 0;
          width: 320px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f0f0f0;
        }
        @media (max-width: 640px) {
          .fp-skel {
            width: 280px;
          }
        }
        .fp-sk { background: linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%); background-size: 200% 100%; animation: fp-shimmer 1.4s infinite; }
        @keyframes fp-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .fp-sk-img { height: 210px; }
        .fp-sk-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
        .fp-sk-line { height: 12px; border-radius: 6px; }
      `}</style>

      <section className="fp-section">
        {/* Header */}
        <div className="fp-head">
          <div>
            <p className="fp-eyebrow">
              <Star className="fp-eyebrow-icon" />
              Hand-picked
            </p>
            <h2 className="fp-title">Featured properties</h2>
            <p className="fp-sub">Top picks curated by our team</p>
          </div>

          <div className="fp-head-right">
            {!loading && properties.length > 0 && (
              <>
                <button
                  className="fp-nav-btn"
                  onClick={() => scroll("left")}
                  disabled={!canLeft}
                  aria-label="Scroll left"
                >
                  <ChevronLeft style={{ width: 17, height: 17 }} />
                </button>
                <button
                  className="fp-nav-btn"
                  onClick={() => scroll("right")}
                  disabled={!canRight}
                  aria-label="Scroll right"
                >
                  <ChevronRight style={{ width: 17, height: 17 }} />
                </button>
              </>
            )}
            <Link href="/properties?isFeatured=true" className="fp-view-all">
              View all <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="fp-scroll-outer">
            <div className="fp-skel-row">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="fp-skel">
                  <div className="fp-sk fp-sk-img" />
                  <div className="fp-sk-body">
                    <div className="fp-sk fp-sk-line" style={{ width: "50%" }} />
                    <div className="fp-sk fp-sk-line" style={{ width: "80%" }} />
                    <div className="fp-sk fp-sk-line" style={{ width: "35%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="fp-empty">
            <Building2 style={{ width: 40, height: 40, color: "#d1d5db", margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>No featured properties yet</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Check back soon</p>
          </div>
        ) : (
          <div className="fp-scroll-outer">
            <div className="fp-scroll" ref={scrollRef}>
              {properties.map((p) => <PropCard key={p._id} prop={p} />)}
            </div>
          </div>
        )}
      </section>
    </>
  );
}