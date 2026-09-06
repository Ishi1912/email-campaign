import Sidebar from "./Sidebar";

export default function AppLayout({ children, title, subtitle, actions }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-600 bg-ink-900/80 px-8 py-6 backdrop-blur-sm">
          <div>
            <h1 className="font-display text-2xl font-semibold text-mist-100">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-mist-400">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
