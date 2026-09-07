// components/homepage/Testimonials.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MessageSquareHeart } from "lucide-react";

const ROW_ONE = [
  {
    id: 1,
    name: "Omar Siddiqui",
    role: "Property Buyer · Karachi",
    photo: "https://randomuser.me/api/portraits/men/34.jpg",
    rating: 5,
    comment: "GharFind ke search filters ne meri weeks ki mehnat bacha li. Teen din mein exactly jo chahiye tha woh mil gaya.",
  },
  {
    id: 2,
    name: "Nadia Hussain",
    role: "Tenant · Lahore",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    rating: 5,
    comment: "Agent bilkul professional tha. Listing mein jo dikh raha tha wahi ghar mein nikla — koi hidden fees nahi, koi surprise nahi.",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    role: "First-time Buyer · Islamabad",
    photo: "https://randomuser.me/api/portraits/men/36.jpg",
    rating: 5,
    comment: "Pehli baar ghar khareed raha tha. GharFind ki verified listing ne itna confidence diya ke bina kisi doubt ke deal ho gayi.",
  },
  {
    id: 4,
    name: "Sara Qureshi",
    role: "Property Seller · Rawalpindi",
    photo: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 5,
    comment: "5 din mein 4 serious buyers aa gaye. Koi faltu inquiries nahi — sab genuine the aur deal bhi jaldi ho gayi.",
  },
  {
    id: 5,
    name: "Usman Ali",
    role: "Investor · Multan",
    photo: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 5,
    comment: "Price alerts aur mortgage calculator ne mujhe accurate projections diye. Ab sirf GharFind use karta hoon investments ke liye.",
  },
];

const ROW_TWO = [
  {
    id: 6,
    name: "Hira Malik",
    role: "Tenant · Faisalabad",
    photo: "https://randomuser.me/api/portraits/women/46.jpg",
    rating: 5,
    comment: "Virtual tour ne ghar aane se pehle poori idea de di. Jab gaya toh koi farq nahi tha — moving in bohat smooth rahi.",
  },
  {
    id: 7,
    name: "Tariq Mehmood",
    role: "Property Buyer · Peshawar",
    photo: "https://randomuser.me/api/portraits/men/53.jpg",
    rating: 5,
    comment: "Doosre portals pe scam ka darr rehta tha. GharFind pe seller directly verified tha — ghar dekha, pasand aaya, deal ho gayi.",
  },
  {
    id: 8,
    name: "Amna Rizvi",
    role: "First-time Buyer · Quetta",
    photo: "https://randomuser.me/api/portraits/women/48.jpg",
    rating: 5,
    comment: "Budget tight tha phir bhi GharFind ne exact range mein options diye. Ghar bhi mila aur koi compromise nahi karna para.",
  },
  {
    id: 9,
    name: "Kamran Baig",
    role: "Commercial Buyer · Hyderabad",
    photo: "https://randomuser.me/api/portraits/men/37.jpg",
    rating: 5,
    comment: "Commercial property dhundh raha tha aur bohat options the magar GharFind ne sab ko ek jagah filter karke easy kar diya.",
  },
  {
    id: 10,
    name: "Fatima Zahra",
    role: "Tenant · Sialkot",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    comment: "Sialkot mein rental options bohat kam hain magar GharFind pe verified listings thi. Agent responsive tha aur process fast raha.",
  },
];

function TestiCard({ item }: { item: typeof ROW_ONE[0] }) {
  return (
    <div className="tcard">
      <div className="tcard-stars">
        {[...Array(item.rating)].map((_, i) => (
          <Star key={i} style={{ width: 15, height: 15, fill: "#f59e0b", color: "#f59e0b" }} />
        ))}
      </div>
      <p className="tcard-comment">&ldquo;{item.comment}&rdquo;</p>
      <div className="tcard-user">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.photo} alt={item.name} className="tcard-photo" />
        <div>
          <p className="tcard-name">{item.name}</p>
          <p className="tcard-role">{item.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <>
      <style>{`
        .ts-section {
          background: #ffffff;
          padding: 80px 0 72px;
          overflow: hidden;
        }

        /* Header */
        .ts-header {
          max-width: 1160px;
          margin: 0 auto 48px;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 400px;
          align-items: center;
          gap: 32px;
        }

        .ts-header-text {
          display: flex;
          flex-direction: column;
        }

        .ts-illus {
          width: 100%;
          height: auto;
          display: block;
        }

        @media (max-width: 900px) {
          .ts-header {
            grid-template-columns: 1fr;
          }
          .ts-illus-wrap { display: none; }
        }

        .ts-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #3b6d11;
          margin-bottom: 12px;
        }

        .ts-title {
          font-size: clamp(24px, 3.2vw, 36px);
          font-weight: 800;
          color: #0d0d0d;
          letter-spacing: -0.022em;
          line-height: 1.18;
          margin: 0 0 10px;
        }

        .ts-title em {
          font-style: normal;
          color: #3b6d11;
        }

        .ts-subtitle {
          font-size: 14.5px;
          color: #6b7280;
          line-height: 1.65;
          margin: 0;
          max-width: 460px;
        }

        /* Marquee rows */
        .ts-marquee-wrap {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .ts-row {
          display: flex;
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        .ts-track {
          display: flex;
          gap: 18px;
          width: max-content;
          animation: marquee-left 35s linear infinite;
        }

        .ts-track-reverse {
          animation: marquee-right 38s linear infinite;
        }

        .ts-row:hover .ts-track,
        .ts-row:hover .ts-track-reverse {
          animation-play-state: paused;
        }

        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        /* Card */
        .tcard {
          background: #ffffff;
          border: 1.5px solid #e8ede3;
          border-radius: 14px;
          padding: 22px 24px 20px;
          width: 320px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .tcard-stars {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-bottom: 12px;
        }

        .tcard-comment {
          font-size: 13.5px;
          color: #374151;
          line-height: 1.7;
          margin: 0 0 16px;
          flex: 1;
        }

        .tcard-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid #f0f4eb;
        }

        .tcard-photo {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .tcard-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 2px;
        }

        .tcard-role {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        @media (max-width: 640px) {
          .ts-section { padding: 60px 0 52px; }
          .tcard { width: 270px; padding: 18px 18px 16px; }
        }
      `}</style>

      <section className="ts-section">
        {/* Header */}
        <div className="ts-header">
          <motion.div
            className="ts-header-text"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <p className="ts-eyebrow">
              <MessageSquareHeart style={{ width: 13, height: 13 }} />
              Client Experiences
            </p>
            <h2 className="ts-title">
              What Our <em>Clients</em> Say
            </h2>
            <p className="ts-subtitle">
              Real stories from buyers, sellers, and tenants who found their
              perfect property on GharFind.
            </p>
          </motion.div>

          <motion.div
            className="ts-illus-wrap"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <Image
              src="/homepage/testimonial/testimonial-illustration.png"
              alt="Happy GharFind clients"
              width={400}
              height={300}
              priority
              className="ts-illus"
            />
          </motion.div>
        </div>

        {/* Marquee rows */}
        <div className="ts-marquee-wrap">
          {/* Row 1 — scrolls left */}
          <div className="ts-row">
            <div className="ts-track">
              {[...ROW_ONE, ...ROW_ONE].map((item, i) => (
                <TestiCard key={`r1-${i}`} item={item} />
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right */}
          <div className="ts-row">
            <div className="ts-track ts-track-reverse">
              {[...ROW_TWO, ...ROW_TWO].map((item, i) => (
                <TestiCard key={`r2-${i}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}