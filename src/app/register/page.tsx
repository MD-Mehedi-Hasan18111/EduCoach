"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  Clock,
  Copy,
} from "lucide-react";
import { slugify } from "@/lib/utils";

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "FREE";
  const initialCycle = (searchParams.get("cycle") as "MONTHLY" | "YEARLY") || "YEARLY";

  const [formData, setFormData] = useState({
    coachingName: "",
    requestedSlug: "",
    directorName: "",
    email: "",
    phone: "",
    city: "Dhaka",
    address: "",
    estimatedStudents: 150,
    planCode: initialPlan,
    billingCycle: initialCycle,
    customRequirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (formData.coachingName && !formData.requestedSlug) {
      setFormData((prev) => ({ ...prev, requestedSlug: slugify(prev.coachingName) }));
    }
  }, [formData.coachingName]);

  const plansMeta: Record<
    string,
    { name: string; monthly: number; yearly: number; maxStudents: number; maxBatches: number; available: boolean }
  > = {
    FREE: {
      name: "Free MVP Tier",
      monthly: 0,
      yearly: 0,
      maxStudents: 200,
      maxBatches: 10,
      available: true,
    },
    STANDARD: {
      name: "Standard Growth (Planned)",
      monthly: 2999,
      yearly: 29990,
      maxStudents: 600,
      maxBatches: 30,
      available: false,
    },
    PRO: {
      name: "Institute Pro (Planned)",
      monthly: 5999,
      yearly: 59990,
      maxStudents: 2000,
      maxBatches: 80,
      available: false,
    },
  };

  const selectedPlan = plansMeta[formData.planCode] || plansMeta.FREE;
  const planPrice = formData.billingCycle === "YEARLY" ? selectedPlan.yearly : selectedPlan.monthly;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSuccessResult(data.request);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyReference = () => {
    if (successResult?.referenceCode) {
      navigator.clipboard.writeText(successResult.referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (successResult) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 py-16 px-4">
          <div className="max-w-xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Application Received Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Welcome to EduCoach!
              </h2>
              <p className="text-sm text-slate-600">
                Your request to register <strong>{successResult.coachingName}</strong> has been
                submitted to EduCoach Master Admin.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase">Tracking Reference Code:</span>
                <button
                  onClick={copyReference}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
              <div className="text-2xl font-mono font-black text-slate-900 tracking-wider bg-white p-3 rounded-xl border border-slate-200 text-center">
                {successResult.referenceCode}
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Save this reference code. You can use it to track your application approval status anytime.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/track?q=${successResult.referenceCode}`}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
              >
                Track Status Online
              </Link>
              <Link
                href="/"
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              New Coaching Setup
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Register Your Coaching Center
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Request a dedicated coaching website, isolated private database, and complete student
              management suite.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coaching Information */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Institute Information</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Coaching Center / Institute Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Academic Care, Al Hikma Coaching"
                        value={formData.coachingName}
                        onChange={(e) => setFormData({ ...formData, coachingName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Desired Subdomain / Identifier *
                      </label>
                      <div className="flex items-center">
                        <span className="px-3.5 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs font-semibold text-slate-500">
                          https://
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="apexcare"
                          value={formData.requestedSlug}
                          onChange={(e) =>
                            setFormData({ ...formData, requestedSlug: slugify(e.target.value) })
                          }
                          className="flex-1 px-4 py-3 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="px-3.5 py-3 bg-slate-100 border border-l-0 border-slate-300 rounded-r-xl text-xs font-semibold text-slate-500">
                          .educoach.app
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Your custom portal will be accessible at this web address.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          City / District
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Dhaka, Chittagong, Sylhet"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Estimated Active Students
                        </label>
                        <select
                          value={formData.estimatedStudents}
                          onChange={(e) =>
                            setFormData({ ...formData, estimatedStudents: Number(e.target.value) })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value={50}>Under 50 Students</option>
                          <option value={150}>50 - 150 Students</option>
                          <option value={350}>150 - 500 Students</option>
                          <option value={800}>500 - 1,500 Students</option>
                          <option value={2000}>1,500+ Students</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Director / Owner Contact */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Director / Owner Information</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mohammad Hasan, Dr. Rafiqul Islam"
                        value={formData.directorName}
                        onChange={(e) =>
                          setFormData({ ...formData, directorName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="director@coaching.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Mobile / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+880 1712-345678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Selection */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Subscription Plan & Cycle</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {Object.entries(plansMeta).map(([code, p]) => (
                      <button
                        type="button"
                        key={code}
                        disabled={!p.available}
                        onClick={() => p.available && setFormData({ ...formData, planCode: code })}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          formData.planCode === code
                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500"
                            : p.available
                            ? "border-slate-200 hover:border-slate-300 bg-white"
                            : "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-slate-900">{p.name}</div>
                          {p.available && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              ফ্রি MVP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {p.maxStudents} শিক্ষার্থী • {p.maxBatches} ব্যাচ
                        </div>
                        <div className="text-xs font-black text-slate-800 mt-1">
                          {p.monthly === 0 ? "৳০ (ফ্রি)" : `৳${p.monthly}/মাস`}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-700 uppercase">Billing Cycle:</span>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="billingCycle"
                        checked={formData.billingCycle === "MONTHLY"}
                        onChange={() => setFormData({ ...formData, billingCycle: "MONTHLY" })}
                        className="text-blue-600"
                      />
                      <span>Monthly</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="billingCycle"
                        checked={formData.billingCycle === "YEARLY"}
                        onChange={() => setFormData({ ...formData, billingCycle: "YEARLY" })}
                        className="text-blue-600"
                      />
                      <span>Yearly (Save 17%)</span>
                    </label>
                  </div>
                </div>

                {/* Custom Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Special Requests / Custom Modules Needed (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., We need SMS gateway for absentee alerts, or special discount for multi-campus..."
                    value={formData.customRequirements}
                    onChange={(e) =>
                      setFormData({ ...formData, customRequirements: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Submit Coaching Website Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-900/50 px-2.5 py-1 rounded-full">
                  Subscription Summary
                </span>
                <h3 className="text-xl font-bold mt-2">What Your Institute Gets</h3>
              </div>

              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">{selectedPlan.name}</span>
                  <span className="text-xs text-blue-400 font-semibold uppercase">
                    {formData.billingCycle}
                  </span>
                </div>

                <div className="text-3xl font-black text-white">
                  {selectedPlan.monthly === 0 ? "৳০" : `৳${planPrice.toLocaleString()}`}
                  <span className="text-xs font-normal text-slate-400">
                    {selectedPlan.monthly === 0 ? " / ফ্রি MVP প্যাকেজ" : `/${formData.billingCycle === "YEARLY" ? "year" : "month"}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-700 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>সর্বোচ্চ ২০০ শিক্ষার্থী ও ১০টি ব্যাচ অন্তর্ভুক্ত</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>সম্পূর্ণ স্বতন্ত্র ও এনক্রিপ্টেড ক্লাউড ডেটাবেজ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>ডিজিটাল হাজিরা, গ্রেডিং ও মেধা তালিকা (Rank)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>শিক্ষার্থী, শিক্ষক ও অ্যাডমিন পৃথক পোর্টাল</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>লাইভ মেসেঞ্জার চ্যাট ও নোটিফিকেশন সেন্টার</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>অনলাইন ফি কালেকশন ও রসিদ প্রিন্ট সুবিধা</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>No payment required now. Your invoice will be generated upon approval.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Approvals are normally processed within 2 to 6 hours.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-center">
                <Link
                  href="/track"
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Already submitted an application? Track status here →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading registration form...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

