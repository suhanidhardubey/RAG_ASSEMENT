"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Home,
  Upload,
  LayoutDashboard,
  BookOpen,
  Layers,
  Brain,
  Trophy,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  Flame,
  ChevronRight,
  GraduationCap,
  Video,
  Gamepad2,
  Calendar,
  Bookmark,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Welcome", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/curriculum", label: "University & Track", icon: GraduationCap },
  { href: "/subjects", label: "Academic Subjects", icon: BookOpen },
  { href: "/videos", label: "Video Lectures", icon: Video },
  { href: "/games", label: "Gaming Zone", icon: Gamepad2, badge: "XP" },
  { href: "/ask", label: "Ask AI Tutor", icon: Sparkles },
  { href: "/upload", label: "Upload & Extract", icon: Upload },
  { href: "/summary", label: "Summary & Terms", icon: FileText },
  { href: "/flashcards", label: "3D Flashcards", icon: Layers },
  { href: "/quiz", label: "Quiz & Analytics", icon: Brain, badge: "Test" },
  { href: "/planner", label: "Study Planner", icon: Calendar },
  { href: "/pyq", label: "PYQ Papers", icon: BookOpen },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, badge: "Rank" },
  { href: "/profile", label: "My Profile", icon: User },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchProfile = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      setLoadingUser(false);
      return;
    }

    api.get("/api/user/me")
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        setCurrentUser(null);
      })
      .finally(() => setLoadingUser(false));
  };

  useEffect(() => {
    fetchProfile();
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
    }
    setCurrentUser(null);
    router.push("/profile");
  };

  return (
    <html lang="en">
      <head>
        <title>RAG Assistant — Study Companion</title>
        <meta
          name="description"
          content="Local AI-powered Study Companion with Document Processing, Flashcards, Quiz Modules, and Leaderboard."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FFF5F8] text-[#4A1525]">
        {/* ─── SIDEBAR NAVIGATION ─── */}
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white/95 backdrop-blur-xl border-r border-[#FFC1D9] z-50 flex flex-col justify-between shadow-sm">
          {/* Top Brand Header */}
          <div>
            <div className="p-5 pb-3 border-b border-[#FFD6E7]">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFC1D9] to-[#FFD6E7] flex items-center justify-center text-xl shadow-xs border border-white group-hover:scale-105 transition-transform">
                  🌸
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-extrabold text-base text-[#4A1525]">
                      RAG Assistant
                    </h1>
                    <span className="text-[10px] bg-[#FFD6E7] text-[#C2185B] font-bold px-1.5 py-0.2 rounded-full border border-[#FFC1D9]">
                      Local
                    </span>
                  </div>
                  <p className="text-[11px] text-[#880E4F]/70 font-semibold truncate max-w-[155px]">
                    Smart Study Companion
                  </p>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-165px)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link text-xs ${isActive ? "active" : ""}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 font-bold">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white text-[#F06292]"
                            : "bg-[#FFD6E7] text-[#C2185B]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Profile Bar / Auth Controls */}
          <div className="p-3 border-t border-[#FFD6E7] bg-[#FFF5F8]/70">
            {currentUser ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 p-2 rounded-2xl hover:bg-white transition-all group border border-transparent hover:border-[#FFC1D9]"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-[#F06292] bg-white p-0.5 shadow-xs overflow-hidden">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#F06292] text-white text-[9px] font-bold flex items-center justify-center">
                      #{currentUser.rank || 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#4A1525] truncate group-hover:text-[#F06292]">
                      {currentUser.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#880E4F]/70 font-semibold">
                      <span>{currentUser.xp?.toLocaleString()} XP</span>
                      <span>•</span>
                      <span className="text-orange-500 font-bold flex items-center gap-0.5">
                        🔥 {currentUser.streak}d
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#F06292] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex-1 py-1 px-2 rounded-xl bg-white border border-[#FFC1D9] text-[10px] font-bold text-[#880E4F] hover:bg-[#FFD6E7] transition-all flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <User className="w-3 h-3 text-[#F06292]" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="py-1 px-2.5 rounded-xl bg-white border border-[#FFC1D9] text-[10px] font-bold text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-1 shadow-2xs"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Exit</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Link
                  href="/profile"
                  className="w-full py-2 px-3 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-[#F06292]/30 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* ─── MAIN APP CONTENT ─── */}
        <main className="ml-64 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
