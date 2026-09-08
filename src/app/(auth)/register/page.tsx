import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register — GharFind",
  description: "Naya account banayein aur apna sapno ka ghar dhundein",
};

export default function RegisterPage() {
  return <RegisterForm />;
}