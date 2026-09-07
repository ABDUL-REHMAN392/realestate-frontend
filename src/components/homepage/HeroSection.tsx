// components/HeroSection.tsx
"use client";

import { BadgeCheck, MapPin, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
];

const PROPERTY_TYPES = [
  { label: "All Types", value: "" },
  { label: "House", value: "house" },
  { label: "Apartment", value: "apartment" },
  { label: "Plot", value: "plot" },
  { label: "Commercial", value: "commercial" },
  { label: "Villa", value: "villa" },
];

interface HeroSectionProps {
  searchText: string;
  onSearchTextChange: (val: string) => void;
  purpose: string;
  onPurposeChange: (val: string) => void;
  propType: string;
  onPropTypeChange: (val: string) => void;
  onSearch: () => void;
  onCityClick: (city: string) => void;
}

// Animation variants for header elements
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

// Staggered container for search box elements
const searchContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4,
    },
  },
};

const searchItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

// Cities pills animation
const citiesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.6,
    },
  },
};

const cityPillVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

export function HeroSection({
  searchText,
  onSearchTextChange,
  purpose,
  onPurposeChange,
  propType,
  onPropTypeChange,
  onSearch,
  onCityClick,
}: HeroSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel =
    PROPERTY_TYPES.find((t) => t.value === propType)?.label || "All Types";

  return (
    <>
      <style>{`
        .hero {
          min-height: auto;
          padding: 40px 16px 50px;
          position: relative;
          overflow: visible;
          background: #ffffff;
        }
        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .hero-content { text-align: left; }
        .hero-eyebrow { font-size: 12px; font-weight: 600; color: #3b6d11;
          background: #f0f7e8; border: 1px solid #c0dd97;
          border-radius: 999px; padding: 6px 14px;
          margin-bottom: 20px; letter-spacing: 0.01em;
          display: inline-flex; align-items: center; gap: 6px; }
        .hero-title {
          font-size: clamp(32px, 4vw, 48px); font-weight: 800;
          line-height: 1.1; letter-spacing: -0.03em; color: #0a0a0a;
          margin: 0 0 16px;
        }
        .hero-title span { color: #3b6d11; }
        .hero-subtitle {
          font-size: 15px; color: #6b7280; line-height: 1.6;
          margin: 0 0 24px; font-weight: 400; max-width: 460px;
        }
        .search-box {
          width: 100%; max-width: 540px; background: #fff;
          border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 8px;
          display: flex; gap: 6px; align-items: center;
          box-shadow: 0 6px 32px rgba(0,0,0,0.08);
        }
        .search-tabs {
          display: flex; background: #f4f4f5; border-radius: 10px;
          padding: 3px; gap: 2px; flex-shrink: 0;
        }
        .search-tab {
          padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;
          border: none; cursor: pointer; font-family: inherit; transition: all 0.18s;
          background: transparent; color: #6b7280;
        }
        .search-tab.active {
          background: #fff; color: #3b6d11; box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        .search-input-wrap {
          flex: 1; position: relative; display: flex; align-items: center;
        }
        .search-icon-inner {
          position: absolute; left: 12px; color: #9ca3af; width: 16px; height: 16px; flex-shrink: 0;
        }
        .search-input {
          width: 100%; height: 42px; border: none; outline: none; font-size: 14px;
          font-family: inherit; padding: 0 12px 0 36px; background: transparent; color: #111;
        }
        .search-input::placeholder { color: #9ca3af; }

        .search-select-wrap {
          position: relative; display: flex; align-items: center;
          height: 42px; min-width: 120px; border-left: 1px solid #f0f0f0;
          padding-left: 10px; z-index: 100;
        }
        .search-select-trigger {
          width: 100%; height: 100%; border: none; outline: none;
          font-size: 13px; font-weight: 500; font-family: inherit;
          background: transparent; color: #374151; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          padding-right: 6px; transition: color 0.2s;
        }
        .search-select-trigger:hover { color: #3b6d11; }
        .search-select-arrow {
          width: 16px; height: 16px; color: #6b7280;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s;
        }
        .search-select-arrow.open { transform: rotate(180deg); color: #3b6d11; }
        
        .search-dropdown-menu {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0;
          background: #fff; border: 1px solid #e5e7eb; border-radius: 10px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15); padding: 6px;
          list-style: none; margin: 0; z-index: 1000;
          animation: dropdownFade 0.2s ease-out;
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .search-dropdown-item {
          padding: 9px 12px; font-size: 13px; font-weight: 500;
          color: #374151; cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
        }
        .search-dropdown-item:hover { background: #f0f7e8; color: #3b6d11; }
        .search-dropdown-item.active { background: #3b6d11; color: #fff; }

        .search-btn {
          height: 42px; padding: 0 18px; background: #3b6d11; color: #fff; border: none;
          border-radius: 10px; font-size: 14px; font-weight: 700; font-family: inherit;
          cursor: pointer; display: flex; align-items: center; gap: 6px; flex-shrink: 0;
          transition: background 0.18s, transform 0.12s; white-space: nowrap;
        }
        .search-btn:hover { background: #2d5509; }
        .search-btn:active { transform: scale(0.98); }
        
        .hero-cities {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-top: 20px; align-items: center;
        }
        .hero-cities-label { font-size: 11px; color: #9ca3af; font-weight: 500; margin-right: 4px; }
        .hero-city-pill {
          display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px;
          border-radius: 999px; border: 1px solid #e5e7eb; background: #fff;
          font-size: 11px; font-weight: 500; color: #374151; cursor: pointer;
          font-family: inherit; transition: all 0.15s;
        }
        .hero-city-pill:hover { border-color: #3b6d11; color: #3b6d11; background: #f0f7e8; }
        
        .hero-image-wrapper {
          position: relative; width: 100%; height: 380px;
          display: flex; align-items: flex-end; justify-content: center;
        }
        .hero-image-container {
          position: relative; width: 100%; height: 100%;
          background: #ffffff; border-radius: 20px; overflow: visible;
        }
        .hero-image { object-fit: contain; object-position: center bottom; }
        
        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr; gap: 28px; }
          .hero-content { text-align: center; }
          .hero-subtitle { margin-left: auto; margin-right: auto; }
          .search-box { margin-left: auto; margin-right: auto; }
          .hero-cities { justify-content: center; }
          .hero-image-wrapper { height: 300px; order: -1; }
        }
        @media (max-width: 768px) {
          .hero { padding: 28px 12px 36px; }
          .search-box { flex-wrap: wrap; }
          .search-select-wrap {
            border-left: none; border-top: 1px solid #f0f0f0;
            width: 100%; min-width: unset; padding-left: 0;
          }
          .hero-image-wrapper { height: 240px; }
          .hero-title { font-size: 28px; }
          .hero-image-container { border-radius: 14px; }
        }
      `}</style>

      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            {/* Animated Eyebrow */}
            <motion.div
              className="hero-eyebrow"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <BadgeCheck style={{ width: 13, height: 13 }} />
              Pakistan's most trusted property platform
            </motion.div>

            {/* Animated Title */}
            <motion.h1
              className="hero-title"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              Find your perfect
              <br />
              <span>home in Pakistan</span>
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.p
              className="hero-subtitle"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              10,000+ verified properties across Lahore, Karachi, Islamabad and
              more. Buy, sell, or rent with confidence.
            </motion.p>

            {/* Animated Search Box Container */}
            <motion.div
              className="search-box"
              variants={searchContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Tabs */}
              <motion.div className="search-tabs" variants={searchItemVariants}>
                {[
                  ["sale", "Buy"],
                  ["rent", "Rent"],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    className={`search-tab ${purpose === v ? "active" : ""}`}
                    onClick={() => onPurposeChange(v)}
                  >
                    {l}
                  </button>
                ))}
              </motion.div>

              {/* Input */}
              <motion.div
                className="search-input-wrap"
                variants={searchItemVariants}
              >
                <Search className="search-icon-inner" />
                <input
                  className="search-input"
                  value={searchText}
                  onChange={(e) => onSearchTextChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                  placeholder="City, area, or property type..."
                />
              </motion.div>

              {/* Select Dropdown */}
              <motion.div
                className="search-select-wrap"
                ref={dropdownRef}
                variants={searchItemVariants}
              >
                <button
                  className="search-select-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  type="button"
                >
                  {currentLabel}
                  <ChevronDown
                    className={`search-select-arrow ${isDropdownOpen ? "open" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <ul className="search-dropdown-menu">
                    {PROPERTY_TYPES.map((type) => (
                      <li
                        key={type.value}
                        className={`search-dropdown-item ${propType === type.value ? "active" : ""}`}
                        onClick={() => {
                          onPropTypeChange(type.value);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {type.label}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>

              {/* Search Button */}
              <motion.button
                className="search-btn"
                onClick={onSearch}
                variants={searchItemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search style={{ width: 15, height: 15 }} /> Search
              </motion.button>
            </motion.div>

            {/* Animated Cities Pills */}
            <motion.div
              className="hero-cities"
              variants={citiesContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                className="hero-cities-label"
                variants={cityPillVariants}
              >
                Try:
              </motion.span>
              {CITIES.map((city) => (
                <motion.button
                  key={city}
                  className="hero-city-pill"
                  onClick={() => onCityClick(city)}
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

          {/* Animated Image Wrapper */}
          <motion.div
            className="hero-image-wrapper"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          >
            <div className="hero-image-container">
              <Image
                src="/homepage/heroSection.png"
                alt="Modern home in Pakistan"
                fill
                className="hero-image"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
