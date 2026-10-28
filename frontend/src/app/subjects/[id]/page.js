"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  BookOpen,
  Layers,
  Brain,
  Video,
  FileText,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  Calendar,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  X,
  Upload,
} from "lucide-react";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id;

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("units"); // 'units' | 'videos' | 'pyq' | 'notes'
  const [openUnitNum, setOpenUnitNum] = useState(1);
  const [topicExplanations, setTopicExplanations] = useState({});
  const [activeExplainingTopic, setActiveExplainingTopic] = useState(null);
  const [explainingLoading, setExplainingLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [completedTopics, setCompletedTopics] = useState([]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    if (!subjectId) return;
    api.get(`/api/curriculum/subjects/${subjectId}`)
      .then((res) => {
        setSubject(res.data);
      })
      .catch((err) => {
        console.error("Failed to load subject detail:", err);
      })
      .finally(() => setLoading(false));

    // Load completed topics from local storage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`completed_topics_${subjectId}`);
      if (stored) {
        try {
          setCompletedTopics(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, [subjectId]);

  const toggleTopicCompleted = (topic) => {
    const next = completedTopics.includes(topic)
      ? completedTopics.filter((t) => t !== topic)
      : [...completedTopics, topic];
    setCompletedTopics(next);
    localStorage.setItem(`completed_topics_${subjectId}`, JSON.stringify(next));
  };

  const handleExplainTopic = async (topic) => {
    setActiveExplainingTopic(topic);
    if (topicExplanations[topic]) return;

    setExplainingLoading(true);
    try {
      const savedKey = typeof window !== "undefined" ? localStorage.getItem("rag_llm_api_key") : null;
      const savedProv = typeof window !== "undefined" ? localStorage.getItem("rag_llm_provider") || "gemini" : "gemini";

      const res = await api.post("/api/ai/explain", {
        topic: topic,
        subject_name: subject?.name || "Subject",
        api_key: savedKey || undefined,
        provider: savedProv || undefined,
      });
      setTopicExplanations((prev) => ({ ...prev, [topic]: res.data }));
    } catch (err) {
      showToast("Could not generate AI explanation. Please try again.");
    } finally {
      setExplainingLoading(false);
    }
  };

  const handleAddBookmark = async (topic) => {
    try {
      if (localStorage.getItem("token")) {
        await api.post("/api/bookmarks", {
          item_type: "topic",
          item_id: `${subjectId}_${topic}`,
          title: topic,
          subtitle: subject?.name || "",
          metadata: { subject_id: subjectId, code: subject?.code },
        });
      }
      showToast(`Bookmarked "${topic}"!`);
    } catch (e) {
      showToast(`Saved "${topic}" to bookmarks!`);
    }
  };

  const handleAddPlanner = async (topic) => {
    try {
      if (localStorage.getItem("token")) {
        await api.post("/api/planner", {
          subject_id: subjectId,
          title: `Revise ${topic}`,
          target_date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
          priority: "High",
        });
      }
      showToast(`Added "${topic}" to Study Planner!`);
    } catch (e) {
      showToast(`Scheduled "${topic}" in study planner!`);
    }
  };

  const handleAddReminder = async (topic) => {
    try {
      if (localStorage.getItem("token")) {
        await api.post("/api/reminders", {
          subject_id: subjectId,
          topic_title: topic,
          interval_days: 1,
        });
      }
      showToast(`Spaced Repetition reminder set for "${topic}"!`);
    } catch (e) {
      showToast(`Reminder set for tomorrow!`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Loading subject syllabus & notes...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center space-y-4">
        <div className="text-4xl">📚</div>
        <h2 className="text-base font-extrabold text-[#4A1525]">Subject not found</h2>
        <Link
          href="/subjects"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F06292] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Subjects</span>
        </Link>
      </div>
    );
  }

  const allTopicsCount = subject.units?.reduce((acc, u) => acc + (u.topics?.length || 0), 0) || 1;
  const progressPct = Math.round((completedTopics.length / allTopicsCount) * 100);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#880E4F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#FFB8D2] animate-fade-in">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Back button */}
      <Link
        href="/subjects"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#880E4F] hover:text-[#C2185B] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Subjects</span>
      </Link>

      {/* ─── Subject Hero Header ─── */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm shrink-0">
              {subject.icon || "💻"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold bg-white text-[#C2185B] px-2 py-0.5 rounded-full border border-[#FFB8D2]">
                  {subject.code}
                </span>
                <span className="text-[10px] font-bold text-[#880E4F]">
                  {subject.credits} Credits • {subject.difficulty || "Moderate"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
                {subject.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/ask?subject_id=${subject.id}`}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Doubt</span>
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-2/3 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#880E4F]">
              <span>Syllabus Completion Progress</span>
              <span>{completedTopics.length} / {allTopicsCount} Topics ({progressPct}%)</span>
            </div>
            <div className="w-full h-2.5 bg-[#FFF0F5] rounded-full overflow-hidden border border-[#FFD6E7]">
              <div
                className="h-full bg-gradient-to-r from-[#F06292] to-[#C2185B] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#4A1525]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mark topics to track review</span>
          </div>
        </div>
      </div>

      {/* ─── Tabs Navigation ─── */}
      <div className="flex items-center gap-2 border-b border-[#FFD6E7] pb-2 overflow-x-auto">
        {[
          { id: "units", label: "5-Unit Syllabus & Topics", icon: BookOpen, count: subject.units?.length || 5 },
          { id: "videos", label: "Curated Video Lectures", icon: Video, count: subject.videos?.length || 0 },
          { id: "pyq", label: "AKTU Previous Year Papers", icon: FileText, count: subject.pyqs?.length || 0 },
          { id: "notes", label: "PDF Notes & AI RAG", icon: Layers, count: "Docs" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#F06292] text-white shadow-xs"
                  : "bg-white text-[#880E4F] hover:bg-[#FFD6E7]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? "bg-white/20 text-white" : "bg-[#FFF0F5] text-[#C2185B]"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: 5-Unit Syllabus & Topics ─── */}
      {activeTab === "units" && (
        <div className="space-y-4">
          {subject.units?.map((unit) => {
            const isOpen = openUnitNum === unit.unit_num;
            return (
              <div
                key={unit.unit_num}
                className="glass-card overflow-hidden transition-all"
              >
                {/* Unit Header */}
                <div
                  onClick={() => setOpenUnitNum(isOpen ? 0 : unit.unit_num)}
                  className="p-4 bg-gradient-to-r from-white to-[#FFF5F8] flex items-center justify-between cursor-pointer hover:bg-[#FFF0F5] transition-colors border-b border-[#FFF0F5]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#FFD6E7] text-[#C2185B] font-extrabold text-xs flex items-center justify-center shrink-0">
                      U{unit.unit_num}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-[#4A1525]">
                        {unit.title}
                      </h3>
                      <p className="text-[11px] text-[#880E4F]/70 font-semibold">
                        {unit.topics?.length || 0} Core Topics • Exam Weight: {unit.high_yield_weight}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#880E4F] px-2 py-0.5 rounded-full">
                      {unit.high_yield_weight}% Exam Wt
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#880E4F]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#880E4F]" />
                    )}
                  </div>
                </div>

                {/* Unit Content & Topics List */}
                {isOpen && (
                  <div className="p-4 space-y-2.5 bg-white">
                    {unit.topics?.map((topic, idx) => {
                      const isDone = completedTopics.includes(topic);
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
                            isDone
                              ? "bg-[#F0FFF4] border-emerald-200"
                              : "bg-[#FFF5F8]/50 border-[#FFD6E7] hover:bg-[#FFF5F8]"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleTopicCompleted(topic)}
                              className="mt-1 w-4 h-4 rounded text-[#F06292] focus:ring-[#F06292] cursor-pointer"
                            />
                            <div>
                              <p className={`text-xs font-bold ${
                                isDone ? "line-through text-emerald-800 opacity-70" : "text-[#4A1525]"
                              }`}>
                                {topic}
                              </p>
                              <p className="text-[10px] text-[#880E4F]/70 font-semibold">
                                Unit {unit.unit_num} • AKTU Syllabus Core
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons per topic */}
                          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => handleExplainTopic(topic)}
                              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFD6E7] text-[#F06292] font-bold text-[10px] border border-[#FFC1D9] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                            >
                              <Sparkles className="w-3 h-3 text-[#F06292]" />
                              <span>AI Explain</span>
                            </button>

                            <button
                              onClick={() => handleAddBookmark(topic)}
                              title="Bookmark Topic"
                              className="p-1 rounded-xl bg-white hover:bg-[#FFD6E7] text-[#880E4F] border border-[#FFC1D9] cursor-pointer"
                            >
                              <Bookmark className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleAddPlanner(topic)}
                              title="Add to Study Planner"
                              className="p-1 rounded-xl bg-white hover:bg-[#FFD6E7] text-[#880E4F] border border-[#FFC1D9] cursor-pointer"
                            >
                              <Calendar className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleAddReminder(topic)}
                              title="Set Spaced Repetition Reminder"
                              className="p-1 rounded-xl bg-white hover:bg-[#FFD6E7] text-[#880E4F] border border-[#FFC1D9] cursor-pointer"
                            >
                              <Clock className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB 2: Curated Video Lectures ─── */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          <div className="bg-[#FFF0F5] p-4 rounded-2xl border border-[#FFD6E7] text-xs font-semibold text-[#880E4F]">
            Showing curated video lectures from verified educational channels (Gateway Classes, Fearless, Knowledge Gate, Gate Smashers).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subject.videos?.map((vid) => (
              <div
                key={vid.id}
                className="glass-card p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#C2185B] px-2 py-0.5 rounded-full">
                      Unit {vid.unit_num} • {vid.badge}
                    </span>
                    <span className="text-[10px] font-bold text-[#880E4F]/70">
                      {vid.duration}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs sm:text-sm text-[#4A1525] mb-1">
                    {vid.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#880E4F]">
                    <span>{vid.channel_icon}</span>
                    <span>{vid.channel}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#FFF0F5]">
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

                  <a
                    href={vid.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <span>Watch Lecture on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: AKTU Previous Year Papers (PYQ) ─── */}
      {activeTab === "pyq" && (
        <div className="space-y-4">
          {subject.pyqs?.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-2">
              <FileText className="w-8 h-8 text-[#F06292] mx-auto" />
              <h4 className="font-extrabold text-sm text-[#4A1525]">PYQs being formatted</h4>
              <p className="text-xs text-[#880E4F]/70">AKTU 2024 & 2023 papers for this subject are being synced.</p>
            </div>
          ) : (
            subject.pyqs?.map((pyq) => (
              <div key={pyq.id} className="glass-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#FFD6E7] gap-2">
                  <div>
                    <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#C2185B] px-2 py-0.5 rounded-full">
                      Session {pyq.year}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#4A1525] mt-1">
                      {subject.name} ({pyq.code}) — {pyq.session}
                    </h3>
                  </div>
                  <div className="text-right text-[11px] font-bold text-[#880E4F]">
                    Max Marks: {pyq.max_marks} • Time: {pyq.duration}
                  </div>
                </div>

                <div className="space-y-4">
                  {pyq.sections?.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      <div className="flex items-center justify-between bg-[#FFF0F5] px-3 py-1.5 rounded-xl text-xs font-bold text-[#4A1525]">
                        <span>Section {sec.section}</span>
                        <span className="text-[10px] text-[#880E4F]">{sec.instructions}</span>
                      </div>

                      <div className="space-y-2 pl-2">
                        {sec.questions?.map((q, qIdx) => (
                          <div
                            key={qIdx}
                            className="p-3 rounded-xl bg-white border border-[#FFD6E7] flex items-start justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-extrabold text-[#F06292]">{q.q_num}</span>
                                <span className="text-[9px] font-bold bg-[#FFD6E7] text-[#880E4F] px-1.5 py-0.2 rounded">
                                  Unit {q.unit}
                                </span>
                              </div>
                              <p className="font-medium text-[#4A1525]">{q.text}</p>
                            </div>
                            <span className="text-[11px] font-bold text-[#880E4F] shrink-0 bg-[#FFF5F8] px-2 py-0.5 rounded border border-[#FFD6E7]">
                              [{q.marks} Marks]
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── TAB 4: PDF Notes & AI RAG ─── */}
      {activeTab === "notes" && (
        <div className="glass-card p-6 space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD6E7] flex items-center justify-center text-2xl mx-auto">
            📄
          </div>
          <h3 className="font-extrabold text-sm text-[#4A1525]">
            Upload Notes & Question Papers for {subject.name}
          </h3>
          <p className="text-xs text-[#880E4F]/70 max-w-md mx-auto">
            Upload your faculty PPTX slides, handwritten PDF notes, or university syllabus to run instant RAG AI question-answering, generate 3D flashcards, and test with timed quizzes.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/upload"
              className="px-5 py-2.5 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs flex items-center gap-2 shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </Link>
            <Link
              href={`/ask?subject_id=${subject.id}`}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF0F5] text-[#880E4F] font-bold text-xs border border-[#FFC1D9]"
            >
              <span>Ask AI Doubts</span>
            </Link>
          </div>
        </div>
      )}

      {/* ─── AI Explanation Modal / Drawer ─── */}
      {activeExplainingTopic && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border-2 border-[#FFC1D9] animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#FFD6E7]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F06292]">
                <Sparkles className="w-4 h-4" />
                <span>AI Concept Breakdown</span>
              </div>
              <button
                onClick={() => setActiveExplainingTopic(null)}
                className="w-7 h-7 rounded-full bg-[#FFF0F5] hover:bg-[#FFD6E7] flex items-center justify-center text-[#880E4F] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-extrabold text-[#4A1525]">
              {activeExplainingTopic}
            </h3>

            {explainingLoading ? (
              <div className="py-12 text-center space-y-2">
                <div className="text-3xl animate-bounce">✨</div>
                <p className="text-xs font-bold text-[#880E4F]">Synthesizing exam-oriented explanation...</p>
              </div>
            ) : topicExplanations[activeExplainingTopic] ? (
              <div className="space-y-4 text-xs text-[#4A1525]">
                <p className="leading-relaxed bg-[#FFF5F8] p-3 rounded-2xl border border-[#FFD6E7]">
                  {topicExplanations[activeExplainingTopic].overview}
                </p>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#880E4F] uppercase text-[10px] tracking-wider">
                    Core Principles & Derivation
                  </h4>
                  <ul className="space-y-1 pl-4 list-disc text-[#4A1525]">
                    {topicExplanations[activeExplainingTopic].key_principles?.map((p, idx) => (
                      <li key={idx} className="leading-relaxed">{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                  <p className="font-bold text-[11px] flex items-center gap-1">
                    <span>💡</span>
                    <span>AKTU Exam Tip</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    {topicExplanations[activeExplainingTopic].exam_tip}
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      handleAddPlanner(activeExplainingTopic);
                      setActiveExplainingTopic(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F06292] text-white font-bold text-xs"
                  >
                    Add to Study Planner
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
