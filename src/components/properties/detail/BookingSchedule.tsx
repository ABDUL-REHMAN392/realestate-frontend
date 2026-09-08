"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CalendarCheck, ChevronDown, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookingApi } from "@/lib/api";
import { useUser } from "@/store/auth.store";
import { TIME_SLOTS } from "@/lib/constants";

interface Props {
  propertyId: string;
  agentId: string;
  propertyTitle: string;
}

export default function BookingSchedule({ propertyId, agentId, propertyTitle }: Props) {
  const user = useUser();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectedDate, setDate] = useState("");
  const [selectedSlot, setSlot] = useState("");
  const [note, setNote] = useState("");
  const [bookedSlots, setBooked] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const maxD = new Date();
  maxD.setDate(maxD.getDate() + 30);
  const maxDate = maxD.toISOString().split("T")[0];

  useEffect(() => {
    if (!selectedDate || !propertyId) return;
    setSlotsLoading(true);
    setSlot("");
    bookingApi
      .getBookedSlots(propertyId, selectedDate)
      .then(({ data }) => setBooked(data.data?.bookedSlots ?? []))
      .catch(() => setBooked([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, propertyId]);

  async function handleBook() {
    if (!user) { router.push("/login"); return; }
    if (!selectedDate || !selectedSlot) { setError("Please select a date and time slot"); return; }
    setSubmitting(true);
    setError("");
    try {
      await bookingApi.create({
        propertyId, agentId,
        date: selectedDate,
        timeSlot: selectedSlot,
        note: note.trim() || undefined,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Booking failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white border border-[#C0DD97] rounded-2xl p-5 text-center">
        <div className="w-12 h-12 rounded-full bg-[#3B6D11] flex items-center justify-center mx-auto mb-3">
          <CalendarCheck className="h-6 w-6 text-white" />
        </div>
        <p className="font-semibold text-[#3B6D11]">Visit Scheduled!</p>
        <p className="text-sm text-[#3B6D11]/80 mt-1">{selectedDate} at {selectedSlot}</p>
        <p className="text-xs text-[#6B7280] mt-1">Agent will confirm soon.</p>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => router.push("/dashboard/bookings")} className="flex-1 h-9 text-sm gap-2">
            <CalendarCheck className="h-4 w-4" /> My Bookings
          </Button>
          <Button
            onClick={() => { setSuccess(false); setDate(""); setSlot(""); }}
            variant="outline" className="flex-1 h-9 text-sm"
          >
            Book Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF3DE] flex items-center justify-center">
            <Calendar className="h-4 w-4 text-[#3B6D11]" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-[#1C1C1C] text-sm">Schedule a Visit</p>
            <p className="text-xs text-[#9CA3AF]">Book a time to see this property</p>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-[#9CA3AF] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-[#E2EAD8]">
          {/* Date */}
          <div className="pt-4">
            <label className="block text-xs font-medium text-[#374151] mb-1.5">Select Date</label>
            <input
              type="date" min={minDate} max={maxDate} value={selectedDate}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-[#D1E5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3B6D11] text-[#374151] bg-white"
            />
          </div>

          {/* Slots */}
          {selectedDate && (
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Select Time Slot
              </label>
              {slotsLoading ? (
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-9 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot} disabled={isBooked} onClick={() => setSlot(slot)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                          isBooked
                            ? "bg-gray-50 text-[#D1D5DB] border-[#E5E7EB] cursor-not-allowed line-through"
                            : isSelected
                            ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                            : "bg-white text-[#374151] border-[#D1E5B8] hover:border-[#3B6D11] hover:bg-[#EAF3DE]"
                        }`}
                      >
                        {isBooked ? `${slot} ✗` : slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Note */}
          {selectedSlot && (
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">
                Note for Agent <span className="text-[#9CA3AF] font-normal">(optional)</span>
              </label>
              <textarea
                value={note} onChange={(e) => setNote(e.target.value)}
                rows={2} maxLength={500}
                placeholder="e.g. I want to check the roof and parking area..."
                className="w-full border border-[#D1E5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3B6D11] resize-none bg-white"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <X className="h-4 w-4 text-red-500" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={handleBook}
            disabled={!selectedDate || !selectedSlot || submitting}
            className="w-full h-11 gap-2 text-sm"
          >
            {submitting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Booking...</>
            ) : (
              <><CalendarCheck className="h-4 w-4" /> Confirm Visit</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}