"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  User,
  Award,
  Flame,
  Zap,
  Target,
  Clock,
  Layers,
  Brain,
  School,
  Edit3,
  Check,
  LogOut,
  LogIn,
  UserPlus,
  RefreshCw,
  Trophy,
  History,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Forms
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [regForm, setRegForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    group_name: "",
  });
  const [editForm, setEditForm] = useState({});

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const loadProfile = () => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get("/api/user/me")
      .then((res) => {
        setUser(res.data);
        setEditForm(res.data);
      })
      .catch(() => {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", loginForm);
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_id", res.data.user.id.toString());
      }
      setUser(res.data.user);
      setEditForm(res.data.user);
      showToast(`Welcome back, ${res.data.user.name}!`);
      loadProfile();
    } catch (err) {
      showToast(err.response?.data?.detail || "Login failed. Check credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/register", regForm);
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_id", res.data.user.id.toString());
      }
      setUser(res.data.user);
      setEditForm(res.data.user);
      showToast("Account created successfully! +50 XP Welcome Bonus 🎉");
      loadProfile();
    } catch (err) {
      showToast(err.response?.data?.detail || "Registration failed. Username/email might be taken.");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/api/user/me", editForm);
      setUser(res.data);
      setIsEditing(false);
      showToast("Profile details saved!");
      loadProfile();
    } catch {
      showToast("Error updating profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setUser(null);
    showToast("Logged out successfully.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ─── AUTH SCREEN (If not logged in) ───
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 space-y-6">
        {toastMsg && (
          <div className="fixed top-6 right-6 bg-[#4A1525] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 animate-bounce">
            {toastMsg}
          </div>
        )}

        {/* Brand Hero Card */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FFC1D9] to-[#FFD6E7] flex items-center justify-center text-3xl mx-auto shadow-sm border-2 border-white">
            🌸
          </div>
          <h1 className="text-xl font-extrabold text-[#4A1525]">
            Student Account Access
          </h1>
          <p className="text-xs text-[#880E4F]/70 font-semibold">
            Sign in to track real study XP, test scores, flashcard mastery & ranking
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex items-center bg-[#FFD6E7] p-1.5 rounded-2xl border border-[#FFC1D9]">
          <button
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              authMode === "login"
                ? "bg-white text-[#F06292] shadow-sm"
                : "text-[#880E4F] hover:text-[#F06292]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode("register")}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              authMode === "register"
                ? "bg-white text-[#F06292] shadow-sm"
                : "text-[#880E4F] hover:text-[#F06292]"
            }`}
          >
            Register Student
          </button>
        </div>

        {/* Sign In Form */}
        {authMode === "login" ? (
          <form onSubmit={handleLogin} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#880E4F] mb-1">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={loginForm.identifier}
                onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                placeholder="e.g. student or your@email.com"
                className="w-full p-3 rounded-2xl border border-[#FFB8D2] bg-white text-xs font-medium text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#880E4F] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
                className="w-full p-3 rounded-2xl border border-[#FFB8D2] bg-white text-xs font-medium text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>

            <button type="submit" className="w-full btn-primary text-xs py-3.5 mt-2">
              <LogIn className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="glass-card p-6 space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#880E4F] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-xs font-medium text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#880E4F] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                  placeholder="johndoe"
                  className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-xs font-medium text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#880E4F] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="john@study.local"
                  className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-xs font-medium text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#880E4F] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                placeholder="Create password"
                className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-xs font-medium text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#880E4F] mb-1">
                College / University
              </label>
              <input
                type="text"
                value={regForm.college}
                onChange={(e) => setRegForm({ ...regForm, college: e.target.value })}
                placeholder="College Name"
                className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-xs font-medium text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#880E4F] mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={regForm.branch}
                  onChange={(e) => setRegForm({ ...regForm, branch: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-xs font-medium text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#880E4F] mb-1">
                  Group / Section
                </label>
                <input
                  type="text"
                  value={regForm.group_name}
                  onChange={(e) => setRegForm({ ...regForm, group_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-xs font-medium text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary text-xs py-3.5 mt-2">
              <UserPlus className="w-4 h-4" />
              <span>Create Account (+50 XP Bonus)</span>
            </button>
          </form>
        )}
      </div>
    );
  }

  // ─── ACTIVE STUDENT PROFILE VIEW ───
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#4A1525] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Hero Profile Banner */}
      <div className="bg-gradient-to-r from-[#FFD6E7] via-[#FFC1D9] to-[#FFD6E7] p-6 rounded-3xl border-2 border-white shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F06292] text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs">
              #{user.rank}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-extrabold text-[#4A1525]">
                {user.name}
              </h1>
              <span className="bg-[#F06292] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {user.group_name || "Group 1"}
              </span>
              <span className="bg-white text-[#880E4F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FFC1D9]">
                @{user.username}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#880E4F]">
              {user.branch} • {user.college}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs font-extrabold">
              <span className="bg-white px-3 py-1 rounded-full text-[#F06292] shadow-2xs flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {user.xp?.toLocaleString()} Total XP
              </span>
              <span className="bg-white px-3 py-1 rounded-full text-orange-600 shadow-2xs flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {user.streak} Day Streak
              </span>
              <span className="bg-white px-3 py-1 rounded-full text-[#880E4F] shadow-2xs">
                Level {user.level} Scholar
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="py-2 px-3 rounded-2xl bg-white border border-[#FFC1D9] text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-1 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="glass-card p-5 space-y-4">
          <h3 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#F06292]" />
            Edit Profile Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-[#880E4F] block mb-1">Full Name</label>
              <input
                type="text"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>
            <div>
              <label className="font-bold text-[#880E4F] block mb-1">College / University</label>
              <input
                type="text"
                value={editForm.college || ""}
                onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>
            <div>
              <label className="font-bold text-[#880E4F] block mb-1">Branch</label>
              <input
                type="text"
                value={editForm.branch || ""}
                onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>
            <div>
              <label className="font-bold text-[#880E4F] block mb-1">Group / Section</label>
              <input
                type="text"
                value={editForm.group_name || ""}
                onChange={(e) => setEditForm({ ...editForm, group_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#FFB8D2] bg-white text-[#4A1525] focus:outline-none focus:ring-2 focus:ring-[#F06292]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Real Academic Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Leaderboard Rank", value: `#${user.rank} Overall`, icon: Trophy, color: "text-[#F06292]", bg: "bg-[#FFD6E7]" },
          { label: "Quizzes Completed", value: `${user.quizzes_taken} Completed`, icon: Brain, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Flashcards Mastered", value: `${user.cards_mastered} Mastered`, icon: Layers, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Estimated Study Time", value: `${user.study_hours} Hours`, icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="glass-card p-4 space-y-1">
              <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center mb-1`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className="text-[11px] font-bold text-[#880E4F]/70">{item.label}</p>
              <p className="text-sm font-extrabold text-[#4A1525] truncate">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Real Activity Timeline (From SQLite) */}
      <div className="glass-card p-5 space-y-3">
        <h3 className="font-extrabold text-sm text-[#4A1525] flex items-center gap-2">
          <History className="w-4 h-4 text-[#F06292]" />
          <span>Real Activity History</span>
        </h3>

        {user.recent_activities?.length > 0 ? (
          <div className="space-y-2">
            {user.recent_activities.map((act) => (
              <div
                key={act.id}
                className="bg-white p-3 rounded-2xl border border-[#FFD6E7] flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <p className="font-bold text-[#4A1525]">{act.description}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {new Date(act.created_at).toLocaleDateString()}
                  </p>
                </div>
                {act.xp_gained > 0 && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    +{act.xp_gained} XP
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-3 text-center">
            No activities recorded yet. Upload a document or take a quiz to earn XP!
          </p>
        )}
      </div>
    </div>
  );
}
