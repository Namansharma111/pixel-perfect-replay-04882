import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { adminLoginFn, adminVerifySessionFn } from "./cms.functions";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  avatarUrl?: string | undefined;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "social_waale_admin_token";
const USER_KEY = "social_waale_admin_user";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const existingCtx = useContext(AuthContext);
  if (existingCtx) {
    return <>{children}</>;
  }

  return <AdminAuthProviderInner>{children}</AdminAuthProviderInner>;
}

function AdminAuthProviderInner({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(TOKEN_KEY);
      } catch {}
    }
    return null;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) return JSON.parse(storedUser);
      } catch {}
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        if (!token) setToken(storedToken);
        if (!user) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {}
        }

        // Verify session with server asynchronously
        adminVerifySessionFn({ data: { token: storedToken } })
          .then((res) => {
            if (!res.ok) {
              logout();
            }
          })
          .catch(() => {
            // Keep local state on network error
          });
      }
    } catch {}
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await adminLoginFn({ data: { email, password: pass } });
      if (res.ok && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setIsLoading(false);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return { ok: true };
      }
      return { ok: false, error: res.error || "Login failed" };
    } catch (err: any) {
      return { ok: false, error: err.message || "Failed to connect to authentication server." };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsLoading(false);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoading && !user) {
      navigate({ to: "/admin/login" });
    }
  }, [user, isLoading, navigate]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#080F35] flex items-center justify-center text-white p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#FF941E] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080F35] flex items-center justify-center text-white p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0B1437] border border-white/15 text-center shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-lg flex items-center justify-center mx-auto shadow-md">
            SW
          </div>
          <h2 className="text-lg font-bold text-white">Admin Session Required</h2>
          <p className="text-xs text-slate-300">
            Please log in with your administrator account to access this page.
          </p>
          <div className="pt-2">
            <a
              href="/admin/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-lg hover:opacity-95 transition-opacity"
            >
              Sign In to Admin Panel →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
