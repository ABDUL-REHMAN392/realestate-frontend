"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser, useAuthStore } from "@/store/auth.store";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  ShieldCheck, Users, UserCheck, LayoutDashboard,
  Building2, ChevronRight, LogOut, 
  Home, Menu, X, BarChart2, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface NavItem { href: string; icon: React.ElementType; label: string; }


// ─── Admin Nav Link ───────────────────────────────────────────────────────────
function AdminNavLink({ href, icon: Icon, label }: NavItem) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));
  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-150",
      isActive
        ? "bg-[#EAF3DE] text-[#3B6D11] font-bold border border-[#C0DD97]/50 shadow-xs"
        : "text-[#6B7280] hover:bg-[#F8FAF6] hover:text-[#3B6D11]",
    )}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {isActive && <ChevronRight className="h-3.5 w-3.5 text-[#3B6D11]" />}
    </Link>
  );
}

// ─── Admin Header ─────────────────────────────────────────────────────────────
function AdminHeader({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void; }) {
  const user   = useUser();
  const logout = useAuthStore((s) => s.logout);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/admin": "Platform Overview", "/admin/agents": "Agent Applications",
    "/admin/users": "User Management", "/admin/properties": "Property Moderation",
    "/admin/analytics": "Analytics Console", "/admin/profile": "Admin Settings",
  };
  const pageTitle = pageTitles[pathname] ?? "Admin Console";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-[#E2EAD8] flex items-center px-4 gap-4">
      <div className="flex items-center gap-3 w-[260px] flex-shrink-0">
        <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link href="/">
          <Image src="/logo.png" alt="GharFind" width={150} height={56} className="object-contain" style={{ height: "auto" }} />
        </Link>
      </div>

      <div className="flex-1 flex items-center gap-3">
        <h1 className="text-sm font-bold text-[#1C1C1C] hidden sm:block">{pageTitle}</h1>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF3DE] text-[#3B6D11] border border-[#C0DD97]">
          Super Admin
        </span>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#3B6D11] flex items-center justify-center flex-shrink-0">
              {user?.photo
                ? <img src={user.photo} alt="" className="w-7 h-7 rounded-full object-cover" />
                : <ShieldCheck className="h-3.5 w-3.5 text-white" />}
            </div>
            <span className="text-sm font-bold text-[#1C1C1C] hidden sm:block">
              {(user?.name ?? "Admin").split(" ")[0]}
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-[#9CA3AF] rotate-90 hidden sm:block" />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-xl border border-[#E2EAD8] py-2 z-20">
                <div className="px-4 py-3 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#3B6D11]" />
                    <p className="text-xs font-bold text-[#3B6D11]">Super Admin</p>
                  </div>
                  <p className="text-sm font-bold text-[#1C1C1C] truncate">{user?.name}</p>
                  <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link href="/admin/profile" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#F8FAF6] hover:text-[#3B6D11]">
                    <Settings className="h-4 w-4 text-[#3B6D11]" /> Profile Settings
                  </Link>
                  <Link href="/" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#F8FAF6]">
                    <Home className="h-4 w-4 text-[#9CA3AF]" /> View Website
                  </Link>
                </div>
                <div className="pt-1 border-t border-[#F3F4F6]">
                  <button onClick={() => { setProfileOpen(false); logout(); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Admin Sidebar ────────────────────────────────────────────────────────────
function AdminSidebar({ open }: { open: boolean }) {
  const user   = useUser();
  const logout = useAuthStore((s) => s.logout);
  const navItems: NavItem[] = [
    { href: "/admin",            icon: LayoutDashboard, label: "Overview"           },
    { href: "/admin/analytics",  icon: BarChart2,       label: "Analytics"          },
    { href: "/admin/agents",     icon: UserCheck,       label: "Agent Applications" },
    { href: "/admin/users",      icon: Users,           label: "Users"              },
    { href: "/admin/properties", icon: Building2,       label: "Properties"         },
    { href: "/admin/profile",    icon: Settings,        label: "Profile Settings"   },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" />}
      <aside className={cn(
        "fixed left-0 top-16 bottom-0 w-[260px] bg-white border-r border-[#E2EAD8] z-30",
        "flex flex-col overflow-y-auto transition-transform duration-200",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}>
        <div className="px-4 py-4 border-b border-[#E2EAD8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3B6D11] flex items-center justify-center flex-shrink-0">
              {user?.photo
                ? <img src={user.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                : <ShieldCheck className="h-5 w-5 text-white" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1C1C1C] truncate">{user?.name ?? "Admin"}</p>
              <p className="text-xs font-bold text-[#3B6D11]">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => <AdminNavLink key={item.href} {...item} />)}
          <div className="pt-3 pb-1">
            <p className="px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Quick Links</p>
          </div>
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] hover:bg-[#F8FAF6] hover:text-[#3B6D11] transition-all">
            <Home className="h-4 w-4 flex-shrink-0 text-[#9CA3AF]" /> View Website
          </Link>
        </nav>

        <div className="px-3 py-4 border-t border-[#E2EAD8]">
          <button onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Main Admin Layout ────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user   = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user === null)               { router.replace("/login"); return; }
    if (user && user.role !== "admin") { router.replace("/"); }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return <LoadingSpinner fullScreen size="lg" color="#3B6D11" text="Loading Admin Console..." />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF6]">
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <AdminSidebar open={sidebarOpen} />
      <div className="md:pl-[260px] pt-16" onClick={() => sidebarOpen && setSidebarOpen(false)}>
        <main className="min-h-[calc(100vh-4rem)] p-6">{children}</main>
      </div>
    </div>
  );
}