"use client";

import { useMemo, useState } from "react";
import type { Submission } from "@/lib/supabase";

const BADGE_COLORS: Record<string, string> = {
  "Certification Program": "bg-sky-100 text-sky-800",
  DBA: "bg-violet-100 text-violet-800",
  PhD: "bg-emerald-100 text-emerald-800",
  "Honorary Doctorate": "bg-amber-100 text-amber-900",
};

const RECOMMENDATIONS = [
  "Certification Program",
  "DBA",
  "PhD",
  "Honorary Doctorate",
];

const STAT_ACCENT: Record<string, string> = {
  "Certification Program": "text-sky-600",
  DBA: "text-violet-600",
  PhD: "text-emerald-600",
  "Honorary Doctorate": "text-amber-600",
};

/** Date + time, e.g. "9 Jun 2026, 9:33 PM" */
function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
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
    "Date & Time",
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
      formatDateTime(r.created_at),
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

  const statCards = [
    { label: "Total", value: submissions.length, accent: "text-stone-900" },
    ...RECOMMENDATIONS.map((rec) => ({
      label: rec,
      value: stats[rec] ?? 0,
      accent: STAT_ACCENT[rec],
    })),
  ];

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            style={{ animationDelay: `${i * 70}ms` }}
            className="card-hover animate-fade-up rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl"
          >
            <p className="truncate text-sm text-stone-500" title={card.label}>
              {card.label}
            </p>
            <p className={`font-display mt-1 text-3xl font-semibold ${card.accent}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative max-w-sm flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, goal…"
              className="w-full rounded-xl border border-stone-300/80 bg-white/70 pl-9 pr-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-stone-300/80 bg-white/70 px-3 py-2.5 text-sm text-stone-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:from-stone-300 disabled:to-stone-300 disabled:shadow-none cursor-pointer"
        >
          ⬇ Export CSV ({filtered.length})
        </button>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="animate-fade-in rounded-2xl border border-white/60 bg-white/70 p-12 text-center backdrop-blur-xl">
          <p className="mb-3 text-4xl">🔎</p>
          <p className="font-medium text-stone-600">No matching submissions</p>
          <p className="mt-1 text-sm text-stone-400">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-sm backdrop-blur-xl sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200/70 bg-stone-50/60">
                  <th className="px-6 py-3.5 text-left font-medium text-stone-600">Name</th>
                  <th className="px-6 py-3.5 text-left font-medium text-stone-600">Email</th>
                  <th className="px-6 py-3.5 text-left font-medium text-stone-600">Career Goal</th>
                  <th className="px-6 py-3.5 text-left font-medium text-stone-600">Recommendation</th>
                  <th className="px-6 py-3.5 text-left font-medium text-stone-600">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-emerald-50/40">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-stone-800">
                      {s.name}
                    </td>
                    <td className="px-6 py-4 text-stone-500">{s.email}</td>
                    <td className="max-w-xs px-6 py-4 text-stone-600">
                      <span className="line-clamp-2">{s.career_goal}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                          BADGE_COLORS[s.recommendation] ?? "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {s.recommendation}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-stone-400">
                      {formatDateTime(s.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-stone-800">{s.name}</p>
                    <p className="truncate text-xs text-stone-400">{s.email}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      BADGE_COLORS[s.recommendation] ?? "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {s.recommendation}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-stone-500">{s.career_goal}</p>
                <p className="mt-2 text-xs text-stone-400">{formatDateTime(s.created_at)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
