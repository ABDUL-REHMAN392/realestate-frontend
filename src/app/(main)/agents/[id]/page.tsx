"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { agentApi } from "@/lib/api";
import { useUser } from "@/store/auth.store";
import {
  MapPin, Star, BadgeCheck, Building2, MessageCircle,
  Phone, Globe, Clock, Award, ChevronLeft, ChevronRight,
  Bed, Bath, Maximize2, ArrowLeft, Send,
  CheckCircle2, Users, TrendingUp, ThumbsUp, Share2,
  Calendar, ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Agent {
  _id: string;
  bio: string;
  experience: number;
  licenseNumber: string;
  agencyName?: string;
  city: string;
  specializations: string[];
  languages: string[];
  isVerified: boolean;
  avgRating: number;
  totalReviews: number;
  totalListings: number;
  whatsapp?: string;
  website?: string;
  user: { _id: string; name: string; email: string; photo?: string; phone?: string };
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: { name: string; photo?: string };
}

interface Property {
  _id: string;
  title: string;
  purpose: "sale" | "rent";
  price: number;
  area: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  address: { city: string };
  images: { url: string; isPrimary: boolean }[];
}

function formatPrice(p: number) {
  if (p >= 10000000) return `${(p / 10000000).toFixed(1)} Cr`;
  if (p >= 100000) return `${(p / 100000).toFixed(0)} Lac`;
  return p.toLocaleString();
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${s <= Math.round(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-200 fill-gray-200"
            }`}
        />
      ))}
    </div>
  );
}

// ── Random avatar pics for happy clients strip ──
const AVATAR_URLS = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/56.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
];

// ─── Review Form ──────────────────────────────
function ReviewForm({ agentId, onSubmit }: { agentId: string; onSubmit: () => void }) {
  const user = useUser();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (rating === 0) { setError("Please select a rating"); return; }
    if (comment.length < 10) { setError("Comment must be at least 10 characters"); return; }
    setSaving(true);
    try {
      await agentApi.addReview(agentId, { rating, comment });
      setRating(0); setComment(""); setError("");
      onSubmit();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Failed to submit review"
      );
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2EAD8] rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 className="font-semibold text-[#1C1C1C] text-base">Write a Review</h3>

      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => {
              if (!user) { router.push("/login"); return; }
              setRating(s);
            }}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star className={`h-7 w-7 transition-colors ${s <= (hover || rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
              }`} />
          </button>
        ))}
        {rating > 0 && (
          <span className="self-center text-sm text-[#6B7280] ml-2 font-medium">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onFocus={() => { if (!user) { router.push("/login"); } }}
        rows={3}
        placeholder="Share your experience with this agent..."
        className="w-full border border-[#D1E5B8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3B6D11] resize-none"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving} className="gap-2 bg-[#3B6D11] hover:bg-[#2d5209]">
        <Send className="h-4 w-4" />
        {saving ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}

// ─── MAIN PAGE ─────────────────────────────────
export default function AgentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const currentUser = useUser();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [listings, setListings] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotal, setReviewTotal] = useState(0);

  const myId =
    (currentUser as unknown as { id?: string })?.id ??
    (currentUser as unknown as { _id?: string })?._id ?? "";

  async function loadReviews(page = 1) {
    try {
      const { data } = await agentApi.getReviews(agentId, { page, limit: 6 });
      setReviews(data.data);
      setReviewTotal(data.total);
      setReviewPage(page);
    } catch { }
  }

  useEffect(() => {
    if (!agentId) return;
    Promise.all([
      agentApi.getAgentById(agentId),
      agentApi.getListings(agentId, { limit: 4 }),
      agentApi.getReviews(agentId, { page: 1, limit: 6 }),
    ])
      .then(([a, l, r]) => {
        setAgent(a.data.data.agent);
        setListings(l.data.data.data ?? []);
        setReviews(r.data.data);
        setReviewTotal(r.data.total);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [agentId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-64 bg-[#EAF3DE] rounded-2xl" />
        <div className="h-24 bg-[#EAF3DE] rounded-2xl" />
        <div className="h-6 bg-[#EAF3DE] rounded w-1/3" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="font-medium text-[#374151]">Agent not found</p>
        <Button onClick={() => router.push("/agents")} variant="outline" className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Agents
        </Button>
      </div>
    );
  }

  const isOwnProfile = !!myId && myId === agent.user._id;

  const handleContact = () => {
    if (!currentUser) { router.push("/login"); return; }
    router.push(`/dashboard/chat?userId=${agent.user._id}`);
  };

  const handleWhatsApp = () => {
    if (!currentUser) { router.push("/login"); return; }
    if (agent.whatsapp) {
      window.open(`https://wa.me/${agent.whatsapp.replace(/\D/g, "")}`, "_blank");
    }
  };

  const stats = [
    { icon: <TrendingUp className="h-5 w-5 text-[#3B6D11]" />, value: `${agent.totalListings}+`, label: "Listings" },
    { icon: <Clock className="h-5 w-5 text-[#3B6D11]" />, value: `${agent.experience}+`, label: "Years Exp." },
    { icon: <Users className="h-5 w-5 text-[#3B6D11]" />, value: "500+", label: "Happy Clients" },
    { icon: <ThumbsUp className="h-5 w-5 text-[#3B6D11]" />, value: "98%", label: "Satisfaction" },
    { icon: <Award className="h-5 w-5 text-[#3B6D11]" />, value: "Top 5%", label: `In ${agent.city}` },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-5 flex-wrap">
          <button onClick={() => router.push("/")} className="hover:text-[#3B6D11]">Home</button>
          <ChevronRightIcon className="h-3.5 w-3.5" />
          <button onClick={() => router.push("/agents")} className="hover:text-[#3B6D11]">Agents</button>
          <ChevronRightIcon className="h-3.5 w-3.5" />
          <span className="text-[#1C1C1C] font-medium truncate max-w-[160px]">{agent.user.name}</span>
        </div>

        {/* ── HERO CARD ── */}
        <div className="bg-white rounded-2xl border border-[#E2EAD8] overflow-hidden mb-4">
          <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">

              {/* ── Photo ── */}
              <div className="relative flex-shrink-0 w-full sm:w-56">
                {/* ✅ Mobile: full width, reasonable height | Desktop: fixed w-56 h-72 */}
                <div className="w-full sm:w-56 h-56 sm:h-72 rounded-2xl overflow-hidden bg-[#EAF3DE]">
                  {agent.user.photo ? (
                    <img
                      src={agent.user.photo}
                      alt={agent.user.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#3B6D11] text-7xl font-bold">
                      {agent.user.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Available badge */}
                <span className="absolute top-3 left-3 bg-[#3B6D11] text-white text-xs font-medium px-3 py-1 rounded-lg">
                  Available
                </span>

                {/* ✅ Happy clients strip with real random avatar pics */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#3B6D11] rounded-b-2xl px-3 py-2.5 flex items-center gap-2.5">
                  <div className="flex -space-x-2.5">
                    {AVATAR_URLS.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`client-${i}`}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                      />
                    ))}
                  </div>
                  <div className="text-white">
                    <p className="text-sm font-bold leading-none">500+</p>
                    <p className="text-[11px] opacity-80 mt-0.5">Happy Clients</p>
                  </div>
                </div>
              </div>

              {/* ── Info ── */}
              <div className="flex-1 min-w-0">
                {/* Name & verified */}
                <div className="flex items-start gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-3xl font-bold text-[#1C1C1C] leading-tight">
                    {agent.user.name}
                  </h1>
                  {agent.isVerified && (
                    <BadgeCheck className="h-6 w-6 text-[#3B6D11] mt-1 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[#6B7280] text-sm mt-0.5">
                  {agent.agencyName ?? "Senior Property Consultant"}
                </p>

                {/* Rating row */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-[#1C1C1C] text-sm">{agent.avgRating.toFixed(1)}</span>
                  <span className="text-sm text-[#6B7280]">({agent.totalReviews} Reviews)</span>
                  <span className="text-[#D1D5DB] hidden sm:inline">•</span>
                  <span className="text-sm text-[#6B7280]">{agent.totalListings}+ Deals</span>
                </div>

                {/* Info grid — 2 cols on all screens */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#3B6D11]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#9CA3AF]">Experience</p>
                      <p className="text-xs sm:text-sm font-semibold text-[#1C1C1C]">
                        {agent.experience}+ Years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                      <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#3B6D11]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#9CA3AF]">Specialization</p>
                      <p className="text-xs sm:text-sm font-semibold text-[#1C1C1C] truncate">
                        {agent.specializations.slice(0, 1).join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#3B6D11]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#9CA3AF]">Location</p>
                      <p className="text-xs sm:text-sm font-semibold text-[#1C1C1C] truncate">
                        {agent.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                      <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#3B6D11]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#9CA3AF]">Languages</p>
                      <p className="text-xs sm:text-sm font-semibold text-[#1C1C1C] truncate">
                        {agent.languages.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-[#6B7280] mt-3 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {agent.bio}
                </p>

                {/* Action buttons */}
                {!isOwnProfile && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      onClick={handleContact}
                      className="gap-1.5 bg-[#3B6D11] hover:bg-[#2d5209] text-white px-4 sm:px-5 h-10 rounded-xl text-sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Contact Agent</span>
                    </Button>
                    {agent.whatsapp && (
                      <Button
                        onClick={handleWhatsApp}
                        variant="outline"
                        className="gap-1.5 border-[#D1E5B8] text-[#3B6D11] hover:bg-[#F0F7E6] px-4 sm:px-5 h-10 rounded-xl text-sm"
                      >
                        <Phone className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: agent.user.name, url: window.location.href });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                      variant="outline"
                      className="gap-1.5 border-[#D1E5B8] text-[#6B7280] hover:border-[#3B6D11] px-4 sm:px-5 h-10 rounded-xl text-sm"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share Profile</span>
                      <span className="sm:hidden">Share</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="bg-white rounded-2xl border border-[#E2EAD8] p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#1C1C1C] text-sm sm:text-base leading-tight">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-[#9CA3AF] truncate">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FULL WIDTH CONTENT ── */}
        <div className="space-y-5 sm:space-y-6">

          {/* About Me */}
          <div className="bg-white rounded-2xl border border-[#E2EAD8] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">

              {/* About Me Text */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#1C1C1C] mb-3">About Me</h2>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{agent.bio}</p>
                <div className="space-y-2">
                  {agent.specializations.map((spec) => (
                    <div key={spec} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B6D11] flex-shrink-0" />
                      <span className="text-sm text-[#374151]">{spec}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3B6D11] flex-shrink-0" />
                    <span className="text-sm text-[#374151]">
                      Market expert in {agent.city} and nearby cities
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3B6D11] flex-shrink-0" />
                    <span className="text-sm text-[#374151]">Trusted by hundreds of clients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3B6D11] flex-shrink-0" />
                    <span className="text-sm text-[#374151]">Always available for my clients</span>
                  </div>
                </div>
              </div>

              {/* Dark CTA Box — hidden on mobile, show on sm+ */}
              <div className="hidden sm:flex flex-col justify-between bg-[#1C2B1A] rounded-2xl p-6 w-72 flex-shrink-0 relative overflow-hidden">
                <div className="absolute bottom-14 right-4 opacity-10">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                    <path d="M9 21V12h6v9" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-xl leading-snug mb-3">
                    Let's Find Your Dream Property
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    I'm here to help you find the perfect property that matches your needs.
                  </p>
                </div>
                <Button
                  onClick={handleContact}
                  className="mt-6 bg-[#3B6D11] hover:bg-[#2d5209] text-white text-sm gap-2 h-11 rounded-xl w-full"
                >
                  <Calendar className="h-4 w-4" /> Schedule a Meeting
                </Button>
              </div>

              {/* ✅ Mobile CTA — show only on mobile */}
              <div className="sm:hidden bg-[#1C2B1A] rounded-2xl p-5 relative overflow-hidden">
                <p className="text-white font-bold text-lg leading-snug mb-2">
                  Let's Find Your Dream Property
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  I'm here to help you find the perfect property that matches your needs.
                </p>
                <Button
                  onClick={handleContact}
                  className="bg-[#3B6D11] hover:bg-[#2d5209] text-white text-sm gap-2 h-10 rounded-xl w-full"
                >
                  <Calendar className="h-4 w-4" /> Schedule a Meeting
                </Button>
              </div>
            </div>
          </div>

          {/* My Listings */}
          {listings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1C1C1C]">My Listings</h2>
                <Link
                  href={`/properties?agent=${agentId}`}
                  className="text-sm text-[#3B6D11] font-medium flex items-center gap-1 hover:underline"
                >
                  View All <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </div>
              {/* ✅ Mobile: 1 col, sm: 2 col, lg: 4 col */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {listings.map((prop) => {
                  const cover =
                    prop.images.find((i) => i.isPrimary)?.url ?? prop.images[0]?.url;
                  return (
                    <Link
                      key={prop._id}
                      href={`/properties/${prop._id}`}
                      className="group bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden hover:border-[#C0DD97] hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[16/9] bg-[#F8FAF6] overflow-hidden">
                        {cover ? (
                          <img
                            src={cover}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-[#D1E5B8]" />
                          </div>
                        )}
                        <span className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-0.5 rounded-md ${prop.purpose === "rent" ? "bg-blue-500" : "bg-[#3B6D11]"}`}>
                          {prop.purpose === "rent" ? "For Rent" : "For Sale"}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-[#3B6D11] text-sm">
                          PKR {formatPrice(prop.price)}
                          {prop.purpose === "rent" && (
                            <span className="text-xs font-normal text-[#9CA3AF]"> /mo</span>
                          )}
                        </p>
                        <p className="text-sm text-[#374151] mt-0.5 truncate group-hover:text-[#3B6D11] transition-colors">
                          {prop.title}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-[#9CA3AF]">
                          <MapPin className="h-3 w-3" /> {prop.address.city}
                        </div>
                        <div className="flex gap-3 mt-2 text-xs text-[#6B7280] border-t border-[#F3F4F6] pt-2">
                          {prop.area && (
                            <span className="flex items-center gap-1">
                              <Maximize2 className="h-3 w-3" />{prop.area} {prop.areaUnit}
                            </span>
                          )}
                          {prop.bedrooms !== undefined && (
                            <span className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />{prop.bedrooms} Beds
                            </span>
                          )}
                          {prop.bathrooms !== undefined && (
                            <span className="flex items-center gap-1">
                              <Bath className="h-3 w-3" />{prop.bathrooms} Baths
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Client Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1C1C1C]">
                Client Reviews ({reviewTotal})
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white border border-[#E2EAD8] rounded-2xl p-8 text-center text-[#9CA3AF] text-sm mb-4">
                No reviews yet. Be the first to review!
              </div>
            ) : (
              <>
                {/* ✅ Mobile: 1 col, sm: 2 col, lg: 3 col */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white border border-[#E2EAD8] rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {review.reviewer.photo ? (
                          <img
                            src={review.reviewer.photo}
                            alt={review.reviewer.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#3B6D11] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {review.reviewer.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#1C1C1C] truncate">
                            {review.reviewer.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="font-bold text-sm text-[#1C1C1C]">
                              {review.rating}.0
                            </span>
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                      </div>
                      <div className="text-[#D1E5B8] text-3xl font-serif leading-none mb-1">"</div>
                      <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
                        {review.comment}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-3">
                        {new Date(review.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>

                {reviewTotal > 6 && (
                  <div className="flex items-center justify-center gap-2 pt-2 mb-4">
                    <button
                      onClick={() => loadReviews(reviewPage - 1)}
                      disabled={reviewPage === 1}
                      className="p-2 rounded-xl border border-[#E2EAD8] text-[#6B7280] hover:border-[#3B6D11] disabled:opacity-40 transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-[#6B7280]">
                      {reviewPage} / {Math.ceil(reviewTotal / 6)}
                    </span>
                    <button
                      onClick={() => loadReviews(reviewPage + 1)}
                      disabled={reviewPage >= Math.ceil(reviewTotal / 6)}
                      className="p-2 rounded-xl border border-[#E2EAD8] text-[#6B7280] hover:border-[#3B6D11] disabled:opacity-40 transition"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Review Form */}
            {!isOwnProfile && (
              <div className="mt-4">
                <ReviewForm agentId={agentId} onSubmit={() => loadReviews(1)} />
              </div>
            )}
          </div>

          {/* Bottom CTA Banner */}
          {!isOwnProfile && (
            <div className="bg-[#1C2B1A] rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[#A3C97A] text-xs font-medium mb-1">
                  Need Help Finding the Right Property?
                </p>
                <h3 className="text-white font-bold text-xl sm:text-2xl">I'm Here to Help!</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-sm">
                  Whether you are buying, selling or renting, I can help you find the property
                  that fits your needs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
                {agent.whatsapp && (
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent h-11 px-5 rounded-xl w-full sm:w-auto"
                  >
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </Button>
                )}
                <Button
                  onClick={handleContact}
                  className="gap-2 bg-[#3B6D11] hover:bg-[#4a8a15] text-white h-11 px-5 rounded-xl w-full sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" /> Contact Agent
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}