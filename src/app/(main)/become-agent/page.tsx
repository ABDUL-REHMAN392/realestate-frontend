"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/store/auth.store";
import { agentApi } from "@/lib/api";
import {
  Upload,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  FileText,
  CreditCard,
  Receipt,
  Clock,
  BadgeCheck,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

// ─── Types ────────────────────────────────────
type AppStatus = "none" | "pending" | "approved" | "rejected";

interface DocField {
  key: "passportPhoto" | "cnicFront" | "cnicBack" | "utilityBill";
  label: string;
  description: string;
  icon: React.ElementType;
}

const DOC_FIELDS: DocField[] = [
  {
    key: "passportPhoto",
    label: "Passport Size Photo",
    description: "Recent passport-size photo with plain background",
    icon: User,
  },
  {
    key: "cnicFront",
    label: "CNIC Front",
    description: "Front side of your National ID Card (clear, flat)",
    icon: CreditCard,
  },
  {
    key: "cnicBack",
    label: "CNIC Back",
    description: "Back side of your National ID Card",
    icon: CreditCard,
  },
  {
    key: "utilityBill",
    label: "Utility Bill",
    description: "Recent electricity, gas, or water bill (last 3 months)",
    icon: Receipt,
  },
];

// ─── Step Config ──────────────────────────────
const STEPS = [
  { label: "Basic Info", icon: FileText },
  { label: "Documents", icon: Upload },
  { label: "Review", icon: CheckCircle },
];

// ─── Step Indicator ───────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, i) => {
        const StepIcon = step.icon;
        const stepNum = i + 1;
        const isCompleted = currentStep > stepNum;
        const isActive = currentStep === stepNum;
        return (
          <Fragment key={i}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? "bg-[#3B6D11] border-[#3B6D11] text-white"
                    : isActive
                      ? "bg-white border-[#3B6D11] text-[#3B6D11]"
                      : "bg-white border-[#D1E5B8] text-[#9CA3AF]"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                  isActive ? "text-[#3B6D11]" : "text-[#9CA3AF]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 -mt-4 transition-all duration-300 ${
                  isCompleted ? "bg-[#3B6D11]" : "bg-[#D1E5B8]"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

// ─── Review Row ───────────────────────────────
function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-[#9CA3AF] w-36 flex-shrink-0">{label}</span>
      <span className="text-[#374151] font-medium">{value}</span>
    </div>
  );
}

// ─── Doc Upload Box ───────────────────────────
function DocUploadBox({
  field,
  file,
  onChange,
}: {
  field: DocField;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = field.icon;
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all
        ${file ? "border-[#3B6D11] bg-[#EAF3DE]" : "border-[#D1E5B8] bg-[#F8FAF6] hover:border-[#3B6D11] hover:bg-[#EAF3DE]/40"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <>
          <img
            src={URL.createObjectURL(file)}
            alt={field.label}
            className="w-full h-28 object-cover rounded-xl"
          />
          <span className="text-xs text-[#3B6D11] font-medium truncate max-w-full px-1">
            {file.name}
          </span>
          <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-[#3B6D11]" />
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-xl bg-[#EAF3DE] flex items-center justify-center">
            <Icon className="h-5 w-5 text-[#3B6D11]" />
          </div>
          <p className="text-sm font-medium text-[#374151] text-center">
            {field.label}
          </p>
          <p className="text-xs text-[#9CA3AF] text-center leading-relaxed">
            {field.description}
          </p>
          <div className="flex items-center gap-1 text-xs text-[#3B6D11] font-medium">
            <Upload className="h-3.5 w-3.5" /> Upload
          </div>
        </>
      )}
    </div>
  );
}

// ─── Custom City Dropdown ─────────────────────
function CityDropdown({
  value,
  onChange,
  cities,
}: {
  value: string;
  onChange: (city: string) => void;
  cities: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border rounded-xl px-4 py-2 text-sm bg-white transition focus:outline-none focus:ring-2 focus:ring-[#3B6D11]/10 ${
          open ? "border-[#3B6D11]" : "border-[#D1E5B8]"
        } ${value ? "text-[#374151]" : "text-[#9CA3AF]"}`}
      >
        <span>{value || "Select city"}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#D1E5B8] rounded-xl shadow-lg overflow-hidden">
          <ul className="max-h-52 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-[#D1E5B8] scrollbar-track-transparent">
            {cities.map((c) => (
              <li
                key={c}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  value === c
                    ? "bg-[#EAF3DE] text-[#3B6D11] font-medium"
                    : "text-[#374151] hover:bg-[#F8FAF6]"
                }`}
              >
                {c}
                {value === c && (
                  <Check className="h-3.5 w-3.5 text-[#3B6D11]" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Confetti Canvas ──────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  w: number;
  h: number;
  color: string;
  shape: "rect" | "circle" | "strip";
}

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [
      "#3B6D11",
      "#7CB342",
      "#A8D86E",
      "#F59E0B",
      "#FCD34D",
      "#FDE68A",
      "#3B82F6",
      "#93C5FD",
      "#EC4899",
      "#F9A8D4",
      "#8B5CF6",
      "#C4B5FD",
    ];

    const TOTAL = 220;
    const DURATION = 5500;

    const particles: Particle[] = Array.from({ length: TOTAL }, () => ({
      x: Math.random() * (canvas?.width ?? window.innerWidth),
      y: -(Math.random() * (canvas?.height ?? window.innerHeight) * 0.6),
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 3 + 1.5,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 9,
      w: Math.random() * 13 + 6,
      h: Math.random() * 7 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: (["rect", "circle", "strip"] as const)[
        Math.floor(Math.random() * 3)
      ],
    }));

    const start = performance.now();
    let rafId: number;

    const draw = (now: number) => {
      const elapsed = now - start;
      const alpha = Math.max(
        0,
        1 - Math.max(0, elapsed - DURATION * 0.6) / (DURATION * 0.4),
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.999;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.vy = Math.random() * 2 + 1.5;
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "strip") {
          ctx.fillRect(-p.w, -p.h / 4, p.w * 2, p.h / 2);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (elapsed < DURATION) {
        rafId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
}

// ─── Status Screens ───────────────────────────
function PendingScreen() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-full h-72 mb-2">
        <Image
          src="/agents/review-illustrate.png"
          alt="Application under review"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="w-full max-w-md bg-white rounded-3xl px-8 py-8 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-[#1C1C1C]">
          Application Under Review
        </h2>
        <p className="text-[#6B7280] leading-relaxed text-sm">
          Thank you for applying to become a verified agent with GharFind. Our
          team is reviewing your application and documents.
        </p>
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 w-full text-left">
          <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700">
              Typical review time: 24–48 hours
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              You will be notified via email and WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApprovedScreen() {
  const router = useRouter();
  return (
    <>
      <ConfettiCanvas />
      <div className="flex flex-col items-center text-center">
        <div className="relative w-full h-72 mb-2">
          <Image
            src="/agents/approved-illustrate.png"
            alt="Application approved"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="w-full max-w-md bg-white rounded-3xl px-8 py-8 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#EAF3DE] flex items-center justify-center">
            <BadgeCheck className="h-7 w-7 text-[#3B6D11]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1C1C1C]">
            You're a Verified Agent!
          </h2>
          <p className="text-[#6B7280] leading-relaxed text-sm">
            Congratulations! Your application has been approved. You can now
            list properties and connect with buyers.
          </p>
          <Button
            onClick={() => router.push("/dashboard/listings")}
            className="w-full gap-2"
          >
            Go to My Listings <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

function RejectedScreen({
  reason,
  onReApply,
}: {
  reason?: string;
  onReApply: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-full h-72 mb-2">
        <Image
          src="/agents/rejected-illustrate.png"
          alt="Application rejected"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="w-full max-w-md bg-white rounded-3xl px-8 py-8 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#1C1C1C]">
          Application Rejected
        </h2>
        <p className="text-[#6B7280] leading-relaxed text-sm">
          You can re-apply with updated documents. Please address the issue
          mentioned below.
        </p>
        {reason && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 w-full text-left">
            <p className="text-xs font-semibold text-red-700 mb-1">
              Reason for rejection:
            </p>
            <p className="text-sm text-red-600">{reason}</p>
          </div>
        )}
        <Button onClick={onReApply} variant="outline" className="w-full gap-2">
          Re-Apply Now <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Cities & Specializations ─────────────────
const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Gujranwala",
  "Sialkot",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
];

const CITY_SPECIALIZATIONS: Record<string, string[]> = {
  Lahore: [
    "DHA Lahore",
    "Bahria Town Lahore",
    "Gulberg",
    "Model Town",
    "Johar Town",
    "Lake City",
    "Raiwind Road",
    "Wapda Town",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
    "Luxury Homes",
  ],
  Karachi: [
    "DHA Karachi",
    "Bahria Town Karachi",
    "Clifton",
    "Gulshan-e-Iqbal",
    "North Nazimabad",
    "Malir",
    "Defence View",
    "Scheme 33",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
    "Luxury Homes",
  ],
  Islamabad: [
    "DHA Islamabad",
    "Bahria Town Islamabad",
    "F-Sectors",
    "E-Sectors",
    "G-Sectors",
    "Blue Area",
    "Park Enclave",
    "Capital Smart City",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
    "Luxury Homes",
  ],
  Rawalpindi: [
    "Bahria Town Phase 8",
    "DHA Rawalpindi",
    "Saddar",
    "Chaklala Scheme",
    "Askari",
    "Gulraiz Housing",
    "Satellite Town",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
  Faisalabad: [
    "Susan Road",
    "Jail Road",
    "Gulberg Faisalabad",
    "Canal Road",
    "Peoples Colony",
    "D-Ground",
    "Millat Road",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
  Multan: [
    "DHA Multan",
    "Bahria Town Multan",
    "Gulgasht Colony",
    "Bosan Road",
    "Shah Rukn-e-Alam Colony",
    "New Multan",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
  Peshawar: [
    "Hayatabad",
    "University Town",
    "Phase 4 Peshawar",
    "Gulbahar",
    "Ring Road Peshawar",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
  Quetta: [
    "Satellite Town Quetta",
    "Jinnah Town",
    "Brewery Road",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
  Gujranwala: [
    "Canal Road Gujranwala",
    "Peoples Colony Gujranwala",
    "Model Town Gujranwala",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
  Sialkot: [
    "Cantt Sialkot",
    "Iqbal Town Sialkot",
    "Defence Road Sialkot",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
  Hyderabad: [
    "Latifabad",
    "Qasimabad",
    "Hyderabad Cantt",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
  Abbottabad: [
    "Shimla Hill",
    "Cantt Abbottabad",
    "Supply Bazar",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
  Bahawalpur: [
    "Model Town Bahawalpur",
    "Satellite Town Bahawalpur",
    "Cantt Bahawalpur",
    "Residential",
    "Commercial",
    "Plots",
    "Rental",
  ],
};

// ─── MAIN PAGE ────────────────────────────────
export default function BecomeAgentPage() {
  const user = useUser();
  const router = useRouter();

  const [appStatus, setAppStatus] = useState<AppStatus | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("");
  const [agencyName, setAgencyName] = useState("");
  // whatsapp now stored as E.164 string from react-phone-number-input
  const [whatsapp, setWhatsapp] = useState<string | undefined>(undefined);
  const [website, setWebsite] = useState("");
  const [specs, setSpecs] = useState<string[]>([]);
  const [langs, setLangs] = useState<string[]>(["English"]);
  const [docs, setDocs] = useState<Record<DocField["key"], File | null>>({
    passportPhoto: null,
    cnicFront: null,
    cnicBack: null,
    utilityBill: null,
  });

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "admin") {
      router.replace("/");
      return;
    }
    if (user.role === "agent") {
      setAppStatus("approved");
      return;
    }

    agentApi
      .getApplicationStatus()
      .then(({ data }) => {
        const status = data.data.applicationStatus;
        if (!status) {
          setAppStatus("none");
          setShowForm(true);
        } else {
          setAppStatus(status.applicationStatus);
          setRejectionReason(status.rejectionReason);
        }
      })
      .catch(() => {
        setAppStatus("none");
        setShowForm(true);
      });
  }, [user, router]);

  const toggleSpec = (s: string) =>
    setSpecs((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const toggleLang = (l: string) =>
    setLangs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));

  // ─── Step Navigation ──────────────────────────
  function handleNext() {
    setError(null);
    if (currentStep === 1) {
      if (!bio || bio.length < 20) {
        setError("Professional Bio must be at least 20 characters.");
        return;
      }
      if (!experience) {
        setError("Please enter your years of experience.");
        return;
      }
      if (!city) {
        setError("Please select your city.");
        return;
      }
      // Validate Pakistani number if entered
      if (whatsapp && !isValidPhoneNumber(whatsapp)) {
        setError("Please enter a valid Pakistani WhatsApp number.");
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      for (const f of DOC_FIELDS) {
        if (!docs[f.key]) {
          setError(`Please upload: ${f.label}`);
          return;
        }
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    setError(null);
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("bio", bio);
      fd.append("experience", experience);
      fd.append("city", city);
      if (agencyName) fd.append("agencyName", agencyName);
      if (whatsapp) fd.append("whatsapp", whatsapp);
      if (website) fd.append("website", website);
      fd.append("specializations", JSON.stringify(specs));
      fd.append("languages", JSON.stringify(langs));
      for (const f of DOC_FIELDS) {
        if (docs[f.key]) fd.append(f.key, docs[f.key] as File);
      }
      await agentApi.apply(fd);
      setAppStatus("pending");
      setShowForm(false);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (appStatus === null) {
    return (
      <LoadingSpinner
        fullScreen
        size="lg"
        text="Checking Verification Status..."
      />
    );
  }

  const showFormContent = appStatus === "none" || showForm;

  return (
    <div className="min-h-screen bg-[#F8FAF6]">
      {/* ─── Hero Banner ─────────────────────────── */}
      {showFormContent && (
        <div
          className="w-full bg-gradient-to-b from-[#EAF3DE]/60 to-[#F8FAF6] relative flex items-end"
          style={{ minHeight: "200px" }}
        >
          {/* Left illustration — absolute to bottom-left corner */}
          <div
            className="hidden md:block absolute bottom-0 left-0 z-0"
            style={{ width: "300px", height: "190px" }}
          >
            <Image
              src="/agents/hero-left.png"
              alt=""
              fill
              className="object-contain"
              style={{ objectPosition: "left bottom" }}
              priority
            />
          </div>

          {/* Center text — sits above images */}
          <div className="relative z-10 w-full text-center px-6 py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-2">
              Become an Agent
            </h1>
            <p className="text-[#6B7280] text-sm md:text-base">
              Join GharFind's verified agent network and grow your real estate
              business.
            </p>
          </div>

          {/* Right illustration — absolute to bottom-right corner */}
          <div
            className="hidden md:block absolute bottom-0 right-0 z-0"
            style={{ width: "300px", height: "190px" }}
          >
            <Image
              src="/agents/hero-right.png"
              alt=""
              fill
              className="object-contain"
              style={{ objectPosition: "right bottom" }}
              priority
            />
          </div>
        </div>
      )}

      {/* ─── Status + Multi-step Form ────────────── */}
      <div
        className={`max-w-2xl mx-auto px-4 ${showFormContent ? "pt-8 pb-12" : "pt-4 pb-12"}`}
      >
        {/* Status Screens */}
        {appStatus === "pending" && !showForm && <PendingScreen />}
        {appStatus === "approved" && <ApprovedScreen />}
        {appStatus === "rejected" && !showForm && (
          <RejectedScreen
            reason={rejectionReason}
            onReApply={() => {
              setShowForm(true);
              setCurrentStep(1);
              setError(null);
            }}
          />
        )}

        {/* Multi-step Form */}
        {showFormContent && (
          <div className="space-y-6">
            {appStatus === "rejected" && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
                ⚠️ You are re-applying. Please update your information and
                upload fresh documents.
              </div>
            )}

            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} />

            {/* ── Step 1: Basic Information ─────────── */}
            {currentStep === 1 && (
              <section className="bg-white rounded-2xl border border-[#E2EAD8] p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#3B6D11]" /> Basic
                  Information
                </h2>

                <div>
                  <label className="text-sm font-medium text-[#374151] mb-1.5 block">
                    Professional Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder="Describe your experience, expertise, and what makes you a great agent..."
                    className="w-full border border-[#D1E5B8] rounded-xl px-4 py-3 text-sm text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B6D11] focus:ring-2 focus:ring-[#3B6D11]/10 resize-none transition"
                  />
                  <p className="text-xs text-[#9CA3AF] mt-1 text-right">
                    {bio.length}/1000
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#374151] mb-1.5 block">
                      Years of Experience{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={70}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 5"
                      className="border-[#D1E5B8] focus:border-[#3B6D11]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#374151] mb-1.5 block">
                      City <span className="text-red-500">*</span>
                    </label>
                    {/* Custom scrollable city dropdown */}
                    <CityDropdown
                      value={city}
                      onChange={(c) => {
                        setCity(c);
                        setSpecs([]);
                      }}
                      cities={CITIES}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#374151] mb-1.5 block">
                      Agency Name
                    </label>
                    <Input
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Your agency (optional)"
                      className="border-[#D1E5B8]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#374151] mb-1.5 block">
                      WhatsApp
                    </label>
                    {/*
                      react-phone-number-input with Pakistan (+92) locked as default country.
                      Only Pakistani numbers are accepted (no other country selectable).
                    */}
                    <PhoneInput
                      international
                      defaultCountry="PK"
                      countries={["PK"]}
                      value={whatsapp}
                      onChange={setWhatsapp}
                      placeholder="+92 300 1234567"
                      className="phone-input-pk"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#374151] mb-2 block">
                    Specializations
                  </label>
                  {!city ? (
                    <p className="text-xs text-[#9CA3AF] italic">
                      Please select a city first to see available
                      specializations.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(CITY_SPECIALIZATIONS[city] ?? []).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSpec(s)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            specs.includes(s)
                              ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                              : "bg-white text-[#6B7280] border-[#D1E5B8] hover:border-[#3B6D11]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-[#374151] mb-2 block">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["English", "Urdu", "Punjabi", "Sindhi", "Pashto"].map(
                      (l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => toggleLang(l)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            langs.includes(l)
                              ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                              : "bg-white text-[#6B7280] border-[#D1E5B8] hover:border-[#3B6D11]"
                          }`}
                        >
                          {l}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ── Step 2: Required Documents ────────── */}
            {currentStep === 2 && (
              <section className="bg-white rounded-2xl border border-[#E2EAD8] p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2">
                  <Upload className="h-5 w-5 text-[#3B6D11]" /> Required
                  Documents
                </h2>
                <p className="text-sm text-[#9CA3AF]">
                  All 4 documents are required for verification. JPG, PNG, or
                  WebP. Max 5MB each.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {DOC_FIELDS.map((field) => (
                    <DocUploadBox
                      key={field.key}
                      field={field}
                      file={docs[field.key]}
                      onChange={(f) =>
                        setDocs((p) => ({ ...p, [field.key]: f }))
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Step 3: Review & Submit ───────────── */}
            {currentStep === 3 && (
              <section className="bg-white rounded-2xl border border-[#E2EAD8] p-6 space-y-5">
                <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#3B6D11]" /> Review Your
                  Application
                </h2>

                {/* Basic Info Summary */}
                <div className="space-y-2.5">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                    Basic Information
                  </p>
                  <ReviewRow
                    label="Professional Bio"
                    value={bio.length > 80 ? bio.substring(0, 80) + "…" : bio}
                  />
                  <ReviewRow
                    label="Experience"
                    value={`${experience} year${Number(experience) !== 1 ? "s" : ""}`}
                  />
                  <ReviewRow label="City" value={city} />
                  <ReviewRow label="Agency Name" value={agencyName} />
                  <ReviewRow label="WhatsApp" value={whatsapp ?? ""} />
                  {specs.length > 0 && (
                    <ReviewRow
                      label="Specializations"
                      value={specs.join(", ")}
                    />
                  )}
                  <ReviewRow label="Languages" value={langs.join(", ")} />
                </div>

                {/* Documents Summary */}
                <div className="border-t border-[#E2EAD8] pt-4 space-y-3">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                    Documents
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {DOC_FIELDS.map((f) => (
                      <div
                        key={f.key}
                        className="flex items-center gap-2 text-sm text-[#374151]"
                      >
                        <CheckCircle className="h-4 w-4 text-[#3B6D11] flex-shrink-0" />
                        {f.label}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12 text-base font-semibold gap-2"
                >
                  <ChevronLeft className="h-5 w-5" /> Back
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-12 text-base font-semibold gap-2"
                >
                  Next <ChevronRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="flex-1 h-12 text-base font-semibold gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {currentStep === 3 && (
              <p className="text-center text-xs text-[#9CA3AF]">
                By submitting, you agree to our Terms of Service. Your documents
                are used only for identity verification.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ─── Phone Input Global Styles ───────────── */}
      <style jsx global>{`
        /* Pakistani phone input styling */
        .phone-input-pk {
          display: flex;
          align-items: center;
          border: 1px solid #d1e5b8;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #fff;
          transition:
            border-color 0.15s,
            box-shadow 0.15s;
          height: 38px;
          padding: 0 12px;
          gap: 6px;
        }
        .phone-input-pk:focus-within {
          border-color: #3b6d11;
          box-shadow: 0 0 0 2px rgba(59, 109, 17, 0.1);
        }
        /* Hide the country selector since only PK is allowed */
        .phone-input-pk .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-right: 2px;
        }
        .phone-input-pk .PhoneInputCountrySelect {
          /* Keep the select but hide it visually — just the flag + code show */
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        .phone-input-pk .PhoneInputCountryIcon {
          width: 20px;
          height: 14px;
          border-radius: 2px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .phone-input-pk .PhoneInputCountrySelectArrow {
          display: none;
        }
        .phone-input-pk input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: #374151;
          background: transparent;
          padding: 0;
          height: 100%;
        }
        .phone-input-pk input::placeholder {
          color: #9ca3af;
        }

        /* Scrollbar styling for city dropdown */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1e5b8;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
