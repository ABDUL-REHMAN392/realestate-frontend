// components/AgentCTA.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import Image from "next/image";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
} as const;

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      delay: 0.4,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      delay: 0.6,
    },
  },
} as const;

const cardVariantsRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      delay: 0.7,
    },
  },
} as const;

export function AgentCTA() {
  return (
    <>
      <style>{`
        .cta-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 24px;
        }
        .cta-wrap {
          background: linear-gradient(135deg, #1a1a1a 0%, #0f1f0f 100%);
          border-radius: 20px;
          padding: 40px 40px;
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        
        /* Decorative gradient glow */
        .cta-wrap::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 153, 34, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        
        /* Left content */
        .cta-left {
          position: relative;
          z-index: 1;
        }
        
        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99, 153, 34, 0.15);
          border: 1px solid rgba(99, 153, 34, 0.3);
          border-radius: 999px;
          padding: 6px 14px;
          margin-bottom: 18px;
        }
        
        .badge-icon {
          width: 12px;
          height: 12px;
          color: #639922;
        }
        
        .badge-text {
          font-size: 12px;
          color: #639922;
          font-weight: 600;
        }
        
        .cta-title {
          font-size: clamp(28px, 3vw, 36px);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.03em;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        
        .cta-sub {
          font-size: 14px;
          color: #9ca3af;
          line-height: 1.6;
          margin: 0 0 24px;
          max-width: 440px;
        }
        
        .cta-btns {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #639922;
          color: #ffffff;
          border-radius: 10px;
          padding: 0 20px;
          height: 44px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          font-family: inherit;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary:hover {
          background: #558b2f;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 153, 34, 0.3);
        }
        
        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #ffffff;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 0 20px;
          height: 44px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
        }
        
        .btn-outline:hover {
          border-color: rgba(99, 153, 34, 0.5);
          background: rgba(99, 153, 34, 0.1);
        }
        
        /* Right side - Image and cards */
        .cta-right {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 280px;
        }
        
        /* Decorative dots pattern */
        .dots-pattern {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          display: grid;
          grid-template-columns: repeat(3, 6px);
          gap: 6px;
          opacity: 0.3;
        }
        
        .dot {
          width: 3px;
          height: 3px;
          background: #639922;
          border-radius: 50%;
        }
        
        /* Image container with circular glow */
        .image-container {
          position: relative;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 153, 34, 0.2) 0%, transparent 70%);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .image-wrapper {
          position: relative;
          width: 230px;
          height: 230px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(99, 153, 34, 0.4);
        }
        
        .agent-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* Stat cards */
        .stat-card {
          position: absolute;
          background: #ffffff;
          border-radius: 10px;
          padding: 12px 16px;
          min-width: 130px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          z-index: 2;
        }
        
        .stat-card-left {
          left: -5px;
          top: 60px;
        }
        
        .stat-card-right {
          right: -5px;
          bottom: 60px;
        }
        
        .stat-label {
          font-size: 11px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 2px;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #0a0a0a;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .stat-icon {
          width: 18px;
          height: 18px;
          color: #639922;
        }
        
        @media (max-width: 968px) {
          .cta-wrap {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 36px 28px;
          }
          .cta-right {
            min-height: 260px;
          }
          .image-container {
            width: 220px;
            height: 220px;
          }
          .image-wrapper {
            width: 190px;
            height: 190px;
          }
          .stat-card {
            padding: 10px 14px;
            min-width: 110px;
          }
          .stat-card-left {
            left: 0;
            top: 50px;
          }
          .stat-card-right {
            right: 0;
            bottom: 50px;
          }
        }
        
        @media (max-width: 768px) {
          .cta-wrap {
            padding: 32px 20px;
          }
          .cta-title {
            font-size: 24px;
          }
          .cta-sub {
            font-size: 13px;
          }
          .btn-primary,
          .btn-outline {
            height: 42px;
            padding: 0 18px;
          }
          .image-container {
            width: 200px;
            height: 200px;
          }
          .image-wrapper {
            width: 170px;
            height: 170px;
          }
          .stat-card {
            display: none;
          }
          .dots-pattern {
            display: none;
          }
        }
      `}</style>
      
      <div className="cta-section">
        <motion.div 
          className="cta-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <div className="cta-left">
            <motion.div className="cta-badge" variants={itemVariants}>
              <TrendingUp className="badge-icon" />
              <span className="badge-text">Join 50,000+ happy users</span>
            </motion.div>
            
            <motion.h2 className="cta-title" variants={itemVariants}>
              Are you an agent?
            </motion.h2>
            
            <motion.p className="cta-sub" variants={itemVariants}>
              List properties, connect with serious buyers & grow your business with GharFind.
            </motion.p>
            
            <motion.div className="cta-btns" variants={itemVariants}>
              <Link href="/become-agent" className="btn-primary">
                Become an Agent <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
              <Link href="/agents" className="btn-outline">
                View Agent Directory
              </Link>
            </motion.div>
          </div>
          
          {/* Right Content - Image and Stats */}
          <div className="cta-right">
            {/* Decorative dots */}
            <div className="dots-pattern">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="dot" />
              ))}
            </div>
            
            {/* Left Stat Card */}
            <motion.div className="stat-card stat-card-left" variants={cardVariants}>
              <div className="stat-label">Total Listings</div>
              <div className="stat-value">
                120
                <TrendingUp className="stat-icon" />
              </div>
            </motion.div>
            
            {/* Agent Image */}
            <motion.div className="image-container" variants={imageVariants}>
              <div className="image-wrapper">
                <Image
                  src="/homepage/agent.png"
                  alt="Professional Real Estate Agent"
                  width={230}
                  height={230}
                  className="agent-image"
                  priority
                />
              </div>
            </motion.div>
            
            {/* Right Stat Card */}
            <motion.div className="stat-card stat-card-right" variants={cardVariantsRight}>
              <div className="stat-label">Profile Views</div>
              <div className="stat-value">
                2,350
                <TrendingUp className="stat-icon" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}