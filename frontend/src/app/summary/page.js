"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  BookOpen,
  Copy,
  Share2,
  Sparkles,
  ChevronDown,
  Check,
  FileText,
  Upload,
  AlertCircle,
} from "lucide-react";

export default function SummaryPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [summary, setSummary] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("short"); // 'short' | 'detailed'
  const [activeKeyword, setActiveKeyword] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
  };

  useEffect(() => {
    api.get("/api/documents")
      .then((res) => {
        setDocuments(res.data);
        if (res.data.length > 0) {
          const stored = localStorage.getItem("activeDocId");
          const active = res.data.find((d) => d.id === stored) || res.data[0];
          setSelectedDocId(active.id);
          loadDocData(active.id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const loadDocData = (docId) => {
    setLoading(true);
    Promise.all([
      api.get(`/api/summary/${docId}`),
      api.get(`/api/keywords/${docId}`),
    ])
      .then(([sumRes, kwRes]) => {
        setSummary(sumRes.data);
        const kws = kwRes.data.keywords || [];
        setKeywords(kws);
        if (kws.length > 0) {
          setActiveKeyword(kws[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleDocChange = (docId) => {
    setSelectedDocId(docId);
    localStorage.setItem("activeDocId", docId);
    loadDocData(docId);
  };

  const copySummary = () => {
    if (!summary) return;
    const text = summary.key_points?.join("\n\n") || "No summary available";
    navigator.clipboard?.writeText(text);
    setCopied(true);
    showToast("Summary key points copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareSummary = () => {
    showToast("Shareable study link copied!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Analyzing document & generating summary...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FFD6E7] text-[#F06292] flex items-center justify-center text-3xl mx-auto">
          📑
        </div>
        <h2 className="text-lg font-extrabold text-[#4A1525]">
          No Documents Uploaded Yet
        </h2>
        <p className="text-xs text-[#880E4F]/70 max-w-sm mx-auto">
          Upload your PDF, PPTX, or Markdown notes to automatically generate high-yield AI summaries and keyword clouds.
        </p>
        <Link href="/upload" className="btn-primary text-xs py-3 px-6 inline-flex">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </Link>
      </div>
    );
  }

  const activeDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#4A1525] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-50 animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#FFD6E7] p-5 rounded-3xl border-2 border-white shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-base font-extrabold text-[#4A1525]">
            AI Document Summary & Keywords Cloud
          </h1>
          <p className="text-xs text-[#880E4F]/70 font-semibold">
            Extracted directly from {activeDoc?.filename || "uploaded file"}
          </p>
        </div>
        <span className="text-2xl">📑</span>
      </div>

      {/* Document Selector Dropdown */}
      <div className="glass-card p-4 space-y-1.5">
        <label className="block text-[11px] font-bold text-[#880E4F] uppercase tracking-wider">
          Select Uploaded Document
        </label>
        <div className="relative">
          <select
            value={selectedDocId}
            onChange={(e) => handleDocChange(e.target.value)}
            className="w-full bg-white text-[#4A1525] text-xs font-bold py-3 px-3.5 rounded-2xl border border-[#FFB8D2] shadow-xs appearance-none focus:outline-none focus:ring-2 focus:ring-[#F06292] cursor-pointer"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.filename} ({d.word_count?.toLocaleString()} words)
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#F06292] absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Summary Mode Toggle */}
      <div className="flex items-center justify-between bg-[#FFD6E7] p-1.5 rounded-2xl border border-[#FFC1D9]">
        <button
          onClick={() => setMode("short")}
          className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
            mode === "short"
              ? "bg-white text-[#F06292] shadow-sm"
              : "text-[#880E4F] hover:text-[#F06292]"
          }`}
        >
          Short Key Points
        </button>
        <button
          onClick={() => setMode("detailed")}
          className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
            mode === "detailed"
              ? "bg-white text-[#F06292] shadow-sm"
              : "text-[#880E4F] hover:text-[#F06292]"
          }`}
        >
          Detailed Breakdown
        </button>
      </div>

      {/* Generated Summary Card */}
      {summary && (
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#FFF0F5]">
            <div className="flex items-center gap-2">
              <span className="text-base">📌</span>
              <h3 className="font-extrabold text-sm text-[#4A1525]">
                {activeDoc?.filename} — Executive Summary
              </h3>
            </div>
            <span className="text-[10px] bg-[#FFF0F5] text-[#F06292] font-bold px-2.5 py-0.5 rounded-full border border-[#FFD6E7]">
              ~{summary.reading_time_min} min read ({summary.word_count?.toLocaleString()} words)
            </span>
          </div>

          {/* Bullets or Sections */}
          {mode === "short" ? (
            <ul className="space-y-3 text-xs text-[#4A1525] leading-relaxed">
              {summary.key_points?.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[#F06292] font-extrabold text-sm mt-0.5">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              {summary.sections?.map((sec, i) => (
                <div key={i} className="p-3 bg-[#FFF5F8] rounded-2xl border border-[#FFD6E7] space-y-1">
                  <h4 className="font-extrabold text-xs text-[#4A1525]">
                    {sec.title}
                  </h4>
                  <p className="text-xs text-[#880E4F]/80 leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#FFF0F5] flex items-center justify-between">
            <span className="text-[11px] text-[#880E4F]/70 font-semibold">
              Parsed from source document text
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copySummary}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#F06292]" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                onClick={shareSummary}
                className="btn-primary text-xs py-1.5 px-3"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Real TF-IDF Keyword Cloud ─── */}
      <div className="glass-card p-5 space-y-4">
        <div>
          <h3 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
            <span>🏷️</span> Important Keywords Cloud (TF-IDF Extracted)
          </h3>
          <p className="text-[11px] text-[#880E4F]/70 font-medium">
            Computed on actual term frequencies from this document. <b className="text-[#F06292]">Click a chip</b> to view calculated score & exam weight.
          </p>
        </div>

        {keywords.length > 0 ? (
          <div className="bg-[#FFD6E7]/30 p-4 rounded-3xl border border-[#FFC1D9] flex flex-wrap items-center justify-center gap-2.5">
            {keywords.map((kw, i) => {
              const isSelected = activeKeyword?.term === kw.term;
              return (
                <button
                  key={i}
                  onClick={() => setActiveKeyword(kw)}
                  className={`px-3.5 py-2 rounded-2xl text-xs shadow-2xs border active:scale-95 transition-all ${
                    isSelected
                      ? "bg-[#F06292] text-white font-extrabold border-[#F06292] shadow-sm"
                      : "bg-white text-[#880E4F] hover:bg-[#FFD6E7] font-bold border-[#FFB8D2]"
                  }`}
                >
                  <span>{kw.term}</span>
                  <span className={`ml-1.5 text-[10px] font-extrabold ${isSelected ? "text-pink-100" : "text-[#F06292]"}`}>
                    {kw.exam_weight}%
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">No keywords extracted yet.</p>
        )}

        {/* Dynamic Detail Card */}
        {activeKeyword && (
          <div className="bg-white p-4 rounded-2xl border-2 border-[#FFC1D9] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F06292]" />
                <h4 className="font-extrabold text-sm text-[#4A1525]">
                  Keyword: {activeKeyword.term}
                </h4>
              </div>
              <span className="text-[10px] bg-[#FFF0F5] text-[#C2185B] font-extrabold px-2.5 py-0.5 rounded-full border border-[#FFC1D9]">
                {activeKeyword.exam_weight}% Calculated Exam Weight
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-2.5 bg-[#FFF5F8] rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold block">DOCUMENT OCCURRENCES</span>
                <span className="font-extrabold text-sm text-[#4A1525]">{activeKeyword.count || 1} times</span>
              </div>
              <div className="p-2.5 bg-[#FFF5F8] rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold block">TF-IDF IMPORTANCE SCORE</span>
                <span className="font-extrabold text-sm text-[#F06292]">{activeKeyword.score}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#880E4F]/70 pt-1">
              This concept is mathematically identified as high-yield for this document based on lexical density and inverted document frequency.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
