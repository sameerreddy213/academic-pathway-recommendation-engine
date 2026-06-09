import Link from "next/link";
import { getSupabase, Submission } from "@/lib/supabase";

const BADGE_COLORS: Record<string, string> = {
  "Certification Program": "bg-blue-100 text-blue-800",
  DBA: "bg-purple-100 text-purple-800",
  PhD: "bg-emerald-100 text-emerald-800",
  "Honorary Doctorate": "bg-amber-100 text-amber-800",
};

async function getSubmissions(): Promise<Submission[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load submissions:", error);
      return [];
    }
    return data ?? [];
  } catch {
    return [];
  }
}

export const revalidate = 0;

export default async function SubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-semibold text-slate-800">AcdyOn</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 text-sm">Submissions</span>
          </div>
          <Link
            href="/"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            ← Back to Form
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">All Submissions</h1>
            <p className="text-slate-500 text-sm mt-1">
              {submissions.length} total submission{submissions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-slate-600 font-medium">No submissions yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Submissions will appear here once users complete the form.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Go to Form →
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-3.5 font-medium text-slate-600">Name</th>
                    <th className="text-left px-6 py-3.5 font-medium text-slate-600">Email</th>
                    <th className="text-left px-6 py-3.5 font-medium text-slate-600">Career Goal</th>
                    <th className="text-left px-6 py-3.5 font-medium text-slate-600">Recommendation</th>
                    <th className="text-left px-6 py-3.5 font-medium text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
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
                        {new Date(s.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.email}</p>
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
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(s.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
