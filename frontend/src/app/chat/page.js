"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  MessageSquare,
  Key,
  Sparkles,
  Send,
  Lock,
  CheckCircle2,
  ExternalLink,
  Bot,
  User,
  Trash2,
  Zap,
} from "lucide-react";

export default function ChatPage() {
  const [apiKey, setApiKey] = useState("");
  const [modelProvider, setModelProvider] = useState("gemini");
  const [saved, setSaved] = useState(false);
  const [backendConfigured, setBackendConfigured] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Welcome to RAGora AI Chat! I am powered by Google Gemini. Ask me anything about your university syllabus, algorithms, code explanations, or exam preparation!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rag_llm_api_key") || "";
      setApiKey(stored);
      if (stored) setSaved(true);
      const storedProv = localStorage.getItem("rag_llm_provider");
      if (storedProv) setModelProvider(storedProv);
    }

    api
      .get("/api/llm/status")
      .then((res) => {
        if (res.data?.configured) {
          setBackendConfigured(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
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
    showToast("Gemini API key saved securely in browser!");
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("rag_llm_api_key");
    setApiKey("");
    setSaved(false);
    showToast("API Key removed.");
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const query = inputMessage.trim();
    if (!query || loading) return;

    const userMsg = {
      role: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const activeKey = apiKey.trim() || undefined;
      const res = await api.post("/api/llm/generate", {
        prompt: query,
        provider: modelProvider,
        api_key: activeKey,
      });

      if (res.data?.success && res.data?.text) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: res.data.text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            provider: res.data.provider,
          },
        ]);
      } else {
        const errorText =
          res.data?.error ||
          "Please connect your Gemini API key above to chat live with Google Gemini.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `⚠️ ${errorText}\n\nYou can get a free Gemini API key in 10 seconds from Google AI Studio: https://aistudio.google.com/app/apikey`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Connection error contacting the AI backend. Please verify your API key and network connection.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Chat cleared! How can RAGora assist your studies right now?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#4A1525] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider">
            <Zap className="w-4 h-4 text-[#C2185B]" />
            <span>RAGora Live Gemini AI Assistant</span>
          </div>
          {(saved || backendConfigured) && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Gemini Ready</span>
            </span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
          Conversational AI Tutor & Problem Solver
        </h1>
        <p className="text-xs text-[#880E4F]/80 font-medium">
          Chat directly with Google Gemini for step-by-step algorithms, derivations, exam answers, and code debugging.
        </p>
      </div>

      {/* API Key Configuration Panel */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#F06292] flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-[#4A1525]">
                Google Gemini API Key
              </h3>
              <p className="text-[11px] text-[#880E4F]/70 font-semibold">
                {saved || backendConfigured
                  ? "Connected! You can chat directly below."
                  : "Connect your free Gemini key to enable live AI responses."}
              </p>
            </div>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#C2185B] bg-[#FFF0F5] hover:bg-[#FFD6E7] px-3 py-1.5 rounded-xl border border-[#FFC1D9] transition-all"
          >
            <span>Get Free Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <form onSubmit={handleSaveKey} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="relative flex-1 w-full">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key (AIzaSy...)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFB8D2] bg-white text-xs font-mono text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="btn-primary text-xs py-2.5 px-5 flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{saved ? "Update" : "Save Key"}</span>
            </button>
            {saved && (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="py-2.5 px-3 rounded-xl border border-rose-300 bg-white text-xs font-bold text-rose-500 hover:bg-rose-50 cursor-pointer"
                title="Disconnect key"
              >
                Disconnect
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Live Chat Box */}
      <div className="glass-card p-4 space-y-4 flex flex-col h-[520px]">
        {/* Chat Header Actions */}
        <div className="flex items-center justify-between pb-2 border-b border-[#FFD6E7] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-[#4A1525]">RAGora Chat Room</span>
          </div>
          <button
            onClick={clearChat}
            className="text-[11px] font-bold text-[#880E4F]/70 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                  m.role === "user"
                    ? "bg-[#F06292] text-white"
                    : "bg-[#FFD6E7] text-[#880E4F] border border-[#FFB8D2]"
                }`}
              >
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs space-y-1 ${
                  m.role === "user"
                    ? "bg-[#F06292] text-white rounded-tr-none shadow-xs"
                    : "bg-white border border-[#FFD6E7] text-[#4A1525] rounded-tl-none shadow-xs"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-medium">
                  {m.text}
                </div>
                <div
                  className={`text-[9px] font-bold text-right ${
                    m.role === "user" ? "text-pink-100" : "text-[#880E4F]/60"
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-[#FFD6E7] rounded-2xl w-fit text-xs font-bold text-[#880E4F] animate-pulse">
              <Sparkles className="w-4 h-4 text-[#F06292] animate-spin" />
              <span>Gemini is generating response...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-[#FFD6E7]">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your question or coding problem..."
            className="flex-1 bg-[#FFF5F8] border border-[#FFC1D9] rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-5 py-2.5 rounded-2xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs shadow-xs disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
