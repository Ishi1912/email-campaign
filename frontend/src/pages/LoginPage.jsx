import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Field, Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import { Logomark } from "../components/layout/Sidebar";
import AuthShell from "../components/layout/AuthShell";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(form);
    if (ok) navigate("/");
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to Signal"
      description="Manage subscribers, ship campaigns, and let AI handle the first draft."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <Input
            type="email"
            required
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>

        {error && (
          <p className="rounded-lg border border-status-coral/30 bg-status-coral/10 px-3.5 py-2.5 text-sm text-status-coral">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" icon={LogIn} loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mist-400">
        New here?{" "}
        <Link to="/register" className="font-medium text-signal-violet hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
