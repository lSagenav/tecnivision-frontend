export default function Loading() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-100 p-4">
            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-9 animate-pulse rounded-xl bg-slate-900/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
