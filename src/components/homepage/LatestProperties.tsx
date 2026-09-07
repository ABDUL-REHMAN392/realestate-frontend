// components/LatestProperties.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Building2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { PropCard, Property } from "./PropCard";

interface LatestPropertiesProps {
  properties: Property[];
  loading: boolean;
}

export function LatestProperties({ properties, loading }: LatestPropertiesProps) {
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
        .latest-section {
          background: #ffffff;
          padding: 80px 0 72px;
          overflow: hidden;
          width: 100%;
        }

        /* Header matching Testimonials max-width 1160px */
        .latest-head {
          max-width: 1160px;
          margin: 0 auto 36px;
          padding: 0 24px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }

        .latest-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #3b6d11;
          margin-bottom: 8px;
        }
        .latest-title { font-size: clamp(22px, 3vw, 32px); font-weight: 800; color: #0a0a0a; letter-spacing: -0.02em; line-height: 1.15; margin: 0; }
        .latest-sub { font-size: 14px; color: #6b7280; margin: 6px 0 0; }

        .latest-head-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .latest-nav-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid #c0dd97; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s; color: #3b6d11;
          padding: 0;
        }
        .latest-nav-btn:hover:not(:disabled) { background: #f0f7e8; border-color: #3b6d11; }
        .latest-nav-btn:disabled { opacity: 0.3; cursor: default; }

        .latest-view-all {
          display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700;
          color: #3b6d11; text-decoration: none; white-space: nowrap; padding: 9px 18px;
          border: 1.5px solid #c0dd97; border-radius: 10px; transition: all 0.15s;
        }
        .latest-view-all:hover { background: #f0f7e8; }

        /* Full width row with mask-image matching Testimonials */
        .latest-scroll-outer {
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

        .cards-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px calc(max(24px, (100vw - 1160px) / 2 + 24px)) 16px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .cards-scroll::-webkit-scrollbar { display: none; }
        .cards-scroll > * { scroll-snap-align: start; }

        /* Card width matching Testimonials card (320px) */
        .cards-scroll > .prop-card {
          flex-shrink: 0;
          width: 320px;
        }
        @media (max-width: 640px) {
          .cards-scroll > .prop-card {
            width: 280px;
          }
        }

        .latest-empty {
          max-width: 1160px;
          margin: 0 auto;
          padding: 48px 24px;
          text-align: center;
          background: #fafafa;
          border-radius: 16px;
          border: 1px dashed #e5e7eb;
        }
        .skeleton-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px calc(max(24px, (100vw - 1160px) / 2 + 24px)) 16px;
        }
        .skeleton-row::-webkit-scrollbar { display: none; }
        .skeleton-card {
          flex-shrink: 0;
          width: 320px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f0f0f0;
        }
        @media (max-width: 640px) {
          .skeleton-card {
            width: 280px;
          }
        }
        .skel { background: linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skel-img { height: 210px; }
        .skel-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
        .skel-line { height: 12px; border-radius: 6px; }
      `}</style>

      <section className="latest-section">
        <div className="latest-head">
          <div>
            <p className="latest-eyebrow">
              <Sparkles style={{ width: 12, height: 12 }} />
              Fresh listings
            </p>
            <h2 className="latest-title">Latest properties</h2>
            <p className="latest-sub">Just added — be the first to see</p>
          </div>

          <div className="latest-head-right">
            {!loading && properties.length > 0 && (
              <>
                <button
                  className="latest-nav-btn"
                  onClick={() => scroll("left")}
                  disabled={!canLeft}
                  aria-label="Scroll left"
                >
                  <ChevronLeft style={{ width: 17, height: 17 }} />
                </button>
                <button
                  className="latest-nav-btn"
                  onClick={() => scroll("right")}
                  disabled={!canRight}
                  aria-label="Scroll right"
                >
                  <ChevronRight style={{ width: 17, height: 17 }} />
                </button>
              </>
            )}
            <Link href="/properties" className="latest-view-all">
              View all <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="latest-scroll-outer">
            <div className="skeleton-row">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skel skel-img" />
                  <div className="skel-body">
                    <div className="skel skel-line" style={{ width: "50%" }} />
                    <div className="skel-body">
                      <div className="skel skel-line" style={{ width: "80%" }} />
                      <div className="skel skel-line" style={{ width: "35%" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="latest-empty">
            <Building2 style={{ width: 40, height: 40, color: "#d1d5db", margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>No properties yet</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px" }}>Be the first to list!</p>
            <Link href="/dashboard/listings" style={{ fontSize: 13, color: "#3b6d11", fontWeight: 700, textDecoration: "none" }}>
              List your property →
            </Link>
          </div>
        ) : (
          <div className="latest-scroll-outer">
            <div className="cards-scroll" ref={scrollRef}>
              {properties.map((p) => <PropCard key={p._id} prop={p} />)}
            </div>
          </div>
        )}
      </section>
    </>
  );
}