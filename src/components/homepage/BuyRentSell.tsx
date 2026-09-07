// components/homepage/BuyRentSell.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const CARDS = [
  {
    type: "buy",
    title: "Buy Property",
    subtitle: "Find your dream home",
    image: "/homepage/buy&rent&sell/buy.png",
    alt: "Buy Property",
    href: "/properties?purpose=sale",
    bg: "linear-gradient(135deg, #e8f5e9 0%, #dcf0d8 100%)",
  },
  {
    type: "rent",
    title: "Rent Property",
    subtitle: "Explore rental options",
    image: "/homepage/buy&rent&sell/rent.png",
    alt: "Rent Property",
    href: "/properties?purpose=rent",
    bg: "linear-gradient(135deg, #fdf3eb 0%, #f7e8db 100%)",
  },
  {
    type: "sell",
    title: "Sell Property",
    subtitle: "List your property",
    image: "/homepage/buy&rent&sell/sell.png",
    alt: "Sell Property",
    href: "/dashboard/listings",
    bg: "linear-gradient(135deg, #fef1ea 0%, #fae2d5 100%)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
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

export function BuyRentSell() {
  return (
    <>
      <style>{`
        .brs-section {
          max-width: 1160px;
          margin: 0 auto;
          padding: 48px 24px 20px;
        }

        .brs-head {
          margin-bottom: 24px;
        }

        .brs-title {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 4px;
        }

        .brs-subtitle {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          margin: 0;
        }

        .brs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .brs-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 20px;
          padding: 24px 20px 20px 24px;
          min-height: 160px;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .brs-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
        }

        .brs-card-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 50%;
        }

        .brs-card-title {
          font-size: 18px;
          font-weight: 800;
          color: #111827;
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .brs-card-subtitle {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
          margin: 0;
          line-height: 1.35;
        }

        .brs-image-wrap {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          pointer-events: none;
          z-index: 1;
        }

        .brs-wrap-buy {
          width: 52%;
          align-items: flex-end;
        }

        .brs-wrap-rent {
          width: 56%;
          top: 0;
          bottom: 0;
          right: 0;
          height: 100%;
        }

        .brs-wrap-sell {
          width: 50%;
          align-items: flex-end;
        }

        .brs-img-buy {
          width: 100%;
          height: 95%;
          object-fit: contain;
          object-position: right bottom;
          transition: transform 0.3s ease;
        }

        .brs-img-rent {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: left center;
          mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%);
          transition: transform 0.3s ease;
        }

        .brs-img-sell {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: right bottom;
          transition: transform 0.3s ease;
        }

        .brs-card:hover .brs-img-buy,
        .brs-card:hover .brs-img-rent,
        .brs-card:hover .brs-img-sell {
          transform: scale(1.05);
        }

        @media (max-width: 900px) {
          .brs-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .brs-card {
            min-height: 145px;
            padding: 20px 18px 18px 20px;
          }
          .brs-card-title {
            font-size: 17px;
          }
        }
      `}</style>

      <motion.section
        className="brs-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="brs-head">
          <h2 className="brs-title">Buy / Rent / Sell</h2>
          <p className="brs-subtitle">What are you looking for?</p>
        </div>

        <motion.div className="brs-grid" variants={containerVariants}>
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={card.href}
                className="brs-card"
                style={{ background: card.bg }}
              >
                <div className="brs-card-content">
                  <h3 className="brs-card-title">{card.title}</h3>
                  <p className="brs-card-subtitle">{card.subtitle}</p>
                </div>
                <div className={`brs-image-wrap brs-wrap-${card.type}`}>
                  <Image
                    src={card.image}
                    alt={card.alt}
                    width={card.type === "rent" ? 260 : card.type === "buy" ? 190 : 180}
                    height={card.type === "rent" ? 170 : 140}
                    className={`brs-img-${card.type}`}
                    priority
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </>
  );
}
