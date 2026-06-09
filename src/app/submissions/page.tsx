import Link from "next/link";
import { getSupabase, Submission } from "@/lib/supabase";
import SubmissionsDashboard from "./SubmissionsDashboard";
import Decor from "../ui/Decor";
import { AcdyonLogo } from "../ui/Logo";

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
    <div className="relative min-h-screen">
      <Decor />

      <header className="sticky top-0 z-20 border-b border-stone-200/60 bg-[var(--paper)]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <AcdyonLogo size={38} />
            <span className="text-lg font-bold tracking-tight text-stone-900">Acdyon</span>
            <span className="text-stone-300">/</span>
            <span className="text-sm text-stone-500">Submissions</span>
          </div>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-600"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span> Back to form
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 sm:px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-semibold text-stone-900">
            Submissions dashboard
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            A live overview of every recommendation generated.
          </p>
        </div>

        <SubmissionsDashboard submissions={submissions} />
      </main>
    </div>
  );
}
