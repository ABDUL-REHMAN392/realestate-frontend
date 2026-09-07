// components/WhyGharFind.tsx
"use client";

import { Shield, User, Bell, Search, Headphones, Users } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const WHY_ITEMS = [
  { 
    icon: Shield, 
    title: "Verified Listings", 
    desc: "100% manually verified properties for your peace of mind.",
    bg: "#f0fdf4", 
    ic: "#16a34a",
    image: "/homepage/whygharfind/verifiedListings.png"
  },
  { 
    icon: User, 
    title: "Trusted Agents", 
    desc: "Connect with experienced and professional real estate agents.",
    bg: "#eff6ff", 
    ic: "#2563eb",
    image: "/homepage/whygharfind/trustedAgents.png"
  },
  { 
    icon: Bell, 
    title: "Price Alerts", 
    desc: "Get instant notifications on price drops & new listings.",
    bg: "#fff7ed", 
    ic: "#f59e0b",
    image: "/homepage/whygharfind/priceAlert.png"
  },
  { 
    icon: Search, 
    title: "Smart Search", 
    desc: "Advanced filters & smart recommendations to find your perfect match.",
    bg: "#f5f3ff", 
    ic: "#7c3aed",
    image: "/homepage/whygharfind/smartSearch.png"
  },
  { 
    icon: Headphones, 
    title: "24/7 Support", 
    desc: "Our team is here to help you anytime, anywhere.",
    bg: "#fce7f3", 
    ic: "#ec4899",
    image: "/homepage/whygharfind/support.png"
  },
  { 
    icon: Users, 
    title: "50K+ Happy Users", 
    desc: "Join thousands of satisfied users who found their perfect property.",
    bg: "#dcfce7", 
    ic: "#22c55e",
    image: "/homepage/whygharfind/happyUsers.png"
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

export function WhyGharFind() {
  return (
    <>
      <style>{`
        .why-section { max-width: 1160px; margin: 0 auto; padding: 80px 24px;  }
        .why-head { text-align: center; margin-bottom: 52px; }
        .why-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #3b6d11; margin-bottom: 10px; }
        .why-title { font-size: clamp(28px, 4vw, 36px); font-weight: 800; color: #0a0a0a; letter-spacing: -0.02em; line-height: 1.2; margin: 0 0 10px; }
        .why-subtitle { font-size: 14px; color: #6b7280; max-width: 460px; margin: 0 auto; line-height: 1.6; }
        
        .why-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 40px 0px; 
        }
        
        .why-card { 
          padding: 24px 20px; 
          border-radius: 16px; 
          border: 1px solid #f0f0f0; 
          background: #fff; 
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-start;
          min-height: 240px;
          max-width: 320px;
          margin: 0 auto;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, box-shadow;
        }
        
        .why-card:hover { 
          transform: translateY(-6px);
          border-color: var(--card-color);
          box-shadow: 0 14px 32px var(--card-color);
        }
        
        .why-content {
          display: flex;
          flex-direction: column;
          width: 52%;
          z-index: 2;
          flex-shrink: 0;
        }
        
        .why-icon { 
          width: 44px; height: 44px; border-radius: 12px; 
          display: flex; align-items: center; justify-content: center; 
          margin-bottom: 14px;
        }
        
        .why-card-title { 
          font-size: 15px; font-weight: 700; color: #111827; 
          margin: 0 0 6px; line-height: 1.3;
        }
        
        .why-desc { 
          font-size: 12.5px; color: #6b7280; line-height: 1.55; margin: 0;
        }
        
        .why-image-wrapper {
          position: absolute;
          right: 16px;
          bottom: 16px;
          width: 130px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* FIX: Removed width: 100% and height: 100% */
        .why-image {
          object-fit: contain;
        }

        @media (max-width: 1024px) { 
          .why-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .why-card { max-width: 100%; width: 100%; min-height: 210px; }
          .why-content { width: 50%; }
          .why-image-wrapper { 
            width: 110px;
            height: 95px;
          }
        }
        
        @media (max-width: 768px) { 
          .why-grid { grid-template-columns: 1fr; gap: 10px; }
          .why-section { padding: 60px 18px; }
          .why-content { width: 55%; }
          .why-image-wrapper { 
            width: 100px;
            height: 85px;
            right: 14px;
            bottom: 14px;
          }
          .why-card { max-width: 100%; width: 100%; min-height: 190px; }
        }
      `}</style>

      <div className="why-section">
        <div className="why-head">
          <motion.p className="why-eyebrow" variants={headerVariants} initial="hidden" animate="visible" transition={{ delay: 0 }}>
            WHY CHOOSE GHARFIND?
          </motion.p>
          
          <motion.h2 className="why-title" variants={headerVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
            Everything you need, in one place
          </motion.h2>
          
          <motion.p className="why-subtitle" variants={headerVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            Powerful tools and trusted features to help you find the right property with confidence.
          </motion.p>
        </div>
        
        <motion.div className="why-grid" variants={containerVariants} initial="hidden" animate="visible">
          {WHY_ITEMS.map(({ icon: Icon, title, desc, bg, ic, image }, index) => (
            <motion.div
              key={title}
              className="why-card"
              style={{ '--card-color': bg } as React.CSSProperties}
              variants={cardVariants}
              whileHover={{ 
                y: -6,
                borderColor: bg,
                boxShadow: `0 14px 32px ${bg}`,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="why-content">
                <div className="why-icon" style={{ background: bg }}>
                  <Icon style={{ width: 20, height: 20, color: ic }} />
                </div>
                <p className="why-card-title">{title}</p>
                <p className="why-desc">{desc}</p>
              </div>
              <div className="why-image-wrapper">
                <Image
                  src={image}
                  alt={title}
                  width={130}
                  height={110}
                  className="why-image"
                  style={{ width: 'auto', height: 'auto' }}
                  priority={index < 3}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}