"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  BookOpen,
  Layers,
  Brain,
  Trophy,
  Flame,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  FileText,
  Upload,
  Sparkles,
  MessageSquare,
  Search,
  MessageCircle,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentConversations, setRecentConversations] = useState([]);
  const [historySearch, setHistorySearch] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/api/user/me"),
      api.get("/api/dashboard/stats"),
      api.get("/api/documents"),
      api.get("/api/conversations?limit=6").catch(() => ({ data: [] })),
    ])
      .then(([userRes, statsRes, docsRes, convRes]) => {
        setUser(userRes.data);
        setStats(statsRes.data);
        setDocuments(docsRes.data);
        setRecentConversations(convRes.data || []);
        if (docsRes.data.length > 0) {
          const stored = localStorage.getItem("activeDocId");
          const active = docsRes.data.find((d) => d.id === stored) || docsRes.data[0];
          setSelectedDocId(active.id);
          localStorage.setItem("activeDocId", active.id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDocChange = (docId) => {
    setSelectedDocId(docId);
    localStorage.setItem("activeDocId", docId);
  };

  const activeDoc = documents.find((d) => d.id === selectedDocId);

  const modules = [
    {
      href: "/subjects",
      icon: "📚",
      title: "Academic Subjects",
      desc: "5-Unit syllabus, topic checklists, notes & weightage",
      badge: "Curriculum",
      badgeBg: "bg-white text-[#C2185B]",
    },
    {
      href: "/videos",
      icon: "🎬",
      title: "Curated Video Lectures",
      desc: "Gateway Classes, Fearless, Gate Smashers & Abdul Bari",
      badge: "Verified",
      badgeBg: "bg-white text-[#F06292]",
    },
    {
      href: "/games",
      icon: "🎮",
      title: "Educational Gaming Zone",
      desc: "Quiz Battle, Memory Match, Find the Bug & Daily Streak",
      badge: "Earn XP",
      badgeBg: "bg-[#F06292] text-white",
    },
    {
      href: "/history",
      icon: "💬",
      title: "Chat History",
      desc: "WhatsApp-style past conversations, global search & resume chatting",
      badge: "WhatsApp",
      badgeBg: "bg-white text-[#C2185B]",
    },
    {
      href: "/ask",
      icon: "🤖",
      title: "Ask AI Tutor (RAG)",
      desc: "Query document chunks & get cited explanations",
      badge: "AI Q&A",
      badgeBg: "bg-white text-[#F06292]",
    },
    {
      href: "/summary",
      icon: "📑",
      title: "AI Document Summary",
      desc: "High-yield key points, section summaries & TF-IDF keywords",
      badge: "Extract",
      badgeBg: "bg-white text-[#F06292]",
    },
    {
      href: "/flashcards",
      icon: "🎴",
      title: "3D Study Flashcards",
      desc: "3D perspective flip cards with +10 XP rewards",
      badge: "Recall",
      badgeBg: "bg-white text-[#F06292]",
    },
    {
      href: "/quiz",
      icon: "✍️",
      title: "Adaptive MCQ Quiz",
      desc: "Timed test with circular meter, grading & analytics",
      badge: "Live Test",
      badgeBg: "bg-[#F06292] text-white",
    },
    {
      href: "/planner",
      icon: "📅",
      title: "Study Planner & Reminders",
      desc: "Daily study targets & spaced repetition review queue",
      badge: "Schedule",
      badgeBg: "bg-white text-[#C2185B]",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* ─── Top Student Header ─── */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="relative group">
              <div className="w-12 h-12 rounded-full border-2 border-[#F06292] bg-white p-0.5 shadow-xs overflow-hidden">
                <img
                  src={user?.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Student&backgroundColor=ffd6e7"}
                  alt={user?.name || "Student"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F06292] text-white text-[10px] font-bold flex items-center justify-center">
                #{user?.rank || 1}
              </span>
            </Link>
            <div>
              <p className="text-xs font-semibold text-[#880E4F]">
                {user ? "Welcome back," : "RAGora Student Dashboard"}
              </p>
              <h1 className="text-base font-extrabold text-[#4A1525]">
                {user ? `${user.name} 👋` : "Guest Student 👋"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/leaderboard"
                  className="bg-white/80 hover:bg-white px-3 py-1.5 rounded-2xl border border-[#FFB8D2] flex items-center gap-1.5 text-xs font-bold text-[#4A1525] shadow-2xs transition-all"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Rank #{user.rank || 1}</span>
                </Link>
                <div className="bg-white/80 px-3 py-1.5 rounded-2xl border border-[#FFB8D2] flex items-center gap-1 text-xs font-bold text-orange-600 shadow-2xs">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>{user.streak || 1}d Streak</span>
                </div>
              </>
            ) : (
              <Link
                href="/profile"
                className="bg-white/90 hover:bg-white px-3 py-1.5 rounded-2xl border border-[#FFB8D2] flex items-center gap-1.5 text-xs font-extrabold text-[#F06292] shadow-2xs transition-all"
              >
                <span>Sign In / Register</span>
              </Link>
            )}
          </div>
        </div>

        {/* Active Document Selector */}
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <FileText className="w-5 h-5 text-[#F06292] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#880E4F]/70 uppercase">
                Active Study Document
              </p>
              {documents.length > 0 ? (
                <select
                  value={selectedDocId}
                  onChange={(e) => handleDocChange(e.target.value)}
                  className="bg-transparent font-extrabold text-xs text-[#4A1525] focus:outline-none cursor-pointer truncate max-w-xs"
                >
                  {documents.map((d) => (
                    <option key={d.id} value={d.id} className="text-[#4A1525]">
                      {d.filename} ({d.word_count?.toLocaleString()} words)
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs font-bold text-[#4A1525]">
                  No documents uploaded yet
                </p>
              )}
            </div>
          </div>

          <Link
            href="/upload"
            className="w-full sm:w-auto py-2 px-3.5 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Material</span>
          </Link>
        </div>
      </div>

      {/* ─── Real Stats Row ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total XP Earned", value: `${user?.xp?.toLocaleString() || 0} XP`, icon: Zap, color: "text-[#F06292]", bg: "bg-[#FFD6E7]" },
          { label: "Quizzes Completed", value: `${stats?.quizzes_taken || 0} Tests`, icon: Brain, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Cards Mastered", value: `${stats?.cards_mastered || 0} Cards`, icon: Layers, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Estimated Study Time", value: `${stats?.study_hours || 0} hrs`, icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="glass-card p-4 space-y-1">
              <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center mb-1`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className="text-[11px] font-bold text-[#880E4F]/70">{item.label}</p>
              <p className="text-sm font-extrabold text-[#4A1525] truncate">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* ─── WhatsApp Chat History Section ─── */}
      <div className="bg-white p-5 rounded-3xl border border-[#FFD6E7] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFD6E7] to-[#FFC1D9] flex items-center justify-center text-xl shadow-2xs">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-[#4A1525]">
                  Dashboard Chat History
                </h3>
                <span className="text-[10px] font-extrabold text-[#25D366] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  WhatsApp View
                </span>
              </div>
              <p className="text-[11px] text-[#880E4F]/70 font-semibold">
                View previous conversations, search topics & continue chatting
              </p>
            </div>
          </div>

          <Link
            href="/history"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF0F5] hover:bg-[#FFD6E7] border border-[#FFD6E7] text-xs font-extrabold text-[#C2185B] transition-all self-start sm:self-auto"
          >
            <span>View All ({recentConversations.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dashboard Quick Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#880E4F]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && historySearch.trim()) {
                router.push(`/history?search=${encodeURIComponent(historySearch.trim())}`);
              }
            }}
            placeholder="Search keyword across all past chats (press Enter for global search)..."
            className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FFD6E7] text-xs font-bold text-[#4A1525] placeholder:text-[#880E4F]/50 focus:outline-none focus:border-[#F06292] transition-colors"
          />
          {historySearch.trim() && (
            <button
              onClick={() => router.push(`/history?search=${encodeURIComponent(historySearch.trim())}`)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl bg-[#F06292] text-white text-[10px] font-extrabold hover:bg-[#E91E63] transition-colors"
            >
              Search
            </button>
          )}
        </div>

        {/* WhatsApp-Style Chat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {recentConversations
            .filter((c) =>
              historySearch
                ? c.title.toLowerCase().includes(historySearch.toLowerCase()) ||
                  c.last_message?.content?.toLowerCase().includes(historySearch.toLowerCase())
                : true
            )
            .slice(0, 6)
            .map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/history?id=${c.id}`)}
                className="bg-[#FFF5F8] hover:bg-[#FFD6E7]/50 p-3.5 rounded-2xl border border-[#FFD6E7] hover:border-[#F06292] transition-all cursor-pointer group flex flex-col justify-between space-y-2 shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-sm shadow-2xs shrink-0 border border-[#FFD6E7]">
                    🤖
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-[#4A1525] truncate group-hover:text-[#C2185B]">
                        {c.title}
                      </h4>
                    </div>
                    <p className="text-[10px] text-[#880E4F]/70 font-semibold line-clamp-2 mt-0.5">
                      {c.last_message?.content || "Click to open conversation..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#FFD6E7]/50 text-[#880E4F]/70 font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#F06292]" />
                    <span>
                      {c.updated_at
                        ? new Date(c.updated_at).toLocaleDateString([], { month: "short", day: "numeric" })
                        : "Recent"}
                    </span>
                  </span>
                  <div className="flex items-center gap-1 text-[#F06292] font-extrabold group-hover:translate-x-0.5 transition-transform">
                    <span>Resume</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}

          {recentConversations.length === 0 && (
            <div className="col-span-full p-6 text-center bg-[#FFF5F8] rounded-2xl border border-[#FFD6E7] space-y-2">
              <p className="text-xs font-bold text-[#4A1525]">
                No previous conversations yet
              </p>
              <p className="text-[11px] text-[#880E4F]/70">
                Ask questions to the AI Tutor to build your persistent WhatsApp-style chat history!
              </p>
              <Link
                href="/ask"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white text-xs font-extrabold shadow-2xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Tutor Now</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ─── Study Modules Grid ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#4A1525] uppercase tracking-wider">
            Study Modules
          </span>
          <span className="text-[11px] font-bold text-[#F06292] bg-white px-2.5 py-0.5 rounded-full border border-[#FFD6E7]">
            {activeDoc ? activeDoc.filename : "Upload a file to begin"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {modules.map((m, idx) => (
            <Link
              key={idx}
              href={m.href}
              className="bg-[#FFD6E7] hover:bg-[#FFC1D9] p-4 rounded-3xl border border-[#FFB8D2] shadow-xs hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform shrink-0">
                  {m.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#4A1525] group-hover:text-[#C2185B]">
                      {m.title}
                    </h4>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${m.badgeBg}`}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#880E4F]/70 font-semibold">
                    {m.desc}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#F06292] group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}

          {/* Module 5: Leaderboard Banner */}
          <Link
            href="/leaderboard"
            className="col-span-1 sm:col-span-2 bg-gradient-to-r from-[#FFD6E7] via-[#FFC1D9] to-[#FFD6E7] hover:from-[#FFC1D9] hover:to-[#FFD6E7] p-4 rounded-3xl border border-[#FFB8D2] shadow-xs flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs">
                🏆
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#4A1525] group-hover:text-[#C2185B]">
                  Live Class Leaderboard & Rankings
                </h4>
                <p className="text-[11px] text-[#880E4F]/80 font-bold">
                  {user ? `You are Rank #${user.rank || 1} • ${user.xp?.toLocaleString() || 0} XP points` : "Track scores, climb the podium & compete with classmates"}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#F06292] bg-white px-3 py-1.5 rounded-full shadow-2xs group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>View Ranks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* ─── Real Progress & Real Recent Activity ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Real Weekly Study Progress Bar Chart (From SQLite) */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-[#4A1525]">
              Weekly Study Progress
            </h4>
            <span className="text-[10px] font-extrabold text-[#F06292] bg-[#FFF0F5] px-2 py-0.5 rounded-full border border-[#FFD6E7]">
              {stats?.weekly_consistency_pct ?? 0}% on track
            </span>
          </div>

          <div className="flex items-end justify-between h-20 pt-2 px-2">
            {(stats?.weekly_tracker || [
              { day: "M", height_pct: 30, is_today: false },
              { day: "T", height_pct: 60, is_today: false },
              { day: "W", height_pct: 45, is_today: false },
              { day: "T", height_pct: 85, is_today: true },
              { day: "F", height_pct: 50, is_today: false },
              { day: "S", height_pct: 70, is_today: false },
              { day: "S", height_pct: 25, is_today: false },
            ]).map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 rounded-t-lg transition-all ${
                    d.is_today
                      ? "bg-[#F06292] shadow-md shadow-[#F06292]/40"
                      : d.count > 0
                      ? "bg-[#FFC1D9]"
                      : "bg-[#FFD6E7]"
                  }`}
                  style={{ height: `${d.height_pct || 25}%` }}
                />
                <span
                  className={`text-[10px] ${
                    d.is_today ? "font-extrabold text-[#F06292]" : "text-[#880E4F]/70 font-semibold"
                  }`}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-center text-[#880E4F]/70 font-medium">
            Tracks real study actions, flashcard recalls, and test completions this week.
          </p>
        </div>

        {/* Real Activity List (From SQLite) */}
        <div className="glass-card p-5 space-y-3">
          <span className="text-xs font-bold text-[#4A1525] uppercase tracking-wider block">
            Recent Activity Log
          </span>
          <div className="space-y-2">
            {stats?.recent_activities?.length > 0 ? (
              stats.recent_activities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white p-3 rounded-2xl border border-[#FFD6E7] flex items-center justify-between shadow-2xs"
                >
                  <div>
                    <p className="font-bold text-xs text-[#4A1525]">{act.description}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(act.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {new Date(act.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {act.xp_gained > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      +{act.xp_gained} XP
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 bg-[#FFF5F8] rounded-2xl border border-[#FFD6E7] text-center space-y-1">
                <p className="text-xs font-bold text-[#4A1525]">No activities yet</p>
                <p className="text-[11px] text-gray-400">
                  Upload a PDF or take a quiz to see your real activity track here!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
