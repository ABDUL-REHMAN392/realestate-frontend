"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Shield, Users, Home, MessageSquare, Clock, ArrowRight, TrendingUp } from "lucide-react";

// ─── Why Choose Us ─────────────────────────────
const WHY_FEATURES = [
  { icon: Shield,       title: "Verified Professionals",  desc: "All agents are verified and background checked." },
  { icon: Users,        title: "Local Market Experts",    desc: "In-depth knowledge of local markets and trends." },
  { icon: Home,         title: "Best Property Deals",     desc: "Access to exclusive listings and best deals." },
  { icon: MessageSquare,title: "Client Focused",          desc: "Dedicated support from start to finish." },
  { icon: Clock,        title: "24/7 Support",            desc: "We're here to help you anytime." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-[#F7FAF3] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#3B6D11] uppercase tracking-widest mb-2">
            Why Choose Our Agents?
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C]">
            Professional. <span className="text-[#3B6D11]">Trusted.</span> Reliable.
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {WHY_FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-5 border border-[#E5EDD8] hover:shadow-md transition text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EAF4DC] flex items-center justify-center mx-auto mb-4">
                <Icon className="h-6 w-6 text-[#3B6D11]" />
              </div>
              <h3 className="font-semibold text-[#1C1C1C] text-sm mb-2">{title}</h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonial Card ──────────────────────────
export interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { _id: string; name: string; photo?: string };
  agent?: { city?: string };
}

function TestimonialCard({ review, city }: { review: Review; city: string }) {
  return (
    <div className="bg-white border border-[#E5EDD8] rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star
            key={s}
            className={`h-4 w-4 ${s < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
          />
        ))}
      </div>
      <p className="text-sm text-[#374151] leading-relaxed mb-5 line-clamp-4">
        &ldquo;{review.comment}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        {/* ✅ FIX: optional chaining on review.user to prevent TypeError */}
        {review.user?.photo ? (
          <img
            src={review.user.photo}
            alt={review.user?.name ?? "User"}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {review.user?.name?.charAt(0) ?? "?"}
            </span>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-[#1C1C1C]">{review.user?.name ?? "Anonymous"}</p>
          <p className="text-xs text-[#9CA3AF]">{city}</p>
        </div>
      </div>
    </div>
  );
}

const FALLBACK_REVIEWS = [
  { _id: "1", rating: 5, comment: "Found my dream home with their help. The agent was professional and guided me throughout the process.", createdAt: "", user: { _id: "1", name: "Ahmed Zaheer" }, agent: { city: "Lahore" } },
  { _id: "2", rating: 5, comment: "Very professional service. Helped me find the perfect rental property in Karachi. Highly recommended!", createdAt: "", user: { _id: "2", name: "Fatima Ali" }, agent: { city: "Karachi" } },
  { _id: "3", rating: 5, comment: "Excellent investment advice and market knowledge. Truly impressive service from start to finish.", createdAt: "", user: { _id: "3", name: "Bilal Hassan" }, agent: { city: "Islamabad" } },
];

export function Testimonials({ reviews, loading }: { reviews: Review[]; loading: boolean }) {
  // ✅ FIX: filter out reviews where user is null/undefined before rendering
  const validReviews = reviews.filter((r) => r !== null && !!r.user);
  const displayReviews = validReviews.length > 0 ? validReviews : FALLBACK_REVIEWS;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#3B6D11] uppercase tracking-widest mb-2">
            What Our Clients Say
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C]">Trusted by Thousands</h2>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#E5EDD8] p-6 animate-pulse space-y-3">
                <div className="flex gap-1">{Array.from({ length: 5 }).map((_, s) => <div key={s} className="w-4 h-4 bg-[#EAF3DE] rounded" />)}</div>
                <div className="h-3 bg-[#EAF3DE] rounded w-full" />
                <div className="h-3 bg-[#EAF3DE] rounded w-5/6" />
                <div className="h-3 bg-[#EAF3DE] rounded w-4/6" />
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-[#EAF3DE]" />
                  <div className="space-y-1">
                    <div className="h-3 bg-[#EAF3DE] rounded w-24" />
                    <div className="h-2 bg-[#EAF3DE] rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-5">
            {displayReviews.map((r) => (
              <TestimonialCard key={r._id} review={r} city={r.agent?.city ?? "Pakistan"} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Join CTA ──────────────────────────────────
export function JoinCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      <div className="relative bg-[#1A3D06] rounded-3xl overflow-hidden px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div
          className="absolute right-36 inset-y-0 w-32 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)", backgroundSize: "14px 14px" }}
        />
        <div className="relative z-10">
          <p className="text-[#A3C97A] text-xs font-semibold uppercase tracking-widest mb-2">Become an Agent</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Join GharFind as an Agent</h2>
          <p className="text-white/60 text-sm">Grow your business, reach more clients and close more deals.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
          <Link
            href="/become-agent"
            className="bg-[#4A8C1C] hover:bg-[#5A9C2C] text-white text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition"
          >
            Join as Agent <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/agent-info"
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
          >
            Learn More
          </Link>
        </div>
        <div className="absolute right-4 bottom-0 h-28 hidden md:block pointer-events-none">
          <Image
            src="/agents/becomeagent.png"
            alt="Become an agent"
            width={130}
            height={112}
            className="h-full w-auto object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}

// ─── Trust Bar ─────────────────────────────────
const TRUST_STATS = [
  { icon: Shield,      title: "100% Verified Agents",  sub: "Trusted & Background Checked" },
  { icon: Home,        title: "10K+ Properties Sold",  sub: "Successfully Closed Deals" },
  { icon: Users,       title: "50K+ Happy Clients",    sub: "Satisfaction Guaranteed" },
  { icon: Clock,       title: "24/7 Support",          sub: "We are here to help" },
];

export function TrustBar() {
  return (
    <section className="border-t border-[#E5EDD8] bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {TRUST_STATS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF4DC] flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-[#3B6D11]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1C1C1C]">{title}</p>
              <p className="text-xs text-[#9CA3AF]">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}