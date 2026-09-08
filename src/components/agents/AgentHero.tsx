"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, Shield, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const POPULAR_CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan"];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const searchContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.4 },
  },
};

const searchItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const citiesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.6 },
  },
};

const cityPillVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 15 },
  },
};

interface DropdownOption { value: string; label: string; }

function CustomDropdown({
  value, options, placeholder, onChange,
}: {
  value: string;
  options: DropdownOption[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find((o) => o.value === value && o.value !== "");
  const currentLabel = selected ? selected.label : placeholder;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="agent-select-trigger"
      >
        <span style={{ color: selected ? "#1C1C1C" : "#9CA3AF", fontWeight: selected ? 500 : 400 }}>
          {currentLabel}
        </span>
        <ChevronDown className={`agent-select-arrow ${open ? "open" : ""}`} />
      </button>

      {open && (
        <ul className="agent-dropdown-menu">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`agent-dropdown-item ${value === opt.value ? "active" : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface AgentHeroProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onSearch: (city: string, specialty: string, exp: string) => void;
}

export function AgentHero({ onToggleSidebar, sidebarOpen, onSearch }: AgentHeroProps) {
  const [heroCity, setHeroCity]           = useState("");
  const [heroSpecialty, setHeroSpecialty] = useState("");
  const [heroExp, setHeroExp]             = useState("");

  const specialtyOptions: DropdownOption[] = [
    { value: "", label: "All Specialties" },
    ...["Residential Expert", "Rental Specialist", "Investment Expert", "Luxury Homes", "Commercial Expert"]
      .map((s) => ({ value: s, label: s })),
  ];

  const expOptions: DropdownOption[] = [
    { value: "",   label: "Any Experience" },
    { value: "1",  label: "1–3 Years"  },
    { value: "3",  label: "3–5 Years"  },
    { value: "5",  label: "5–10 Years" },
    { value: "10", label: "10+ Years"  },
  ];

  return (
    <>
      <style>{`

        .agent-hero {
          min-height: auto;
          padding: 40px 16px 50px;
          position: relative;
          overflow: visible;
          background: #ffffff;
        }

        /* Outer wrapper: max-width container */
        .agent-hero-outer {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        /* Top row: text left, image right */
        .agent-hero-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: center;
          margin-bottom: 32px;
        }

        /* Bottom row: search bar full width + cities */
        .agent-hero-bottom {
          width: 100%;
        }

        .agent-hero-content { text-align: left; }

        /* Eyebrow */
        .agent-eyebrow {
          font-size: 12px; font-weight: 600; color: #3b6d11;
          background: #f0f7e8; border: 1px solid #c0dd97;
          border-radius: 999px; padding: 6px 14px;
          margin-bottom: 20px; letter-spacing: 0.01em;
          display: inline-flex; align-items: center; gap: 6px;
        }

        /* Title */
        .agent-hero-title {
          font-size: clamp(32px, 4vw, 48px); font-weight: 800;
          line-height: 1.1; letter-spacing: -0.03em; color: #0a0a0a;
          margin: 0 0 16px;
        }
        .agent-hero-title span { color: #3b6d11; }

        /* Subtitle */
        .agent-hero-subtitle {
          font-size: 15px; color: #6b7280; line-height: 1.6;
          margin: 0; font-weight: 400; max-width: 460px;
        }

        /* Image side */
        .agent-image-wrapper {
          position: relative; width: 100%; height: 380px;
          display: flex; align-items: flex-end; justify-content: center;
        }
        .agent-image-container {
          position: relative; width: 100%; height: 100%;
          background: #ffffff; border-radius: 20px; overflow: visible;
        }
        .agent-hero-image {
          object-fit: contain; object-position: center bottom;
        }

        /* Floating badge */
        .agent-badge {
          position: absolute; bottom: 32px; right: 16px;
          background: #fff; border-radius: 14px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.12);
          padding: 10px 16px; display: flex; align-items: center;
          gap: 10px; z-index: 20; border: 1px solid #e5edd8;
        }
        .agent-badge-icon {
          width: 36px; height: 36px; background: #f0f7e8;
          border-radius: 10px; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .agent-badge-number {
          font-size: 18px; font-weight: 800; color: #0a0a0a;
          line-height: 1; letter-spacing: -0.03em;
        }
        .agent-badge-label {
          font-size: 10px; color: #9ca3af; margin-top: 2px;
        }

        /* ── Search Bar: full width, single row, labeled ── */
        .agent-search-bar {
          width: 100%;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.12);
          border: 1px solid #F0F0F0;
          display: flex;
          align-items: stretch;
          overflow: visible;
        }

        .agent-search-field {
          flex: 1;
          padding: 16px 24px;
          border-right: 1px solid #F0F0F0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          min-width: 0;
          position: relative;
        }

        .agent-field-label {
          font-size: 10px;
          font-weight: 700;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          white-space: nowrap;
        }

        .agent-city-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .agent-city-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #374151;
          background: transparent;
          min-width: 0;
        }
        .agent-city-input::placeholder { color: #9CA3AF; }
        .agent-city-pin {
          width: 18px; height: 18px;
          color: #3b6d11; flex-shrink: 0;
        }

        /* Dropdown trigger */
        .agent-select-trigger {
          width: 100%;
          border: none; outline: none;
          font-size: 14px;
          background: transparent; color: #374151;
          cursor: pointer;
          display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
          padding: 0; transition: color 0.2s;
        }
        .agent-select-trigger:hover { color: #3b6d11; }

        .agent-select-arrow {
          width: 16px; height: 16px; color: #9CA3AF; flex-shrink: 0;
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), color 0.2s;
        }
        .agent-select-arrow.open { transform: rotate(180deg); color: #3b6d11; }

        /* Dropdown menu */
        .agent-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px); left: 0;
          background: #fff; border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          padding: 6px; list-style: none; margin: 0;
          z-index: 1000; min-width: 200px;
          animation: agentDropFade 0.2s ease-out;
        }
        @keyframes agentDropFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .agent-dropdown-item {
          padding: 9px 12px; font-size: 13px; font-weight: 500;
          color: #374151; cursor: pointer; border-radius: 8px;
          transition: all 0.15s;
          list-style: none;
        }
        .agent-dropdown-item:hover  { background: #f0f7e8; color: #3b6d11; }
        .agent-dropdown-item.active { background: #3b6d11; color: #fff; }

        /* Buttons section */
        .agent-search-actions {
          display: flex; align-items: center; gap: 10px;
          padding: 16px 20px; flex-shrink: 0;
        }

        .agent-filter-btn {
          height: 44px; padding: 0 18px;
          border-radius: 12px; border: 1.5px solid #E5E7EB;
          font-size: 13px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center;
          gap: 6px; transition: all 0.18s;
          white-space: nowrap; background: transparent; color: #6b7280;
        }
        .agent-filter-btn:hover  { background: #f0f7e8; color: #3b6d11; border-color: #3b6d11; }
        .agent-filter-btn.active { background: #f0f7e8; color: #3b6d11; border-color: #3b6d11; }

        .agent-search-btn {
          height: 44px; padding: 0 24px;
          background: #3b6d11; color: #fff; border: none;
          border-radius: 12px; font-size: 14px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center;
          gap: 6px; transition: background 0.18s, transform 0.12s;
          white-space: nowrap;
        }
        .agent-search-btn:hover  { background: #2d5509; }
        .agent-search-btn:active { transform: scale(0.98); }

        /* City pills */
        .agent-cities {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-top: 16px; align-items: center;
        }
        .agent-cities-label {
          font-size: 11px; color: #9ca3af;
          font-weight: 500; margin-right: 4px;
        }
        .agent-city-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 10px; border-radius: 999px;
          border: 1px solid #e5e7eb; background: #fff;
          font-size: 11px; font-weight: 500; color: #374151;
          transition: all 0.15s;
        }
        .agent-city-pill:hover {
          border-color: #3b6d11; color: #3b6d11; background: #f0f7e8;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .agent-hero-top       { grid-template-columns: 1fr; gap: 28px; }
          .agent-hero-content   { text-align: center; }
          .agent-hero-subtitle  { margin-left: auto; margin-right: auto; }
          .agent-cities         { justify-content: center; }
          .agent-image-wrapper  { height: 300px; order: -1; }
        }
        @media (max-width: 768px) {
          .agent-hero           { padding: 28px 12px 36px; }
          .agent-search-bar     { flex-direction: column; }
          .agent-search-field   { border-right: none; border-bottom: 1px solid #F0F0F0; }
          .agent-search-actions { border-top: 1px solid #F0F0F0; justify-content: flex-end; }
          .agent-image-wrapper  { height: 240px; }
          .agent-hero-title     { font-size: 28px; }
          .agent-image-container { border-radius: 14px; }
        }
      `}</style>

      <section className="agent-hero">
        <div className="agent-hero-outer">

          {/* ── TOP ROW: text + image ── */}
          <div className="agent-hero-top">

            {/* Left: text content */}
            <div className="agent-hero-content">
              <motion.div
                className="agent-eyebrow"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                <Shield style={{ width: 13, height: 13 }} />
                Trusted Professionals
              </motion.div>

              <motion.h1
                className="agent-hero-title"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                Connect with<br />
                <span>Top Real Estate Agents</span>
              </motion.h1>

              <motion.p
                className="agent-hero-subtitle"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                Find experienced and verified agents who can help you buy, sell or rent
                the perfect property across Pakistan.
              </motion.p>
            </div>

            {/* Right: image */}
            <motion.div
              className="agent-image-wrapper"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            >
              <div className="agent-image-container">
                <Image
                  src="/agents/herosetion.png"
                  alt="Real estate agents"
                  fill
                  className="agent-hero-image"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <motion.div
                className="agent-badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
              >
                <div className="agent-badge-icon">
                  <Shield style={{ width: 18, height: 18, color: "#3b6d11" }} />
                </div>
                <div>
                  <p className="agent-badge-number">500+</p>
                  <p className="agent-badge-label">Verified Agents</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ── BOTTOM ROW: full-width search bar + city pills ── */}
          <div className="agent-hero-bottom">
            <motion.div
              className="agent-search-bar"
              variants={searchContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Location */}
              <motion.div className="agent-search-field" variants={searchItemVariants}>
                <span className="agent-field-label">Location</span>
                <div className="agent-city-row">
                  <input
                    className="agent-city-input"
                    value={heroCity}
                    onChange={(e) => setHeroCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch(heroCity, heroSpecialty, heroExp)}
                    placeholder="City, area or location"
                  />
                  <MapPin className="agent-city-pin" />
                </div>
              </motion.div>

              {/* Specialization */}
              <motion.div className="agent-search-field" variants={searchItemVariants}>
                <span className="agent-field-label">Specialization</span>
                <CustomDropdown
                  value={heroSpecialty}
                  options={specialtyOptions}
                  placeholder="All Specialties"
                  onChange={setHeroSpecialty}
                />
              </motion.div>

              {/* Experience */}
              <motion.div
                className="agent-search-field"
                variants={searchItemVariants}
                style={{ borderRight: "none" }}
              >
                <span className="agent-field-label">Experience</span>
                <CustomDropdown
                  value={heroExp}
                  options={expOptions}
                  placeholder="Any Experience"
                  onChange={setHeroExp}
                />
              </motion.div>

              {/* Buttons */}
              <motion.div className="agent-search-actions" variants={searchItemVariants}>
                <button
                  type="button"
                  onClick={onToggleSidebar}
                  className={`agent-filter-btn ${sidebarOpen ? "active" : ""}`}
                >
                  More Filters
                </button>
                <motion.button
                  type="button"
                  className="agent-search-btn"
                  onClick={() => onSearch(heroCity, heroSpecialty, heroExp)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search style={{ width: 15, height: 15 }} />
                  Search Agents
                </motion.button>
              </motion.div>
            </motion.div>

            {/* City pills */}
            <motion.div
              className="agent-cities"
              variants={citiesContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span className="agent-cities-label" variants={cityPillVariants}>
                Try:
              </motion.span>
              {POPULAR_CITIES.map((city) => (
                <motion.button
                  key={city}
                  type="button"
                  className="agent-city-pill"
                  onClick={() => onSearch(city, "", "")}
                  variants={cityPillVariants}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "#3b6d11",
                    color: "#3b6d11",
                    background: "#f0f7e8",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin style={{ width: 10, height: 10 }} />
                  {city}
                </motion.button>
              ))}
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
}