"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inquiryApi } from "@/lib/api";
import { useUser } from "@/store/auth.store";

interface Props {
  propertyId: string;
  agentId: string;
}

export default function InquiryForm({ propertyId, agentId }: Props) {
  const user = useUser();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (message.trim().length < 10) { setError("Message must be at least 10 characters"); return; }
    setSending(true);
    setError("");
    try {
      await inquiryApi.send({
        propertyId, agentId,
        message: message.trim(),
        phone: phone.trim() || undefined,
      });
      setSent(true);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to send inquiry"
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-white border border-[#C0DD97] rounded-2xl p-5 text-center">
        <CheckCircle className="h-10 w-10 text-[#3B6D11] mx-auto mb-2" />
        <p className="font-semibold text-[#3B6D11]">Inquiry Sent!</p>
        <p className="text-sm text-[#3B6D11]/80 mt-1">The agent will contact you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2EAD8] rounded-2xl p-5 space-y-3">
      <h3 className="font-semibold text-[#1C1C1C] text-sm">Send Inquiry</h3>
      <textarea
        value={message} onChange={(e) => setMessage(e.target.value)}
        rows={3} placeholder="I am interested in this property. Please contact me..."
        className="w-full border border-[#D1E5B8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3B6D11] resize-none bg-white"
      />
      <input
        type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
        placeholder="Your phone number (optional)"
        className="w-full border border-[#D1E5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3B6D11] bg-white"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" disabled={sending} className="w-full gap-2 h-10">
        {sending ? "Sending..." : <><MessageCircle className="h-4 w-4" /> Send Inquiry</>}
      </Button>
    </form>
  );
}