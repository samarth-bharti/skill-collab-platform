import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Briefcase,
  Compass,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getNotifications, getPendingRequests } from "../lib/api";

const primaryLinks = [
  { label: "Overview", to: "/dashboard", icon: Home, end: true },
  { label: "Network", to: "/dashboard/discover", icon: Users },
  { label: "Projects", to: "/dashboard/projects", icon: Briefcase },
  { label: "Chat", to: "/dashboard/chat", icon: MessageSquare },
];

const secondaryLinks = [
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
  { label: "Support", to: "/dashboard/support", icon: HelpCircle },
];

function NavItem({ item, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      end={item.end}
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-lime-300 text-slate-950"
            : "text-slate-300 hover:bg-white/6 hover:text-white"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </NavLink>
  );
}

function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full flex-col justify-between rounded-[28px] border border-white/10 bg-slate-950/90 p-5 shadow-2xl backdrop-blur">
      <div className="space-y-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 text-slate-950">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Skill Collab</p>
            <h1 className="text-lg font-semibold text-white">Student Workspace</h1>
          </div>
        </Link>

        <nav className="space-y-2">
          {primaryLinks.map((item) => (
            <NavItem key={item.to} item={item} onClick={onNavigate} />
          ))}
        </nav>
      </div>

      <div className="space-y-2">
        {secondaryLinks.map((item) => (
          <NavItem key={item.to} item={item} onClick={onNavigate} />
        ))}
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const loadShellData = async () => {
      const [nextNotifications, nextRequests] = await Promise.all([
        getNotifications(currentUser.$id),
        getPendingRequests(currentUser.$id),
      ]);
      setNotifications(nextNotifications);
      setRequests(nextRequests);
    };

    loadShellData();

    window.addEventListener("skill-collab:data-updated", loadShellData);
    return () => {
      window.removeEventListener("skill-collab:data-updated", loadShellData);
    };
  }, [currentUser]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length + requests.length,
    [notifications, requests]
  );

  const initials = useMemo(() => {
    const name = currentUser?.fullName || currentUser?.name || "User";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const content = children || <Outlet />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(163,230,53,0.18),_transparent_30%),linear-gradient(180deg,#07111f_0%,#020617_45%,#020617_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <div className="hidden w-72 shrink-0 lg:block">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="sticky top-4 z-20 flex items-center justify-between rounded-[28px] border border-white/10 bg-slate-950/75 px-5 py-4 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Build Together</p>
                <h2 className="text-lg font-semibold text-white">Frontend collaboration prototype</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:block">
                {requests.length} pending requests
              </div>
              <Link
                to="/dashboard/discover"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-lime-300 px-1 text-[11px] font-semibold text-slate-950">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300 font-semibold text-slate-950">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{currentUser?.fullName || currentUser?.name}</p>
                  <p className="text-xs text-slate-400">{currentUser?.role || "Student Builder"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          <main className="min-h-[calc(100vh-7rem)]">{content}</main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 p-4 backdrop-blur lg:hidden">
          <div className="mx-auto flex h-full max-w-sm flex-col gap-4">
            <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-slate-900 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Navigation</p>
                <p className="text-lg font-semibold text-white">Skill Collab</p>
              </div>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
