import { Logomark } from "./Sidebar";

// A loose ambient rendering of the "signal flow" motif for the auth screens -
// three parallel paths pulsing left to right, evoking messages moving through
// the pipeline (sent -> delivered -> opened) without claiming to be real data.
function AmbientFlow() {
  const rows = [
    { y: 60, color: "#8C6BFF", delay: "0s" },
    { y: 140, color: "#5AA9FF", delay: "0.6s" },
    { y: 220, color: "#34D399", delay: "1.2s" },
    { y: 300, color: "#F5B84E", delay: "1.8s" },
  ];
  return (
    <svg viewBox="0 0 420 360" className="h-full w-full" fill="none">
      {rows.map((r, i) => (
        <g key={i}>
          <line x1="0" y1={r.y} x2="420" y2={r.y} stroke="#212446" strokeWidth="2" />
          <circle r="4" fill={r.color}>
            <animateMotion
              dur="4.5s"
              begin={r.delay}
              repeatCount="indefinite"
              path={`M0,${r.y} L420,${r.y}`}
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

export default function AuthShell({ eyebrow, title, description, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-ink-600 bg-ink-800 lg:flex lg:flex-col lg:justify-between p-12">
        <div className="flex items-center gap-2.5">
          <Logomark />
          <span className="font-display font-semibold text-mist-100">Signal</span>
        </div>

        <div className="absolute inset-0 opacity-70">
          <AmbientFlow />
        </div>

        <div className="relative z-10 max-w-sm">
          <p className="text-xs uppercase tracking-wider text-signal-violet font-medium">
            Campaign Studio
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-mist-100">
            Every message, on its way somewhere.
          </h2>
          <p className="mt-3 text-sm text-mist-400 leading-relaxed">
            Import a list, write with AI assistance, and send — Signal keeps your
            subscribers and campaigns in one place.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logomark size={40} />
          </div>
          <p className="text-center lg:text-left text-xs font-medium uppercase tracking-wider text-signal-violet">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-center lg:text-left font-display text-2xl font-semibold text-mist-100">
            {title}
          </h1>
          <p className="mt-2 text-center lg:text-left text-sm text-mist-400">{description}</p>

          <div className="mt-8 rounded-2xl border border-ink-600 bg-ink-800/60 p-6 shadow-card">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
