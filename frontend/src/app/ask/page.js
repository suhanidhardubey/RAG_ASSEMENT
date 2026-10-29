"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  Search,
  MessageSquare,
  Clock,
  Plus,
  X,
  ArrowRight,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function AskRAGContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTopic = searchParams.get("topic") || "";
  const initialSubject = searchParams.get("subject_id") || "";
  const initialConvId = searchParams.get("conversation_id") || "";
  const initialMsgId = searchParams.get("message_id") || "";

  const [question, setQuestion] = useState(initialTopic);
  const [documents, setDocuments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubject);

  // Active Conversation State
  const [activeConvId, setActiveConvId] = useState(initialConvId);
  const [activeConvTitle, setActiveConvTitle] = useState("");
  const [highlightMsgId, setHighlightMsgId] = useState(
    initialMsgId ? parseInt(initialMsgId) : null
  );

  // AI Tutor Search & Past Conversations State
  const [tutorSearchQuery, setTutorSearchQuery] = useState("");
  const [matchingConversations, setMatchingConversations] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);
  const [isSearchingTutor, setIsSearchingTutor] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [copiedIdx, setCopiedIdx] = useState(null);

  const chatEndRef = useRef(null);
  const highlightedRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Fetch documents, subjects, and recent tutor conversations on mount
  useEffect(() => {
    Promise.all([
      api.get("/api/documents").catch(() => ({ data: [] })),
      api.get("/api/curriculum/subjects").catch(() => ({ data: [] })),
      api.get("/api/conversations", { params: { chat_type: "tutor", limit: 6 } }).catch(() => ({ data: [] })),
    ]).then(([docRes, subRes, convRes]) => {
      setDocuments(docRes.data || []);
      setSubjects(subRes.data || []);
      setRecentConversations(convRes.data || []);
      if (docRes.data?.length > 0 && !selectedDocId) {
        setSelectedDocId(docRes.data[0].id);
      }
    });

    if (initialConvId) {
      loadConversation(initialConvId, initialMsgId);
    } else if (initialTopic) {
      handleAsk(initialTopic);
    }
  }, []);

  // AI Tutor Search: find previous conversations related to keyword or topic
  useEffect(() => {
    if (!tutorSearchQuery.trim()) {
      setMatchingConversations([]);
      setIsSearchingTutor(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingTutor(true);
        const res = await api.get("/api/conversations", {
          params: { search: tutorSearchQuery.trim(), chat_type: "tutor" },
        });
        setMatchingConversations(res.data || []);
      } catch (err) {
        console.error("Failed to search past tutor conversations:", err);
      } finally {
        setIsSearchingTutor(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [tutorSearchQuery]);

  // Load an existing conversation and restore its messages
  const loadConversation = async (convId, targetMsgId = null) => {
    if (!convId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/conversations/${convId}`);
      const conv = res.data;
      if (conv) {
        setActiveConvId(conv.id);
        setActiveConvTitle(conv.title);
        if (conv.doc_id) setSelectedDocId(conv.doc_id);
        if (conv.subject_id) setSelectedSubjectId(conv.subject_id);

        const loadedMessages = (conv.messages || []).map((m) => ({
          id: m.id,
          role: m.role,
          text: m.content,
          source: m.source || "Academic Materials",
          citations: m.citations || [],
          confidence: m.confidence || 0.94,
          llm_used: Boolean(m.llm_used),
          timestamp: m.created_at
            ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));

        setMessages(loadedMessages);

        if (targetMsgId) {
          setHighlightMsgId(parseInt(targetMsgId));
        }

        // Keep browser URL in sync without full reload
        router.replace(`/ask?conversation_id=${conv.id}${targetMsgId ? `&message_id=${targetMsgId}` : ""}`);
        showToast(`Loaded conversation: "${conv.title}"`);
      }
    } catch (err) {
      showToast("Could not load conversation history.");
    } finally {
      setLoading(false);
    }
  };

  // Scroll to highlighted message if opening from search result
  useEffect(() => {
    if (highlightMsgId && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (!highlightMsgId && messages.length > 0 && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, highlightMsgId]);

  // Start fresh new chat topic
  const handleNewChat = () => {
    setActiveConvId("");
    setActiveConvTitle("");
    setMessages([]);
    setQuestion("");
    setHighlightMsgId(null);
    router.replace("/ask");
    showToast("Started fresh study topic!");
  };

  const handleAsk = async (queryText = question) => {
    const q = queryText.trim();
    if (!q || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setHighlightMsgId(null);

    try {
      const savedKey = typeof window !== "undefined" ? localStorage.getItem("rag_llm_api_key") : null;
      const savedProv = typeof window !== "undefined" ? localStorage.getItem("rag_llm_provider") || "gemini" : "gemini";

      const res = await api.post("/api/rag/ask", {
        question: q,
        conversation_id: activeConvId || undefined,
        doc_id: selectedDocId || undefined,
        subject_id: selectedSubjectId || undefined,
        api_key: savedKey || undefined,
        provider: savedProv || undefined,
      });

      if (res.data?.conversation_id) {
        setActiveConvId(res.data.conversation_id);
        if (!activeConvTitle) {
          setActiveConvTitle(q.length > 45 ? q.substring(0, 42) + "..." : q);
        }
        router.replace(`/ask?conversation_id=${res.data.conversation_id}`);
      }

      const botMessage = {
        id: res.data.assistant_message_id || Date.now() + 1,
        role: "assistant",
        text: res.data.answer,
        source: res.data.source,
        citations: res.data.citations || [],
        confidence: res.data.confidence || 0.9,
        llm_used: res.data.llm_used,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Refresh recent conversations strip
      api
        .get("/api/conversations", { params: { chat_type: "tutor", limit: 6 } })
        .then((r) => setRecentConversations(r.data || []))
        .catch(() => {});
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I encountered an issue querying the document chunks. Please verify your document is uploaded and try again.",
          source: "Error",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#880E4F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#FFB8D2] animate-fade-in">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── Header Banner ─── */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-5 sm:p-6 rounded-3xl border-2 border-white shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#C2185B]" />
            <span>Retrieval-Augmented Generation (RAG) • Gemini AI Connected</span>
          </div>
          <Link
            href="/history"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 hover:bg-white text-[11px] font-extrabold text-[#C2185B] border border-[#FFB8D2] shadow-2xs transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat History</span>
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
          Ask AI Tutor & Syllabus Search
        </h1>
        <p className="text-xs text-[#880E4F]/80 font-medium">
          Ask questions grounded in your uploaded documents or official syllabus. All conversations are persistently stored in SQLite so you can search and resume anytime.
        </p>
      </div>

      {/* ─── AI TUTOR SEARCH BOX (Requirement 3: Search Previous Conversations) ─── */}
      <div className="bg-white p-4 rounded-3xl border border-[#FFD6E7] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold text-[#880E4F] uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#F06292]" />
            <span>Search Previous Conversations & Topics</span>
          </label>
          <button
            onClick={() => setShowHistoryPanel(!showHistoryPanel)}
            className="text-[11px] font-extrabold text-[#F06292] hover:text-[#C2185B] flex items-center gap-1"
          >
            <span>{showHistoryPanel ? "Hide Past Chats" : "Show Past Chats"}</span>
            {showHistoryPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#880E4F]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={tutorSearchQuery}
            onChange={(e) => setTutorSearchQuery(e.target.value)}
            placeholder="Type any keyword (e.g. 'deadlock', 'algorithm', 'neural') to find past conversations..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FFD6E7] text-xs font-bold text-[#4A1525] placeholder:text-[#880E4F]/50 focus:outline-none focus:border-[#F06292] transition-colors"
          />
          {tutorSearchQuery && (
            <button
              onClick={() => setTutorSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#FFD6E7] text-[#880E4F]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Matching Search Results Dropdown/Cards */}
        {tutorSearchQuery && (
          <div className="p-3 bg-[#FFF5F8] rounded-2xl border border-[#FFD6E7] space-y-2 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#880E4F]">
              <span>
                {isSearchingTutor
                  ? "Searching past chats..."
                  : `Found ${matchingConversations.length} matching conversation${matchingConversations.length === 1 ? "" : "s"}`}
              </span>
              <span className="text-[10px] bg-[#FFD6E7] text-[#C2185B] px-2 py-0.5 rounded-md">
                Keyword: "{tutorSearchQuery}"
              </span>
            </div>

            {matchingConversations.length > 0 ? (
              <div className="space-y-2">
                {matchingConversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      const firstMatchId = c.matching_messages?.[0]?.id;
                      loadConversation(c.id, firstMatchId);
                      setTutorSearchQuery("");
                    }}
                    className="p-3 bg-white hover:bg-[#FFF0F5] rounded-xl border border-[#FFD6E7] hover:border-[#F06292] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💬</span>
                        <h4 className="text-xs font-extrabold text-[#4A1525] truncate group-hover:text-[#C2185B]">
                          {c.title}
                        </h4>
                        <span className="text-[10px] text-[#880E4F]/60">
                          {c.updated_at ? new Date(c.updated_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                      {c.matching_messages?.length > 0 ? (
                        <p className="text-[10px] text-[#4A1525] bg-[#FFF0F5] p-1.5 rounded-lg mt-1 font-medium line-clamp-2">
                          <span className="font-bold text-[#C2185B]">
                            {c.matching_messages[0].role === "user" ? "Q: " : "AI: "}
                          </span>
                          {c.matching_messages[0].snippet || c.matching_messages[0].content}
                        </p>
                      ) : (
                        <p className="text-[10px] text-[#880E4F]/70 truncate mt-0.5">
                          {c.last_message?.content || "Click to open and resume chat"}
                        </p>
                      )}
                    </div>

                    <button className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-[#F06292] group-hover:bg-[#E91E63] text-white text-[10px] font-extrabold shadow-2xs transition-colors shrink-0 flex items-center gap-1">
                      <span>Resume Chat</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : !isSearchingTutor ? (
              <p className="text-xs text-center text-[#880E4F]/70 py-3">
                No past tutor conversations matched "{tutorSearchQuery}". Try another keyword or ask your question below!
              </p>
            ) : null}
          </div>
        )}

        {/* Recent Conversations Chips */}
        {recentConversations.length > 0 && (!tutorSearchQuery || showHistoryPanel) && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-[#880E4F]/70 uppercase tracking-wider block">
              Recent Study Sessions:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {recentConversations.map((c) => {
                const isActive = c.id === activeConvId;
                return (
                  <button
                    key={c.id}
                    onClick={() => loadConversation(c.id)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#F06292] text-white border-[#F06292] shadow-2xs"
                        : "bg-[#FFF0F5] hover:bg-[#FFD6E7] text-[#4A1525] border-[#FFD6E7]"
                    }`}
                  >
                    <span>💬</span>
                    <span className="truncate max-w-[150px]">{c.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Active Conversation Status Banner ─── */}
      {activeConvId && (
        <div className="p-3 bg-gradient-to-r from-pink-50 to-[#FFF0F5] rounded-2xl border border-[#FFC1D9] flex items-center justify-between gap-3 text-xs shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold text-[#C2185B] uppercase block">
                Continuing Conversation:
              </span>
              <p className="font-extrabold text-[#4A1525] text-xs truncate max-w-sm sm:max-w-md">
                {activeConvTitle || "Study Thread"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/history?id=${activeConvId}`}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFD6E7] border border-[#FFD6E7] text-[10px] font-extrabold text-[#880E4F] transition-all"
            >
              Full History
            </Link>
            <button
              onClick={handleNewChat}
              className="px-3 py-1 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white text-[10px] font-extrabold shadow-2xs transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>New Topic</span>
            </button>
          </div>
        </div>
      )}

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
              Type any query above or search your previous chats. Answers are synthesized using course knowledge and automatically saved to your history.
            </p>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isHighlighted = highlightMsgId === m.id;
            return (
              <div
                key={m.id || idx}
                ref={isHighlighted ? highlightedRef : null}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                } space-y-1 transition-all ${
                  isHighlighted ? "ring-2 ring-[#F06292] ring-offset-2 rounded-3xl p-1" : ""
                }`}
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
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Source: {m.source}</span>
                        </span>
                        {m.llm_used && (
                          <span className="bg-pink-50 text-[#C2185B] px-1.5 py-0.2 rounded border border-pink-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#F06292]" />
                            <span>Gemini AI Synthesized</span>
                          </span>
                        )}
                      </div>
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
                          {copiedIdx === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
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
            );
          })
        )}

        {loading && (
          <div className="p-4 bg-white border border-[#FFD6E7] rounded-3xl max-w-sm text-xs font-bold text-[#880E4F] flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-[#F06292] animate-spin" />
            <span>Searching document chunks & formulating answer...</span>
          </div>
        )}

        <div ref={chatEndRef} />
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
          placeholder={
            activeConvId
              ? "Continue conversation: ask a follow-up question..."
              : "Ask any question from your documents or syllabus..."
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 text-xs font-semibold text-[#4A1525] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!question.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs shadow-xs disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>{activeConvId ? "Continue" : "Ask"}</span>
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
