export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center bg-slate-950">
      <div
        role="status"
        aria-label="Cargando página"
        className="navigation-loading-indicator"
      >
        <span className="block h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-cyan-300 motion-reduce:animate-none" />
      </div>
    </div>
  );
}
