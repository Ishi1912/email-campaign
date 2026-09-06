import { Loader2 } from "lucide-react";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-ink-600 bg-ink-700/60 backdrop-blur-sm shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

const badgeStyles = {
  // subscriber statuses
  active: "bg-status-mint/15 text-status-mint border-status-mint/30",
  unsubscribed: "bg-mist-400/15 text-mist-400 border-mist-400/30",
  bounced: "bg-status-coral/15 text-status-coral border-status-coral/30",
  // campaign statuses
  draft: "bg-mist-400/15 text-mist-400 border-mist-400/30",
  scheduled: "bg-status-amber/15 text-status-amber border-status-amber/30",
  sending: "bg-status-sky/15 text-status-sky border-status-sky/30",
  sent: "bg-status-mint/15 text-status-mint border-status-mint/30",
  failed: "bg-status-coral/15 text-status-coral border-status-coral/30",
  default: "bg-signal-violet/15 text-signal-violet border-signal-violet/30",
};

export function Badge({ status, children }) {
  const style = badgeStyles[status] || badgeStyles.default;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children || status}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-600 border border-ink-500">
          <Icon size={22} className="text-signal-violet" />
        </div>
      )}
      <h3 className="font-display font-semibold text-mist-100 text-lg">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-mist-400 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner({ size = 20, className = "" }) {
  return <Loader2 size={size} className={`animate-spin text-signal-violet ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="flex h-72 w-full items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}
