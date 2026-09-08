"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email:    z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export default function LoginForm() {
  const [showPass,     setShowPass]     = useState(false);
  const [apiError,     setApiError]     = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setApiError("");
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email:    data.email,
        password: data.password,
        redirect: false,
      });
      if (!res)      { setApiError("Connection error. Try again."); return; }
      if (res.error) { setApiError("Invalid email or password.");   return; }
      if (res.ok)    { router.push("/dashboard"); }
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleOAuth(provider: "google") {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl: "/dashboard" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-6">
        {/* Top right nav link */}
        <div className="flex justify-end mb-4">
          <p className="text-sm text-[#6B7280]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#2D5016] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Login to Your Account</h2>
        <p className="text-sm text-[#9CA3AF]">Enter your details to continue</p>
      </div>

      {/* Error */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
        >
          {apiError}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Username</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              placeholder="Enter your username"
              autoComplete="email"
              {...register("email")}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#1A1A1A] placeholder:text-[#C4C9D4] bg-white outline-none transition-all
                ${errors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-[#DDE3D5] focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                }`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-[#374151]">Password</label>
            <Link href="/forgot-password" className="text-xs text-[#2D5016] hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
              className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-[#1A1A1A] placeholder:text-[#C4C9D4] bg-white outline-none transition-all
                ${errors.password
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-[#DDE3D5] focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#2D5016] transition-colors"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-[#DDE3D5] text-[#2D5016] accent-[#2D5016] cursor-pointer"
          />
          <span className="text-sm text-[#6B7280]">Remember me</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#1E3A0F] hover:bg-[#2D5016] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? <Spinner /> : (
            <>
              Login
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[#E5EDD8]" />
        <span className="text-xs text-[#9CA3AF]">or continue with</span>
        <div className="flex-1 h-px bg-[#E5EDD8]" />
      </div>

      {/* OAuth */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-[#DDE3D5] bg-white text-sm font-medium text-[#374151] hover:bg-[#F8FAF6] hover:border-[#A8C47A] transition-all disabled:opacity-50"
        >
          {oauthLoading === "google" ? <Spinner /> : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </button>
      </div>

      {/* Bottom terms */}
      <p className="text-center text-[11px] text-[#9CA3AF] mt-5">
        By continuing, you agree to our{" "}
        <a href="#" className="text-[#2D5016] hover:underline">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="text-[#2D5016] hover:underline">Privacy Policy</a>
      </p>
    </motion.div>
  );
}