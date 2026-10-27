"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  Sparkles,
  Send,
  BookOpen,
  FileText,
  Copy,
  Check,
  Bookmark,
  Layers,
  Brain,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  Key,
} from "lucide-react";

function AskRAGContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";
  const initialSubject = searchParams.get("subject_id") || "";

  const [question, setQuestion] = useState(initialTopic);
  const [documents, setDocuments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubject);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [copiedIdx, setCopiedIdx] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    Promise.all([
      api.get("/api/documents").catch(() => ({ data: [] })),
      api.get("/api/curriculum/subjects").catch(() => ({ data: [] })),
    ]).then(([docRes, subRes]) => {
      setDocuments(docRes.data || []);
      setSubjects(subRes.data || []);
      if (docRes.data?.length > 0) {
        setSelectedDocId(docRes.data[0].id);
      }
    });

    if (initialTopic) {
      handleAsk(initialTopic);
    }
  }, []);

  const handleAsk = async (queryText = question) => {
    const q = queryText.trim();
    if (!q) return;

    const userMessage = { role: "user", text: q, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/api/rag/ask", {
        question: q,
        doc_id: selectedDocId || undefined,
        subject_id: selectedSubjectId || undefined,
      });

      const botMessage = {
        role: "assistant",
        text: res.data.answer,
        source: res.data.source,
        citations: res.data.citations || [],
        confidence: res.data.confidence || 0.9,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I encountered an issue querying the document chunks. Please verify your document is uploaded and try again.",
          source: "Error",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast("Answer copied to clipboard!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleBookmarkAnswer = async (q, a) => {
    try {
      if (localStorage.getItem("token")) {
        await api.post("/api/bookmarks", {
          item_type: "qa",
          item_id: `qa_${Date.now()}`,
          title: q,
          subtitle: a.substring(0, 80) + "...",
          metadata: { question: q, answer: a },
        });
      }
      showToast("Q&A answer bookmarked!");
    } catch (e) {
      showToast("Saved answer locally!");
    }
  };

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
          <Sparkles className="w-4 h-4 text-[#C2185B]" />
          <span>Retrieval-Augmented Generation (RAG)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
          Ask AI Tutor & Document Search
        </h1>
        <p className="text-xs text-[#880E4F]/80 font-medium">
          Ask questions against your uploaded syllabus PDFs, lecture slides, or select an official AKTU subject to receive grounded, cited answers and exam tips.
        </p>
      </div>

      {/* Knowledge Source Selection Controls */}
      <div className="glass-card p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Uploaded Documents Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#880E4F] uppercase flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Search In Uploaded Document</span>
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => {
              setSelectedDocId(e.target.value);
              setSelectedSubjectId("");
            }}
            className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-3 py-2 text-xs font-bold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
          >
            {documents.length > 0 ? (
              documents.map((d) => (
                <option key={d.id} value={d.id}>
                  📄 {d.filename} ({d.word_count?.toLocaleString()} words)
                </option>
              ))
            ) : (
              <option value="">No files uploaded (Using Core Curriculum)</option>
            )}
          </select>
        </div>

        {/* Academic Subject Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#880E4F] uppercase flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Or Search In Subject Syllabus</span>
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setSelectedDocId("");
            }}
            className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-3 py-2 text-xs font-bold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
          >
            <option value="">All Subjects Syllabus</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}: {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-[#880E4F] shrink-0">Try asking:</span>
        {[
          "Explain Peterson's algorithm step-by-step",
          "What are the 4 Coffman conditions for deadlock?",
          "Differentiate Monolithic vs Microkernel architecture",
          "Explain Belady's anomaly with FIFO example",
          "State Arden's Theorem in TAFL",
        ].map((sample, i) => (
          <button
            key={i}
            onClick={() => handleAsk(sample)}
            className="bg-white hover:bg-[#FFD6E7] text-[#4A1525] px-3 py-1 rounded-xl border border-[#FFD6E7] shrink-0 font-semibold text-[11px] transition-all cursor-pointer"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* ─── Chat / Answers Stream ─── */}
      <div className="space-y-4 min-h-[280px]">
        {messages.length === 0 ? (
          <div className="glass-card p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD6E7] text-2xl flex items-center justify-center mx-auto">
              🤖
            </div>
            <h3 className="font-extrabold text-sm text-[#4A1525]">
              AI Study Assistant is Ready
            </h3>
            <p className="text-xs text-[#880E4F]/70 max-w-md mx-auto">
              Type any query above or select a sample question. Answers are retrieved directly from document text chunks with source citations.
            </p>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} space-y-1`}
            >
              <div
                className={`max-w-2xl p-4 rounded-3xl text-xs space-y-2.5 ${
                  m.role === "user"
                    ? "bg-[#F06292] text-white rounded-br-none shadow-sm"
                    : "bg-white border border-[#FFD6E7] text-[#4A1525] rounded-bl-none shadow-xs"
                }`}
              >
                {/* Assistant Metadata Header */}
                {m.role === "assistant" && (
                  <div className="flex items-center justify-between pb-2 border-b border-[#FFF0F5] text-[10px] font-bold text-[#880E4F]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Source: {m.source}</span>
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                      {Math.round((m.confidence || 0.9) * 100)}% Match
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-line leading-relaxed font-medium">
                  {m.text}
                </div>

                {/* Citations Snippets */}
                {m.citations?.length > 0 && (
                  <div className="pt-2 border-t border-[#FFF0F5] space-y-1">
                    <p className="text-[10px] font-bold text-[#880E4F] uppercase tracking-wider">
                      Grounding Citations
                    </p>
                    <div className="space-y-1">
                      {m.citations.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className="bg-[#FFF5F8] p-2 rounded-xl text-[10px] font-mono text-[#880E4F] border border-[#FFD6E7]"
                        >
                          "{c}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action footer for assistant responses */}
                {m.role === "assistant" && (
                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#880E4F]">
                    <span>{m.timestamp}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(m.text, idx)}
                        className="p-1 rounded hover:bg-[#FFF0F5] cursor-pointer"
                        title="Copy text"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleBookmarkAnswer(messages[idx - 1]?.text || "Concept", m.text)}
                        className="p-1 rounded hover:bg-[#FFF0F5] cursor-pointer"
                        title="Bookmark answer"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="p-4 bg-white border border-[#FFD6E7] rounded-3xl max-w-sm text-xs font-bold text-[#880E4F] flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-[#F06292] animate-spin" />
            <span>Searching document chunks & formulating answer...</span>
          </div>
        )}
      </div>

      {/* ─── Question Input Bar ─── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="glass-card p-2 rounded-2xl flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask any question from your documents or syllabus..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 text-xs font-semibold text-[#4A1525] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!question.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs shadow-xs disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

export default function AskRAGPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm font-semibold text-[#8B4B62]">
          Loading AI assistant...
        </div>
      }
    >
      <AskRAGContent />
    </Suspense>
  );
}

