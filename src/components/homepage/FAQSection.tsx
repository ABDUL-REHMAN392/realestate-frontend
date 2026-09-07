// components/homepage/FAQSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does GharFind verify property listings?",
    answer:
      "Every property on GharFind undergoes a comprehensive verification process. Our team checks property documentation, ownership details, and on-ground location accuracy before awarding the 'Verified' trust badge.",
  },
  {
    question: "Is there any fee to search or contact property owners/agents?",
    answer:
      "No, browsing properties, using search filters, and contacting verified agents or property owners on GharFind is completely free for buyers and tenants.",
  },
  {
    question: "How do I list my property for sale or rent?",
    answer:
      "Listing your property is quick and straightforward. Create an account, head over to your Dashboard > Listings, provide details like property type, location, price, and upload clear photos. Once submitted, our team will review and publish your listing.",
  },
  {
    question: "What documents are required to buy property in Pakistan?",
    answer:
      "Typically, you need the original Title Deed (Registry / Allotment Letter / Transfer Letter), Mutation (Inteqal), Non-Encumbrance Certificate (NOC), and valid CNIC copies of the buyer and seller.",
  },
  {
    question: "How do I schedule a physical site visit for a property?",
    answer:
      "Open any property page and click 'Schedule Visit' or contact the listed agent directly via Call or WhatsApp to choose a suitable date and time for an on-site viewing.",
  },
  {
    question: "How does the Mortgage Calculator help me plan my purchase?",
    answer:
      "Our Mortgage Calculator calculates estimated monthly installments, interest rates (KIBOR-aligned), down payment splits, and loan tenures across major Pakistani commercial banks to help you budget accurately.",
  },
  {
    question: "How can real estate agents register and get verified?",
    answer:
      "Real estate agents and agencies can apply through the 'Become an Agent' page. After verifying your agency credentials, CNIC, and track record, you receive an official verified badge and full CRM dashboard access.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <style>{`
        .faq-wrap {
          max-width: 1160px;
          margin: 0 auto;
          padding: 80px 24px 70px;
          position: relative;
        }

        .faq-head-container {
          position: relative;
          margin-bottom: 40px;
        }

        .faq-head {
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .faq-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3b6d11;
          margin-bottom: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .faq-title {
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 12px;
        }

        .faq-subtitle {
          font-size: 15px;
          color: #6b7280;
          max-width: 540px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Top Right Architecture Illustration */
        .faq-illustration-right {
          position: absolute;
          right: 0;
          top: -15px;
          width: 270px;
          height: auto;
          pointer-events: none;
          z-index: 1;
          opacity: 0.9;
        }

        .faq-img {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(59, 109, 17, 0.08));
        }

        /* 2-Column Layout: Left Card + Right FAQ Accordions */
        .faq-main-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 32px;
          align-items: start;
          position: relative;
          z-index: 2;
        }

        /* Left Card - Fixed & Independent Height */
        .faq-left-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1.5px solid #edf2e9;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          height: 490px;
          align-self: start;
        }

        .faq-left-header {
          position: relative;
          z-index: 3;
          padding: 32px 28px 16px 28px;
        }

        .faq-left-icon-bubble {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          background: #eef6e6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .faq-left-icon-bubble svg {
          width: 26px;
          height: 26px;
          color: #3b6d11;
        }

        .faq-left-title {
          font-size: 22px;
          font-weight: 800;
          color: #111827;
          line-height: 1.25;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .faq-left-title-green {
          color: #3b6d11;
          display: block;
        }

        .faq-left-divider {
          width: 36px;
          height: 3.5px;
          background: #3b6d11;
          border-radius: 2px;
          margin: 14px 0 14px;
        }

        .faq-left-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        /* Full-width Image Wrap firmly at the bottom of the card */
        .faq-card-image-wrap {
          position: relative;
          z-index: 2;
          width: 100%;
          margin-top: auto;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          line-height: 0;
        }

        .faq-card-house-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          object-position: bottom center;
        }

        /* Right Column FAQ List */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          border: 1.5px solid #f0f0f0;
          border-radius: 16px;
          background: #ffffff;
          overflow: hidden;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .faq-item:hover {
          border-color: #d1e7be;
        }

        .faq-item.is-open {
          border-color: #3b6d11;
          background: #fafdf7;
          box-shadow: 0 6px 20px rgba(59, 109, 17, 0.06);
        }

        .faq-question-btn {
          width: 100%;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }

        .faq-q-text {
          font-size: 15.5px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          line-height: 1.4;
        }

        .faq-item.is-open .faq-q-text {
          color: #25490a;
        }

        .faq-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #6b7280;
          transition: all 0.25s ease;
        }

        .faq-item.is-open .faq-icon-wrap {
          background: #3b6d11;
          color: #ffffff;
          transform: rotate(180deg);
        }

        .faq-answer-wrap {
          padding: 0 24px 20px;
        }

        .faq-a-text {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.7;
          margin: 0;
        }

        /* Bottom Support Helper Box */
        .faq-support-box {
          margin-top: 48px;
          padding: 28px 32px;
          border-radius: 20px;
          background: #f8faf6;
          border: 1.5px dashed #cde3bb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: relative;
          z-index: 2;
        }

        .faq-support-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .faq-support-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #eaf3de;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b6d11;
          flex-shrink: 0;
        }

        .faq-support-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 2px;
        }

        .faq-support-desc {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .faq-support-btns {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .faq-btn-chat {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-radius: 10px;
          background: #3b6d11;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .faq-btn-chat:hover {
          background: #2f570e;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 109, 17, 0.25);
        }

        .faq-btn-mail {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .faq-btn-mail:hover {
          border-color: #3b6d11;
          color: #3b6d11;
          background: #f8fcf4;
        }

        @media (max-width: 1024px) {
          .faq-main-grid {
            grid-template-columns: 300px 1fr;
            gap: 24px;
          }
          .faq-left-card {
            height: 470px;
          }
          .faq-illustration-right {
            width: 200px;
            top: -10px;
            opacity: 0.6;
          }
        }

        @media (max-width: 860px) {
          .faq-main-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .faq-left-card {
            height: auto;
            min-height: 420px;
          }
          .faq-illustration-right {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .faq-wrap {
            padding: 60px 18px 50px;
          }
          .faq-question-btn {
            padding: 16px 18px;
          }
          .faq-q-text {
            font-size: 15px;
          }
          .faq-answer-wrap {
            padding: 0 18px 16px;
          }
          .faq-support-box {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
          }
          .faq-support-btns {
            width: 100%;
            flex-direction: column;
          }
          .faq-btn-chat, .faq-btn-mail {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <section className="faq-wrap">
        {/* Header with Top-Right Skyline Illustration */}
        <div className="faq-head-container">
          <motion.div
            className="faq-illustration-right"
            initial={{ opacity: 0, x: 25, y: -5 }}
            whileInView={{ opacity: 0.95, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src="/homepage/faq/faq-illustration.png"
              alt="GharFind Real Estate Architecture"
              width={340}
              height={140}
              className="faq-img"
              priority
            />
          </motion.div>

          <div className="faq-head">
            <p className="faq-eyebrow">
              <HelpCircle style={{ width: 14, height: 14 }} />
              GOT QUESTIONS?
            </p>
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-subtitle">
              Find answers to common questions about buying, renting, selling, and
              navigating GharFind.
            </p>
          </div>
        </div>

        {/* Main 2-Column Section: Left Card + Right FAQ Accordions */}
        <div className="faq-main-grid">
          {/* Left Helper Card with Fixed Stable Height */}
          <motion.div
            className="faq-left-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Card Content Top */}
            <div className="faq-left-header">
              {/* Question Icon Bubble */}
              <div className="faq-left-icon-bubble">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="faq-left-title">
                Have Questions?
                <span className="faq-left-title-green">We&apos;re Here to Help</span>
              </h3>

              {/* Accent Divider */}
              <div className="faq-left-divider" />

              {/* Description */}
              <p className="faq-left-desc">
                Can&apos;t find what you&apos;re looking for? Our team is ready to
                assist you with any questions.
              </p>
            </div>

            {/* Full-width Bottom House Image */}
            <div className="faq-card-image-wrap">
              <Image
                src="/homepage/faq/faq-house.png"
                alt="Have Questions? We are here to help"
                width={360}
                height={260}
                className="faq-card-house-img"
                priority
              />
            </div>
          </motion.div>

          {/* Right Column: FAQ Accordion List */}
          <div className="faq-list">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={faq.question}
                  className={`faq-item ${isOpen ? "is-open" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <button
                    className="faq-question-btn"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{faq.question}</span>
                    <div className="faq-icon-wrap">
                      <ChevronDown style={{ width: 18, height: 18 }} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="faq-answer-wrap">
                          <p className="faq-a-text">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Support helper box */}
        <div className="faq-support-box">
          <div className="faq-support-info">
            <div className="faq-support-icon">
              <MessageCircle style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <h4 className="faq-support-title">Still have questions?</h4>
              <p className="faq-support-desc">
                Our support team and property advisors are available 24/7.
              </p>
            </div>
          </div>
          <div className="faq-support-btns">
            <Link href="/become-agent" className="faq-btn-chat">
              Contact Advisor <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
            <a href="mailto:hello@gharfind.pk" className="faq-btn-mail">
              <Mail style={{ width: 14, height: 14 }} /> Email Support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
