// components/StatsBar.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Home, ShieldCheck, Users, Map } from "lucide-react";

const STATS = [
  { num: 10000, suffix: "+",  label: "Properties Listed", icon: Home },
  { num: 500,   suffix: "+",  label: "Verified Agents",   icon: ShieldCheck },
  { num: 50,    suffix: "K+", label: "Happy Users",       icon: Users },
  { num: 25,    suffix: "+",  label: "Cities Covered",    icon: Map },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12, delayChildren: 0.2 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } },
} as const;

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = value / (2000 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatted = value >= 1000
    ? `${(count / 1000).toFixed(0)}K`
    : count.toLocaleString();

  return (
    <div ref={ref}>
      <span className="sb__num">{formatted}{suffix}</span>
    </div>
  );
}

export function StatsBar() {
  return (
    <>
      <style>{`
        .sb__wrap {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 24px 32px;
          max-width: 1100px;
          margin: 0 auto;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          overflow: hidden;
        }

        .sb__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .sb__item {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 0 24px;
          position: relative;
        }

        .sb__item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0; top: 50%;
          transform: translateY(-50%);
          width: 1px; height: 44px;
          background: #639922;
          opacity: 0.25;
        }

        /* Big circle — matches screenshot */
        .sb__icon-wrap {
          flex-shrink: 0;
          width: 64px !important;
          height: 64px !important;
          border-radius: 50% !important;
          background: #253312 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Big icon inside circle */
        .sb__icon-wrap svg {
          width: 32px !important;
          height: 32px !important;
          color: #639922 !important;
          stroke: #639922 !important;
        }

        .sb__content {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .sb__num {
          font-size: 26px !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          letter-spacing: -0.02em !important;
          line-height: 1 !important;
          display: block !important;
        }

        .sb__label {
          font-size: 13px !important;
          color: #639922 !important;
          font-weight: 500 !important;
          line-height: 1.4 !important;
        }

        @media (max-width: 968px) {
          .sb__wrap { padding: 24px 20px; }
          .sb__grid { grid-template-columns: repeat(2, 1fr); gap: 28px; }
          .sb__item { padding: 0; }
          .sb__item::after { display: none !important; }
        }

        @media (max-width: 480px) {
          .sb__wrap { padding: 20px 16px; border-radius: 12px; }
          .sb__grid { grid-template-columns: 1fr; gap: 20px; }
          .sb__icon-wrap { width: 52px !important; height: 52px !important; }
          .sb__icon-wrap svg { width: 26px !important; height: 26px !important; }
          .sb__num { font-size: 22px !important; }
        }
      `}</style>

      <motion.div
        className="sb__wrap"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="sb__grid">
          {STATS.map(({ num, suffix, label, icon: Icon }) => (
            <motion.div
              key={label}
              className="sb__item"
              variants={itemVariants}
            >
              <div className="sb__icon-wrap">
                <Icon />
              </div>
              <div className="sb__content">
                <Counter value={num} suffix={suffix} />
                <div className="sb__label">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}