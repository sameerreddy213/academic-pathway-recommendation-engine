"use client";

import { useMemo, useState } from "react";
import type { Submission } from "@/lib/supabase";

const BADGE_COLORS: Record<string, string> = {
  "Certification Program": "bg-blue-100 text-blue-800",
  DBA: "bg-purple-100 text-purple-800",
  PhD: "bg-emerald-100 text-emerald-800",
  "Honorary Doctorate": "bg-amber-100 text-amber-800",
};

const RECOMMENDATIONS = [
  "Certification Program",
  "DBA",
  "PhD",
  "Honorary Doctorate",
];

const STAT_ACCENT: Record<string, string> = {
  "Certification Program": "text-blue-600",
  DBA: "text-purple-600",
  PhD: "text-emerald-600",
  "Honorary Doctorate": "text-amber-600",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toCsv(rows: Submission[]): string {
  const headers = [
    "Name",
    "Email",
    "Qualification",
    "Experience",
    "Profession",
    "Career Goal",
    "Recommendation",
    "Reason",
    "Date",
  ];
  const escape = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      r.name,
      r.email,
      r.qualification,
      r.experience,
      r.profession,
      r.career_goal,
      r.recommendation,
      r.recommendation_reason,
      formatDate(r.created_at),
    ]
      .map((v) => escape(String(v)))
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

export default function SubmissionsDashboard({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of RECOMMENDATIONS) counts[r] = 0;
    for (const s of submissions) {
      counts[s.recommendation] = (counts[s.recommendation] ?? 0) + 1;
    }
    return counts;
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter((s) => {
      const matchesFilter = filter === "All" || s.recommendation === filter;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.career_goal.toLowerCase().includes(q) ||
        s.profession.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [submissions, query, filter]);

  function downloadCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `acdyon-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{submissions.length}</p>
        </div>
        {RECOMMENDATIONS.map((rec) => (
          <div
            key={rec}
            className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-sm p-5"
          >
            <p className="text-sm text-slate-500 truncate" title={rec}>
              {rec}
            </p>
            <p className={`text-3xl font-bold mt-1 ${STAT_ACCENT[rec]}`}>
              {stats[rec] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, goal…"
              className="w-full rounded-lg border border-slate-300 bg-white/80 pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white/80 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            <option value="All">All recommendations</option>
            {RECOMMENDATIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={downloadCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-medium px-4 py-2.5 transition-colors cursor-pointer"
        >
          ⬇ Export CSV ({filtered.length})
        </button>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-12 text-center">
          <p className="text-4xl mb-3">🔎</p>
          <p className="text-slate-600 font-medium">No matching submissions</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70 bg-slate-50/60">
                  <th className="text-left px-6 py-3.5 font-medium text-slate-600">Name</th>
                  <th className="text-left px-6 py-3.5 font-medium text-slate-600">Email</th>
                  <th className="text-left px-6 py-3.5 font-medium text-slate-600">Career Goal</th>
                  <th className="text-left px-6 py-3.5 font-medium text-slate-600">Recommendation</th>
                  <th className="text-left px-6 py-3.5 font-medium text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">
                      {s.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{s.email}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs">
                      <span className="line-clamp-2">{s.career_goal}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                          BADGE_COLORS[s.recommendation] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {s.recommendation}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(s.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-white/40 bg-white/70 backdrop-blur-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{s.name}</p>
                    <p className="text-xs text-slate-400 truncate">{s.email}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      BADGE_COLORS[s.recommendation] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {s.recommendation}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{s.career_goal}</p>
                <p className="text-xs text-slate-400 mt-2">{formatDate(s.created_at)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
