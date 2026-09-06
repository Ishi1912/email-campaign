// The signature visual for this product: a horizontal "signal flow" bar that
// mirrors how a campaign actually moves through the system, with a traveling
// pulse to suggest motion/liveness without being gimmicky. Widths are
// proportional to each stage's share of the total.
export default function SignalFlow({ stages, total }) {
  const safeTotal = total || 1;

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-ink-900 border border-ink-600">
        {stages.map((stage, i) => {
          const pct = Math.max((stage.value / safeTotal) * 100, stage.value > 0 ? 2 : 0);
          return (
            <div
              key={stage.key}
              className="relative h-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                backgroundColor: stage.color,
                borderRight: i < stages.length - 1 ? "2px solid #0A0C18" : "none",
              }}
            >
              {stage.value > 0 && (
                <span
                  className="absolute top-0 h-full w-6 bg-white/40 blur-[2px] animate-pulseTravel"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stages.map((stage) => (
          <div key={stage.key} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <div className="min-w-0">
              <p className="font-mono text-lg leading-tight text-mist-100">{stage.value}</p>
              <p className="truncate text-xs text-mist-400">{stage.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
