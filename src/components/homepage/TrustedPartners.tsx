// components/homepage/TrustedPartners.tsx
"use client";

import React from "react";

interface PartnerLogo {
  name: string;
  svg: React.ReactNode;
}

const PARTNER_LOGOS: PartnerLogo[] = [
  {
    name: "Emaar Properties",
    svg: (
      <svg className="h-8 w-auto" viewBox="0 0 160 38" fill="none">
        <g fill="#1F2937">
          <path d="M4 8h17v3.5H8.5v5.5h11v3.5h-11v6H22V30H4V8zm23 0h5.2l6 14.5L44.5 8h5v22h-4.2V15l-5 12h-3l-5-12v15H27V8zm26 0h5.5l9 22h-4.8l-2-5.5h-9.5l-2 5.5h-4.5L53 8zm2.2 5.5L52 21h7.5l-3.3-7.5zm17.5-5.5h5.5l9 22h-4.8l-2-5.5h-9.5l-2 5.5h-4.5L72.7 8zm2.2 5.5l-3.2 7.5h7.5l-3.3-7.5zm17.6-5.5h11c4.5 0 8.5 2.5 8.5 7.2 0 3.5-2.5 5.8-5.8 6.7l6.8 8.1h-5.5l-6-7.5h-4.5V30h-4.5V8zm4.5 3.5v7.2h6c2.8 0 4.2-1.5 4.2-3.6s-1.4-3.6-4.2-3.6h-6z" />
        </g>
        <circle cx="140" cy="19" r="4" fill="#C5A059" />
      </svg>
    ),
  },
  {
    name: "HBL - Habib Bank Limited",
    svg: (
      <svg className="h-9 w-auto" viewBox="0 0 160 40" fill="none">
        <rect x="0" y="4" width="34" height="32" rx="7" fill="#008265" />
        <path d="M10 12v16M24 12v16M10 20h14" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" />
        <text x="44" y="27" fill="#008265" fontSize="24" fontWeight="900" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="-0.5px">HBL</text>
      </svg>
    ),
  },
  {
    name: "Standard Chartered",
    svg: (
      <svg className="h-8 w-auto" viewBox="0 0 210 38" fill="none">
        {/* Official SC Dual Ribbon */}
        <path d="M18 10c-5.5 0-9 3.5-9 8 0 7 11 4.5 11 10.5 0 4-3.5 6-8.5 6-4 0-7.5-1.5-9.5-3.5l2.5-4c1.8 1.5 4.2 2.5 6.8 2.5 3 0 4.2-1.2 4.2-2.5 0-6-11-4-11-10.5 0-5.5 4.5-8.5 10-8.5 3.5 0 6.5 1 8.5 2.5l-2.5 4c-1.5-1-3.8-2-6.5-2z" fill="#009A44" />
        <path d="M28 8c5 0 8 3 8 7 0 6-9 4-9 9 0 3.5 3 5 7 5 3 0 5.5-1 7-2l2 3.5c-2 1.5-5 2.5-8.5 2.5-6.5 0-11-3.5-11-9 0-6.5 9-4.5 9-9 0-2.5-2-3.5-5-3.5-2.5 0-5 1-6.5 2l-2-3.5c2.5-1.5 5.5-2 9-2z" fill="#0072CE" />
        <text x="48" y="18" fill="#0072CE" fontSize="13" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">Standard</text>
        <text x="48" y="31" fill="#009A44" fontSize="13" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">Chartered</text>
      </svg>
    ),
  },
  {
    name: "Meezan Bank",
    svg: (
      <svg className="h-9 w-auto" viewBox="0 0 190 40" fill="none">
        {/* Official Meezan Bank Crescent & Star */}
        <circle cx="16" cy="20" r="15" fill="#2E3192" />
        <path d="M16 8a12 12 0 1 0 12 12A12 12 0 0 0 16 8zm0 20a8 8 0 0 1-5.6-13.7 9.2 9.2 0 0 0 7.3 13.5A7.9 7.9 0 0 1 16 28z" fill="#FBB03B" />
        <text x="40" y="21" fill="#2E3192" fontSize="16" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="-0.2px">Meezan Bank</text>
        <text x="40" y="32" fill="#FBB03B" fontSize="8.5" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.4px">The Premier Islamic Bank</text>
      </svg>
    ),
  },
  {
    name: "Bank Alfalah",
    svg: (
      <svg className="h-9 w-auto" viewBox="0 0 185 40" fill="none">
        {/* Official Bank Alfalah Red Spiral */}
        <circle cx="16" cy="20" r="14" fill="#ED1C24" />
        <path d="M11 16c0-3 8-3 8 2s-8 3-8 8" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="16" cy="27" r="1.5" fill="#ffffff" />
        <text x="40" y="21" fill="#ED1C24" fontSize="16" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">Bank Alfalah</text>
        <text x="40" y="32" fill="#231F20" fontSize="8" fontWeight="600" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.8px">ISLAMIC & CONVENTIONAL</text>
      </svg>
    ),
  },
  {
    name: "Bahria Town",
    svg: (
      <svg className="h-9 w-auto" viewBox="0 0 185 40" fill="none">
        {/* Official Bahria Town Gold & Navy Emblem */}
        <circle cx="16" cy="20" r="15" fill="#0A192F" stroke="#C5A059" strokeWidth="2" />
        <path d="M8 24l4-9 4 5 4-5 4 9H8z" fill="#C5A059" />
        <circle cx="16" cy="12" r="1.8" fill="#C5A059" />
        <text x="40" y="21" fill="#0A192F" fontSize="15" fontWeight="900" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5px">BAHRIA TOWN</text>
        <text x="40" y="32" fill="#C5A059" fontSize="8" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="1px">A NEW WAY ON LIFE</text>
      </svg>
    ),
  },
  {
    name: "DHA Pakistan",
    svg: (
      <svg className="h-9 w-auto" viewBox="0 0 170 40" fill="none">
        {/* Official DHA Shield Crest */}
        <path d="M15 4l14 7v16l-14 9-14-9V11l14-7z" fill="#1C3D12" stroke="#B89738" strokeWidth="1.8" />
        <path d="M15 11l7 10h-14l7-10z" fill="#B89738" />
        <text x="38" y="22" fill="#1C3D12" fontSize="18" fontWeight="900" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5px">DHA</text>
        <text x="38" y="33" fill="#B89738" fontSize="8.5" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="2px">PAKISTAN</text>
      </svg>
    ),
  },
  {
    name: "MCB Bank",
    svg: (
      <svg className="h-9 w-auto" viewBox="0 0 160 40" fill="none">
        {/* Official MCB Orange / Navy Circular Symbol */}
        <circle cx="16" cy="20" r="14" fill="#F58220" />
        <path d="M16 6a14 14 0 0 1 0 28V6z" fill="#002D62" />
        <circle cx="16" cy="20" r="5" fill="#ffffff" />
        <text x="38" y="26" fill="#002D62" fontSize="20" fontWeight="900" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5px">MCB</text>
        <text x="90" y="26" fill="#F58220" fontSize="14" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">BANK</text>
      </svg>
    ),
  },
  {
    name: "JS Bank",
    svg: (
      <svg className="h-9 w-auto" viewBox="0 0 150 40" fill="none">
        <rect x="0" y="5" width="30" height="30" rx="7" fill="#0033A0" />
        <path d="M9 14h6v9c0 3-2 4-5 3M16 14h6c2 0 4 1 2 4s-3 2-3 4l4 4" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <text x="40" y="26" fill="#0033A0" fontSize="18" fontWeight="900" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5px">JS BANK</text>
      </svg>
    ),
  },
  {
    name: "Habib Metro",
    svg: (
      <svg className="h-9 w-auto" viewBox="0 0 185 40" fill="none">
        <rect x="0" y="5" width="30" height="30" rx="6" fill="#006837" />
        <path d="M7 12l8 9 8-9v16h-4.5v-9l-3.5 4.5-3.5-4.5v9H7V12z" fill="#ffffff" />
        <text x="38" y="22" fill="#006837" fontSize="15" fontWeight="900" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">HABIBMETRO</text>
        <text x="38" y="32" fill="#8DC63F" fontSize="8" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.8px">BANK LIMITED</text>
      </svg>
    ),
  },
];

export function TrustedPartners() {
  const doubledLogos = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <>
      <style>{`
        .partners-section {
          padding: 60px 0 50px;
          background: #ffffff;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
        }

        .partners-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
          margin-bottom: 32px;
        }

        .partners-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #3b6d11;
          margin-bottom: 8px;
          display: inline-block;
        }

        .partners-heading {
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }

        .partners-caption {
          font-size: 14px;
          color: #6b7280;
          margin: 0 auto;
          max-width: 520px;
        }

        /* Continuous Seamless Marquee Container */
        .marquee-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 16px 0;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .marquee-track {
          display: flex;
          align-items: center;
          gap: 60px;
          width: max-content;
          animation: marqueeScroll 38s linear infinite;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Default: Clean Grayscale / Gray color
           Hover: Full authentic original brand colors! */
        .partner-logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          filter: grayscale(100%) opacity(0.45);
          transition: filter 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          cursor: pointer;
          user-select: none;
        }

        .partner-logo-item:hover {
          filter: grayscale(0%) opacity(1);
          transform: scale(1.08);
        }

        @media (max-width: 768px) {
          .partners-section {
            padding: 44px 0 36px;
          }
          .marquee-track {
            gap: 40px;
            animation-duration: 28s;
          }
          .partner-logo-item {
            filter: grayscale(100%) opacity(0.6);
          }
        }
      `}</style>

      <section className="partners-section">
        <div className="partners-container">
          <span className="partners-eyebrow">TRUSTED NETWORK</span>
          <h3 className="partners-heading">Trusted by Leading Developers & Banks</h3>
          <p className="partners-caption">
            Partnered with Pakistan&apos;s premier housing authorities, master builders, and financial institutions.
          </p>
        </div>

        {/* Infinite Logo Marquee with Grayscale-to-Color on Hover */}
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {doubledLogos.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="partner-logo-item"
                title={partner.name}
              >
                {partner.svg}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
