import Link from "next/link";
import { getSupabase, Submission } from "@/lib/supabase";
import SubmissionsDashboard from "./SubmissionsDashboard";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 sticky top-0 z-10">
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Submissions Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Live overview of every recommendation generated.
          </p>
        </div>

        <SubmissionsDashboard submissions={submissions} />
      </main>
    </div>
  );
}
