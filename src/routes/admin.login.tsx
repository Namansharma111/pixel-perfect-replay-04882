import React, { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AdminAuthProvider, useAdminAuth } from "@/lib/cms/auth-context";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/login")({
  component: LoginPageWrapper,
});

function LoginPageWrapper() {
  return (
    <AdminAuthProvider>
      <LoginForm />
    </AdminAuthProvider>
  );
}

function LoginForm() {
  const { user, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@socialwaale.com");
  const [password, setPassword] = useState("Admin@SocialWaale2026!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.ok) {
      navigate({ to: "/admin/dashboard" });
    } else {
      setError(res.error || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

      <div className="w-full max-w-md bg-[#0B1437]/90 backdrop-blur-xl rounded-3xl border border-white/15 p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
            SW
          </div>
          <span className="text-[11px] font-bold tracking-widest text-[#FFD84A] uppercase">
            SECURE MANAGEMENT PORTAL
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">Social Waale CMS</h1>
          <p className="text-xs text-slate-300 mt-1">
            Sign in to manage blog articles, SEO metadata, and digital media.
          </p>
        </div>

        {/* Demo Credentials Pill & Quick 1-Click Login */}
        <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-[#FFD84A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF941E]" /> Administrator Credentials:
            </p>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Ready</span>
          </div>
          <div className="space-y-0.5 text-[11px] font-mono text-slate-300 bg-[#080F35]/70 p-2.5 rounded-xl border border-white/5">
            <p>Email: <span className="text-white font-bold">admin@socialwaale.com</span></p>
            <p>Password: <span className="text-white font-bold">Admin@SocialWaale2026!</span></p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setEmail("admin@socialwaale.com");
              setPassword("Admin@SocialWaale2026!");
              login("admin@socialwaale.com", "Admin@SocialWaale2026!").then((res) => {
                if (res.ok) navigate({ to: "/admin/services" });
                else setError(res.error || "Login failed");
              });
            }}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> 1-Click Instant Admin Sign-In
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@socialwaale.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080F35] border border-white/15 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080F35] border border-white/15 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:opacity-95 transition-all mt-2"
          >
            {loading ? "Authenticating..." : "Sign In to CMS"} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link
            to="/articles"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
