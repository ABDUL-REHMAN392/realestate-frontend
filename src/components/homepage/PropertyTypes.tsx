"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    id: "house",
    title: "Houses",
    href: "/properties?type=house",
    image: "/homepage/category/houses.svg",
  },
  {
    id: "apartment",
    title: "Apartments",
    href: "/properties?type=apartment",
    image: "/homepage/category/apartments.svg",
  },
  {
    id: "plot",
    title: "Plots & Land",
    href: "/properties?type=plot",
    image: "/homepage/category/plots-and-land.svg",
  },
  {
    id: "commercial",
    title: "Commercial",
    href: "/properties?type=commercial",
    image: "/homepage/category/commercial.svg",
  },
  {
    id: "villa",
    title: "Luxury Villas",
    href: "/properties?type=villa",
    image: "/homepage/category/luxury-villas.svg",
  },
  {
    id: "industrial",
    title: "Industrial",
    href: "/properties?type=industrial",
    image: "/homepage/category/industrial.svg",
  },
];

const containerVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
    },
  },
} as const;

export function PropertyTypes() {
  return (
    <>
      <style>{`
        /* =========================================
           SECTION
        ========================================= */

        .ptypes-section {
          max-width: 1160px;
          margin: 0 auto;
          padding: 70px 24px;
        }

        /* =========================================
           HEADER
        ========================================= */

        .ptypes-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
          gap: 16px;
        }

        .ptypes-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3b6d11;
          margin: 0 0 8px;
        }

        .ptypes-title {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 6px;
        }

        .ptypes-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        /* =========================================
           GRID
        ========================================= */

        .ptypes-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
        }

        /* =========================================
           CARD
        ========================================= */

        .ptype-card {
          position: relative;

          background: #ffffff;

          border: 1.5px solid #edf0ea;
          border-radius: 18px;

          padding: 4px 10px 7px;

          text-decoration: none;
          color: inherit;

          display: flex;
          flex-direction: column;

          min-height: 200px;

          overflow: hidden;

          transition: none;
        }

        /* =========================================
           ILLUSTRATION
        ========================================= */

        .ptype-visual {
          position: relative;

          width: 100%;
          height: 145px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: -8px;

          overflow: hidden;
        }

        .ptype-image {
          width: 100%;
          height: 145px;

          object-fit: contain;
          object-position: center;

          display: block;

          transform: none;
          transition: none;
        }

        /* =========================================
           TITLE
        ========================================= */

        .ptype-info {
          display: flex;
          flex-direction: column;

          width: 100%;

          padding: 0;

          margin-top: 0;

          text-align: center;
        }

        .ptype-name {
          font-size: 15px;
          font-weight: 800;

          color: #111827;

          margin: 0;

          letter-spacing: -0.01em;
          line-height: 1.25;

          text-align: center;
        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 1100px) {
          .ptypes-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }

          .ptype-card {
            min-height: 205px;
          }

          .ptype-visual {
            height: 150px;
            margin-bottom: -8px;
          }

          .ptype-image {
            height: 150px;
          }
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 640px) {
          .ptypes-section {
            padding: 50px 18px;
          }

          .ptypes-head {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 24px;
          }

          .ptypes-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .ptype-card {
            padding: 3px 8px 6px;
            min-height: 165px;
            border-radius: 15px;
          }

          .ptype-visual {
            height: 115px;
            margin-bottom: -6px;
          }

          .ptype-image {
            height: 115px;
          }

          .ptype-name {
            font-size: 14px;
          }
        }

        /* =========================================
           SMALL MOBILE
        ========================================= */

        @media (max-width: 400px) {
          .ptypes-section {
            padding-left: 14px;
            padding-right: 14px;
          }

          .ptypes-grid {
            gap: 8px;
          }

          .ptype-card {
            min-height: 155px;
            padding: 2px 7px 5px;
          }

          .ptype-visual {
            height: 108px;
            margin-bottom: -5px;
          }

          .ptype-image {
            height: 108px;
          }

          .ptype-name {
            font-size: 13px;
          }
        }

        /* =========================================
           REDUCED MOTION
        ========================================= */

        @media (prefers-reduced-motion: reduce) {
          .ptype-card,
          .ptype-image {
            transition: none;
          }
        }
      `}</style>

      <section className="ptypes-section">

        {/* HEADER */}

        <div className="ptypes-head">
          <div>
            <p className="ptypes-eyebrow">
              CATEGORIES
            </p>

            <h2 className="ptypes-title">
              Explore Property Types
            </h2>

            <p className="ptypes-subtitle">
              Select a category to browse verified listings across Pakistan.
            </p>
          </div>
        </div>

        {/* CATEGORY GRID */}

        <motion.div
          className="ptypes-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
        >
          {CATEGORIES.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
            >
              <Link
                href={item.href}
                className="ptype-card"
              >
                {/* SVG */}
                <div className="ptype-visual">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="ptype-image"
                    loading="lazy"
                  />
                </div>

                {/* CENTERED TITLE */}
                <div className="ptype-info">
                  <h3 className="ptype-name">
                    {item.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </section>
    </>
  );
}