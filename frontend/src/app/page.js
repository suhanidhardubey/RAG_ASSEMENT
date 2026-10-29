"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Sparkles,
  Upload,
  Brain,
  BookOpen,
  Layers,
  Trophy,
  ArrowRight,
  Zap,
  LayoutDashboard,
  User,
  CheckCircle2,
  Lock,
  GraduationCap,
  Video,
  Gamepad2,
  Calendar,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "University & Track Selector",
    desc: "Support for AKTU B.Tech, other autonomous universities, and self-paced tracks with modular syllabi.",
    color: "bg-[#FFF0F5] text-[#C2185B]",
    badge: "AKTU / Other",
    href: "/curriculum",
  },
  {
    icon: BookOpen,
    title: "5-Unit Subjects Dashboard",
    desc: "Dedicated card for every subject with unit breakdown, topic checklists, and exam weightage.",
    color: "bg-[#FFD6E7] text-[#F06292]",
    badge: "5 Units",
    href: "/subjects",
  },
  {
    icon: Video,
    title: "Curated YouTube Lectures",
    desc: "Verified lectures from Gateway Classes, Fearless, Knowledge Gate, Gate Smashers, and Abdul Bari.",
    color: "bg-[#FFF0F5] text-[#880E4F]",
    badge: "Verified Videos",
    href: "/videos",
  },
  {
    icon: Gamepad2,
    title: "Interactive Gaming Zone",
    desc: "Educational games: Quiz Battle vs AI, Memory Match, Find the Bug, and Daily Streak Challenges.",
    color: "bg-[#FFD6E7] text-[#C2185B]",
    badge: "Earn XP",
    href: "/games",
  },
  {
    icon: Sparkles,
    title: "Ask AI Tutor (RAG)",
    desc: "Pure-Python BM25/TF-IDF chunk retrieval over uploaded notes with cited source explanations.",
    color: "bg-[#FFF0F5] text-[#F06292]",
    badge: "AI RAG",
    href: "/ask",
  },
  {
    icon: MessageSquare,
    title: "Chat History",
    desc: "Persistent conversations with global keyword search across past user questions and AI explanations.",
    color: "bg-[#FFD6E7] text-[#C2185B]",
    badge: "Saved Chats",
    href: "/history",
  },
  {
    icon: Calendar,
    title: "Study Planner & Reminders",
    desc: "Target milestone scheduling and scientific spaced repetition revision intervals (1, 3, 7 days).",
    color: "bg-[#FFD6E7] text-[#880E4F]",
    badge: "Productivity",
    href: "/planner",
  },
  {
    icon: Layers,
    title: "3D Study Flashcards",
    desc: "CSS 3D perspective flip cards generated from source sentences. Earn +10 XP for every mastered card.",
    color: "bg-[#FFF0F5] text-[#F06292]",
    badge: "+10 XP / Card",
    href: "/flashcards",
  },
  {
    icon: Brain,
    title: "Adaptive Quiz & Analytics",
    desc: "Timed MCQs with live countdown timer, instant grading, circular score meter, and history.",
    color: "bg-[#FFD6E7] text-[#C2185B]",
    badge: "+15 XP / Correct",
    href: "/quiz",
  },
];

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    api.get("/api/user/me")
      .then((res) => setCurrentUser(res.data))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <div className="min-h-screen pb-16 space-y-12">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFD6E7] via-[#FFC1D9] to-[#FFD6E7] pt-16 pb-20 px-6 border-b-2 border-white text-center">
        {/* Soft Blurred Background Circles */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-16 w-80 h-80 rounded-full bg-white/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-white/30 blur-2xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto flex flex-col items-center">
          {/* White Logo Badge (Book + Sparkle) */}
          <div className="animate-float w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-6 relative border-2 border-white">
            <div className="relative flex items-center justify-center">
              <BookOpen className="w-14 h-14 text-[#F06292]" />
              <div className="absolute -bottom-2 -right-3 w-8 h-8 rounded-full bg-[#FFD6E7] border-2 border-white flex items-center justify-center shadow-md text-xs">
                🎓
              </div>
              <div className="absolute -top-3 -left-3 text-lg animate-spin" style={{ animationDuration: "6s" }}>
                ✨
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#4A1525] tracking-tight mb-2">
            RAGora
          </h1>
          <p className="text-base sm:text-lg font-bold text-[#880E4F] max-w-md leading-relaxed mb-3">
            Next-Gen AI Study Agora & Intelligent Companion
          </p>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-white text-xs font-bold text-[#C2185B] shadow-sm mb-8">
            <span>✨</span> Gemini AI • Document RAG • 3D Flashcards • Timed Quizzes • Leaderboard
          </div>

          {/* Bottom Action */}
          <div className="w-full max-w-xs space-y-3">
            <Link
              href="/upload"
              className="w-full py-4 px-6 rounded-2xl bg-white text-[#F06292] hover:text-[#E91E63] font-extrabold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore RAGora</span>
              <ArrowRight className="w-5 h-5 text-[#F06292] group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-center text-[11px] text-[#880E4F]/70 font-bold">
              Powered by Google Gemini & Local TF-IDF • SQLite Persistence
            </p>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="max-w-5xl mx-auto px-6 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
            Complete RAGora Study Architecture
          </h2>
          <p className="text-xs text-[#880E4F]/70 font-semibold">
            Grounded AI intelligence, syllabus explorer, 3D memory tools, and real-time student gamification
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Link
                key={i}
                href={feat.href}
                className="glass-card p-4 space-y-3 flex flex-col justify-between group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-2xl ${feat.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] bg-[#FFF0F5] text-[#C2185B] font-extrabold px-2 py-0.5 rounded-full border border-[#FFD6E7]">
                    {feat.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-[#4A1525] group-hover:text-[#F06292] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-[11px] text-[#880E4F]/70 leading-relaxed font-medium mt-1">
                    {feat.desc}
                  </p>
                </div>
                <div className="text-[10px] font-bold text-[#F06292] flex items-center gap-1">
                  <span>Open Module</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Dynamic Live Student Identity Banner ─── */}
      <section className="max-w-3xl mx-auto px-6">
        {currentUser ? (
          <div className="bg-white p-5 rounded-3xl border-2 border-[#FFC1D9] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#F06292] bg-[#FFF5F8] p-0.5 overflow-hidden">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs text-[#4A1525]">
                    Logged In: {currentUser.name}
                  </h4>
                  <span className="text-[9px] bg-[#F06292] text-white font-bold px-1.5 rounded">
                    RANK #{currentUser.rank || 1}
                  </span>
                </div>
                <p className="text-[10px] text-[#880E4F]/70 font-semibold">
                  {currentUser.xp?.toLocaleString()} XP • {currentUser.streak || 1}-day streak • {currentUser.college}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="btn-secondary text-xs py-2 px-3.5"
              >
                <span>View Profile</span>
              </Link>
              <Link
                href="/dashboard"
                className="btn-primary text-xs py-2 px-3.5"
              >
                <span>Go to Dashboard</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-3xl border-2 border-[#FFC1D9] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#F06292] flex items-center justify-center text-2xl shrink-0">
                👤
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#4A1525]">
                  Start Your Study Journey
                </h4>
                <p className="text-[10px] text-[#880E4F]/70 font-semibold">
                  Register your student profile to track XP, flashcard mastery, and quiz scores on the leaderboard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
              >
                <span>Sign In / Register</span>
              </Link>
              <Link
                href="/upload"
                className="btn-secondary text-xs py-2 px-3.5 whitespace-nowrap"
              >
                <span>Upload Material</span>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
