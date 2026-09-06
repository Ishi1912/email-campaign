import { Card } from "../ui/primitives";

export default function StatCard({ label, value, icon: Icon, accent = "#8C6BFF", hint }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-mist-400">{label}</p>
          <p className="mt-2 font-mono text-3xl font-medium text-mist-100">{value}</p>
          {hint && <p className="mt-1 text-xs text-mist-400">{hint}</p>}
        </div>
        {Icon && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accent}22` }}
          >
            <Icon size={18} style={{ color: accent }} />
          </div>
        )}
      </div>
    </Card>
  );
}
