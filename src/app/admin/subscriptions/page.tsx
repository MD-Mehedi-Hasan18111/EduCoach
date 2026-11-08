"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Plus,
  FileText,
  Search,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [systems, setSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Renewal Modal
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [renewPlan, setRenewPlan] = useState("STANDARD");
  const [renewCycle, setRenewCycle] = useState("YEARLY");
  const [durationMonths, setDurationMonths] = useState(12);
  const [customAmount, setCustomAmount] = useState<number | string>("");
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subsRes, invsRes, sysRes] = await Promise.all([
        fetch("/api/subscriptions"),
        fetch("/api/invoices"),
        fetch("/api/systems"),
      ]);

      if (subsRes.ok) {
        const d = await subsRes.json();
        setSubscriptions(d.subscriptions || []);
      }
      if (invsRes.ok) {
        const d = await invsRes.json();
        setInvoices(d.invoices || []);
      }
      if (sysRes.ok) {
        const d = await sysRes.json();
        setSystems(d.systems || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantId) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: selectedTenantId,
          planCode: renewPlan,
          billingCycle: renewCycle,
          durationMonths,
          amount: customAmount ? Number(customAmount) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to renew subscription.");
      setRenewModalOpen(false);
      loadData();
      alert("Subscription renewed successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkPaid = async (invoiceId: string) => {
    const trxId = prompt("Enter bKash/Bank Transaction ID (Optional):", "MANUAL-PAY");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          status: "PAID",
          paymentMethod: "MANUAL",
          transactionId: trxId || "CONFIRMED",
        }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Subscriptions & Billing</h1>
          <p className="text-xs text-slate-500">
            Manage coaching institute license validities, plan renewals, and digital invoices
          </p>
        </div>

        <button
          onClick={() => {
            if (systems.length > 0) setSelectedTenantId(systems[0]._id);
            setRenewModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Renew / Extend Subscription</span>
        </button>
      </div>

      {/* Active Subscriptions Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Active Tenant Subscriptions</h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {subscriptions.length} Records
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading subscriptions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Coaching Institute</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Billing Cycle</th>
                  <th className="py-3 px-4">Valid Period</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {subscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{sub.coachingName}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                        {sub.planCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{sub.billingCycle}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(sub.startDate)} - {formatDate(sub.endDate)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ৳{(sub.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoices & Payment Receipts */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Invoices & Payment Logs</h3>
            <p className="text-xs text-slate-500">
              Track paid invoices, bKash/Nagad transactions, and overdue billing
            </p>
          </div>
          <button
            onClick={loadData}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Coaching Name</th>
                <th className="py-3 px-4">Period / Notes</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Trx ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{inv.coachingName}</div>
                    <div className="text-[11px] text-slate-400">{inv.ownerEmail}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{inv.billingPeriod}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ৳{(inv.amount || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {inv.paymentMethod || "UNSPECIFIED"}
                    </span>
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
                        PENDING
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {inv.status !== "PAID" && (
                      <button
                        onClick={() => handleMarkPaid(inv._id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Renewal Modal */}
      {renewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Subscription Extension
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Renew Coaching Subscription
                </h3>
              </div>
              <button
                onClick={() => setRenewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRenew} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Select Coaching Institute *
                </label>
                <select
                  required
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-semibold"
                >
                  {systems.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Plan Tier
                  </label>
                  <select
                    value={renewPlan}
                    onChange={(e) => setRenewPlan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="STARTER">Starter Basic</option>
                    <option value="STANDARD">Standard Growth</option>
                    <option value="PRO">Professional Institute</option>
                    <option value="ENTERPRISE">Enterprise Multi-Branch</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Cycle
                  </label>
                  <select
                    value={renewCycle}
                    onChange={(e) => setRenewCycle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="YEARLY">Yearly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Duration (Months)
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value={1}>1 Month Extension</option>
                  <option value={3}>3 Months Extension</option>
                  <option value={6}>6 Months Extension</option>
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Custom Amount (BDT) - Leave empty for standard plan price
                </label>
                <input
                  type="number"
                  placeholder="e.g. 29990"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-60"
                >
                  {processing ? "Renewing..." : "Confirm Subscription Renewal"}
                </button>
                <button
                  type="button"
                  onClick={() => setRenewModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

