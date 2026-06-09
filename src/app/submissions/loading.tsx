export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg" />
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <div className="h-7 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-80 bg-slate-200/70 rounded mt-3 animate-pulse" />
        </div>

        {/* Stat card skeletons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-5"
            >
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-12 bg-slate-200 rounded mt-3 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-slate-200/70 rounded animate-pulse" />
              <div className="h-4 flex-1 bg-slate-200/50 rounded animate-pulse" />
              <div className="h-6 w-28 bg-slate-200 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
