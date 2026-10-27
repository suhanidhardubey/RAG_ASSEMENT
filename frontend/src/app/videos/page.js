"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Video,
  Search,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Filter,
  Layers,
  GraduationCap,
} from "lucide-react";

export default function VideoLecturesPage() {
  const [videos, setVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");

  useEffect(() => {
    Promise.all([
      api.get("/api/videos"),
      api.get("/api/curriculum/subjects"),
    ])
      .then(([vidRes, subRes]) => {
        setVideos(vidRes.data || []);
        setSubjects(subRes.data || []);
      })
      .catch((err) => console.error("Error loading videos:", err))
      .finally(() => setLoading(false));
  }, []);

  const channels = ["all", "Gateway Classes", "Fearless", "Knowledge Gate", "Gate Smashers", "Abdul Bari"];

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.channel.toLowerCase().includes(search.toLowerCase()) ||
      v.topics_covered?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesSubject = selectedSubject === "all" || v.subject_id === selectedSubject;
    const matchesChannel = selectedChannel === "all" || v.channel.toLowerCase() === selectedChannel.toLowerCase();

    return matchesSearch && matchesSubject && matchesChannel;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Loading verified video lectures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-7">
      {/* ─── Header ─── */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider">
          <Video className="w-4 h-4" />
          <span>Verified University Lecture Library</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
          Curated YouTube Video Lectures
        </h1>
        <p className="text-xs text-[#880E4F]/80 max-w-2xl font-medium">
          Direct, verified topic-wise lectures from renowned educational channels for AKTU & Technical Engineering: <strong>Gateway Classes</strong>, <strong>Fearless</strong>, <strong>Knowledge Gate</strong>, <strong>Gate Smashers</strong>, and <strong>Abdul Bari</strong>.
        </p>
      </div>

      {/* ─── Filters & Search Controls ─── */}
      <div className="glass-card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-[#880E4F]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topic (e.g. Peterson Solution, Banker's, DFA, AVL Trees)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
            />
          </div>

          {/* Subject dropdown */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
            >
              <option value="all">All Academic Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Channel Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-[#880E4F] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Channel:</span>
          </span>
          {channels.map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedChannel === ch
                  ? "bg-[#F06292] text-white shadow-xs"
                  : "bg-white text-[#880E4F] hover:bg-[#FFD6E7]"
              }`}
            >
              {ch === "all" ? "All Channels" : ch}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Video Cards Grid ─── */}
      {filteredVideos.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <div className="text-4xl">🎬</div>
          <h3 className="font-extrabold text-sm text-[#4A1525]">No lectures found for this criteria</h3>
          <p className="text-xs text-[#880E4F]/70">Try clearing filters or search by another subject.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((vid) => {
            const sub = subjects.find((s) => s.id === vid.subject_id);

            return (
              <div
                key={vid.id}
                className="bg-white rounded-3xl border border-[#FFD6E7] hover:border-[#F06292] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#C2185B] px-2 py-0.5 rounded-full">
                      Unit {vid.unit_num} • {vid.badge}
                    </span>
                    <span className="text-[10px] font-bold text-[#880E4F]/70">
                      {vid.duration}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-sm text-[#4A1525] group-hover:text-[#C2185B] transition-colors line-clamp-2 mb-2">
                    {vid.title}
                  </h3>

                  {/* Channel info */}
                  <div className="flex items-center gap-2 text-xs font-bold text-[#880E4F] mb-3">
                    <span className="text-base">{vid.channel_icon || "🎓"}</span>
                    <span>{vid.channel}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded-md border border-emerald-200">
                      ✓ Verified
                    </span>
                  </div>

                  {/* Subject reference */}
                  {sub && (
                    <p className="text-[11px] text-[#880E4F]/70 font-semibold mb-2">
                      Subject: {sub.name} ({sub.code})
                    </p>
                  )}

                  {/* Topics Tags */}
                  <div className="flex flex-wrap gap-1">
                    {vid.topics_covered?.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-semibold bg-[#FFF5F8] text-[#880E4F] px-1.5 py-0.5 rounded border border-[#FFD6E7]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-3 border-t border-[#FFF0F5] space-y-2">
                  <a
                    href={vid.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href={`/ask?topic=${encodeURIComponent(vid.title)}`}
                    className="w-full py-1.5 rounded-xl bg-[#FFF5F8] hover:bg-[#FFD6E7] text-[#880E4F] font-bold text-[11px] flex items-center justify-center gap-1 border border-[#FFD6E7] transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-[#F06292]" />
                    <span>Ask AI About This Topic</span>
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
