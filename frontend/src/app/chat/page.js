"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Key,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Cpu,
  CheckCircle2,
  Lock,
  Layers,
  Brain,
  BookOpen,
} from "lucide-react";

export default function ChatPage() {
  const [apiKey, setApiKey] = useState("");
  const [modelProvider, setModelProvider] = useState("gemini");
  const [saved, setSaved] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rag_llm_api_key") || "";
      setApiKey(stored);
      if (stored) setSaved(true);
    }
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      showToast("Please enter a valid API key");
      return;
    }
    localStorage.setItem("rag_llm_api_key", apiKey.trim());
    localStorage.setItem("rag_llm_provider", modelProvider);
    setSaved(true);
    showToast("API Key saved securely in your local browser storage!");
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("rag_llm_api_key");
    setApiKey("");
    setSaved(false);
    showToast("API Key removed.");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#4A1525] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs space-y-2 text-center">
        <div className="w-14 h-14 rounded-3xl bg-white shadow-sm flex items-center justify-center text-2xl mx-auto">
          💬
        </div>
        <h1 className="text-lg font-extrabold text-[#4A1525]">
          AI Conversational Chatbot
        </h1>
        <p className="text-xs text-[#880E4F]/80 font-semibold max-w-md mx-auto">
          Grounded conversational Q&A is paused until an LLM API key is connected. All other study modules are 100% active!
        </p>
      </div>

      {/* Active Modules Banner */}
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-xs font-extrabold text-[#4A1525] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#F06292]" />
          <span>Fully Working Local Modules (Zero API Key Needed):</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-[#880E4F]">
          <Link href="/upload" className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#FFD6E7] hover:bg-[#FFF5F8] transition-colors">
            <span className="text-emerald-500">✅</span>
            <span>Document Extraction (.pdf, .pptx, .md)</span>
          </Link>
          <Link href="/summary" className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#FFD6E7] hover:bg-[#FFF5F8] transition-colors">
            <span className="text-emerald-500">✅</span>
            <span>Document Summary & Key Points</span>
          </Link>
          <Link href="/summary" className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#FFD6E7] hover:bg-[#FFF5F8] transition-colors">
            <span className="text-emerald-500">✅</span>
            <span>TF-IDF Weighted Keyword Cloud</span>
          </Link>
          <Link href="/flashcards" className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#FFD6E7] hover:bg-[#FFF5F8] transition-colors">
            <span className="text-emerald-500">✅</span>
            <span>3D Flip Flashcards & Real XP Claim</span>
          </Link>
          <Link href="/quiz" className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#FFD6E7] hover:bg-[#FFF5F8] transition-colors">
            <span className="text-emerald-500">✅</span>
            <span>Timed MCQ Quizzes & Analytics</span>
          </Link>
          <Link href="/leaderboard" className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#FFD6E7] hover:bg-[#FFF5F8] transition-colors">
            <span className="text-emerald-500">✅</span>
            <span>Live SQLite Leaderboard & Rankings</span>
          </Link>
        </div>
      </div>

      {/* Connect API Key Card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] text-[#F06292] flex items-center justify-center shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#4A1525]">
              Connect Your LLM API Key (When Ready)
            </h3>
            <p className="text-[11px] text-[#880E4F]/70 font-semibold">
              Add your Gemini or OpenAI API key here to turn on live grounded conversational chat.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#880E4F] mb-1">
              Provider
            </label>
            <select
              value={modelProvider}
              onChange={(e) => setModelProvider(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-xs font-bold text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
            >
              <option value="gemini">Google Gemini API (Recommended)</option>
              <option value="openai">OpenAI (GPT-4o mini)</option>
              <option value="ollama">Local Ollama (e.g. Llama-3 / Mistral)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#880E4F] mb-1">
              API Key or Endpoint URL
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API Key (e.g. AIzaSy...)"
              className="w-full p-3 rounded-2xl border border-[#FFB8D2] bg-white text-xs font-mono text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 btn-primary text-xs py-3 flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{saved ? "Update API Key" : "Save Key & Activate"}</span>
            </button>
            {saved && (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="py-3 px-4 rounded-2xl border border-rose-300 bg-white text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </form>

        {saved && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>API Key connected! Once backend integration is configured, live responses will stream.</span>
          </div>
        )}
      </div>

      {/* CTA back to Dashboard */}
      <div className="text-center pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#F06292] hover:underline"
        >
          <span>Continue studying on Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
