"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Upload,
  ArrowRight,
} from "lucide-react";

export default function FlashcardsPage() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ known: 0, unknown: 0 });
  const [activeDocName, setActiveDocName] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
  };

  useEffect(() => {
    const docId = localStorage.getItem("activeDocId") || "";
    api.get(`/api/flashcards/${docId}`)
      .then((res) => {
        const loadedCards = res.data.flashcards || [];
        setCards(loadedCards);
      })
      .catch(() => {
        setCards([]);
      })
      .finally(() => setLoading(false));

    api.get("/api/documents")
      .then((res) => {
        const doc = res.data.find((d) => d.id === docId) || res.data[0];
        if (doc) setActiveDocName(doc.filename);
      })
      .catch(() => {});
  }, []);

  const total = cards.length;
  const current = cards[currentIndex];
  const progressPct = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  const flip = () => setIsFlipped(!isFlipped);

  const next = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i + 1) % total);
  };

  const prev = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i - 1 + total) % total);
  };

  const shuffle = () => {
    setIsFlipped(false);
    setCards([...cards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    showToast("Deck shuffled 🔀");
  };

  const handleResponse = async (gotIt) => {
    if (!current) return;

    if (gotIt) {
      setStats((s) => ({ ...s, known: s.known + 1 }));
      showToast("Mastered! +10 XP awarded ✅");
    } else {
      setStats((s) => ({ ...s, unknown: s.unknown + 1 }));
      showToast("Saved to review queue ❌");
    }

    // Persist real progress to backend
    try {
      const docId = localStorage.getItem("activeDocId") || "default";
      await api.post("/api/flashcards/review", {
        doc_id: docId,
        card_id: current.id,
        status: gotIt ? "known" : "unknown",
      });
    } catch {}

    setTimeout(next, 350);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Generating document flashcards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FFD6E7] text-[#F06292] flex items-center justify-center text-3xl mx-auto">
          🎴
        </div>
        <h2 className="text-lg font-extrabold text-[#4A1525]">
          No Study Flashcards Found
        </h2>
        <p className="text-xs text-[#880E4F]/70">
          Upload a document first to automatically extract and generate Q&A flashcards.
        </p>
        <Link href="/upload" className="btn-primary text-xs py-3 px-6 inline-flex">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#4A1525] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-50 animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#FFD6E7] p-4 rounded-3xl border-2 border-white shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-sm font-extrabold text-[#4A1525]">Study Flashcards</h1>
          <p className="text-[11px] text-[#880E4F]/70 font-semibold truncate max-w-sm">
            {activeDocName || "Document Flashcards"}
          </p>
        </div>
        <button
          onClick={shuffle}
          className="w-9 h-9 rounded-2xl bg-white text-[#F06292] hover:bg-[#FFF0F5] flex items-center justify-center shadow-xs transition-all active:scale-95"
          title="Shuffle deck"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

      {/* Counter & Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-extrabold text-[#4A1525]">
          <span>Card {currentIndex + 1} / {total}</span>
          <span className="text-[11px] font-bold text-[#F06292]">
            {progressPct}% Completed
          </span>
        </div>
        <div className="w-full h-2 bg-[#FFD6E7] rounded-full overflow-hidden border border-[#FFC1D9]">
          <div
            className="h-full bg-[#F06292] transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ─── 3D Flip Card ─── */}
      <div className="perspective-1000 py-2">
        <div
          onClick={flip}
          className={`transform-style-3d relative w-full h-[280px] sm:h-[300px] cursor-pointer transition-transform duration-500 rounded-3xl ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front Face: Question */}
          <div className="backface-hidden absolute inset-0 bg-white rounded-3xl border-2 border-[#FFC1D9] p-6 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#F06292] font-bold">
              <span className="bg-[#FFF0F5] px-3 py-1 rounded-full border border-[#FFD6E7]">
                QUESTION
              </span>
              <span className="flex items-center gap-1">Tap to Flip 🔄</span>
            </div>

            <div className="text-center px-4 space-y-3 my-auto">
              <h3 className="text-sm sm:text-base font-extrabold text-[#4A1525] leading-relaxed">
                {current.question}
              </h3>
              <p className="text-[11px] text-[#880E4F]/70 font-semibold">
                Difficulty: {current.difficulty || "Core"}
              </p>
            </div>

            <div className="text-center text-[10px] text-gray-400 font-semibold">
              Source: {activeDocName || "Document"}
            </div>
          </div>

          {/* Back Face: Answer */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 bg-gradient-to-br from-[#FFF5F8] to-[#FFD6E7] rounded-3xl border-2 border-[#F06292] p-6 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#880E4F] font-bold">
              <span className="bg-white px-3 py-1 rounded-full border border-[#FFC1D9] text-[#F06292]">
                ANSWER & EXPLANATION
              </span>
              <span className="flex items-center gap-1">Tap to Flip Back 🔄</span>
            </div>

            <div className="text-center px-3 space-y-2 my-auto">
              <p className="text-base sm:text-lg font-extrabold text-[#C2185B]">
                {current.answer}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#4A1525] leading-relaxed">
                {current.explanation}
              </p>
            </div>

            <div className="text-center text-[11px] text-[#C2185B] font-extrabold">
              Document Grounded
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Actions (Didn't Know / Got it!) ─── */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleResponse(false)}
            className="py-3.5 px-4 rounded-2xl bg-white border-2 border-[#FFC1D9] text-[#880E4F] font-extrabold text-xs hover:bg-[#FFF0F5] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <XCircle className="w-4 h-4 text-red-500" />
            <span>Didn't know</span>
          </button>

          <button
            onClick={() => handleResponse(true)}
            className="py-3.5 px-4 rounded-2xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#F06292]/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Got it! (+10 XP)</span>
          </button>
        </div>

        {/* Previous / Next Controls */}
        <div className="flex items-center justify-between px-2 pt-1 text-xs font-bold text-[#880E4F]">
          <button
            onClick={prev}
            className="hover:text-[#F06292] flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-[11px] text-gray-400 font-medium">
            Mastered: {stats.known} • Review: {stats.unknown}
          </span>
          <button
            onClick={next}
            className="hover:text-[#F06292] flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
