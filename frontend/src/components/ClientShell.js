"use client";

import { useState, useEffect, Suspense } from "react";
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
  Sparkles,
  ChevronRight,
  GraduationCap,
  Video,
  Gamepad2,
  Calendar,
  Bookmark,
  FileText,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  X,
  Globe,
  Smartphone,
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

function ShellInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window === "undefined") return "https://frontend-weld-seven-11.vercel.app";
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "https://frontend-weld-seven-11.vercel.app";
    }
    return window.location.origin;
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const text = `🌸 *RIVora* — AI Study Agora & Exam Companion with Gemini AI!\n\nAccess 3D Flashcards, Syllabus Intelligence, Timed Quizzes, and Live AI Tutoring.\n\n🔗 Open directly here:\n${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = () => {
    const url = getShareUrl();
    if (navigator.share) {
      navigator.share({
        title: "RIVora - AI Study Agora & Exam Companion",
        text: "Study smarter with RIVora: Gemini AI, 3D Flashcards, Quizzes & Syllabus intelligence!",
        url: url,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const fetchProfile = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
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
      });
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

  const shareUrl = getShareUrl();

  return (
    <div className="min-h-screen bg-[#FFF5F8] text-[#4A1525]">
      {/* ─── FLOATING TOP-RIGHT SHARE BUTTON ─── */}
      <div className="fixed top-4 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#25D366]/40 hover:border-[#25D366] text-[#1EBE5D] hover:text-[#128C7E] font-extrabold text-xs shadow-md shadow-emerald-500/15 hover:shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <MessageCircle className="w-4 h-4 fill-[#25D366]" />
          <span>Share on WhatsApp</span>
        </button>
      </div>

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
                  <h1 className="font-extrabold text-base text-[#4A1525] tracking-tight">
                    RIVora
                  </h1>
                  <span className="text-[10px] bg-[#FFD6E7] text-[#C2185B] font-bold px-1.5 py-0.2 rounded-full border border-[#FFC1D9]">
                    AI Agora
                  </span>
                </div>
                <p className="text-[11px] text-[#880E4F]/70 font-semibold truncate max-w-[155px]">
                  Smart Study Agora
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Share on WhatsApp CTA */}
          <div className="p-3 pb-1">
            <button
              onClick={() => setIsShareOpen(true)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-[#25D366] hover:from-emerald-600 hover:to-[#1EBE5D] text-white font-extrabold text-[11px] shadow-sm shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span className="tracking-tight">Share on WhatsApp</span>
              </div>
              <Share2 className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-215px)]">
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

      {/* ─── SHARE MODAL ─── */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#FFC1D9] p-6 space-y-5 overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#25D366] via-[#F06292] to-[#880E4F]" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-[#25D366] text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#4A1525]">
                    Share RIVora
                  </h3>
                  <p className="text-xs text-[#880E4F]/70 font-semibold">
                    Send to WhatsApp or copy live link
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShareOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Link Box */}
            <div className="p-3.5 rounded-2xl bg-[#FFF5F8] border border-[#FFD6E7] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Active Public HTTPS Link
                </span>
                <span className="text-[10px] text-[#880E4F]/60">Ready to share</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#FFC1D9]">
                <Globe className="w-4 h-4 text-[#F06292] shrink-0" />
                <span className="font-mono text-xs text-[#4A1525] truncate select-all flex-1">
                  {shareUrl}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {/* WhatsApp Share Button */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Share Directly on WhatsApp</span>
                <ExternalLink className="w-4 h-4 opacity-75" />
              </button>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className={`w-full py-3 px-4 rounded-2xl border font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white border-[#FFC1D9] hover:bg-[#FFF5F8] text-[#880E4F]"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Copied Link to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Share Link</span>
                  </>
                )}
              </button>

              {/* Native Mobile Share */}
              {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  <span>More Sharing Options (SMS, Telegram, Instagram)...</span>
                </button>
              )}
            </div>

            {/* Permanent Hosting Notice */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] space-y-1.5 text-amber-950">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Want a permanent link that never resets?</span>
              </div>
              <p className="text-amber-900/80 leading-relaxed">
                Cloudflare quick tunnels stay active while your launcher is running. To get a permanent 24/7 link (e.g. <span className="font-mono font-bold">rivora.vercel.app</span>) that never expires, deploy your GitHub repo to <strong>Vercel</strong> (100% free)!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN APP CONTENT ─── */}
      <main className="ml-64 min-h-screen">{children}</main>
    </div>
  );
}

export default function ClientShell({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF5F8] p-8 text-[#8B4B62] font-semibold text-sm">
          Loading companion workspace...
        </div>
      }
    >
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}
