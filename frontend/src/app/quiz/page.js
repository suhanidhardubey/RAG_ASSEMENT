"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Brain,
  Clock,
  RotateCcw,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Upload,
} from "lucide-react";

export default function QuizPage() {
  const [phase, setPhase] = useState("quiz"); // 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [results, setResults] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [activeDocName, setActiveDocName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const docId = localStorage.getItem("activeDocId") || "";

    Promise.all([
      api.get(`/api/quiz/${docId}`),
      api.get("/api/quiz/history"),
      api.get("/api/documents"),
    ])
      .then(([quizRes, histRes, docsRes]) => {
        setQuestions(quizRes.data.questions || []);
        setScoreHistory(histRes.data.attempts || []);
        const doc = docsRes.data.find((d) => d.id === docId) || docsRes.data[0];
        if (doc) setActiveDocName(doc.filename);
      })
      .catch(() => {
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "quiz" || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, questions]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentQ = questions[currentIdx];
  const progressPct = questions.length > 0 ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;

  const handleSelectOption = (key) => {
    if (!currentQ) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: key });
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const docId = localStorage.getItem("activeDocId") || "";
      const res = await api.post("/api/quiz/submit", {
        doc_id: docId,
        answers: selectedAnswers,
        questions,
        time_taken: 300 - timeLeft,
      });

      setResults(res.data);
      setPhase("result");

      // Reload real score history
      api.get("/api/quiz/history").then((hRes) => {
        setScoreHistory(hRes.data.attempts || []);
      });
    } catch {
      // Local fallback calculation if backend issue
      let correct = 0;
      const review = questions.map((q) => {
        const uAns = selectedAnswers[q.id] || "";
        const isCor = (uAns === q.correct);
        if (isCor) correct++;
        return {
          question: q.question,
          user_answer: uAns,
          user_option_text: q.options[uAns] || "None",
          correct_answer: q.correct,
          correct_option_text: q.options[q.correct],
          is_correct: isCor,
          explanation: q.explanation,
        };
      });
      const tot = questions.length || 1;
      setResults({
        score: Math.round((correct / tot) * 100),
        correct,
        wrong: tot - correct,
        total: tot,
        xp_earned: correct * 15,
        time_taken: 300 - timeLeft,
        review,
      });
      setPhase("result");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextOrSubmit = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Generating adaptive quiz from document...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FFD6E7] text-[#F06292] flex items-center justify-center text-3xl mx-auto">
          ✍️
        </div>
        <h2 className="text-lg font-extrabold text-[#4A1525]">
          No Quiz Questions Available
        </h2>
        <p className="text-xs text-[#880E4F]/70">
          Upload a study document to automatically generate a 10-question MCQ test with realistic distractors.
        </p>
        <Link href="/upload" className="btn-primary text-xs py-3 px-6 inline-flex">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </Link>
      </div>
    );
  }

  // ─── SCREEN 8: QUIZ IN PROGRESS ───
  if (phase === "quiz") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="bg-[#FFD6E7] p-4 rounded-3xl border-2 border-white shadow-xs flex items-center justify-between">
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-full bg-white text-[#F06292] flex items-center justify-center shadow-xs font-bold"
          >
            ←
          </Link>

          <div className="text-center">
            <h2 className="font-extrabold text-xs text-[#4A1525]">
              Question {currentIdx + 1} of {questions.length}
            </h2>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white text-[#F06292] font-mono text-xs font-bold shadow-2xs mt-0.5 border border-[#FFC1D9]">
              ⏱️ <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          <span className="text-[10px] font-bold text-[#880E4F]/70 truncate max-w-[100px]">
            {activeDocName}
          </span>
        </div>

        {/* Top Progress Bar */}
        <div className="w-full h-2 bg-[#FFD6E7] rounded-full overflow-hidden border border-[#FFC1D9]">
          <div
            className="h-full bg-[#F06292] transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#F06292] bg-[#FFF0F5] px-2.5 py-0.5 rounded-md border border-[#FFC1D9]">
              Document MCQ
            </span>
            <span className="text-[10px] text-gray-400 font-bold">
              {currentQ.points || "+4 Points"}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-extrabold text-[#4A1525] leading-relaxed whitespace-pre-line">
            {currentQ.question}
          </h3>
        </div>

        {/* 4 Option Buttons */}
        <div className="space-y-2.5">
          {Object.entries(currentQ.options).map(([key, val]) => {
            const isSelected = selectedAnswers[currentQ.id] === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectOption(key)}
                className={`quiz-opt-btn ${isSelected ? "selected" : ""}`}
              >
                <span
                  className={`w-6 h-6 rounded-full font-bold text-[11px] flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-white text-[#F06292]"
                      : "bg-[#FFF0F5] text-[#880E4F] border border-[#FFD6E7]"
                  }`}
                >
                  {key}
                </span>
                <span className="text-xs sm:text-sm">{val}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Next / Submit Action */}
        <div className="pt-2">
          <button
            onClick={handleNextOrSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs shadow-md shadow-[#F06292]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>
              {currentIdx < questions.length - 1
                ? `Next Question (${currentIdx + 2} / ${questions.length})`
                : submitting
                ? "Submitting & Calculating Score..."
                : "Submit Quiz & View Results"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ─── SCREEN 9: REAL QUIZ RESULTS VIEW ───
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#FFD6E7] p-4 rounded-3xl border-2 border-white shadow-xs flex items-center justify-between">
        <Link
          href="/dashboard"
          className="w-8 h-8 rounded-full bg-white text-[#F06292] flex items-center justify-center shadow-xs font-bold"
        >
          ←
        </Link>
        <h2 className="font-extrabold text-sm text-[#4A1525]">Quiz Results</h2>
        <div className="w-8" />
      </div>

      {/* Big Circular Score Meter */}
      <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-3">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#FFD6E7"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#F06292"
              strokeWidth="9"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * (results?.score || 0)) / 100}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-[#4A1525]">
              {results?.score || 0}%
            </span>
            <span className="text-[10px] text-[#880E4F] font-extrabold">
              {results?.correct || 0} / {results?.total || questions.length} Score
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F5] border border-[#FFC1D9] text-xs font-extrabold text-[#F06292]">
          {results?.score >= 80 ? "🎉 Outstanding Mastery!" : results?.score >= 60 ? "👍 Good Passing Score!" : "💪 Keep Practicing!"}
        </div>
        <p className="text-xs text-[#880E4F]/70 font-semibold">
          Earned <b className="text-[#F06292]">+{results?.xp_earned || 0} XP</b> recorded to your student profile!
        </p>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-white p-3 rounded-2xl border border-[#FFD6E7] shadow-2xs">
          <span className="text-sm">✅</span>
          <p className="font-extrabold text-base text-emerald-600">
            {results?.correct || 0}
          </p>
          <p className="text-[10px] text-gray-400 font-bold">Correct</p>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#FFD6E7] shadow-2xs">
          <span className="text-sm">❌</span>
          <p className="font-extrabold text-base text-rose-500">
            {results?.wrong || 0}
          </p>
          <p className="text-[10px] text-gray-400 font-bold">Wrong</p>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#FFD6E7] shadow-2xs">
          <span className="text-sm">⏱️</span>
          <p className="font-extrabold text-base text-[#4A1525]">
            {Math.floor((results?.time_taken || 0) / 60)}m {(results?.time_taken || 0) % 60}s
          </p>
          <p className="text-[10px] text-gray-400 font-bold">Time Taken</p>
        </div>
      </div>

      {/* Real Score Progression Bar Chart (From SQLite history) */}
      <div className="glass-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-xs text-[#4A1525]">
            Your Score Progression History
          </h4>
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {scoreHistory.length} Total Test{scoreHistory.length === 1 ? "" : "s"}
          </span>
        </div>

        {scoreHistory.length > 0 ? (
          <div className="flex items-end justify-between h-20 pt-4 px-4 overflow-x-auto gap-2">
            {scoreHistory.slice(-6).map((att, i) => (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[40px]">
                <span className="text-[10px] font-bold text-[#F06292]">
                  {att.score}%
                </span>
                <div
                  className="w-8 bg-[#F06292] rounded-t-md transition-all shadow-xs"
                  style={{ height: `${Math.max(15, att.score * 0.6)}px` }}
                />
                <span className="text-[9px] text-gray-400 font-semibold truncate max-w-[50px]">
                  #{att.id || i + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-3 text-center">First test completed!</p>
        )}
      </div>

      {/* Review Missed Questions */}
      {results?.review && results.review.filter((r) => !r.is_correct).length > 0 && (
        <div className="glass-card p-4 space-y-3">
          <h4 className="font-extrabold text-xs text-[#4A1525] flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Review Missed Questions ({results.review.filter((r) => !r.is_correct).length})
          </h4>

          <div className="space-y-2.5">
            {results.review
              .filter((r) => !r.is_correct)
              .map((r, i) => (
                <div key={i} className="p-3 bg-[#FFF0F5] rounded-2xl border border-[#FFC1D9] text-xs space-y-1">
                  <p className="font-extrabold text-[#4A1525] text-xs">
                    {r.question}
                  </p>
                  <p className="text-[11px] text-rose-500 font-bold">
                    Your Answer: {r.user_answer ? `${r.user_answer}: ${r.user_option_text}` : "No answer selected"}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold">
                    Correct Answer: {r.correct_answer}: {r.correct_option_text}
                  </p>
                  <p className="text-[10px] text-[#880E4F]/70 pt-0.5">
                    Context: {r.explanation}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Action Buttons: Retry Quiz, View Ranking */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => {
            setPhase("quiz");
            setCurrentIdx(0);
            setSelectedAnswers({});
            setTimeLeft(300);
          }}
          className="btn-secondary text-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>

        <Link
          href="/leaderboard"
          className="btn-primary text-xs"
        >
          <Trophy className="w-4 h-4" />
          <span>Check Leaderboard</span>
        </Link>
      </div>
    </div>
  );
}
