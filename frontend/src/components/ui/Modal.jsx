import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, title, subtitle, children, width = "max-w-lg" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
      <div
        className="fixed inset-0 bg-ink-900/80 backdrop-blur-sm animate-riseIn"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${width} rounded-2xl border border-ink-500 bg-ink-800 shadow-card animate-riseIn`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between border-b border-ink-600 px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-mist-100">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-mist-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-600 hover:text-mist-100 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
