"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Award, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingSpinner fullScreen size="lg" text="Authenticating..." />;
  }

  const isLogin = pathname.includes("/login");
  
  const authContent = isLogin
    ? {
        title: (
          <>
            Welcome Back! <br />
            Let's <span className="text-[#2D5016]">Ghar Finds</span> Your Property Experience
          </>
        ),
        subtitle: "Login to access your account and explore premium properties."
      }
    : {
        title: (
          <>
            Create Your Account, <br />
            <span className="text-[#2D5016]">Ghar Finds</span> Your Lifestyle
          </>
        ),
        subtitle: "Join Ghar Finds and get access to premium properties, personalized recommendations and exclusive deals."
      };

  return (
    <motion.div 
      className="min-h-screen bg-[#ffffff] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      {/* ── Top Nav ── */}
      <motion.header 
        className="w-full px-8 py-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/" className="flex items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
<Image src="/logo.png" alt="GharFind" width={150} height={56} className="object-contain" />          </motion.div>
        </Link>
        <div id="auth-nav-slot" />
      </motion.header>

      {/* ─ Main Two-Column ── */}
      <div className="flex flex-1 w-full max-w-[1280px] mx-auto px-6 pb-6 gap-8 items-stretch">

        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-col justify-between flex-1 relative overflow-hidden">
          
          {/* 1️⃣ Text Content (TOP) */}
          <motion.div 
            className="mt-4 mb-6 z-20 relative max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
          >
            <h1 className="text-4xl font-bold text-[#1A1A1A] leading-tight tracking-tight">
              {authContent.title}
            </h1>
            <p className="text-[#6B7280] mt-4 text-base leading-relaxed">
              {authContent.subtitle}
            </p>
          </motion.div>

          {/* 2️⃣ Hero Image (MIDDLE) */}
          <motion.div 
            className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.1 }}
          >
            <Image
              src="/homepage/herosection.png"
              alt="Premium Property"
              width={560}
              height={380}
              className="object-contain object-bottom w-full max-h-[360px]"
              priority
            />
          </motion.div>

          {/* 3️⃣ Trust Bar Area */}
          <motion.div 
            className="relative mt-auto pb-2"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.2 }}
          >
            {/* Background Shapes */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <motion.div 
                className="absolute top-0 left-1/4 w-64 h-64 bg-[#F5F7F2]/80 rounded-full blur-3xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
              <motion.div 
                className="absolute top-8 right-1/4 w-48 h-48 bg-[#E8EDE0]/80 rounded-full blur-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              />
              <motion.div 
                className="absolute -bottom-4 left-1/3 w-56 h-56 bg-[#F0F4E8]/80 rounded-full blur-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>

            {/* Trust Bar */}
            <motion.div 
              className="relative z-10 bg-gradient-to-r from-[#1E3A0F] via-[#2A4A18] to-[#4A7C24] rounded-2xl px-6 py-4 flex items-center justify-between gap-4 shadow-lg border border-white/10"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" as const, delay: 0.3 }}
            >
              {[
                { icon: Shield,      title: "Secure & Safe",     sub: "Your data is protected" },
                { icon: Award,       title: "Trusted Platform",  sub: "10K+ Happy Clients" },
                { icon: Headphones,  title: "24/7 Support",      sub: "We're here to help" },
              ].map(({ icon: Icon, title, sub }, index) => (
                <motion.div 
                  key={title} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-[#A8C47A]" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{title}</p>
                    <p className="text-white/60 text-[11px]">{sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT PANEL — Form Card ── */}
        <motion.div 
          className="w-full lg:w-[480px] shrink-0 flex items-center"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.15 }}
        >
          <motion.div 
            className="w-full bg-white rounded-3xl shadow-sm border border-[#E5EDD8] p-8"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" as const, delay: 0.2 }}
          >
            {/* Mobile logo */}
            <Link href="/" className="flex items-center mb-6 lg:hidden">
<Image src="/logo.png" alt="GharFind" width={150} height={56} className="object-contain" />            </Link>

            {children}

            {/* Privacy note */}
            <motion.div 
              className="flex items-start gap-2 mt-5 pt-4 border-t border-[#F0F4E8]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Shield className="h-4 w-4 text-[#2D5016] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Your information is <span className="font-semibold text-[#4B5563]">safe</span> with us and will never be shared with anyone.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}