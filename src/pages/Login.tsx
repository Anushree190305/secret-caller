import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/home", { replace: true });
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/fc164b4b-f085-44ee-bb7f-ec7df8539571/d3b4e5e1-3375-4b2e-887c-e64e5d04bb59/US-en-20231211-popsignuptwoithoutcard-perspective_alpha_website_large.jpg')] bg-cover bg-center opacity-30" />
      <div className="relative z-10 w-full max-w-md bg-black/75 rounded-lg p-12">
        <h1 className="text-foreground text-3xl font-bold mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-primary/20 border border-primary rounded p-3 text-sm text-primary">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="text-muted-foreground mt-6">
          New to Netflix?{" "}
          <Link to="/signup" className="text-foreground hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
