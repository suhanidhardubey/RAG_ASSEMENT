"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  MessageSquare,
  Search,
  X,
  Send,
  Trash2,
  ExternalLink,
  Bot,
  User,
  Sparkles,
  Clock,
  ChevronLeft,
  Copy,
  Check,
  Edit2,
  ShieldCheck,
  Plus,
  BookOpen,
  FileText,
  Filter,
} from "lucide-react";

function formatChatTime(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (isYesterday) {
      return "Yesterday";
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch (e) {
    return "";
  }
}

function HistoryInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialId = searchParams.get("id") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialHighlight = searchParams.get("highlight") || "";

  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(initialId);
  const [activeConv, setActiveConv] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterType, setFilterType] = useState("all");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingConv, setLoadingConv] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [highlightMsgId, setHighlightMsgId] = useState(
    initialHighlight ? parseInt(initialHighlight) : null
  );
  const [showMobileChat, setShowMobileChat] = useState(Boolean(initialId));
  const [toastMsg, setToastMsg] = useState("");
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleVal, setEditTitleVal] = useState("");

  const chatEndRef = useRef(null);
  const highlightedRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Fetch list of conversations
  const fetchConversations = async (query = searchQuery) => {
    try {
      setLoadingList(true);
      const params = {};
      if (query.trim()) params.search = query.trim();
      const res = await api.get("/api/conversations", { params });
      const list = res.data || [];
      setConversations(list);

      // If user came with initialId or no conversation selected yet, pick first
      if (initialId && !selectedConvId) {
        setSelectedConvId(initialId);
      } else if (!selectedConvId && list.length > 0 && window.innerWidth >= 768) {
        setSelectedConvId(list[0].id);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchConversations(searchQuery);
  }, [searchQuery]);

  // Load single conversation whenever selectedConvId changes
  const loadConversation = async (convId) => {
    if (!convId) {
      setActiveConv(null);
      return;
    }
    try {
      setLoadingConv(true);
      const res = await api.get(`/api/conversations/${convId}`);
      setActiveConv(res.data);
      setEditTitleVal(res.data?.title || "");
    } catch (err) {
      console.error("Failed to load conversation details:", err);
      setActiveConv(null);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    if (selectedConvId) {
      loadConversation(selectedConvId);
    }
  }, [selectedConvId]);

  // Scroll to highlighted message or bottom
  useEffect(() => {
    if (highlightMsgId && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (!highlightMsgId && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConv, highlightMsgId]);

  const handleSelectConversation = (convId, msgId = null) => {
    setSelectedConvId(convId);
    setHighlightMsgId(msgId);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = inputMessage.trim();
    if (!text || sending || !selectedConvId) return;

    setInputMessage("");
    setSending(true);

    // Optimistically add user message to active conversation
    const optimisticUserMsg = {
      id: Date.now(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setActiveConv((prev) =>
      prev
        ? {
            ...prev,
            messages: [...(prev.messages || []), optimisticUserMsg],
          }
        : null
    );

    try {
      const savedKey =
        typeof window !== "undefined"
          ? localStorage.getItem("rag_llm_api_key")
          : null;
      const savedProv =
        typeof window !== "undefined"
          ? localStorage.getItem("rag_llm_provider") || "gemini"
          : "gemini";

      const res = await api.post("/api/rag/ask", {
        question: text,
        conversation_id: selectedConvId,
        doc_id: activeConv?.doc_id || undefined,
        subject_id: activeConv?.subject_id || undefined,
        api_key: savedKey || undefined,
        provider: savedProv || undefined,
      });

      // Reload full conversation to ensure sync with database
      await loadConversation(selectedConvId);
      // Refresh conversation list to update preview and updated_at order
      fetchConversations(searchQuery);
    } catch (err) {
      showToast("Error sending message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (convId, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat conversation?")) {
      return;
    }
    try {
      await api.delete(`/api/conversations/${convId}`);
      showToast("Conversation deleted");
      if (selectedConvId === convId) {
        setSelectedConvId("");
        setActiveConv(null);
        setShowMobileChat(false);
      }
      fetchConversations(searchQuery);
    } catch (err) {
      showToast("Failed to delete conversation");
    }
  };

  const handleSaveTitle = async () => {
    if (!editTitleVal.trim() || !selectedConvId) return;
    try {
      await api.patch(`/api/conversations/${selectedConvId}`, {
        title: editTitleVal.trim(),
      });
      setIsEditingTitle(false);
      showToast("Title updated");
      if (activeConv) {
        setActiveConv({ ...activeConv, title: editTitleVal.trim() });
      }
      fetchConversations(searchQuery);
    } catch (err) {
      showToast("Failed to rename conversation");
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    showToast("Message copied to clipboard!");
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Helper to highlight matching text in snippet
  const renderHighlightedSnippet = (snippet, query) => {
    if (!query || !snippet) return snippet;
    const parts = snippet.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={i}
          className="bg-[#FFD6E7] text-[#C2185B] font-extrabold px-1 py-0.5 rounded"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filter conversations by filterType
  const filteredConversations = conversations.filter((c) => {
    if (filterType === "tutor") return c.chat_type === "tutor";
    if (filterType === "today") {
      const d = new Date(c.updated_at || c.created_at);
      const now = new Date();
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#880E4F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#FFB8D2] animate-fade-in">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── Top Header Banner ─── */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-5 sm:p-6 rounded-3xl border-2 border-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4 text-[#C2185B]" />
            <span>Persistent Conversation Storage • Study History</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
            Chat History & Global Search
          </h1>
          <p className="text-xs text-[#880E4F]/80 font-medium">
            Search any keyword across all past conversations, questions, and AI responses. Click any chat to resume right where you left off.
          </p>
        </div>

        <Link
          href="/ask"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F06292] hover:bg-[#E91E63] text-white text-xs font-extrabold shadow-md shadow-[#F06292]/25 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Tutor Chat</span>
        </Link>
      </div>

      {/* ─── WhatsApp-Style Dual-Pane Container ─── */}
      <div className="bg-white rounded-3xl border border-[#FFD6E7] shadow-sm overflow-hidden h-[calc(100vh-210px)] min-h-[580px] grid grid-cols-1 md:grid-cols-12">
        {/* ══════════════════════════════════════════════════════════ */}
        {/* LEFT PANE: Conversation List & Global Search (5 cols)     */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div
          className={`md:col-span-5 border-r border-[#FFD6E7] flex flex-col h-full bg-[#FFF5F8]/40 ${
            showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* WhatsApp List Header */}
          <div className="p-3.5 border-b border-[#FFD6E7] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FFC1D9] to-[#FFD6E7] flex items-center justify-center text-base shadow-2xs">
                💬
              </div>
              <div>
                <h2 className="text-xs font-extrabold text-[#4A1525]">
                  All Conversations
                </h2>
                <p className="text-[10px] text-[#880E4F]/70 font-semibold">
                  {conversations.length} saved session{conversations.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <Link
              href="/ask"
              title="Start New Topic"
              className="w-8 h-8 rounded-xl bg-[#FFF0F5] hover:bg-[#FFD6E7] border border-[#FFD6E7] flex items-center justify-center text-[#880E4F] transition-all"
            >
              <Plus className="w-4 h-4 text-[#F06292]" />
            </Link>
          </div>

          {/* Global Search Bar */}
          <div className="p-3 bg-white border-b border-[#FFD6E7] space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#880E4F]/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keywords in chats & answers..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FFF0F5] border border-[#FFD6E7] text-xs font-bold text-[#4A1525] placeholder:text-[#880E4F]/40 focus:outline-none focus:border-[#F06292] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[#FFD6E7] text-[#880E4F]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
              {[
                { id: "all", label: "All Chats" },
                { id: "tutor", label: "AI Tutor" },
                { id: "today", label: "Today" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-2.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    filterType === f.id
                      ? "bg-[#F06292] text-white shadow-2xs"
                      : "bg-[#FFF0F5] text-[#880E4F] hover:bg-[#FFD6E7]"
                  }`}
                >
                  {f.label}
                </button>
              ))}

              {searchQuery && (
                <span className="text-[10px] font-bold text-[#C2185B] bg-[#FFD6E7] px-2 py-0.5 rounded-md ml-auto shrink-0">
                  {filteredConversations.length} found
                </span>
              )}
            </div>
          </div>

          {/* Conversation List Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#FFD6E7]/60">
            {loadingList ? (
              <div className="p-8 text-center space-y-2">
                <div className="text-2xl animate-bounce">🌸</div>
                <p className="text-xs font-bold text-[#880E4F]">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-xl flex items-center justify-center mx-auto text-[#880E4F]">
                  💬
                </div>
                <h4 className="font-extrabold text-xs text-[#4A1525]">
                  {searchQuery ? "No matching chats found" : "No conversation history yet"}
                </h4>
                <p className="text-[11px] text-[#880E4F]/70 max-w-xs mx-auto">
                  {searchQuery
                    ? `No past user questions or AI responses matched "${searchQuery}". Try another keyword.`
                    : "Ask questions in the AI Tutor or upload documents to start your study history!"}
                </p>
                <Link
                  href="/ask"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F06292] text-white text-[11px] font-extrabold shadow-xs hover:bg-[#E91E63]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start First Chat</span>
                </Link>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === selectedConvId;
                const formattedTime = formatChatTime(c.updated_at || c.created_at);
                const hasMatchingMsgs = c.matching_messages?.length > 0;

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectConversation(c.id)}
                    className={`p-3.5 cursor-pointer transition-all group relative flex gap-3 ${
                      isSelected
                        ? "bg-[#FFF0F5] border-l-4 border-[#F06292]"
                        : "bg-white hover:bg-[#FFF5F8]"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFD6E7] to-[#FFC1D9] flex items-center justify-center text-lg shadow-2xs border border-white">
                        🤖
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                    </div>

                    {/* Middle Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-extrabold text-[#4A1525] truncate max-w-[170px] sm:max-w-[190px]">
                          {c.title}
                        </h3>
                        <span className="text-[10px] font-semibold text-[#880E4F]/70 shrink-0">
                          {formattedTime}
                        </span>
                      </div>

                      {/* Snippet / Last Message Preview */}
                      {searchQuery && hasMatchingMsgs ? (
                        <div className="space-y-1">
                          {c.matching_messages.slice(0, 2).map((m, mIdx) => (
                            <div
                              key={m.id || mIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectConversation(c.id, m.id);
                              }}
                              className="text-[11px] text-[#4A1525] bg-[#FFF0F5] p-1.5 rounded-lg border border-[#FFD6E7] hover:border-[#F06292] transition-colors"
                            >
                              <span className="font-extrabold text-[10px] text-[#C2185B] uppercase block">
                                {m.role === "user" ? "You asked:" : "AI Tutor replied:"}
                              </span>
                              <p className="line-clamp-2 leading-relaxed">
                                {renderHighlightedSnippet(m.snippet || m.content, searchQuery)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-[#880E4F]/70 truncate font-medium">
                          {c.last_message?.role === "user" ? "You: " : "AI: "}
                          {c.last_message?.content || "Tap to continue discussion..."}
                        </p>
                      )}

                      {/* Bottom Meta */}
                      <div className="flex items-center justify-between mt-2 text-[10px]">
                        <span className="text-[#880E4F] bg-[#FFF0F5] px-1.5 py-0.2 rounded border border-[#FFD6E7] font-semibold">
                          {c.chat_type === "tutor" ? "AI Tutor" : "General"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#FFD6E7] text-[#C2185B] font-bold px-1.5 py-0.2 rounded-full">
                            {c.message_count || 0} msg{c.message_count === 1 ? "" : "s"}
                          </span>
                          <button
                            onClick={(e) => handleDeleteConversation(c.id, e)}
                            title="Delete Chat"
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-100 text-rose-500 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* RIGHT PANE: Active WhatsApp Conversation View (7 cols)    */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div
          className={`md:col-span-7 flex flex-col h-full bg-[#FFF5F8]/30 ${
            showMobileChat ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedConvId && activeConv ? (
            <>
              {/* WhatsApp Chat Top Header */}
              <div className="p-3.5 border-b border-[#FFD6E7] bg-white flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-1.5 rounded-xl hover:bg-[#FFF0F5] text-[#880E4F]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FFD6E7] to-[#FFC1D9] flex items-center justify-center text-lg shrink-0 shadow-2xs">
                    🤖
                  </div>

                  <div className="min-w-0">
                    {isEditingTitle ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editTitleVal}
                          onChange={(e) => setEditTitleVal(e.target.value)}
                          className="text-xs font-extrabold px-2 py-0.5 rounded border border-[#F06292] text-[#4A1525] focus:outline-none"
                        />
                        <button
                          onClick={handleSaveTitle}
                          className="p-1 rounded bg-[#F06292] text-white hover:bg-[#E91E63]"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setIsEditingTitle(false)}
                          className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-extrabold text-[#4A1525] truncate max-w-[200px] sm:max-w-sm">
                          {activeConv.title}
                        </h3>
                        <button
                          onClick={() => setIsEditingTitle(true)}
                          title="Rename Chat"
                          className="p-1 rounded hover:bg-[#FFF0F5] text-[#880E4F]/60 hover:text-[#880E4F]"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-[#880E4F]/70 font-semibold">
                      <span>
                        {activeConv.messages?.length || 0} messages
                      </span>
                      <span>•</span>
                      <span>Active {formatChatTime(activeConv.updated_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/ask?conversation_id=${selectedConvId}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFF0F5] hover:bg-[#FFD6E7] border border-[#FFD6E7] text-[11px] font-extrabold text-[#880E4F] transition-all"
                  >
                    <span>Open in AI Tutor</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={(e) => handleDeleteConversation(selectedConvId, e)}
                    title="Delete Conversation"
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-[#FFD6E7] text-rose-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#FFF5F8]/40 to-white">
                {loadingConv ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-2">
                      <div className="text-2xl animate-spin">🌸</div>
                      <p className="text-xs font-bold text-[#880E4F]">
                        Loading chat messages...
                      </p>
                    </div>
                  </div>
                ) : activeConv.messages?.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <div className="text-2xl">💬</div>
                    <p className="text-xs font-bold text-[#4A1525]">
                      No messages yet in this conversation.
                    </p>
                    <p className="text-[11px] text-[#880E4F]/70">
                      Type below to ask your first question and start chatting!
                    </p>
                  </div>
                ) : (
                  activeConv.messages?.map((m) => {
                    const isUser = m.role === "user";
                    const isHighlighted = highlightMsgId === m.id;

                    return (
                      <div
                        key={m.id}
                        ref={isHighlighted ? highlightedRef : null}
                        className={`flex flex-col ${
                          isUser ? "items-end" : "items-start"
                        } space-y-1 transition-all ${
                          isHighlighted
                            ? "ring-2 ring-[#F06292] ring-offset-2 rounded-2xl p-0.5"
                            : ""
                        }`}
                      >
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-2 ${
                            isUser
                              ? "bg-gradient-to-r from-[#F06292] to-[#E91E63] text-white rounded-br-none shadow-xs"
                              : "bg-white border border-[#FFD6E7] text-[#4A1525] rounded-bl-none shadow-2xs"
                          }`}
                        >
                          {/* Assistant Source Header */}
                          {!isUser && (
                            <div className="flex items-center justify-between pb-1.5 border-b border-[#FFF0F5] text-[10px] font-bold text-[#880E4F]">
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{m.source || "Academic Syllabus"}</span>
                                {m.llm_used ? (
                                  <span className="bg-pink-50 text-[#C2185B] px-1 rounded border border-pink-200">
                                    Gemini AI
                                  </span>
                                ) : null}
                              </div>
                              <span className="bg-emerald-50 text-emerald-800 px-1 rounded border border-emerald-200">
                                {Math.round((m.confidence || 0.94) * 100)}% match
                              </span>
                            </div>
                          )}

                          {/* Message Body */}
                          <div className="whitespace-pre-line leading-relaxed font-medium">
                            {searchQuery ? renderHighlightedSnippet(m.content, searchQuery) : m.content}
                          </div>

                          {/* Citations if available */}
                          {m.citations?.length > 0 && (
                            <div className="pt-2 border-t border-[#FFF0F5] space-y-1">
                              <p className="text-[10px] font-bold text-[#880E4F] uppercase tracking-wider">
                                Grounded Citations
                              </p>
                              {m.citations.map((c, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="bg-[#FFF5F8] p-1.5 rounded-lg text-[10px] font-mono text-[#880E4F] border border-[#FFD6E7]"
                                >
                                  "{c}"
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Time & Action Footer */}
                          <div
                            className={`flex items-center justify-between pt-1 text-[10px] ${
                              isUser ? "text-pink-100" : "text-[#880E4F]/70"
                            }`}
                          >
                            <span>
                              {m.created_at
                                ? new Date(m.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </span>

                            <button
                              onClick={() => handleCopy(m.content, m.id)}
                              className={`p-1 rounded cursor-pointer transition-colors ${
                                isUser ? "hover:bg-pink-700/30" : "hover:bg-[#FFF0F5]"
                              }`}
                              title="Copy message text"
                            >
                              {copiedMsgId === m.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {sending && (
                  <div className="flex items-center gap-2 p-3 bg-white border border-[#FFD6E7] rounded-2xl max-w-xs text-xs font-bold text-[#880E4F] animate-pulse">
                    <Sparkles className="w-4 h-4 text-[#F06292] animate-spin" />
                    <span>AI Tutor is formulating answer...</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar (Continue Chatting) */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-[#FFD6E7] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Continue this conversation... ask follow-up questions"
                  className="flex-1 bg-[#FFF0F5] border border-[#FFD6E7] rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#4A1525] focus:outline-none focus:border-[#F06292] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || sending}
                  className="px-4 py-2.5 rounded-2xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs shadow-xs disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            /* Empty State when no conversation is selected on desktop */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FFD6E7] to-[#FFC1D9] flex items-center justify-center text-3xl shadow-xs">
                💬
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-[#4A1525]">
                  Select a Conversation to View
                </h3>
                <p className="text-xs text-[#880E4F]/70 max-w-sm">
                  Browse previous questions, search for topics across all past chats, or continue chatting right here.
                </p>
              </div>

              <Link
                href="/ask"
                className="px-4 py-2.5 rounded-2xl bg-[#F06292] hover:bg-[#E91E63] text-white text-xs font-extrabold shadow-md shadow-[#F06292]/25 transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start New AI Tutor Chat</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm font-semibold text-[#8B4B62]">
          Loading conversation history...
        </div>
      }
    >
      <HistoryInner />
    </Suspense>
  );
}
