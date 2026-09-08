"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, CheckCheck, Trash2, X, Info, Package, CalendarCheck, Home, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { notificationApi, tokenStore } from "@/lib/api";
import { useUser } from "@/store/auth.store";
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────
interface Notification {
  _id: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

function NotifIcon({ type }: { type: string }) {
  const cls = "h-4 w-4";
  if (type.includes("booking"))   return <CalendarCheck className={cn(cls, "text-blue-500")} />;
  if (type.includes("property"))  return <Home className={cn(cls, "text-[#3B6D11]")} />;
  if (type.includes("inquiry"))   return <MessageCircle className={cn(cls, "text-amber-500")} />;
  if (type.includes("message"))   return <MessageCircle className={cn(cls, "text-purple-500")} />;
  if (type.includes("agent"))     return <Package className={cn(cls, "text-indigo-500")} />;
  return <Info className={cn(cls, "text-gray-400")} />;
}

function notifBg(type: string) {
  if (type.includes("booking"))  return "bg-blue-50";
  if (type.includes("property")) return "bg-[#EAF3DE]";
  if (type.includes("inquiry"))  return "bg-amber-50";
  if (type.includes("message"))  return "bg-purple-50";
  if (type.includes("agent"))    return "bg-indigo-50";
  return "bg-gray-50";
}

export default function NotificationBell() {
  const user = useUser();
  const [open, setOpen]             = useState(false);
  const [notifs, setNotifs]         = useState<Notification[]>([]);
  const [unread, setUnread]         = useState(0);
  const [loading, setLoading]       = useState(false);
  const socketRef                   = useRef<Socket | null>(null);
  const panelRef                    = useRef<HTMLDivElement>(null);

  // ── Fetch notifications ───────────────────────
  const fetchNotifs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await notificationApi.getAll({ limit: 30 });
      setNotifs(data.data?.data ?? []);
      setUnread(data.data?.unread ?? 0);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [user]);

  // ── Socket connection for real-time push ──────
  useEffect(() => {
    if (!user) return;
    const token = tokenStore.get();
    if (!token) return;

    const s = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5001", {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = s;

    s.on("notification:new", (notif: Notification) => {
      setNotifs((prev) => [notif, ...prev].slice(0, 30));
      setUnread((n) => n + 1);
    });

    return () => { s.disconnect(); socketRef.current = null; };
  }, [user]);

  // ── Load on mount ─────────────────────────────
  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  // ── Close on outside click ────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function markRead(id: string) {
    try {
      await notificationApi.markRead(id);
      setNotifs((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
      setUnread((n) => Math.max(0, n - 1));
    } catch { /* silent */ }
  }

  async function markAllRead() {
    try {
      await notificationApi.markAllRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch { /* silent */ }
  }

  async function deleteNotif(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const wasUnread = notifs.find((n) => n._id === id)?.isRead === false;
    try {
      await notificationApi.delete(id);
      setNotifs((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) setUnread((n) => Math.max(0, n - 1));
    } catch { /* silent */ }
  }

  if (!user) return null;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifs(); }}
        className="relative p-2 rounded-xl text-[#6B7280] hover:text-[#3B6D11] hover:bg-[#EAF3DE] transition-all"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 leading-none">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[calc(100vw-1rem)] sm:w-[360px] max-w-[360px] max-h-[520px] flex flex-col bg-white border border-[#E2EAD8] rounded-2xl shadow-xl shadow-[#3B6D11]/8 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2EAD8] flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#3B6D11]" />
                <h3 className="font-semibold text-[#1C1C1C] text-sm">Notifications</h3>
                {unread > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{unread} new</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#3B6D11] hover:text-[#2d5209] font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#EAF3DE] transition-colors"
                  >
                    <CheckCheck className="h-3 w-3" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-[#F8FAF6] text-[#9CA3AF] hover:text-[#374151] transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-9 h-9 rounded-xl bg-[#EAF3DE] flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[#EAF3DE] rounded w-3/4" />
                        <div className="h-3 bg-[#EAF3DE] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifs.length === 0 ? (
                <div className="py-12 text-center text-[#9CA3AF]">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifs.map((notif) => (
                  <div
                    key={notif._id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 hover:bg-[#F8FAF6] transition-colors group border-b border-[#F0F6E8] last:border-0 cursor-pointer",
                      !notif.isRead && "bg-[#F8FAF6]"
                    )}
                    onClick={() => { if (!notif.isRead) markRead(notif._id); setOpen(false); }}
                  >
                    {/* Icon */}
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", notifBg(notif.type))}>
                      <NotifIcon type={notif.type} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm leading-snug truncate", !notif.isRead ? "font-semibold text-[#1C1C1C]" : "font-medium text-[#374151]")}>
                            {notif.link
                              ? <Link href={notif.link} onClick={(e) => e.stopPropagation()} className="hover:text-[#3B6D11]">{notif.title}</Link>
                              : notif.title
                            }
                          </p>
                          <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">{notif.body}</p>
                          <p className="text-xs text-[#9CA3AF] mt-1">{timeAgo(notif.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.isRead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); markRead(notif._id); }}
                              className="p-1 rounded-lg hover:bg-[#EAF3DE] text-[#9CA3AF] hover:text-[#3B6D11]"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => deleteNotif(notif._id, e)}
                            className="p-1 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Unread dot */}
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#3B6D11] flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifs.length > 0 && (
              <div className="border-t border-[#E2EAD8] px-4 py-2.5 flex-shrink-0">
                <p className="text-center text-xs text-[#9CA3AF]">{notifs.length} notification{notifs.length !== 1 ? "s" : ""}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}