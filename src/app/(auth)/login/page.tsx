import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — GharFind",
  description: "Apne account mein sign in karein",
};

export default function LoginPage() {
  return <LoginForm />;
}