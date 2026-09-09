// The signature visual for this product: a horizontal "signal flow" bar that
// mirrors how a campaign actually moves through the system.
export default function SignalFlow({ stages, total }) {
  const safeTotal = total || 0;

  return (
    <div>
      {/* Campaign progress bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-ink-900 border border-ink-600">
        {stages.map((stage, i) => {
          const pct =
            safeTotal > 0
              ? (stage.value / safeTotal) * 100
              : 0;

          return (
            <div
              key={stage.key}
              className="relative h-full shrink-0 transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                backgroundColor: stage.color,
                borderRight:
                  i < stages.length - 1 && pct > 0
                    ? "2px solid #0A0C18"
                    : "none",
              }}
            >
              {stage.value > 0 && (
                <span
                  className="absolute top-0 h-full w-6 bg-white/30 blur-[2px] animate-pulseTravel"
                  style={{
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Campaign stages */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage) => (
          <div
            key={stage.key}
            className="flex items-center gap-2 min-w-0"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor: stage.color,
              }}
            />

            <div className="min-w-0">
              <p className="font-mono text-lg leading-tight text-mist-100">
                {stage.value}
              </p>

              <p className="truncate text-xs text-mist-400">
                {stage.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}