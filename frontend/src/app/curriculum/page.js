"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  School,
  Compass,
  Check,
  AlertCircle,
  FolderPlus,
} from "lucide-react";

export default function CurriculumPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState("aktu");
  const [structure, setStructure] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState("B.Tech");
  const [selectedBranch, setSelectedBranch] = useState("csds");
  const [selectedSemester, setSelectedSemester] = useState("sem4");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [user, setUser] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    Promise.all([
      api.get("/api/curriculum/universities"),
      api.get("/api/user/me").catch(() => ({ data: null })),
    ])
      .then(([uniRes, userRes]) => {
        setUniversities(uniRes.data);
        if (userRes.data) {
          setUser(userRes.data);
          if (userRes.data.university) setSelectedUni(userRes.data.university);
          if (userRes.data.course) setSelectedCourse(userRes.data.course);
          if (userRes.data.branch) setSelectedBranch(userRes.data.branch);
          if (userRes.data.semester) setSelectedSemester(userRes.data.semester);
          if (Array.isArray(userRes.data.selected_subjects)) {
            setSelectedSubjectIds(userRes.data.selected_subjects);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load curriculum config:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // When university changes, load structure
  useEffect(() => {
    if (!selectedUni) return;
    api.get(`/api/curriculum/structure?university_id=${selectedUni}`)
      .then((res) => {
        setStructure(res.data);
        if (res.data.courses?.length && !res.data.courses.includes(selectedCourse)) {
          setSelectedCourse(res.data.courses[0]);
        }
        if (res.data.branches?.length && !res.data.branches.some((b) => b.id === selectedBranch)) {
          setSelectedBranch(res.data.branches[0].id);
        }
        if (res.data.semesters?.length && !res.data.semesters.some((s) => s.id === selectedSemester)) {
          setSelectedSemester(res.data.semesters[0].id);
        }
      })
      .catch((err) => console.error("Structure error:", err));
  }, [selectedUni]);

  // When branch or semester changes, load filtered subjects
  useEffect(() => {
    if (!selectedUni) return;
    api.get(`/api/curriculum/subjects?university_id=${selectedUni}&branch=${selectedBranch}&semester=${selectedSemester}&course=${selectedCourse}`)
      .then((res) => {
        setAvailableSubjects(res.data);
        if (selectedSubjectIds.length === 0 && res.data.length > 0) {
          setSelectedSubjectIds(res.data.map((s) => s.id));
        }
      })
      .catch((err) => console.error("Subjects error:", err));
  }, [selectedUni, selectedBranch, selectedSemester, selectedCourse]);

  const toggleSubject = (subId) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        university: selectedUni,
        course: selectedCourse,
        branch: selectedBranch,
        semester: selectedSemester,
        selected_subjects: selectedSubjectIds,
      };

      if (localStorage.getItem("token")) {
        await api.put("/api/user/curriculum", payload);
      }

      localStorage.setItem("user_curriculum", JSON.stringify(payload));
      showToast("Curriculum saved successfully! Loading your subjects...");
      setTimeout(() => {
        router.push("/subjects");
      }, 1200);
    } catch (err) {
      showToast(err.response?.data?.detail || "Saved locally for this session!");
      setTimeout(() => router.push("/subjects"), 1200);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🌸</div>
          <p className="text-xs font-bold text-[#880E4F]">Loading curriculum catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#880E4F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#FFB8D2]">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFD6E7] to-[#FFC1D9] p-6 rounded-3xl border-2 border-white shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#880E4F] uppercase tracking-wider">
          <School className="w-4 h-4" />
          <span>Academic Curriculum Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A1525]">
          Select Your University & Syllabus
        </h1>
        <p className="text-xs text-[#880E4F]/80 max-w-2xl font-medium">
          Choose your learning pathway. We support official AKTU 5-unit syllabus modular structures, flexible credit syllabi for state/autonomous colleges, and topic-driven tracks for independent learners.
        </p>
      </div>

      {/* Step 1: University Selection Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#4A1525] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F06292] text-white text-xs flex items-center justify-center">1</span>
            <span>Choose Your Learning Track</span>
          </h2>
          <span className="text-[11px] font-bold text-[#880E4F]">3 Paths Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {universities.map((uni) => {
            const isSelected = selectedUni === uni.id;
            return (
              <div
                key={uni.id}
                onClick={() => setSelectedUni(uni.id)}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-white border-[#F06292] shadow-md scale-[1.01]"
                    : "bg-white/80 border-[#FFD6E7] hover:border-[#FFC1D9] hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-[#F06292] text-white" : "bg-[#FFD6E7] text-[#880E4F]"
                  }`}>
                    {uni.badge}
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-[#F06292] bg-[#F06292] text-white" : "border-[#FFC1D9]"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <h3 className="font-extrabold text-sm text-[#4A1525] mb-1">
                  {uni.short_name}
                </h3>
                <p className="text-[11px] text-[#880E4F]/70 font-medium mb-3 leading-relaxed">
                  {uni.description}
                </p>

                <div className="pt-3 border-t border-[#FFF0F5] flex items-center justify-between text-[11px] font-semibold text-[#880E4F]">
                  <span>{uni.courses.length} Programs</span>
                  <span className="text-[#F06292] font-bold">Configure →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Course, Branch & Semester Selectors */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="text-sm font-extrabold text-[#4A1525] flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#F06292] text-white text-xs flex items-center justify-center">2</span>
          <span>Course, Branch & Level</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Course */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#880E4F] uppercase">Program / Degree</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
            >
              {structure?.courses?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Branch / Track */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#880E4F] uppercase">Branch / Specialization</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
            >
              {structure?.branches?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester / Level */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#880E4F] uppercase">Semester / Learning Phase</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full bg-[#FFF0F5] border border-[#FFC1D9] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#4A1525] focus:outline-none focus:border-[#F06292]"
            >
              {structure?.semesters?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Step 3: Subject Selection Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#4A1525] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F06292] text-white text-xs flex items-center justify-center">3</span>
            <span>Choose Your Semester Subjects ({selectedSubjectIds.length}/{availableSubjects.length} Active)</span>
          </h2>
          <button
            onClick={() => {
              if (selectedSubjectIds.length === availableSubjects.length) {
                setSelectedSubjectIds([]);
              } else {
                setSelectedSubjectIds(availableSubjects.map((s) => s.id));
              }
            }}
            className="text-[11px] font-bold text-[#F06292] hover:underline"
          >
            {selectedSubjectIds.length === availableSubjects.length ? "Deselect All" : "Select All"}
          </button>
        </div>

        {availableSubjects.length === 0 ? (
          <div className="glass-card p-8 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#F06292] mx-auto" />
            <p className="text-xs font-bold text-[#4A1525]">No subjects mapped for this specific branch/semester yet.</p>
            <p className="text-[11px] text-[#880E4F]/70">Try selecting AKTU ➔ B.Tech ➔ Computer Science (CSDS) ➔ Semester 4 to see full subjects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {availableSubjects.map((sub) => {
              const isChecked = selectedSubjectIds.includes(sub.id);
              return (
                <div
                  key={sub.id}
                  onClick={() => toggleSubject(sub.id)}
                  className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isChecked
                      ? "bg-white border-[#F06292] shadow-sm"
                      : "bg-white/70 border-[#FFD6E7] opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFD6E7] flex items-center justify-center text-xl shrink-0">
                      {sub.icon || "📚"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-[#FFF0F5] px-1.5 py-0.5 rounded text-[#880E4F] border border-[#FFD6E7]">
                          {sub.code}
                        </span>
                        <span className="text-[10px] font-semibold text-[#880E4F]/70">
                          {sub.credits} Credits • {sub.units?.length || 5} Units
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs text-[#4A1525] truncate mt-0.5">
                        {sub.name}
                      </h4>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                    isChecked ? "border-[#F06292] bg-[#F06292] text-white" : "border-[#FFC1D9]"
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save & Continue Action Bar */}
      <div className="pt-4 border-t border-[#FFD6E7] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-[#880E4F]">
          <span className="font-bold">Next:</span> Open your dedicated Subjects Dashboard with unit breakdowns, notes, and PYQs.
        </div>
        <button
          onClick={handleSave}
          disabled={saving || selectedSubjectIds.length === 0}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#F06292] hover:bg-[#E91E63] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
        >
          {saving ? (
            <span>Saving Settings...</span>
          ) : (
            <>
              <span>Save Curriculum & Open Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
