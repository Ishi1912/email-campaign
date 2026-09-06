import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-signal-violet text-white hover:bg-signal-violetDim shadow-glow disabled:opacity-50 disabled:shadow-none",
  secondary:
    "bg-ink-600 text-mist-100 hover:bg-ink-500 border border-ink-500",
  ghost:
    "bg-transparent text-mist-400 hover:text-mist-100 hover:bg-ink-700",
  danger:
    "bg-transparent text-status-coral border border-status-coral/30 hover:bg-status-coral/10",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-5 py-3 gap-2",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  children,
  className = "",
  disabled,
  ...props
}) {
  return (
    <Comp
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </Comp>
  );
}
