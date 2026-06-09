import Decor from "../ui/Decor";

export default function Loading() {
  return (
    <div className="relative min-h-screen">
      <Decor />

      <header className="border-b border-stone-200/60 bg-[var(--paper)]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 sm:px-6 py-3.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-5 sm:px-6 py-10">
        <div>
          <div className="skeleton h-8 w-72 rounded-lg" />
          <div className="skeleton mt-3 h-4 w-80 rounded" />
        </div>

        {/* Stat card skeletons */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl"
            >
              <div className="skeleton h-4 w-20 rounded" />
              <div className="skeleton mt-3 h-8 w-12 rounded" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-4 flex-1 rounded" />
              <div className="skeleton h-6 w-28 rounded-full" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
