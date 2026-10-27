"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  BookOpen,
  Layers,
  Brain,
  Video,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  School,
  GraduationCap,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUni, setFilterUni] = useState("all");

  useEffect(() => {
    Promise.all([
      api.get("/api/user/me").catch(() => ({ data: null })),
      api.get("/api/curriculum/subjects"),
    ])
      .then(([userRes, subRes]) => {
        setUser(userRes.data);
        const allSubs = subRes.data || [];
        setSubjects(allSubs);
      })
      .catch((err) => console.error("Error loading subjects:", err))
      .finally(() => setLoading(false));
  }, []);

  const userSelectedIds = user?.selected_subjects || [];

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUni = filterUni === "all" || s.university_id === filterUni;
    return matchesSearch && matchesUni;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Loading subjects dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-7">
      {/* ─── Top Header ─── */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Curriculum & Subjects Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
            My Academic Subjects
          </h1>
          <p className="text-xs text-[#880E4F]/80 font-medium">
            5-Unit Modular Syllabi with deep topic breakdowns, notes, verified video lectures, and AI explanations.
          </p>
        </div>

        <Link
          href="/curriculum"
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FFF0F5] text-[#F06292] font-extrabold text-xs border border-[#FFB8D2] shadow-xs flex items-center gap-1.5 transition-all shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Change Syllabus / University</span>
        </Link>
      </div>

      {/* ─── Search & University Filter Bar ─── */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#880E4F]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subject by name or code (e.g. KCS-401)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl pl-10 pr-3.5 py-2 text-xs font-semibold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Subjects" },
            { id: "aktu", label: "AKTU Official" },
            { id: "independent", label: "Self-Paced / AI" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterUni(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterUni === tab.id
                  ? "bg-[#F06292] text-white shadow-xs"
                  : "bg-white text-[#880E4F] hover:bg-[#FFD6E7]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Subjects Grid ─── */}
      {filteredSubjects.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="font-extrabold text-sm text-[#4A1525]">No subjects match your search</h3>
          <p className="text-xs text-[#880E4F]/70">Try clearing filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((sub) => {
            const isEnrolled = userSelectedIds.includes(sub.id);
            const totalTopics = sub.units?.reduce((acc, u) => acc + (u.topics?.length || 0), 0) || 0;

            return (
              <div
                key={sub.id}
                className="bg-white/95 rounded-3xl border border-[#FFD6E7] hover:border-[#F06292] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
              >
                {/* Subject Top Info */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFD6E7] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-2xs">
                      {sub.icon || "💻"}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold bg-[#FFF0F5] text-[#C2185B] px-2 py-0.5 rounded-full border border-[#FFD6E7] block mb-1">
                        {sub.code}
                      </span>
                      <span className="text-[10px] font-bold text-[#880E4F]/70">
                        {sub.credits} Credits • {sub.units?.length || 5} Units
                      </span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-[#4A1525] group-hover:text-[#C2185B] transition-colors line-clamp-1 mb-1">
                    {sub.name}
                  </h3>
                  <p className="text-[11px] text-[#880E4F]/70 font-medium">
                    {totalTopics} Core syllabus topics • AKTU 5-Unit Structure
                  </p>
                </div>

                {/* Units Preview Badges */}
                <div className="space-y-1.5 pt-2 border-t border-[#FFF0F5]">
                  <p className="text-[10px] font-bold text-[#880E4F] uppercase tracking-wider">
                    Units Overview
                  </p>
                  <div className="space-y-1">
                    {sub.units?.slice(0, 3).map((u) => (
                      <div
                        key={u.unit_num}
                        className="flex items-center justify-between text-[11px] bg-[#FFF5F8] px-2.5 py-1 rounded-xl text-[#4A1525]"
                      >
                        <span className="font-bold truncate max-w-[190px]">
                          U{u.unit_num}: {u.title}
                        </span>
                        <span className="text-[9px] font-bold text-[#F06292] bg-white px-1.5 py-0.2 rounded border border-[#FFD6E7]">
                          {u.high_yield_weight}% wt
                        </span>
                      </div>
                    ))}
                    {sub.units?.length > 3 && (
                      <p className="text-[10px] text-center font-bold text-[#880E4F]/70">
                        + {sub.units.length - 3} more units inside
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Action Button Links */}
                <div className="pt-2 border-t border-[#FFD6E7] grid grid-cols-2 gap-2">
                  <Link
                    href={`/subjects/${sub.id}`}
                    className="py-2.5 px-3 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-[11px] flex items-center justify-center gap-1 shadow-xs transition-all col-span-2"
                  >
                    <span>Explore Units & Topics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/videos?subject_id=${sub.id}`}
                    className="py-1.5 px-2 rounded-xl bg-[#FFF0F5] hover:bg-[#FFD6E7] text-[#880E4F] font-bold text-[10px] flex items-center justify-center gap-1 border border-[#FFD6E7] transition-all"
                  >
                    <Video className="w-3 h-3 text-[#F06292]" />
                    <span>Lectures</span>
                  </Link>

                  <Link
                    href={`/pyq?subject_id=${sub.id}`}
                    className="py-1.5 px-2 rounded-xl bg-[#FFF0F5] hover:bg-[#FFD6E7] text-[#880E4F] font-bold text-[10px] flex items-center justify-center gap-1 border border-[#FFD6E7] transition-all"
                  >
                    <FileText className="w-3 h-3 text-[#F06292]" />
                    <span>PYQ Papers</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
