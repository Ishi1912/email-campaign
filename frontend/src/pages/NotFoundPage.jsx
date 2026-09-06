import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
      <Compass size={32} className="text-signal-violet mb-4" />
      <h1 className="font-display text-2xl font-semibold text-mist-100">Page not found</h1>
      <p className="mt-2 text-sm text-mist-400 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
