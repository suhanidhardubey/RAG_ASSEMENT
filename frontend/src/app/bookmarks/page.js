"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Bookmark,
  Trash2,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const loadBookmarks = () => {
    if (localStorage.getItem("token")) {
      api.get("/api/bookmarks")
        .then((res) => setBookmarks(res.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleDelete = async (b) => {
    try {
      if (localStorage.getItem("token")) {
        await api.delete(`/api/bookmarks/${b.item_type}/${b.item_id}`);
      }
      setBookmarks((prev) => prev.filter((item) => item.id !== b.id));
      showToast("Bookmark removed.");
    } catch (e) {
      setBookmarks((prev) => prev.filter((item) => item.id !== b.id));
    }
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    if (filterType === "all") return true;
    return b.item_type === filterType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Loading bookmarked resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#880E4F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#FFB8D2] animate-fade-in">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider">
          <Bookmark className="w-4 h-4" />
          <span>Saved Revision Resources</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
          My Bookmarked Topics & Answers
        </h1>
        <p className="text-xs text-[#880E4F]/80 font-medium">
          Quickly access saved formulas, exam topics, and high-yield AI explanations across all your syllabus subjects.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "topic", "qa"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
              filterType === tab
                ? "bg-[#F06292] text-white shadow-xs"
                : "bg-white text-[#880E4F] hover:bg-[#FFD6E7]"
            }`}
          >
            {tab === "all" ? "All Bookmarks" : tab === "topic" ? "Topics" : "Q&A Explanations"}
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <div className="text-4xl">🔖</div>
          <h3 className="font-extrabold text-sm text-[#4A1525]">No saved resources yet</h3>
          <p className="text-xs text-[#880E4F]/70 max-w-sm mx-auto">
            Click the bookmark icon on any topic in the Subjects Explorer or AI Assistant to pin it here for instant review.
          </p>
          <div className="pt-2">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F06292] text-white font-bold text-xs"
            >
              <span>Explore Subjects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map((b) => (
            <div
              key={b.id}
              className="glass-card p-4 flex items-start justify-between gap-3 hover:border-[#F06292] transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#C2185B] px-2 py-0.5 rounded-full capitalize">
                    {b.item_type}
                  </span>
                  {b.metadata?.code && (
                    <span className="text-[10px] font-mono font-bold text-[#880E4F]">
                      {b.metadata.code}
                    </span>
                  )}
                  <span className="text-[10px] text-[#880E4F]/70 font-semibold">
                    Saved on {b.created_at?.split("T")[0]}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs sm:text-sm text-[#4A1525]">
                  {b.title}
                </h4>

                {b.subtitle && (
                  <p className="text-xs text-[#880E4F]/70 font-medium line-clamp-2">
                    {b.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {b.metadata?.subject_id && (
                  <Link
                    href={`/subjects/${b.metadata.subject_id}`}
                    className="p-1.5 rounded-xl bg-[#FFF0F5] hover:bg-[#FFD6E7] text-[#F06292] text-xs font-bold flex items-center gap-1"
                    title="Open Subject"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}

                <button
                  onClick={() => handleDelete(b)}
                  className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-500 cursor-pointer"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
