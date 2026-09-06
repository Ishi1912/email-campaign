import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Field, Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import AuthShell from "../components/layout/AuthShell";

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await register(form);
    if (ok) navigate("/");
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      description="Set up your workspace to start managing subscribers and campaigns."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name">
          <Input
            required
            placeholder="Jordan Rivers"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            required
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Password" hint="At least 6 characters.">
          <Input
            type="password"
            required
            minLength={6}
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

        <Button type="submit" className="w-full" size="lg" icon={UserPlus} loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mist-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-signal-violet hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
