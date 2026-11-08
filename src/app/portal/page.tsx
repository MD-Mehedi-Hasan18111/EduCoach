"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Building2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CreditCard,
  Database,
  Key,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LogOut,
  Send,
  HelpCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TenantPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Payment submission state
  const [payModal, setPayModal] = useState<any | null>(null);
  const [payMethod, setPayMethod] = useState("BKASH");
  const [transactionId, setTransactionId] = useState("");
  const [submittingPay, setSubmittingPay] = useState(false);

  useEffect(() => {
    async function loadPortal() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.authenticated || (data.user?.role !== "TENANT_OWNER" && data.user?.role !== "COACHING_ADMIN")) {
          router.push("/login");
          return;
        }

        setUser(data.user);
        setTenant(data.user.tenantDetails);

        // Fetch tenant invoices
        const invRes = await fetch("/api/invoices");
        if (invRes.ok) {
          const invData = await invRes.json();
          setInvoices(invData.invoices || []);
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadPortal();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModal || !transactionId) return;
    setSubmittingPay(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: payModal._id,
          paymentMethod: payMethod,
          transactionId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit transaction.");
      setPayModal(null);
      setTransactionId("");
      alert("Payment transaction submitted! EduCoach Master Admin will verify shortly.");
      // Reload invoices
      const invRes = await fetch("/api/invoices");
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData.invoices || []);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingPay(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-400">Loading Coaching Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black">{tenant?.name || user?.coachingName}</h1>
            <p className="text-xs text-blue-400 font-medium">EduCoach Client Subscription Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-white">{user?.name}</div>
            <div className="text-[11px] text-slate-400">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Status & Quick Launch Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                System Status:
              </span>
              {tenant?.status === "ACTIVE" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  OPERATIONAL & ONLINE
                </span>
              )}
              {tenant?.status === "MAINTENANCE" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  SCHEDULED MAINTENANCE
                </span>
              )}
              {tenant?.status === "SUSPENDED" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  ACCESS SUSPENDED
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900">{tenant?.name}</h2>
            <p className="text-xs text-slate-600 font-mono">
              Live Website:{" "}
              <a
                href={tenant?.systemUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline font-bold"
              >
                {tenant?.systemUrl}
              </a>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={tenant?.systemUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <span>Launch Coaching Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* System Specs & Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Subscription Plan
              </span>
              <div className="text-xl font-black text-slate-900 mt-1">{tenant?.planCode} Plan</div>
              <p className="text-xs text-slate-500 mt-1">
                Valid until {formatDate(tenant?.subscriptionExpiresAt)}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Dedicated Database
              </span>
              <div className="text-base font-mono font-bold text-slate-900 mt-1">
                {tenant?.databaseName}
              </div>
              <p className="text-xs text-slate-500 mt-1">100% Isolated Private Database</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                License Key
              </span>
              <div className="text-xs font-mono font-bold text-slate-700 mt-1 select-all truncate">
                {tenant?.licenseKey}
              </div>
              <p className="text-xs text-slate-500 mt-1">Managed via EduCoach License Gateway</p>
            </div>
          </div>
        </div>

        {/* Invoices & Payment Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Billing & Invoices</h3>
              <p className="text-xs text-slate-500">
                View your subscription payment history and submit bKash/Nagad verification
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{inv.billingPeriod}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ৳{(inv.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {inv.paymentMethod || "UNSPECIFIED"}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {inv.transactionId || "—"}
                      </td>
                      <td className="py-3 px-4">
                        {inv.status === "PAID" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            PAID
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3" />
                            PENDING VERIFICATION
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.status !== "PAID" && (
                          <button
                            onClick={() => {
                              setPayModal(inv);
                              setTransactionId(inv.transactionId || "");
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                          >
                            Pay / Submit Trx
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Submission Modal */}
        {payModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    Invoice Payment
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Pay Invoice {payModal.invoiceNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setPayModal(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Payable Amount:</span>
                  <span>৳{(payModal.amount || 0).toLocaleString()} BDT</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Send payment via bKash / Nagad Merchant: <code>01700-000000</code> and enter the
                  Transaction ID below.
                </div>
              </div>

              <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Payment Method
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-semibold"
                  >
                    <option value="BKASH">bKash</option>
                    <option value="NAGAD">Nagad</option>
                    <option value="ROCKET">Rocket</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BKH981726481"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submittingPay}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingPay ? "Submitting..." : "Submit for Verification"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayModal(null)}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

