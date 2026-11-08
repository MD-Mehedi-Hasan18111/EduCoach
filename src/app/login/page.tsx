"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building2,
  Sparkles,
  KeyRound,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    const finalEmail = loginEmail || email;
    const finalPass = loginPassword || password;

    if (!finalEmail || !finalPass) {
      setError("Please provide both email and password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: finalEmail, password: finalPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      if (data.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else if (data.role === "TENANT_OWNER" || data.role === "COACHING_ADMIN") {
        router.push("/portal");
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const autofillAndLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLogin(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/25 mb-4">
              <Layers className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In to EduCoach
            </h1>
            {/* <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Access Super Admin Master Console or Coaching Owner Portal
            </p> */}
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="admin@educoach.com or owner@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins */}
            {/* <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                Quick Demo Access
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => autofillAndLogin("admin@educoach.com", "EduCoach@2026")}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Master Super Admin</span>
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                    Auto-Fill
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => autofillAndLogin("admin@alhikma.com", "coaching123")}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Al-Hikmah Portal Admin</span>
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                    Auto-Fill
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => autofillAndLogin("admin@shikkhon.com", "coaching123")}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span>Shikkhon Portal Admin</span>
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                    Auto-Fill
                  </span>
                </button>
              </div>
            </div> */}
          </div>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have a coaching website yet?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Register your coaching center →
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

