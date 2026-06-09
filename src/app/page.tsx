"use client";

import { useState } from "react";
import Link from "next/link";
import Decor from "./ui/Decor";

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
  "Certification Program": "bg-sky-100 text-sky-800 border-sky-200",
  DBA: "bg-violet-100 text-violet-800 border-violet-200",
  PhD: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Honorary Doctorate": "bg-amber-100 text-amber-900 border-amber-200",
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

const inputClass =
  "w-full rounded-xl border border-stone-300/80 bg-white/70 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 shadow-sm transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 hover:border-stone-400";

const labelClass = "block text-sm font-medium text-stone-700 mb-1.5";

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
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <Decor />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-stone-200/60 bg-[var(--paper)]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 sm:px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-sm font-bold text-white shadow-md shadow-emerald-600/25">
              A
            </div>
            <span className="font-display text-lg font-semibold text-stone-800">AcdyOn</span>
          </div>
          <Link
            href="/submissions"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-600"
          >
            Submissions
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 sm:px-6 py-12 sm:py-16">
        {/* Hero — left-aligned, editorial */}
        <div className="mb-10 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <span className="text-emerald-500">✦</span> AI-powered guidance
          </span>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.08] text-stone-900 sm:text-5xl">
            Your next
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">academic pathway</span>, decided.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-stone-600 sm:text-lg">
            Share a few details and our engine recommends the ideal credential — a certification,
            DBA, PhD, or honorary doctorate — with a personalised rationale written just for you.
          </p>
        </div>

        {/* Result */}
        {result && (
          <div className="animate-pop-in mb-8 overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-emerald-100/60 backdrop-blur-xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 text-3xl shadow-inner">
                {ICONS[result.recommendation] ?? "🎓"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-stone-500">
                  Hi <span className="font-semibold text-stone-700">{result.name}</span>, we
                  recommend:
                </p>
                <div className="mt-2 mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-sm font-semibold ${
                      BADGE_COLORS[result.recommendation] ??
                      "bg-stone-100 text-stone-800 border-stone-200"
                    }`}
                  >
                    {result.recommendation}
                  </span>
                  {result.aiGenerated && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      ✨ AI-generated
                    </span>
                  )}
                </div>
                <p className="font-display text-lg leading-relaxed text-stone-700">
                  {result.recommendation_reason}
                </p>
              </div>
            </div>
            <button
              onClick={() => setResult(null)}
              className="mt-6 w-full rounded-xl border border-stone-200 bg-white/60 py-2.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
            >
              ← Submit another profile
            </button>
          </div>
        )}

        {/* Form */}
        {!result && (
          <div className="card-hover animate-fade-up rounded-[1.75rem] border border-white/60 bg-white/70 p-6 shadow-xl shadow-stone-200/50 backdrop-blur-xl sm:p-8">
            <h2 className="font-display mb-6 text-xl font-semibold text-stone-800">Your profile</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Highest Qualification <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    required
                    className={inputClass}
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
                  <label className={labelClass}>
                    Years of Work Experience <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    required
                    className={inputClass}
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
                <label className={labelClass}>
                  Current Profession <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="profession"
                  value={form.profession}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer, Business Analyst, Teacher"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Career Goal <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="careerGoal"
                  value={form.careerGoal}
                  onChange={handleChange}
                  placeholder="e.g. Transition into AI research, become a business executive, gain industry recognition…"
                  required
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <div className="animate-fade-in rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="shimmer relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Analysing your profile…
                    </>
                  ) : (
                    <>Get my recommendation →</>
                  )}
                </span>
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-center text-sm text-stone-400">
        © 2025 AcdyOn · Academic Pathway Engine
      </footer>
    </div>
  );
}
