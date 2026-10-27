"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Gamepad2,
  Swords,
  Layers,
  Bug,
  Flame,
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  Zap,
  ArrowRight,
  ShieldAlert,
  Award,
} from "lucide-react";

export default function GamingZonePage() {
  const [activeGame, setActiveGame] = useState("hub"); // 'hub' | 'battle' | 'memory' | 'bug' | 'daily'
  const [gameHistory, setGameHistory] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [user, setUser] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      api.get("/api/user/me").then((res) => setUser(res.data)).catch(() => {});
      api.get("/api/games/history").then((res) => setGameHistory(res.data || [])).catch(() => {});
    }
  }, []);

  const saveScore = async (gameType, score, stars, xp) => {
    try {
      if (localStorage.getItem("token")) {
        await api.post("/api/games/score", {
          game_type: gameType,
          score: score,
          stars: stars,
          xp_earned: xp,
          time_seconds: 30,
        });
        api.get("/api/games/history").then((res) => setGameHistory(res.data || [])).catch(() => {});
      }
      showToast(`+${xp} XP points saved to your student profile!`);
    } catch (e) {
      showToast(`+${xp} XP earned in practice mode!`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#880E4F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#FFB8D2] animate-fade-in">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Interactive Educational Arena</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
            Engineering Gaming Zone
          </h1>
          <p className="text-xs text-[#880E4F]/80 font-medium">
            Reinforce core CS concepts, debug algorithms, and challenge AI in real interactive games to earn XP points.
          </p>
        </div>

        {activeGame !== "hub" && (
          <button
            onClick={() => setActiveGame("hub")}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#FFF0F5] text-[#880E4F] font-extrabold text-xs border border-[#FFB8D2] shadow-xs cursor-pointer transition-all shrink-0"
          >
            ← Back to All Games
          </button>
        )}
      </div>

      {/* ─── GAME HUB (Selection Screen) ─── */}
      {activeGame === "hub" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Game 1: Quiz Battle */}
            <div
              onClick={() => setActiveGame("battle")}
              className="glass-card p-6 rounded-3xl border border-[#FFD6E7] hover:border-[#F06292] cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F06292] to-[#FFD6E7] text-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
                  ⚔️
                </div>
                <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#C2185B] px-2.5 py-0.5 rounded-full">
                  1v1 Battle
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#4A1525] group-hover:text-[#C2185B] transition-colors mb-1">
                  Quiz Battle vs AI Bot
                </h3>
                <p className="text-xs text-[#880E4F]/70 leading-relaxed font-medium">
                  Challenge the CyberBot in a rapid-fire technical shootout. Deal 25 damage per correct answer to deplete its 100 HP!
                </p>
              </div>
              <div className="pt-2 border-t border-[#FFF0F5] flex items-center justify-between text-xs font-bold text-[#F06292]">
                <span>+30 XP Reward</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Play Now →
                </span>
              </div>
            </div>

            {/* Game 2: Memory Match */}
            <div
              onClick={() => setActiveGame("memory")}
              className="glass-card p-6 rounded-3xl border border-[#FFD6E7] hover:border-[#F06292] cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#880E4F] to-[#FFC1D9] text-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
                  🎴
                </div>
                <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#880E4F] px-2.5 py-0.5 rounded-full">
                  Memory Flip
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#4A1525] group-hover:text-[#C2185B] transition-colors mb-1">
                  Concept Memory Match
                </h3>
                <p className="text-xs text-[#880E4F]/70 leading-relaxed font-medium">
                  Flip tiles on a 3D grid and match Operating System & Automata keywords to their definitions in minimum moves.
                </p>
              </div>
              <div className="pt-2 border-t border-[#FFF0F5] flex items-center justify-between text-xs font-bold text-[#F06292]">
                <span>+25 XP Reward</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Play Now →
                </span>
              </div>
            </div>

            {/* Game 3: Find the Bug */}
            <div
              onClick={() => setActiveGame("bug")}
              className="glass-card p-6 rounded-3xl border border-[#FFD6E7] hover:border-[#F06292] cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C2185B] to-[#FFD6E7] text-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
                  🐛
                </div>
                <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#C2185B] px-2.5 py-0.5 rounded-full">
                  Code Inspector
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#4A1525] group-hover:text-[#C2185B] transition-colors mb-1">
                  Find the Bug Challenge
                </h3>
                <p className="text-xs text-[#880E4F]/70 leading-relaxed font-medium">
                  Inspect real snippets in C and Python. Spot off-by-one errors, synchronization race conditions, and null pointers!
                </p>
              </div>
              <div className="pt-2 border-t border-[#FFF0F5] flex items-center justify-between text-xs font-bold text-[#F06292]">
                <span>+20 XP Reward</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Play Now →
                </span>
              </div>
            </div>

            {/* Game 4: Daily Challenge */}
            <div
              onClick={() => setActiveGame("daily")}
              className="glass-card p-6 rounded-3xl border border-[#FFD6E7] hover:border-[#F06292] cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#FFD6E7] text-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
                  🌟
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Daily Bonus
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#4A1525] group-hover:text-[#C2185B] transition-colors mb-1">
                  Daily Streak Challenge
                </h3>
                <p className="text-xs text-[#880E4F]/70 leading-relaxed font-medium">
                  Answer today's 3 high-yield university exam questions to keep your streak hot and earn bonus XP.
                </p>
              </div>
              <div className="pt-2 border-t border-[#FFF0F5] flex items-center justify-between text-xs font-bold text-amber-700">
                <span>+60 XP Bonus</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Play Now →
                </span>
              </div>
            </div>
          </div>

          {/* ─── Recent Game History & Badges ─── */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>My Recent Game Achievements & XP History</span>
            </h3>

            {gameHistory.length === 0 ? (
              <p className="text-xs text-[#880E4F]/70 font-semibold py-4 text-center">
                No games played yet. Pick a challenge above to start earning XP and trophies!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {gameHistory.map((g) => (
                  <div
                    key={g.id}
                    className="p-3.5 rounded-2xl bg-[#FFF5F8] border border-[#FFD6E7] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-extrabold text-[#4A1525] capitalize">
                        {g.game_type?.replace("_", " ")}
                      </p>
                      <p className="text-[10px] text-[#880E4F]/70 font-semibold">
                        Score: {g.score} pts
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold bg-[#FFD6E7] text-[#C2185B] px-2 py-0.5 rounded-full block">
                        +{g.xp_earned} XP
                      </span>
                      <div className="flex justify-end gap-0.5 mt-1">
                        {[...Array(g.stars || 1)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MINI GAME 1: QUIZ BATTLE VS AI ─── */}
      {activeGame === "battle" && (
        <QuizBattleGame onFinish={(score, xp) => saveScore("quiz_battle", score, 3, xp)} />
      )}

      {/* ─── MINI GAME 2: MEMORY MATCH ─── */}
      {activeGame === "memory" && (
        <MemoryMatchGame onFinish={(score, stars, xp) => saveScore("memory_match", score, stars, xp)} />
      )}

      {/* ─── MINI GAME 3: FIND THE BUG ─── */}
      {activeGame === "bug" && (
        <FindTheBugGame onFinish={(score, xp) => saveScore("find_the_bug", score, 3, xp)} />
      )}

      {/* ─── MINI GAME 4: DAILY CHALLENGE ─── */}
      {activeGame === "daily" && (
        <DailyChallengeGame onFinish={(score, xp) => saveScore("daily_challenge", score, 3, xp)} />
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════
// COMPONENT: QUIZ BATTLE VS AI
// ═══════════════════════════════════════════════════════════════════════
function QuizBattleGame({ onFinish }) {
  const [playerHp, setPlayerHp] = useState(100);
  const [botHp, setBotHp] = useState(100);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [combatLog, setCombatLog] = useState("Battle started! Choose the right answer to attack CyberBot.");

  const questions = [
    {
      q: "In Deadlock Avoidance, which algorithm is used to determine safety state for multiple resource instances?",
      opts: ["Round Robin", "Peterson's Algorithm", "Banker's Algorithm", "Bakery Algorithm"],
      correct: 2,
    },
    {
      q: "What is the condition where high paging activity causes the CPU utilization to drop sharply?",
      opts: ["Belady's Anomaly", "Thrashing", "Starvation", "Context Switching"],
      correct: 1,
    },
    {
      q: "In AKTU TAFL, what automaton model accepts Context-Free Languages (CFL)?",
      opts: ["Deterministic Finite Automata", "Turing Machine", "Linear Bounded Automata", "Pushdown Automata (PDA)"],
      correct: 3,
    },
    {
      q: "Which disk scheduling algorithm services requests in order of minimum seek time from current position?",
      opts: ["SSTF", "FCFS", "C-SCAN", "LOOK"],
      correct: 0,
    },
  ];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === questions[currentIdx].correct;
    if (isCorrect) {
      setBotHp((prev) => Math.max(0, prev - 25));
      setCombatLog("💥 Critical hit! You dealt 25 damage to CyberBot!");
    } else {
      setPlayerHp((prev) => Math.max(0, prev - 25));
      setCombatLog("🛡️ CyberBot counterattacked! You took 25 damage!");
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length && playerHp > 0 && botHp > 0) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      // Finished
      const won = botHp <= 25 || playerHp > botHp;
      onFinish(won ? 100 : 50, won ? 35 : 15);
    }
  };

  const isGameOver = playerHp <= 0 || botHp <= 0 || (isAnswered && currentIdx === questions.length - 1);

  return (
    <div className="glass-card p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#FFD6E7]">
        <h2 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
          <span>⚔️</span>
          <span>Quiz Battle Arena (Question {currentIdx + 1}/{questions.length})</span>
        </h2>
        <span className="text-xs font-bold text-[#F06292] bg-[#FFF0F5] px-2.5 py-0.5 rounded-full border border-[#FFD6E7]">
          Round 1
        </span>
      </div>

      {/* HP Bars */}
      <div className="grid grid-cols-2 gap-4">
        {/* Player HP */}
        <div className="bg-[#FFF5F8] p-3.5 rounded-2xl border border-[#FFD6E7] space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-[#4A1525]">
            <span>🧑 Student (You)</span>
            <span>{playerHp} / 100 HP</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#FFD6E7]">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${playerHp}%` }}
            />
          </div>
        </div>

        {/* Bot HP */}
        <div className="bg-[#FFF5F8] p-3.5 rounded-2xl border border-[#FFD6E7] space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-[#4A1525]">
            <span>🤖 CyberBot AI</span>
            <span>{botHp} / 100 HP</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#FFD6E7]">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${botHp}%` }}
            />
          </div>
        </div>
      </div>

      {/* Combat Log */}
      <div className="p-2.5 bg-white rounded-xl text-center text-xs font-bold text-[#880E4F] border border-[#FFB8D2]">
        {combatLog}
      </div>

      {!isGameOver ? (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-[#FFD6E7]">
            <p className="font-extrabold text-sm text-[#4A1525] leading-relaxed">
              {questions[currentIdx].q}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {questions[currentIdx].opts.map((opt, i) => {
              let btnClass = "bg-white hover:bg-[#FFF0F5] border-[#FFD6E7] text-[#4A1525]";
              if (isAnswered) {
                if (i === questions[currentIdx].correct) {
                  btnClass = "bg-emerald-100 border-emerald-400 text-emerald-900 font-extrabold";
                } else if (i === selectedOpt) {
                  btnClass = "bg-rose-100 border-rose-400 text-rose-900 font-extrabold";
                } else {
                  btnClass = "bg-white border-gray-200 text-gray-400 opacity-50";
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelect(i)}
                  className={`p-3 rounded-2xl border text-xs text-left font-bold transition-all cursor-pointer ${btnClass}`}
                >
                  <span className="font-mono text-[#F06292] mr-2">[{String.fromCharCode(65 + i)}]</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={nextQuestion}
                className="px-6 py-2 rounded-xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
              >
                Next Round →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center space-y-4 bg-white rounded-3xl border border-[#FFD6E7]">
          <div className="text-5xl">{playerHp > botHp ? "👑" : "🤖"}</div>
          <h3 className="text-lg font-extrabold text-[#4A1525]">
            {playerHp > botHp ? "Victory! You defeated CyberBot!" : "Battle Ended! Practice again to defeat CyberBot."}
          </h3>
          <p className="text-xs text-[#880E4F]/70 font-semibold">
            {playerHp > botHp ? "Earned +35 XP points!" : "Earned +15 practice XP!"}
          </p>
          <button
            onClick={() => {
              setPlayerHp(100);
              setBotHp(100);
              setCurrentIdx(0);
              setSelectedOpt(null);
              setIsAnswered(false);
              setCombatLog("Rematch started!");
            }}
            className="px-5 py-2.5 rounded-xl bg-[#F06292] text-white font-bold text-xs"
          >
            Play Rematch
          </button>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════
// COMPONENT: MEMORY MATCH GAME
// ═══════════════════════════════════════════════════════════════════════
function MemoryMatchGame({ onFinish }) {
  const pairs = [
    { id: 1, term: "Semaphore", def: "Integer variable for process synchronization" },
    { id: 2, term: "Deadlock", def: "Processes permanently blocked waiting for resources" },
    { id: 3, term: "Paging", def: "Fixed-size memory frames avoiding external fragmentation" },
    { id: 4, term: "DFA", def: "Automaton with exactly one transition per input symbol" },
    { id: 5, term: "Thrashing", def: "Excessive swapping causing sharp CPU performance drop" },
    { id: 6, term: "Banker's Algorithm", def: "Resource allocation algorithm ensuring safety state" },
  ];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Generate card deck
    const deck = [];
    pairs.forEach((p) => {
      deck.push({ uid: `${p.id}_term`, pairId: p.id, text: p.term, type: "term" });
      deck.push({ uid: `${p.id}_def`, pairId: p.id, text: p.def, type: "def" });
    });
    setCards(deck.sort(() => Math.random() - 0.5));
  }, []);

  const handleCardClick = (card) => {
    if (flipped.length === 2 || flipped.some((c) => c.uid === card.uid) || matched.includes(card.pairId)) {
      return;
    }

    const nextFlipped = [...flipped, card];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      if (nextFlipped[0].pairId === nextFlipped[1].pairId && nextFlipped[0].type !== nextFlipped[1].type) {
        // Matched!
        const nextMatched = [...matched, nextFlipped[0].pairId];
        setMatched(nextMatched);
        setFlipped([]);
        if (nextMatched.length === pairs.length) {
          onFinish(100, moves <= 8 ? 3 : 2, 25);
        }
      } else {
        // Mismatch, flip back after short pause
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#FFD6E7]">
        <h2 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
          <span>🎴</span>
          <span>Concept Memory Match (Matches: {matched.length}/{pairs.length})</span>
        </h2>
        <span className="text-xs font-bold text-[#880E4F]">
          Moves: {moves}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => {
          const isFlipped = flipped.some((f) => f.uid === c.uid);
          const isMatched = matched.includes(c.pairId);

          return (
            <div
              key={c.uid}
              onClick={() => handleCardClick(c)}
              className={`h-24 p-2.5 rounded-2xl border-2 flex items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                isMatched
                  ? "bg-[#F0FFF4] border-emerald-400 text-emerald-900 opacity-60 scale-95"
                  : isFlipped
                  ? "bg-white border-[#F06292] shadow-sm font-bold text-[#4A1525]"
                  : "bg-gradient-to-tr from-[#FFD6E7] to-[#FFC1D9] border-white text-[#880E4F] hover:scale-[1.02]"
              }`}
            >
              {isFlipped || isMatched ? (
                <span className="text-[11px] leading-tight font-extrabold">
                  {c.text}
                </span>
              ) : (
                <span className="text-xl">🌸</span>
              )}
            </div>
          );
        })}
      </div>

      {matched.length === pairs.length && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
          <p className="font-extrabold text-xs text-emerald-900">
            🎉 Awesome! All concepts matched in {moves} moves!
          </p>
          <p className="text-[11px] text-emerald-700 font-bold">+25 XP awarded</p>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════
// COMPONENT: FIND THE BUG GAME
// ═══════════════════════════════════════════════════════════════════════
function FindTheBugGame({ onFinish }) {
  const [currentBugIdx, setCurrentBugIdx] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const puzzles = [
    {
      title: "C Semaphore Wait / P() Operation",
      lines: [
        "1: void wait(Semaphore *S) {",
        "2:     while (S->value <= 0); // busy wait",
        "3:     S->value++; // increment count",
        "4: }",
      ],
      buggyLine: 3,
      fix: "Line 3 is wrong: wait() must DECREMENT the semaphore value (S->value--), not increment it! Incrementing is done by signal().",
    },
    {
      title: "Binary Search Off-by-One",
      lines: [
        "1: int binarySearch(int arr[], int n, int target) {",
        "2:     int low = 0, high = n; // bounds",
        "3:     while (low <= high) {",
        "4:         int mid = low + (high - low) / 2;",
        "5:         if (arr[mid] == target) return mid;",
        "6:         else if (arr[mid] < target) low = mid + 1;",
        "7:         else high = mid - 1;",
        "8:     }",
        "9:     return -1;",
        "10: }",
      ],
      buggyLine: 2,
      fix: "Line 2 is buggy: high should be initialized to `n - 1`, not `n`. Using `high = n` can cause an out-of-bounds array access at `arr[n]`.",
    },
  ];

  const handleLineClick = (lineNum) => {
    if (revealed) return;
    setSelectedLine(lineNum);
    setRevealed(true);
    if (lineNum === puzzles[currentBugIdx].buggyLine) {
      onFinish(100, 20);
    }
  };

  const puzzle = puzzles[currentBugIdx];

  return (
    <div className="glass-card p-6 rounded-3xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#FFD6E7]">
        <h2 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
          <span>🐛</span>
          <span>Find the Bug: {puzzle.title}</span>
        </h2>
        <span className="text-[11px] font-bold text-[#880E4F]">
          Puzzle {currentBugIdx + 1}/{puzzles.length}
        </span>
      </div>

      <p className="text-xs text-[#880E4F] font-semibold">
        Click on the exact line of code containing the logical or syntax defect:
      </p>

      {/* Code viewer */}
      <div className="bg-[#2D1520] p-4 rounded-2xl font-mono text-xs text-pink-100 space-y-1 overflow-x-auto shadow-inner">
        {puzzle.lines.map((l, i) => {
          const lineNum = i + 1;
          const isSelected = selectedLine === lineNum;
          const isBug = lineNum === puzzle.buggyLine;

          let lineBg = "hover:bg-white/10";
          if (revealed) {
            if (isBug) lineBg = "bg-rose-500/40 text-rose-200 font-bold border-l-4 border-rose-500 pl-1";
            else if (isSelected) lineBg = "bg-white/20";
          }

          return (
            <div
              key={i}
              onClick={() => handleLineClick(lineNum)}
              className={`p-1 rounded cursor-pointer transition-colors ${lineBg}`}
            >
              {l}
            </div>
          );
        })}
      </div>

      {revealed && (
        <div className="p-4 bg-white rounded-2xl border border-[#FFD6E7] space-y-2">
          <p className="font-bold text-xs text-[#4A1525]">
            {selectedLine === puzzle.buggyLine ? "✅ Correct! You found the bug:" : "❌ Not quite! The bug was on Line " + puzzle.buggyLine + ":"}
          </p>
          <p className="text-xs text-[#880E4F] leading-relaxed bg-[#FFF5F8] p-2.5 rounded-xl border border-[#FFD6E7]">
            {puzzle.fix}
          </p>
          {currentBugIdx + 1 < puzzles.length && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setCurrentBugIdx((prev) => prev + 1);
                  setSelectedLine(null);
                  setRevealed(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-[#F06292] text-white font-bold text-xs"
              >
                Next Puzzle →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════
// COMPONENT: DAILY CHALLENGE GAME
// ═══════════════════════════════════════════════════════════════════════
function DailyChallengeGame({ onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/games/daily")
      .then((res) => setQuestions(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (qId, optKey) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optKey }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correctCount += 1;
    });
    const xpGained = correctCount * 20;
    onFinish(correctCount * 33, xpGained);
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-[#880E4F]">Loading daily challenge...</div>;
  }

  return (
    <div className="glass-card p-6 rounded-3xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#FFD6E7]">
        <h2 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
          <span>🌟</span>
          <span>Today's AKTU Daily Challenge (3 Questions)</span>
        </h2>
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          +60 Max XP
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          return (
            <div key={q.id} className="p-4 bg-white rounded-2xl border border-[#FFD6E7] space-y-2.5">
              <p className="text-xs font-extrabold text-[#4A1525]">
                {idx + 1}. {q.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(q.options).map(([key, val]) => {
                  const isChosen = answers[q.id] === key;
                  const isCorrect = key === q.correct;

                  let optClass = "bg-[#FFF5F8] border-[#FFD6E7] text-[#4A1525]";
                  if (isChosen) optClass = "bg-[#FFD6E7] border-[#F06292] font-bold";
                  if (submitted) {
                    if (isCorrect) optClass = "bg-emerald-100 border-emerald-400 text-emerald-900 font-extrabold";
                    else if (isChosen) optClass = "bg-rose-100 border-rose-400 text-rose-900";
                  }

                  return (
                    <button
                      key={key}
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, key)}
                      className={`p-2.5 rounded-xl border text-xs text-left font-semibold cursor-pointer transition-all ${optClass}`}
                    >
                      <span className="font-mono text-[#F06292] mr-1.5 font-bold">[{key}]</span>
                      {val}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <p className="text-[11px] text-[#880E4F] bg-[#FFF0F5] p-2 rounded-xl border border-[#FFD6E7]">
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            className="px-6 py-2.5 rounded-2xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs shadow-md disabled:opacity-50 transition-all cursor-pointer"
          >
            Submit Daily Challenge
          </button>
        </div>
      ) : (
        <div className="p-4 bg-[#FFF5F8] border border-[#FFD6E7] rounded-2xl text-center space-y-1">
          <p className="font-extrabold text-xs text-[#4A1525]">Challenge Complete!</p>
          <p className="text-[11px] text-[#880E4F]">XP rewards recorded in your profile.</p>
        </div>
      )}
    </div>
  );
}
