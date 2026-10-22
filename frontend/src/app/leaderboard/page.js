"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Trophy,
  Flame,
  Star,
  Medal,
  Crown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  User,
  UserPlus,
} from "lucide-react";

export default function LeaderboardPage() {
  const [tab, setTab] = useState("alltime"); // 'weekly' | 'alltime'
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  useEffect(() => {
    Promise.all([
      api.get("/api/leaderboard"),
      api.get("/api/user/me").catch(() => ({ data: null })),
    ])
      .then(([lbRes, profRes]) => {
        setLeaderboard(lbRes.data || []);
        setActiveProfile(profRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const switchTab = (t) => {
    setTab(t);
    showToast(t === "weekly" ? "Showing Current Week Ranking" : "Showing Overall Semester Rankings");
  };

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#4A1525] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-50 animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* ─── Header ─── */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-5 rounded-3xl border-2 border-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-full bg-white text-[#F06292] flex items-center justify-center shadow-xs font-bold"
          >
            ←
          </Link>
          <div className="text-center">
            <h1 className="font-extrabold text-sm sm:text-base text-[#4A1525]">
              Live Student Leaderboard & Rankings
            </h1>
            <p className="text-[10px] text-[#880E4F]/70 font-semibold">
              Real-time scores earned from quizzes, flashcards & study consistency
            </p>
          </div>
          <Link href="/profile" className="text-base" title="My Profile">
            👤
          </Link>
        </div>

        {/* Weekly / All-Time Toggle */}
        <div className="flex items-center bg-white/70 backdrop-blur-sm p-1 rounded-2xl border border-white">
          <button
            onClick={() => switchTab("alltime")}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              tab === "alltime"
                ? "bg-[#F06292] text-white shadow-xs"
                : "text-[#880E4F] hover:text-[#F06292]"
            }`}
          >
            All-Time Leaderboard
          </button>
          <button
            onClick={() => switchTab("weekly")}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              tab === "weekly"
                ? "bg-[#F06292] text-white shadow-xs"
                : "text-[#880E4F] hover:text-[#F06292]"
            }`}
          >
            Weekly Sprint
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center space-y-2">
            <div className="text-3xl animate-bounce">🌸</div>
            <p className="text-xs font-bold text-[#880E4F]">Loading leaderboard data...</p>
          </div>
        </div>
      ) : leaderboard.length === 0 ? (
        /* ─── Empty State (No users registered yet) ─── */
        <div className="glass-card p-8 rounded-3xl text-center space-y-4 border-2 border-dashed border-[#FFB8D2]">
          <div className="w-16 h-16 rounded-3xl bg-[#FFD6E7] flex items-center justify-center text-3xl mx-auto">
            🏆
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-[#4A1525]">
              No Students Ranked Yet
            </h3>
            <p className="text-xs text-[#880E4F]/70 max-w-sm mx-auto font-medium">
              Be the first to register an account, take a quiz on your uploaded documents, and claim the #1 spot on the podium!
            </p>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 btn-primary text-xs py-2.5 px-5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Student Profile</span>
          </Link>
        </div>
      ) : (
        <>
          {/* ─── Dynamic Top 3 Podium ─── */}
          <div className="pt-4 pb-2 flex items-end justify-center gap-3">
            {/* Rank 2: Silver */}
            {top2 ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-slate-300 bg-white p-0.5 shadow-sm overflow-hidden">
                    <img
                      src={top2.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${top2.username}&backgroundColor=ffd6e7`}
                      alt={top2.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-200 border border-white text-[10px] font-bold text-slate-700 flex items-center justify-center shadow-xs">
                    🥈
                  </span>
                </div>
                <p className="font-extrabold text-xs text-[#4A1525] mt-1.5 truncate max-w-[85px]">
                  {top2.name} {activeProfile?.id === top2.id && "(You)"}
                </p>
                <p className="text-[10px] font-extrabold text-[#F06292]">{top2.xp?.toLocaleString()} pts</p>
                <div className="w-20 h-20 bg-gradient-to-t from-[#FFC1D9] to-[#FFD6E7] rounded-t-2xl mt-1 flex items-center justify-center font-extrabold text-white text-lg shadow-xs">
                  2
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-sm font-bold text-slate-400">
                  2nd
                </div>
                <div className="w-20 h-16 bg-[#FFD6E7]/40 rounded-t-2xl mt-1 flex items-center justify-center font-bold text-white text-base">
                  2
                </div>
              </div>
            )}

            {/* Rank 1: Gold */}
            {top1 && (
              <div className="flex flex-col items-center -translate-y-2">
                <div className="relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-base">
                    👑
                  </span>
                  <div className="w-16 h-16 rounded-full border-2 border-amber-400 bg-white p-0.5 shadow-md overflow-hidden">
                    <img
                      src={top1.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${top1.username}&backgroundColor=ffd6e7`}
                      alt={top1.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border border-white text-xs font-bold text-white flex items-center justify-center shadow-xs">
                    🥇
                  </span>
                </div>
                <p className="font-extrabold text-xs text-[#4A1525] mt-1.5 truncate max-w-[95px]">
                  {top1.name} {activeProfile?.id === top1.id && "(You)"}
                </p>
                <p className="text-[10px] font-extrabold text-[#C2185B]">{top1.xp?.toLocaleString()} pts</p>
                <div className="w-24 h-28 bg-gradient-to-t from-[#F06292] to-[#FF8DA1] rounded-t-3xl mt-1 flex items-center justify-center font-extrabold text-white text-2xl shadow-sm">
                  1
                </div>
              </div>
            )}

            {/* Rank 3: Bronze */}
            {top3 ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-amber-600 bg-white p-0.5 shadow-sm overflow-hidden">
                    <img
                      src={top3.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${top3.username}&backgroundColor=ffd6e7`}
                      alt={top3.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-600 border border-white text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                    🥉
                  </span>
                </div>
                <p className="font-extrabold text-xs text-[#4A1525] mt-1.5 truncate max-w-[85px]">
                  {top3.name} {activeProfile?.id === top3.id && "(You)"}
                </p>
                <p className="text-[10px] font-extrabold text-[#880E4F]">{top3.xp?.toLocaleString()} pts</p>
                <div className="w-20 h-16 bg-gradient-to-t from-[#FFC1D9]/80 to-[#FFD6E7] rounded-t-2xl mt-1 flex items-center justify-center font-extrabold text-white text-base shadow-xs">
                  3
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-600/40 flex items-center justify-center text-sm font-bold text-amber-700">
                  3rd
                </div>
                <div className="w-20 h-12 bg-[#FFD6E7]/30 rounded-t-2xl mt-1 flex items-center justify-center font-bold text-white text-sm">
                  3
                </div>
              </div>
            )}
          </div>

          {/* ─── List Cards ─── */}
          <div className="space-y-2.5">
            {leaderboard.map((user) => {
              const isCurrentUser = activeProfile && activeProfile.id === user.id;

              if (isCurrentUser) {
                return (
                  <div
                    key={user.id}
                    className="bg-[#F06292] p-3.5 rounded-2xl border-2 border-white text-white shadow-md shadow-[#F06292]/30 flex items-center justify-between scale-[1.01] transform transition-transform"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 font-extrabold text-sm text-white text-center shrink-0">
                        #{user.rank}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-white overflow-hidden shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-white truncate">
                            {user.name}
                          </h4>
                          <span className="bg-white text-[#F06292] text-[9px] font-extrabold px-1.5 rounded shrink-0">
                            YOU
                          </span>
                        </div>
                        <p className="text-[10px] text-pink-100 font-semibold truncate">
                          Streak: {user.streak || 1}d • {user.group_name || "Group 1"} • {user.quizzes || 0} quizzes
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-white shrink-0 ml-2">
                      {user.xp?.toLocaleString()} XP
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={user.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#FFD6E7] shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 font-extrabold text-xs text-center shrink-0 ${
                        user.rank === 1
                          ? "text-amber-500 font-black"
                          : user.rank === 2
                          ? "text-slate-500 font-bold"
                          : user.rank === 3
                          ? "text-amber-700 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      #{user.rank}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#FFF0F5] border border-[#FFD6E7] overflow-hidden shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-[#4A1525] truncate">
                        {user.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium truncate">
                        Streak: {user.streak || 1}d • {user.group_name || "Group 1"} • {user.quizzes || 0} quizzes
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-xs text-[#F06292] shrink-0 ml-2">
                    {user.xp?.toLocaleString()} XP
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Link to Student Profile */}
      <div className="pt-2 text-center">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#F06292] hover:underline"
        >
          <span>View Detailed Student Analytics & Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
