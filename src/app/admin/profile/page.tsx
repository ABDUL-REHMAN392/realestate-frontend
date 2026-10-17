"use client";

import { useEffect, useState } from "react";
import {
  Camera, Save, Key, User,
  CheckCircle2, AlertCircle, ShieldCheck, Lock,
  Globe, Laptop, Check
} from "lucide-react";
import { useAuthStore, useUser } from "@/store/auth.store";
import { userApi, authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { AxiosError } from "axios";

type Flash = { type: "ok" | "err"; text: string } | null;

function FlashMsg({ msg }: { msg: Flash }) {
  if (!msg) return null;
  return (
    <div className={`mb-6 flex items-center gap-2.5 p-3.5 rounded-xl text-xs font-semibold border ${
      msg.type === "ok"
        ? "bg-[#EAF3DE] border-[#C0DD97] text-[#3B6D11]"
        : "bg-rose-50 border-rose-200 text-rose-800"
    }`}>
      {msg.type === "ok"
        ? <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3B6D11]" />
        : <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
      }
      {msg.text}
    </div>
  );
}

function getErr(err: unknown, fallback: string): string {
  const e = err as AxiosError<{
    message?: string;
    errors?: Record<string, string[]>;
  }>;
  const fieldErrors = e?.response?.data?.errors;
  if (fieldErrors) {
    const first = Object.values(fieldErrors)[0]?.[0];
    if (first) return first;
  }
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.response?.status === 401) return "Incorrect current password.";
  if (e?.response?.status === 403) return "Session expired. Please sign in again.";
  return fallback;
}

export default function AdminProfilePage() {
  const user = useUser();
  const { setUser } = useAuthStore();

  const [form, setForm] = useState({ name: "", phone: "" });
  const [pwForm, setPwForm] = useState({ current: "", newPass: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [pwSave, setPwSave] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<Flash>(null);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name ?? "", phone: user.phone ?? "" });
  }, [user]);

  function flash(type: "ok" | "err", text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 5000);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { flash("err", "Name cannot be empty."); return; }
    setSaving(true);
    try {
      const { data } = await userApi.updateMe({
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
      });
      setUser(data.data.user);
      flash("ok", "Admin profile updated successfully.");
    } catch (err) {
      flash("err", getErr(err, "Failed to update profile."));
    }
    setSaving(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.newPass !== pwForm.confirm) {
      flash("err", "New passwords do not match.");
      return;
    }
    if (pwForm.newPass.length < 8) {
      flash("err", "Password must be at least 8 characters long.");
      return;
    }
    setPwSave(true);
    try {
      await authApi.changePassword({
        currentPassword: pwForm.current,
        newPassword: pwForm.newPass,
      });
      flash("ok", "Master password updated successfully.");
      setPwForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      flash("err", getErr(err, "Failed to update password."));
    }
    setPwSave(false);
  }

  async function uploadPhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      flash("err", "Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      flash("err", "Image must be less than 5MB.");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const { data } = await userApi.updateMe(fd);
      setUser(data.data.user);
      flash("ok", "Admin avatar updated successfully.");
    } catch (err) {
      flash("err", getErr(err, "Failed to upload avatar."));
    }
    setUploading(false);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="border-b border-[#E2EAD8] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1C1C]">Admin Settings & Security</h1>
            <span className="text-xs font-bold text-[#3B6D11] bg-[#EAF3DE] px-2.5 py-0.5 rounded-full border border-[#C0DD97]">
              Root Administrator
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage your executive credentials, primary contact info, and platform moderation access
          </p>
        </div>
      </div>

      <FlashMsg msg={msg} />

      {/* ── Executive Identity Card ── */}
      <Card className="border-[#E2EAD8] shadow-xs overflow-hidden bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group shrink-0">
              <Avatar className="h-20 w-20 ring-4 ring-[#EAF3DE] shadow-sm">
                {user?.photo && <AvatarImage src={user.photo} alt={user?.name ?? "Admin"} className="object-cover" />}
                <AvatarFallback className="bg-[#3B6D11] text-white text-2xl font-bold">
                  {(user?.name ?? "A").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="h-5 w-5" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadPhoto(f);
                }}
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <h2 className="text-lg font-bold text-[#1C1C1C] truncate">{user?.name ?? "Administrator"}</h2>
                <Badge variant="green" className="text-[11px] bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97]">
                  Full Access
                </Badge>
              </div>
              <p className="text-xs text-[#6B7280] font-medium">{user?.email}</p>
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-[11px] text-[#6B7280] flex-wrap">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#3B6D11]" /> System Moderator
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-[#3B6D11]" /> 256-bit Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-[#3B6D11]" /> Pakistan Gateway
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Main Settings 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details Form */}
        <Card className="border-[#E2EAD8] shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-4 border-b border-[#E2EAD8]">
            <CardTitle className="text-base font-bold text-[#1C1C1C] flex items-center gap-2">
              <User className="h-4 w-4 text-[#3B6D11]" /> Administrator Details
            </CardTitle>
            <CardDescription className="text-xs text-[#6B7280]">
              Update your display name and emergency phone contact
            </CardDescription>
          </CardHeader>
          <form onSubmit={saveProfile} className="flex-1 flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#374151]">Full Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Platform Administrator"
                  required
                  className="border-[#E2EAD8] focus-visible:ring-[#3B6D11] text-xs h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#374151]">Official Email Address (Locked)</label>
                <Input
                  value={user?.email ?? ""}
                  disabled
                  className="border-[#E2EAD8] bg-[#F8FAF6] text-[#9CA3AF] text-xs h-10 rounded-xl cursor-not-allowed font-medium"
                />
                <p className="text-[10px] text-[#9CA3AF]">Root email is tied to domain authentication and cannot be edited.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#374151]">Phone / WhatsApp</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="border-[#E2EAD8] focus-visible:ring-[#3B6D11] text-xs h-10 rounded-xl"
                />
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t border-[#E2EAD8] flex justify-end bg-[#F8FAF6]/50">
              <Button
                type="submit"
                disabled={saving}
                size="sm"
                className="text-xs bg-[#3B6D11] hover:bg-[#2D540D] text-white rounded-xl font-bold px-5 shadow-xs"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {saving ? "Saving Changes..." : "Save Profile"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Security & Password Form */}
        <Card className="border-[#E2EAD8] shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-4 border-b border-[#E2EAD8]">
            <CardTitle className="text-base font-bold text-[#1C1C1C] flex items-center gap-2">
              <Key className="h-4 w-4 text-[#3B6D11]" /> Master Password
            </CardTitle>
            <CardDescription className="text-xs text-[#6B7280]">
              Protect administrative privileges with a strong password
            </CardDescription>
          </CardHeader>
          <form onSubmit={changePassword} className="flex-1 flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#374151]">Current Password</label>
                <Input
                  type="password"
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="border-[#E2EAD8] focus-visible:ring-[#3B6D11] text-xs h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#374151]">New Password</label>
                <Input
                  type="password"
                  value={pwForm.newPass}
                  onChange={(e) => setPwForm({ ...pwForm, newPass: e.target.value })}
                  placeholder="At least 8 characters"
                  required
                  className="border-[#E2EAD8] focus-visible:ring-[#3B6D11] text-xs h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#374151]">Confirm New Password</label>
                <Input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  placeholder="Repeat new password"
                  required
                  className="border-[#E2EAD8] focus-visible:ring-[#3B6D11] text-xs h-10 rounded-xl"
                />
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t border-[#E2EAD8] flex justify-end bg-[#F8FAF6]/50">
              <Button
                type="submit"
                disabled={pwSave}
                size="sm"
                className="text-xs bg-[#3B6D11] hover:bg-[#2D540D] text-white rounded-xl font-bold px-5 shadow-xs"
              >
                <Key className="h-3.5 w-3.5 mr-1.5" />
                {pwSave ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* ── System Access & Session Security ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#E2EAD8] shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#1C1C1C]">Executive Privileges</CardTitle>
            <CardDescription className="text-xs text-[#6B7280]">Active permission scopes for your account</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2.5">
            {[
              "Property Moderation (Approve, Reject & Feature)",
              "Agent Application KYC Review & Verification",
              "User Management (Status Toggling & Role Control)",
              "System Analytics & Platform Growth Insights",
            ].map((perm) => (
              <div key={perm} className="p-2.5 bg-[#F8FAF6] rounded-xl border border-[#E2EAD8] flex items-center justify-between text-xs font-semibold text-[#1C1C1C]">
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#3B6D11]" /> {perm}
                </span>
                <span className="text-[10px] font-bold text-[#3B6D11] bg-[#EAF3DE] px-2 py-0.5 rounded-full border border-[#C0DD97]">
                  Active
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#E2EAD8] shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#1C1C1C]">Session & Device Security</CardTitle>
            <CardDescription className="text-xs text-[#6B7280]">Authenticated browser sessions</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="p-3.5 bg-[#F8FAF6] rounded-xl border border-[#E2EAD8] flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5 text-[#3B6D11]" /> Desktop Browser
                </p>
                <p className="text-[10px] text-[#6B7280]">Active Session • Encrypted Token Authorization</p>
              </div>
              <span className="text-[10px] font-bold text-[#3B6D11] bg-[#EAF3DE] px-2.5 py-1 rounded-full border border-[#C0DD97]">
                Current
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Always sign out from public workstations when managing real estate moderation and agent applications.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
