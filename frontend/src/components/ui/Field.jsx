export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-mist-100">{label}</span>
      )}
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-mist-400">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs text-status-coral">{error}</span>}
    </label>
  );
}

const baseInput =
  "w-full rounded-lg border border-ink-500 bg-ink-900/60 px-3.5 py-2.5 text-sm text-mist-100 placeholder:text-mist-400 outline-none transition-colors focus:border-signal-violet";

export function Input(props) {
  return <input className={baseInput} {...props} />;
}

export function Textarea(props) {
  return <textarea className={`${baseInput} resize-y leading-relaxed`} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={`${baseInput} appearance-none cursor-pointer`} {...props}>
      {children}
    </select>
  );
}
