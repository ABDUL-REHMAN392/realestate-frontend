"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import PhoneInput, {
  isValidPhoneNumber,
} from "react-phone-number-input";
import { authApi } from "@/lib/api";
import type { AxiosError } from "axios";

/* ─────────────────────────────────────────────
   Validation Schema
───────────────────────────────────────────── */

const schema = z.object({
  name: z
    .string()
    .min(2, "At least 2 characters")
    .max(100),

  email: z
    .string()
    .email("Valid email required"),

  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "1 uppercase letter required")
    .regex(/[0-9]/, "1 number required"),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || isValidPhoneNumber(val, "PK"),
      "Valid Pakistani number required (e.g. 0300 1234567)"
    ),

  agreeTerms: z
    .boolean()
    .refine(
      (v) => v === true,
      "You must agree to terms"
    ),
});

type FormData = z.infer<typeof schema>;

/* ─────────────────────────────────────────────
   Spinner
───────────────────────────────────────────── */

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />

    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   Field Wrapper
───────────────────────────────────────────── */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#374151] mb-1.5">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Normal Input Classes
───────────────────────────────────────────── */

const inputClass = (hasError: boolean) =>
  `w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#1A1A1A] placeholder:text-[#C4C9D4] bg-white outline-none transition-all ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-[#DDE3D5] focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
  }`;

/* ─────────────────────────────────────────────
   Register Form
───────────────────────────────────────────── */

export default function RegisterForm() {
  const [showPass, setShowPass] = useState(false);

  const [phone, setPhone] = useState<string | undefined>(
    ""
  );

  const [phoneError, setPhoneError] = useState("");

  const [apiError, setApiError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [oauthLoading, setOauthLoading] =
    useState<"google" | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  /* ─────────────────────────────────────────
     Submit
  ───────────────────────────────────────── */

  const onSubmit = async (data: FormData) => {
    /* Phone validation */
    if (phone && !isValidPhoneNumber(phone, "PK")) {
      setPhoneError(
        "Valid Pakistani number required"
      );
      return;
    }

    setPhoneError("");
    setApiError("");
    setIsSubmitting(true);

    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: phone || undefined,
        role: "buyer",
      });

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err) {
      const e = err as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;

      const fieldErrors =
        e.response?.data?.errors;

      if (fieldErrors) {
        const first =
          Object.values(fieldErrors)[0]?.[0];

        setApiError(
          first ?? "Validation failed."
        );
      } else {
        setApiError(
          e.response?.data?.message ??
            "Registration failed. Try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────────────────────
     OAuth
  ───────────────────────────────────────── */

  async function handleOAuth(
    provider: "google"
  ) {
    setOauthLoading(provider);

    await signIn(provider, {
      callbackUrl: "/dashboard",
    });
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      {/* ─────────────────────────────────────
          Header
      ───────────────────────────────────── */}

      <div className="mb-5">
        <div className="flex justify-end mb-4">
          <p className="text-sm text-[#6B7280]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#2D5016] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">
          Create Your Account
        </h2>

        <p className="text-sm text-[#9CA3AF]">
          Fill in your details to get started
        </p>
      </div>

      {/* ─────────────────────────────────────
          API Error
      ───────────────────────────────────── */}

      {apiError && (
        <motion.div
          initial={{
            opacity: 0,
            y: -4,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
        >
          {apiError}
        </motion.div>
      )}

      {/* ─────────────────────────────────────
          Form
      ───────────────────────────────────── */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3.5 mb-5"
      >
        {/* Name */}

        <Field
          label="Full Name"
          error={errors.name?.message}
        >
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
              <User className="h-4 w-4" />
            </div>

            <input
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              {...register("name")}
              className={inputClass(
                !!errors.name
              )}
            />
          </div>
        </Field>

        {/* Email */}

        <Field
          label="Email Address"
          error={errors.email?.message}
        >
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
              <Mail className="h-4 w-4" />
            </div>

            <input
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              {...register("email")}
              className={inputClass(
                !!errors.email
              )}
            />
          </div>
        </Field>

        {/* Password */}

        <Field
          label="Password"
          error={errors.password?.message}
        >
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
              <Lock className="h-4 w-4" />
            </div>

            <input
              type={
                showPass
                  ? "text"
                  : "password"
              }
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...register("password")}
              className={`${inputClass(
                !!errors.password
              )} pr-10`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPass(!showPass)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#2D5016] transition-colors"
              aria-label={
                showPass
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPass ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </Field>

        {/* ─────────────────────────────────
            Phone — Pakistan Only
        ───────────────────────────────── */}

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">
            Phone Number
          </label>

          <PhoneInput
            international
            defaultCountry="PK"
            countries={["PK"]}
            countryCallingCodeEditable={false}
            value={phone}
            onChange={(value) => {
              setPhone(value);

              if (phoneError) {
                setPhoneError("");
              }
            }}
            placeholder="300 1234567"
            className={`
              flex
              items-center
              w-full
              overflow-hidden
              rounded-xl
              border
              bg-white
              transition-[border-color,box-shadow]
              duration-150

              ${
                phoneError
                  ? `
                    border-red-300
                    focus-within:border-red-400
                    focus-within:ring-2
                    focus-within:ring-red-100
                  `
                  : `
                    border-[#DDE3D5]
                    focus-within:border-[#2D5016]
                    focus-within:ring-2
                    focus-within:ring-[#2D5016]/10
                  `
              }

              [&_.PhoneInputCountry]:flex
              [&_.PhoneInputCountry]:items-center
              [&_.PhoneInputCountry]:gap-[6px]
              [&_.PhoneInputCountry]:h-12
              [&_.PhoneInputCountry]:px-3
              [&_.PhoneInputCountry]:bg-[#F8FAF6]
              [&_.PhoneInputCountry]:border-r
              [&_.PhoneInputCountry]:border-r-[#DDE3D5]
              [&_.PhoneInputCountry]:shrink-0
              [&_.PhoneInputCountry]:cursor-default

              [&_.PhoneInputCountrySelectArrow]:hidden

              [&_.PhoneInputCountrySelect]:absolute
              [&_.PhoneInputCountrySelect]:opacity-0
              [&_.PhoneInputCountrySelect]:pointer-events-none
              [&_.PhoneInputCountrySelect]:w-0
              [&_.PhoneInputCountrySelect]:h-0

              [&_.PhoneInputCountryIcon]:w-[22px]
              [&_.PhoneInputCountryIcon]:h-4
              [&_.PhoneInputCountryIcon]:rounded-[2px]
              [&_.PhoneInputCountryIcon]:overflow-hidden
              [&_.PhoneInputCountryIcon]:shadow-[0_0_0_1px_rgba(0,0,0,0.08)]

              [&_.PhoneInputCountryIcon_img]:w-full
              [&_.PhoneInputCountryIcon_img]:h-full
              [&_.PhoneInputCountryIcon_img]:object-cover
              [&_.PhoneInputCountryIcon_img]:block

              [&_.PhoneInputCountryIcon_svg]:w-full
              [&_.PhoneInputCountryIcon_svg]:h-full
              [&_.PhoneInputCountryIcon_svg]:object-cover
              [&_.PhoneInputCountryIcon_svg]:block

              [&_.PhoneInputCountryCallingCode]:text-sm
              [&_.PhoneInputCountryCallingCode]:font-semibold
              [&_.PhoneInputCountryCallingCode]:text-[#374151]
              [&_.PhoneInputCountryCallingCode]:tracking-[0.01em]
              [&_.PhoneInputCountryCallingCode]:select-none

              [&_.PhoneInputInput]:flex-1
              [&_.PhoneInputInput]:min-w-0
              [&_.PhoneInputInput]:h-12
              [&_.PhoneInputInput]:px-3
              [&_.PhoneInputInput]:border-0
              [&_.PhoneInputInput]:outline-none
              [&_.PhoneInputInput]:bg-transparent
              [&_.PhoneInputInput]:text-sm
              [&_.PhoneInputInput]:text-[#1A1A1A]

              [&_.PhoneInputInput::placeholder]:text-[#C4C9D4]
            `}
          />

          {phoneError && (
            <p className="text-xs text-red-500 mt-1">
              {phoneError}
            </p>
          )}
        </div>

        {/* ─────────────────────────────────
            Terms
        ───────────────────────────────── */}

        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register("agreeTerms")}
              className="w-4 h-4 mt-0.5 rounded border-[#DDE3D5] accent-[#2D5016] cursor-pointer flex-shrink-0"
            />

            <span className="text-sm text-[#6B7280] leading-relaxed">
              I agree to the{" "}
              <a
                href="#"
                className="text-[#2D5016] font-semibold hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#2D5016] font-semibold hover:underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>

          {errors.agreeTerms && (
            <p className="text-xs text-red-500 mt-1">
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        {/* ─────────────────────────────────
            Submit
        ───────────────────────────────── */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#1E3A0F] hover:bg-[#2D5016] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-1"
        >
          {isSubmitting ? (
            <Spinner />
          ) : (
            <>
              Sign Up
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* ─────────────────────────────────────
          Divider
      ───────────────────────────────────── */}

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[#E5EDD8]" />

        <span className="text-xs text-[#9CA3AF]">
          or sign up with
        </span>

        <div className="flex-1 h-px bg-[#E5EDD8]" />
      </div>

      {/* ─────────────────────────────────────
          Google OAuth
      ───────────────────────────────────── */}

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() =>
            handleOAuth("google")
          }
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-[#DDE3D5] bg-white text-sm font-medium text-[#374151] hover:bg-[#F8FAF6] hover:border-[#A8C47A] transition-all disabled:opacity-50"
        >
          {oauthLoading === "google" ? (
            <Spinner />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />

              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />

              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />

              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}

          Continue with Google
        </button>
      </div>
    </motion.div>
  );
}