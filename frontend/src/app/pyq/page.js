"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  FileText,
  Search,
  BookOpen,
  Filter,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Download,
} from "lucide-react";

export default function PYQPapersPage() {
  const [pyqs, setPyqs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    Promise.all([
      api.get("/api/pyqs"),
      api.get("/api/curriculum/subjects"),
    ])
      .then(([pyqRes, subRes]) => {
        setPyqs(pyqRes.data || []);
        setSubjects(subRes.data || []);
      })
      .catch((err) => console.error("Error loading PYQs:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPyqs = pyqs.filter((p) => {
    return selectedSubject === "all" || p.subject_id === selectedSubject;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Loading previous year question papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-7">
      {/* ─── Header ─── */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Official University Question Archives</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
          Previous Year Exam Question Papers (PYQ)
        </h1>
        <p className="text-xs text-[#880E4F]/80 font-medium max-w-2xl">
          AKTU modular examination questions structured by Section A (2 Marks - Core Concept), Section B (7 Marks - Numericals & Derivations), and Section C (7 Marks - Comprehensive Applications).
        </p>
      </div>

      {/* ─── Subject Filter Bar ─── */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#880E4F]" />
          <span className="text-xs font-bold text-[#4A1525]">Filter by Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-3 py-1.5 text-xs font-bold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
          >
            <option value="all">All Available Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}: {s.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-bold text-[#880E4F]">
          Showing {filteredPyqs.length} Exam Papers
        </span>
      </div>

      {/* ─── Papers List ─── */}
      <div className="space-y-6">
        {filteredPyqs.map((paper) => {
          const sub = subjects.find((s) => s.id === paper.subject_id);

          return (
            <div key={paper.id} className="glass-card p-6 space-y-5">
              {/* Paper Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#FFD6E7] gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#C2185B] px-2 py-0.5 rounded-full">
                      AKTU {paper.year}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[#FFF0F5] text-[#880E4F] px-1.5 py-0.5 rounded border border-[#FFD6E7]">
                      {paper.code}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#4A1525]">
                    {sub?.name || "Subject"} — {paper.session}
                  </h3>
                </div>

                <div className="text-right text-[11px] font-bold text-[#880E4F]">
                  <p>Max Marks: {paper.max_marks}</p>
                  <p className="text-[10px] text-[#880E4F]/70">Duration: {paper.duration}</p>
                </div>
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-4">
                {paper.sections?.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-2">
                    <div className="bg-[#FFF0F5] px-3.5 py-2 rounded-2xl flex items-center justify-between text-xs font-extrabold text-[#4A1525] border border-[#FFD6E7]">
                      <span>Section {sec.section}</span>
                      <span className="text-[10px] text-[#880E4F] font-semibold">{sec.instructions}</span>
                    </div>

                    <div className="space-y-2 pl-1 sm:pl-3">
                      {sec.questions?.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-3.5 rounded-2xl bg-white border border-[#FFD6E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-extrabold text-[#F06292]">{q.q_num}</span>
                              <span className="text-[9px] font-bold bg-[#FFD6E7] text-[#880E4F] px-1.5 py-0.2 rounded">
                                Unit {q.unit}
                              </span>
                            </div>
                            <p className="font-medium text-[#4A1525] leading-relaxed">{q.text}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <span className="text-[10px] font-bold text-[#880E4F] bg-[#FFF5F8] px-2 py-0.5 rounded border border-[#FFD6E7]">
                              [{q.marks} Marks]
                            </span>
                            <Link
                              href={`/ask?topic=${encodeURIComponent(q.text)}`}
                              className="px-2.5 py-1 rounded-xl bg-[#FFF0F5] hover:bg-[#FFD6E7] text-[#F06292] text-[10px] font-bold flex items-center gap-1 border border-[#FFC1D9]"
                            >
                              <Sparkles className="w-3 h-3 text-[#F06292]" />
                              <span>AI Solution</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
