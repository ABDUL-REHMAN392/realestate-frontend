// components/RentalsSection.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Building2, Key } from "lucide-react";
import { PropCard, Property } from "./PropCard";

interface RentalsSectionProps {
  rentals: Property[];
  loading: boolean;
}

export function RentalsSection({ rentals, loading }: RentalsSectionProps) {
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
  }, [rentals, checkScroll]);

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

  if (!loading && rentals.length === 0) return null;

  return (
    <>
      <style>{`
        .rentals-section {
          background: #ffffff;
          padding: 80px 0 72px;
          overflow: hidden;
          width: 100%;
        }

        /* Header matching Testimonials max-width 1160px */
        .rentals-head {
          max-width: 1160px;
          margin: 0 auto 36px;
          padding: 0 24px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }

        .rentals-eyebrow {
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
        .rentals-title { font-size: clamp(22px, 3vw, 32px); font-weight: 800; color: #0a0a0a; letter-spacing: -0.02em; line-height: 1.15; margin: 0; }
        .rentals-sub { font-size: 14px; color: #6b7280; margin: 6px 0 0; }

        .rentals-head-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .rentals-nav-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid #c0dd97; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s; color: #3b6d11;
          padding: 0;
        }
        .rentals-nav-btn:hover:not(:disabled) { background: #f0f7e8; border-color: #3b6d11; }
        .rentals-nav-btn:disabled { opacity: 0.3; cursor: default; }

        .rentals-view-all {
          display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700;
          color: #3b6d11; text-decoration: none; white-space: nowrap; padding: 9px 18px;
          border: 1.5px solid #c0dd97; border-radius: 10px; transition: all 0.15s;
        }
        .rentals-view-all:hover { background: #f0f7e8; }

        /* Full width row with mask-image matching Testimonials */
        .rentals-scroll-outer {
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

        .rentals-cards-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px calc(max(24px, (100vw - 1160px) / 2 + 24px)) 16px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .rentals-cards-scroll::-webkit-scrollbar { display: none; }
        .rentals-cards-scroll > * { scroll-snap-align: start; }

        /* Card width matching Testimonials card (320px) */
        .rentals-cards-scroll > .prop-card {
          flex-shrink: 0;
          width: 320px;
        }
        @media (max-width: 640px) {
          .rentals-cards-scroll > .prop-card {
            width: 280px;
          }
        }

        .rentals-skel-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px calc(max(24px, (100vw - 1160px) / 2 + 24px)) 16px;
        }
        .rentals-skel-row::-webkit-scrollbar { display: none; }
        .rentals-skel {
          flex-shrink: 0;
          width: 320px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f0f0f0;
        }
        @media (max-width: 640px) {
          .rentals-skel {
            width: 280px;
          }
        }
        .rentals-sk { background: linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%); background-size: 200% 100%; animation: rentals-shimmer 1.4s infinite; }
        @keyframes rentals-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .rentals-sk-img { height: 210px; }
        .rentals-sk-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
        .rentals-sk-line { height: 12px; border-radius: 6px; }
      `}</style>

      <section className="rentals-section">
        <div className="rentals-head">
          <div>
            <p className="rentals-eyebrow">
              <Key style={{ width: 12, height: 12 }} />
              Verified rentals
            </p>
            <h2 className="rentals-title">For rent</h2>
            <p className="rentals-sub">Find your ideal rental property</p>
          </div>

          <div className="rentals-head-right">
            {!loading && rentals.length > 0 && (
              <>
                <button
                  className="rentals-nav-btn"
                  onClick={() => scroll("left")}
                  disabled={!canLeft}
                  aria-label="Scroll left"
                >
                  <ChevronLeft style={{ width: 17, height: 17 }} />
                </button>
                <button
                  className="rentals-nav-btn"
                  onClick={() => scroll("right")}
                  disabled={!canRight}
                  aria-label="Scroll right"
                >
                  <ChevronRight style={{ width: 17, height: 17 }} />
                </button>
              </>
            )}
            <Link href="/properties?purpose=rent" className="rentals-view-all">
              View all <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rentals-scroll-outer">
            <div className="rentals-skel-row">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rentals-skel">
                  <div className="rentals-sk rentals-sk-img" />
                  <div className="rentals-sk-body">
                    <div className="rentals-sk rentals-sk-line" style={{ width: "50%" }} />
                    <div className="rentals-sk rentals-sk-line" style={{ width: "80%" }} />
                    <div className="rentals-sk rentals-sk-line" style={{ width: "35%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rentals-scroll-outer">
            <div className="rentals-cards-scroll" ref={scrollRef}>
              {rentals.map((p) => <PropCard key={p._id} prop={p} />)}
            </div>
          </div>
        )}
      </section>
    </>
  );
}