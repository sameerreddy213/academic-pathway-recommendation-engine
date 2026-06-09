"use client";

import { useState } from "react";
import Link from "next/link";

type FormData = {
  name: string;
  email: string;
  qualification: string;
  experience: string;
  profession: string;
  careerGoal: string;
};

type Result = {
  recommendation: string;
  recommendation_reason: string;
  name: string;
  aiGenerated: boolean;
};

const QUALIFICATIONS = [
  "High School / 12th",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
];

const EXPERIENCES = [
  "0-1 years",
  "2-4 years",
  "5-9 years",
  "10-14 years",
  "15+ years",
];

const BADGE_COLORS: Record<string, string> = {
  "Certification Program": "bg-blue-100 text-blue-800 border-blue-200",
  DBA: "bg-purple-100 text-purple-800 border-purple-200",
  PhD: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Honorary Doctorate": "bg-amber-100 text-amber-800 border-amber-200",
};

const ICONS: Record<string, string> = {
  "Certification Program": "🎓",
  DBA: "💼",
  PhD: "🔬",
  "Honorary Doctorate": "🏅",
};

const initialForm: FormData = {
  name: "",
  email: "",
  qualification: "",
  experience: "",
  profession: "",
  careerGoal: "",
};

export default function HomePage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult({
          recommendation: data.submission.recommendation,
          recommendation_reason: data.submission.recommendation_reason,
          name: data.submission.name,
          aiGenerated: Boolean(data.aiGenerated),
        });
        setForm(initialForm);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-semibold text-slate-800 text-lg">AcdyOn</span>
          </div>
          <Link
            href="/submissions"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            View Submissions →
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <span>✨</span> AI-Powered Pathway
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            Academic Pathway
            <br />
            <span className="text-indigo-600">Recommendation Engine</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-lg mx-auto">
            Tell us about yourself and we&apos;ll recommend the ideal academic credential to
            accelerate your career.
          </p>
        </div>

        {/* Result Card */}
        {result && (
          <div className="mb-8 rounded-2xl border border-white/50 bg-white/70 backdrop-blur-xl shadow-xl shadow-indigo-100/50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{ICONS[result.recommendation] ?? "🎓"}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 mb-1">
                  Hi{" "}
                  <span className="font-semibold text-slate-700">{result.name}</span>, we
                  recommend:
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`inline-block text-sm font-semibold px-3 py-1 rounded-full border ${
                      BADGE_COLORS[result.recommendation] ??
                      "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {result.recommendation}
                  </span>
                  {result.aiGenerated && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full">
                      ✨ AI-generated
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {result.recommendation_reason}
                </p>
              </div>
            </div>
            <button
              onClick={() => setResult(null)}
              className="mt-5 w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Submit another profile
            </button>
          </div>
        )}

        {/* Form */}
        {!result && (
          <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-xl shadow-xl shadow-indigo-100/40 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Your Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Highest Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  >
                    <option value="">Select qualification</option>
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Years of Work Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  >
                    <option value="">Select experience</option>
                    {EXPERIENCES.map((ex) => (
                      <option key={ex} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Current Profession <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="profession"
                  value={form.profession}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer, Business Analyst, Teacher"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Career Goal <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="careerGoal"
                  value={form.careerGoal}
                  onChange={handleChange}
                  placeholder="e.g. Transition into AI research, become a business executive, gain industry recognition..."
                  required
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing your profile…
                  </>
                ) : (
                  "Get My Recommendation →"
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-center text-sm text-slate-400">
        &copy; 2025 AcdyOn · Academic Pathway Engine
      </footer>
    </div>
  );
}
