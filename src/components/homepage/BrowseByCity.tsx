// components/BrowseByCity.tsx
"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const CITIES = [
  { name: "Lahore", urdu: "لاہور", bg: "#f5f3ff" },
  { name: "Karachi", urdu: "کراچی", bg: "#eff6ff" },
  { name: "Islamabad", urdu: "اسلام آباد", bg: "#f0fdf4" },
  { name: "Rawalpindi", urdu: "راولپنڈی", bg: "#fff7ed" },
  { name: "Faisalabad", urdu: "فیصل آباد", bg: "#fff7ed" },
  { name: "Multan", urdu: "ملتان", bg: "#ffedd5" },
  { name: "Peshawar", urdu: "پشاور", bg: "#f0fdf9" },
  { name: "Quetta", urdu: "کوئٹہ", bg: "#fafaf9" },
];

// Animation variants - FIXED: added `as const` for proper TypeScript inference
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      mass: 0.8,
    },
  },
} as const;

const headerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14,
    },
  },
} as const;

export function BrowseByCity() {
  const router = useRouter();
  
  return (
    <>
      <style>{`
        .city-section { max-width: 1160px; margin: 0 auto; padding: 80px 24px;  }
        .city-section-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px; gap: 16px; }
        .city-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }
        .city-section-title { font-size: clamp(22px, 3vw, 32px); font-weight: 800; color: #0a0a0a; letter-spacing: -0.02em; line-height: 1.15; margin: 0; }
        .city-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .city-card {
          position: relative; padding: 20px; border-radius: 16px; border: none;
          cursor: pointer; text-align: left; font-family: inherit;
          transition: all 0.3s ease; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;
          min-height: 130px;
        }
        .city-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
        
        /* Image styling */
        .city-card-image {
          position: absolute; right: -10px; bottom: -5px;
          width: 65%; height: 90%;
          object-fit: contain; transition: transform 0.3s ease;
          z-index: 1;
        }
        .city-card:hover .city-card-image { transform: scale(1.05); }
        
        .city-name { font-size: 16px; font-weight: 700; color: #0a0a0a; margin: 0 0 4px; position: relative; z-index: 2; }
        .city-name-urdu {
          display: block; font-size: 14px; font-weight: 600; color: #6b7280;
          direction: rtl; font-family: 'Noto Nastaliq Urdu', serif; margin-top: 2px; line-height: 1.6;
        }
        .city-link {
          font-size: 12px; color: #9ca3af; display: flex; align-items: center; gap: 4px;
          margin: 0; position: relative; z-index: 2; font-weight: 500;
        }
        .city-link svg {
          transform: rotate(-62deg);
          transition: transform 0.2s;
        }
        .city-card:hover .city-link svg {
          transform: rotate(-62deg) translateX(3px);
        }

        /* View All Button Styling based on Image 7 */
        .view-all-btn { 
          padding: 10px 22px; 
          border: 1.5px solid #A5D6A7; /* Light Green Border */
          border-radius: 14px; 
          background: transparent; 
          color: #1B5E20; /* Dark Green Text */
          cursor: pointer; 
          display: flex; align-items: center; gap: 8px; 
          font-weight: 600; font-size: 15px;
          transition: all 0.3s ease;
        }
        .view-all-btn svg {
          color: #1B5E20; /* Dark Green Icon */
          transition: color 0.3s ease;
        }
        .view-all-btn:hover { 
          background: #1B5E20; /* Dark Green Background */
          color: #fff; 
          border-color: #1B5E20;
        }
        .view-all-btn:hover svg {
          color: #fff;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) { 
          .city-grid { grid-template-columns: repeat(2, 1fr); } 
          .city-section-head { flex-direction: column; align-items: flex-start; gap: 12px; }
          .view-all-btn { padding: 8px 16px; font-size: 14px; width: 100%; justify-content: center; }
        }
      `}</style>

      <motion.div 
        className="city-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="city-section-head"
          variants={headerVariants}
        >
          <div>
            <motion.p 
              className="city-eyebrow"
              variants={headerVariants}
            >
              Locations
            </motion.p>
            <motion.h2 
              className="city-section-title"
              variants={headerVariants}
            >
              Browse by city
            </motion.h2>
          </div>
          <motion.button 
            className="view-all-btn" 
            onClick={() => router.push('/properties')}
            variants={headerVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View all <ArrowRight style={{ width: 18, height: 18 }} />
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="city-grid"
          variants={containerVariants}
        >
          {CITIES.map((city) => (
            <motion.button 
              key={city.name} 
              className="city-card" 
              onClick={() => router.push(`/properties?city=${city.name}`)}
              style={{ background: city.bg }}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <Image
                src={`/homepage/cities/${city.name.toLowerCase()}.png`}
                alt={city.name}
                width={180}
                height={150}
                className="city-card-image"
              />
              <div>
                <p className="city-name">
                  {city.name}
                  <span className="city-name-urdu">{city.urdu}</span>
                </p>
              </div>
              <p className="city-link">
                View properties <ArrowRight style={{ width: 10, height: 10 }} />
              </p>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}