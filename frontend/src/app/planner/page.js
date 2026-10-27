"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  AlertCircle,
  RotateCcw,
  Flag,
} from "lucide-react";

export default function StudyPlannerPage() {
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [title, setTitle] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    setTargetDate(new Date().toISOString().split("T")[0]);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const loadData = () => {
    Promise.all([
      api.get("/api/planner").catch(() => ({ data: [] })),
      api.get("/api/reminders").catch(() => ({ data: [] })),
      api.get("/api/curriculum/subjects").catch(() => ({ data: [] })),
    ])
      .then(([planRes, remRes, subRes]) => {
        setTasks(planRes.data || []);
        setReminders(remRes.data || []);
        setSubjects(subRes.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (localStorage.getItem("token")) {
        await api.post("/api/planner", {
          title: title.trim(),
          subject_id: selectedSubject,
          target_date: targetDate,
          priority: priority,
        });
      } else {
        // Guest local storage fallback
        const newTask = {
          id: Date.now(),
          title: title.trim(),
          subject_id: selectedSubject,
          target_date: targetDate,
          priority: priority,
          completed: 0,
        };
        setTasks((prev) => [...prev, newTask]);
      }
      setTitle("");
      showToast("Study task added successfully!");
      loadData();
    } catch (err) {
      showToast("Added task locally!");
    }
  };

  const handleToggleTask = async (task) => {
    const nextCompleted = task.completed ? 0 : 1;
    try {
      if (localStorage.getItem("token")) {
        await api.put(`/api/planner/${task.id}`, { completed: nextCompleted });
      }
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
      );
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (localStorage.getItem("token")) {
        await api.delete(`/api/planner/${taskId}`);
      }
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast("Task removed.");
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const handleToggleReminder = async (remId) => {
    try {
      if (localStorage.getItem("token")) {
        await api.put(`/api/reminders/${remId}/toggle`);
      }
      setReminders((prev) =>
        prev.map((r) =>
          r.id === remId ? { ...r, is_completed: r.is_completed ? 0 : 1 } : r
        )
      );
      showToast("Spaced repetition schedule updated!");
    } catch (err) {}
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Loading study planner...</p>
        </div>
      </div>
    );
  }

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
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Academic Productivity & Schedule</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
          Study Planner & Spaced Repetition Reminders
        </h1>
        <p className="text-xs text-[#880E4F]/80 font-medium max-w-2xl">
          Plan upcoming syllabus topics, schedule target exam preparation milestones, and follow scientific spaced repetition review cycles (1-day, 3-day, 7-day intervals).
        </p>
      </div>

      {/* ─── Task Progress Overview ─── */}
      <div className="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 w-full sm:w-2/3">
          <div className="flex justify-between text-xs font-bold text-[#4A1525]">
            <span>Task Completion Milestone</span>
            <span>{completedCount} of {tasks.length} Done ({progressPct}%)</span>
          </div>
          <div className="w-full h-3 bg-[#FFF0F5] rounded-full overflow-hidden border border-[#FFD6E7]">
            <div
              className="h-full bg-gradient-to-r from-[#F06292] to-[#C2185B] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="text-xs font-extrabold text-[#880E4F] bg-[#FFF5F8] px-3.5 py-2 rounded-2xl border border-[#FFD6E7] shrink-0">
          🔥 Consistency boosts exam retention by 60%
        </div>
      </div>

      {/* ─── Add New Task Form ─── */}
      <form onSubmit={handleAddTask} className="glass-card p-5 space-y-4">
        <h3 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#F06292]" />
          <span>Schedule New Study Milestone</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="e.g. Master Banker's Algorithm numericals..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
            />
          </div>

          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
            >
              <option value="">General Task</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}: {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-1/2 bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-2 py-2.5 text-xs font-bold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>

            <button
              type="submit"
              disabled={!title.trim()}
              className="w-1/2 rounded-2xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* ─── Task List ─── */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F06292]" />
          <span>Scheduled Study Goals ({tasks.length})</span>
        </h3>

        {tasks.length === 0 ? (
          <div className="glass-card p-10 text-center space-y-2">
            <p className="text-xs font-bold text-[#4A1525]">No tasks scheduled yet.</p>
            <p className="text-[11px] text-[#880E4F]/70">Add a milestone above or click "Add to Study Planner" from any subject unit topic.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => {
              const sub = subjects.find((s) => s.id === task.subject_id);
              const priorityColors = {
                High: "bg-rose-100 text-rose-800 border-rose-200",
                Medium: "bg-amber-100 text-amber-800 border-amber-200",
                Low: "bg-emerald-100 text-emerald-800 border-emerald-200",
              };

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    task.completed
                      ? "bg-[#F0FFF4] border-emerald-200 opacity-60"
                      : "bg-white border-[#FFD6E7] hover:border-[#F06292] shadow-2xs"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={Boolean(task.completed)}
                      onChange={() => handleToggleTask(task)}
                      className="w-4 h-4 rounded text-[#F06292] focus:ring-[#F06292] cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${
                        task.completed ? "line-through text-emerald-900" : "text-[#4A1525]"
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#880E4F]/70 font-semibold mt-0.5">
                        {sub && <span>{sub.code} •</span>}
                        <span>Target: {task.target_date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-500 cursor-pointer transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Spaced Repetition Reminders ─── */}
      <div className="space-y-3 pt-4 border-t border-[#FFD6E7]">
        <h3 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#F06292]" />
          <span>Spaced Repetition Review Queue</span>
        </h3>

        {reminders.length === 0 ? (
          <div className="glass-card p-6 text-center text-xs font-bold text-[#880E4F]/70">
            No active revision reminders. Click the clock icon on any topic in the Subjects Explorer to schedule spaced repetitions.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-white border border-[#FFD6E7] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-extrabold text-[#4A1525]">{r.topic_title}</p>
                  <p className="text-[10px] text-[#880E4F]/70 font-semibold">
                    Review Interval: {r.interval_days} days • Next: {r.next_review_date}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleReminder(r.id)}
                  className={`px-3 py-1 rounded-xl font-bold text-[10px] cursor-pointer border transition-all ${
                    r.is_completed
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-[#FFF0F5] text-[#F06292] border-[#FFC1D9] hover:bg-[#FFD6E7]"
                  }`}
                >
                  {r.is_completed ? "✓ Reviewed" : "Mark Reviewed"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
