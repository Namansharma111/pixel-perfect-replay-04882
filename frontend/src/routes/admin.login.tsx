import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AdminAuthProvider, useAdminAuth } from "@/lib/cms/auth-context";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  requestPasswordResetFn,
  resetPasswordWithTokenFn,
} from "@/lib/cms/cms.functions";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): { reset?: string } => ({
    ...(typeof search["reset"] === "string" ? { reset: search["reset"] } : {}),
  }),
  component: LoginPageWrapper,
});

function LoginPageWrapper() {
  return (
    <AdminAuthProvider>
      <LoginPageContent />
    </AdminAuthProvider>
  );
}

type ViewMode = "login" | "forgot_request" | "set_new_password";

function LoginPageContent() {
  const { user, login } = useAdminAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>(
    search.reset ? "set_new_password" : "login",
  );

  // Login form state (both empty by default, no hardcoded credentials)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot password request state
  const [resetEmail, setResetEmail] = useState("");
  const [resetReqLoading, setResetReqLoading] = useState(false);
  const [resetReqSuccess, setResetReqSuccess] = useState<string | null>(null);
  const [resetReqError, setResetReqError] = useState<string | null>(null);

  // Set new password state
  const [resetToken, setResetToken] = useState(search.reset || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetPassLoading, setResetPassLoading] = useState(false);
  const [resetPassSuccess, setResetPassSuccess] = useState<string | null>(null);
  const [resetPassError, setResetPassError] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (search.reset) {
      setResetToken(search.reset);
      setViewMode("set_new_password");
    }
  }, [search.reset]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (res.ok) {
        navigate({ to: "/admin/dashboard" });
      } else {
        setLoginError(res.error || "Invalid email or password.");
      }
    } catch {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRequestResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetReqError(null);
    setResetReqSuccess(null);
    setResetReqLoading(true);

    try {
      const res = await requestPasswordResetFn({
        data: { email: resetEmail.trim() },
      });

      if (res.ok) {
        setResetReqSuccess(
          "Password reset request received. For security, if an administrator account exists for this email, you can proceed to set your new password.",
        );
        if (res.token) {
          setResetToken(res.token);
        }
      } else {
        setResetReqError("Unable to process request. Please try again.");
      }
    } catch {
      setResetReqError("Network error. Please try again.");
    } finally {
      setResetReqLoading(false);
    }
  };

  const handleSetNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetPassError(null);
    setResetPassSuccess(null);

    if (newPassword.length < 8) {
      setResetPassError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetPassError("Passwords do not match. Please re-enter.");
      return;
    }

    setResetPassLoading(true);
    try {
      const res = await resetPasswordWithTokenFn({
        data: {
          token: resetToken.trim(),
          newPassword,
        },
      });

      if (res.ok) {
        setResetPassSuccess(
          "Your password has been successfully updated! You can now sign in with your new password.",
        );
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setViewMode("login");
          setResetPassSuccess(null);
        }, 2500);
      } else {
        setResetPassError(res.error || "Password reset token is invalid or expired.");
      }
    } catch {
      setResetPassError("Could not reset password. Please request a fresh reset link.");
    } finally {
      setResetPassLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

      {/* Decorative ambient blur rings */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="w-full max-w-md bg-[#0B1437]/95 backdrop-blur-2xl rounded-3xl border border-white/15 p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
            SW
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-[#FFD84A] uppercase bg-white/5 border border-white/10 mb-2">
            <Shield className="w-3 h-3 text-[#FF941E]" /> SECURE MANAGEMENT PORTAL
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Social Waale CMS</h1>
          <p className="text-xs text-slate-300 mt-1">
            Authorized administrator access and content management.
          </p>
        </div>

        {/* =================================================================== */}
        {/* VIEW 1: STANDARD LOGIN FORM                                        */}
        {/* =================================================================== */}
        {viewMode === "login" && (
          <div>
            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{loginError}</div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@socialwaale.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080F35] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-[#FF941E] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginError(null);
                      setResetReqSuccess(null);
                      setViewMode("forgot_request");
                    }}
                    className="text-[11px] font-semibold text-[#FFD84A] hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080F35] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-[#FF941E] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:opacity-95 transition-all mt-3 cursor-pointer"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to CMS <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: FORGOT PASSWORD REQUEST                                    */}
        {/* =================================================================== */}
        {viewMode === "forgot_request" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setViewMode("login")}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                title="Back to login"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Reset Administrator Password
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your registered administrator email address to generate a secure, expiring
              password reset token.
            </p>

            {resetReqError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{resetReqError}</span>
              </div>
            )}

            {resetReqSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-200 space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{resetReqSuccess}</span>
                </div>
                {resetToken && (
                  <div className="pt-2 border-t border-emerald-500/20">
                    <p className="text-[11px] text-slate-300 mb-2">
                      Secure reset authorization confirmed for your session. Proceed to set your
                      new password now:
                    </p>
                    <Button
                      type="button"
                      onClick={() => setViewMode("set_new_password")}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Set New Password Now →
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleRequestResetSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@socialwaale.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080F35] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-[#FF941E] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={resetReqLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  {resetReqLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Generating Reset Token...
                    </>
                  ) : (
                    "Send Password Reset Link"
                  )}
                </Button>
              </form>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setViewMode("login")}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: SET NEW PASSWORD                                           */}
        {/* =================================================================== */}
        {viewMode === "set_new_password" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setViewMode("login")}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                title="Back to login"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Create New Secure Password
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your new administrator password. Passwords are saved with strong cryptographic
              scrypt hashing.
            </p>

            {resetPassError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{resetPassError}</span>
              </div>
            )}

            {resetPassSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="leading-relaxed">{resetPassSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSetNewPasswordSubmit} className="space-y-3.5" noValidate>
                <div>
                  <label
                    htmlFor="reset-token-input"
                    className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1"
                  >
                    Reset Security Token
                  </label>
                  <input
                    id="reset-token-input"
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter or paste reset token"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080F35] border border-white/15 text-white font-mono text-[11px] placeholder:text-slate-500 focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-password-input"
                    className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1"
                  >
                    New Password (Min 8 Characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="new-password-input"
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080F35] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="p-1.5 text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password-input"
                    className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="confirm-password-input"
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080F35] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={resetPassLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all mt-2 cursor-pointer"
                >
                  {resetPassLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Updating Password...
                    </>
                  ) : (
                    "Save New Password & Sign In"
                  )}
                </Button>
              </form>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setViewMode("login")}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* Footer Link */}
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
