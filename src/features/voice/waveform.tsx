/** Small CSS-only waveform (transform-based) used for listening/speaking states. */
export function Waveform({ className = "bg-current" }: { className?: string }) {
  return (
    <span className="inline-flex h-4 items-center gap-0.5" aria-hidden>
      {[0, 0.15, 0.3, 0.1, 0.25].map((delay, i) => (
        <span key={i} className={`h-full w-0.5 rounded-full animate-wave ${className}`} style={{ animationDelay: `${delay}s` }} />
      ))}
    </span>
  );
}
