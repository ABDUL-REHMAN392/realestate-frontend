// components/HowItWorks.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const STEPS = [
  { 
    n: "1", 
    title: "Search", 
    desc: "Use advanced filters to search thousands of verified properties.",
    image: "/homepage/works/search.png"
  },
  { 
    n: "2", 
    title: "Compare", 
    desc: "Compare properties, prices, features, locations and choose the best one.",
    image: "/homepage/works/Compare.png"
  },
  { 
    n: "3", 
    title: "Connect", 
    desc: "Connect with trusted agents or book a visit and close the deal.",
    image: "/homepage/works/connect.png"
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
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

export function HowItWorks() {
  return (
    <>
      <style>{`
        .hiw-wrap { background: #fff; padding: 1px 0; }
        .hiw-section { max-width: 1200px; margin: 0 auto; padding: 100px 24px;  }
        .hiw-head { text-align: center; margin-bottom: 80px; }
        .hiw-eyebrow { 
          font-size: 13px; 
          font-weight: 700; 
          letter-spacing: 0.12em; 
          text-transform: uppercase; 
          color: #558b2f; 
          margin-bottom: 10px;
        }
        .hiw-title { 
          font-size: clamp(28px, 4vw, 38px); 
          font-weight: 800; 
          color: #0a0a0a; 
          letter-spacing: -0.02em; 
          line-height: 1.2; 
          margin: 0 0 14px; 
        }
        .hiw-subtitle {
          font-size: 15px;
          color: #9ca3af;
          margin: 0;
          font-weight: 400;
        }
        .steps-wrap { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 0; 
          position: relative; 
          align-items: start;
        }
        
        /* Dashed connecting lines with new dark green color */
        .dotted-line {
          position: absolute;
          top: 150px;
          height: 0;
          z-index: 0;
          border-top: 2px dashed #2d5209; /* Dark Green #2d5209 */
        }
        .dotted-line-1 { left: 22%; width: 22%; }
        .dotted-line-2 { left: 56%; width: 22%; }

        .step { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          text-align: center; 
          position: relative; 
          z-index: 1; 
          padding: 0 20px; 
        }
        .step-circle-wrap {
          position: relative;
          width: 300px;
          height: 300px;
          margin-bottom: 28px;
        }
        .step-bg-circle {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: #f0f7e8;
          z-index: 0;
        }
        .step-num {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 52px; 
          height: 52px; 
          border-radius: 50%; 
          background: #fff;
          border: 2px solid #c8e6a9; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-size: 20px; 
          font-weight: 700; 
          color: #558b2f;
          z-index: 2;
        }
        .step-image-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -40%);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }
        .step-image {
          width: 100%;
          max-width: 240px;
          height: auto;
          object-fit: contain;
        }
        .step-title { 
          font-size: 18px; 
          font-weight: 700; 
          color: #0a0a0a; 
          margin: 0 0 10px; 
        }
        .step-desc { 
          font-size: 14px; 
          color: #6b7280; 
          line-height: 1.7; 
          max-width: 280px; 
          margin: 0 auto; 
        }

        @media (max-width: 968px) {
          .steps-wrap { grid-template-columns: 1fr; gap: 60px; }
          .dotted-line { display: none; }
          .step-circle-wrap {
            width: 280px;
            height: 280px;
            margin: 0 auto 28px;
          }
          .step-bg-circle {
            width: 240px;
            height: 240px;
          }
          .step-image { max-width: 200px; }
        }
        @media (max-width: 768px) {
          .hiw-section { padding: 60px 20px; }
          .step { padding: 0 12px; }
          .step-circle-wrap {
            width: 260px;
            height: 260px;
          }
          .step-bg-circle {
            width: 220px;
            height: 220px;
          }
        }
      `}</style>

      <div className="hiw-wrap">
        <div className="hiw-section">
          <motion.div 
            className="hiw-head"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p 
              className="hiw-eyebrow"
              variants={headerVariants}
            >
              Process
            </motion.p>
            <motion.h2 
              className="hiw-title"
              variants={headerVariants}
            >
              How it works
            </motion.h2>
            <motion.p 
              className="hiw-subtitle"
              variants={headerVariants}
            >
              Find your dream property in 3 simple steps.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="steps-wrap"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Two separate dashed lines connecting the circles */}
            <div className="dotted-line dotted-line-1" />
            <div className="dotted-line dotted-line-2" />
            
            {STEPS.map(({ n, title, desc, image }) => (
              <motion.div 
                key={n} 
                className="step"
                variants={itemVariants}
              >
                <div className="step-circle-wrap">
                  <div className="step-bg-circle" />
                  <div className="step-num">{n}</div>
                  <div className="step-image-wrap">
                    <Image
                      src={image}
                      alt={title}
                      width={240}
                      height={200}
                      className="step-image"
                      priority={n === "1"}
                    />
                  </div>
                </div>
                <p className="step-title">{title}</p>
                <p className="step-desc">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}