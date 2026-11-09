"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  Building2,
  Mail,
  Phone,
  Database,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Share2,
  BookOpen,
  Globe,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [counts, setCounts] = useState<{ PENDING: number; APPROVED: number; REJECTED: number; ALL: number }>({
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    ALL: 0,
  });

  // Approval form state
  const [approveModal, setApproveModal] = useState<any | null>(null);
  const [systemUrl, setSystemUrl] = useState("");
  const [initialPassword, setInitialPassword] = useState("EduCoach@123");
  const [processing, setProcessing] = useState(false);

  // Rejection state
  const [rejectModal, setRejectModal] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/requests?status=${statusFilter}`);
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const openApproveModal = (req: any) => {
    setApproveModal(req);
    setSystemUrl("");
    setInitialPassword("EduCoach@123");
  };

  const handleApprove = async () => {
    if (!approveModal) return;
    if (!systemUrl.trim()) {
      alert("Please provide the Live Coaching Website URL before approving.");
      return;
    }
    setProcessing(true);
    try {
      const res = await fetch(`/api/requests/${approveModal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE",
          systemUrl,
          initialPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve request.");
      setApproveModal(null);
      await loadRequests();
      window.dispatchEvent(new CustomEvent("refresh-pending-count"));
      alert(`Success! Coaching system provisioned with initial password: ${initialPassword}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/requests/${rejectModal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          rejectionReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject request.");
      setRejectModal(null);
      await loadRequests();
      window.dispatchEvent(new CustomEvent("refresh-pending-count"));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Coaching Registration Requests</h1>
          <p className="text-xs text-slate-500">
            Review incoming requests for new coaching websites, dedicated DBs & subscriptions
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { key: "PENDING", label: "Pending", count: counts.PENDING },
            { key: "APPROVED", label: "Approved", count: counts.APPROVED },
            { key: "REJECTED", label: "Declined", count: counts.REJECTED },
            { key: "ALL", label: "All Requests", count: counts.ALL },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                statusFilter === st.key
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{st.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  statusFilter === st.key
                    ? "bg-slate-800 text-slate-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {st.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-2">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold">No {statusFilter.toLowerCase()} requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {req.logoUrl ? (
                      <div className="w-12 h-12 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 p-1 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={req.logoUrl}
                          alt={req.coachingName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center shrink-0">
                        {req.coachingName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          REF: {req.referenceCode}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">{req.coachingName}</h3>
                        {req.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3 animate-spin" />
                            Pending Approval
                          </span>
                        )}
                        {req.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                        {req.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            Declined
                          </span>
                        )}
                      </div>
                      {req.tagline && (
                        <p className="text-xs text-slate-500 italic mt-0.5">&ldquo;{req.tagline}&rdquo;</p>
                      )}
                    </div>
                  </div>

                  {/* Social & Web badges */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    {req.facebookUrl && (
                      <a
                        href={req.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {req.youtubeUrl && (
                      <a
                        href={req.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center gap-1"
                      >
                        <span>YouTube</span>
                      </a>
                    )}
                    {req.websiteUrl && (
                      <a
                        href={req.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Site</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Batch Types Pills */}
                {req.batchTypes && req.batchTypes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Batches:
                    </span>
                    {req.batchTypes.map((batch: string) => (
                      <span
                        key={batch}
                        className="text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200/60 px-2 py-0.5 rounded-md"
                      >
                        {batch}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Director Contact:</span>
                    <span className="font-bold text-slate-800">{req.directorName}</span>
                    <div className="text-[11px] text-slate-500">{req.email}</div>
                    <div className="text-[11px] text-slate-500">{req.phone}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Plan &amp; Cycle:</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {req.planCode} ({req.billingCycle})
                    </span>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Est. {req.estimatedStudents} Students
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Location:</span>
                    <span className="font-semibold text-slate-700">
                      {req.city || "Dhaka"}, Bangladesh
                    </span>
                    <div className="text-[11px] text-slate-500 truncate">{req.address}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Requested On:</span>
                    <span className="font-semibold text-slate-700">
                      {formatDate(req.createdAt)}
                    </span>
                  </div>
                </div>

                {req.customRequirements && (
                  <p className="text-xs text-slate-600 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900">Special Notes: </span>
                    {req.customRequirements}
                  </p>
                )}

                {req.status === "APPROVED" && req.assignedSystemUrl && (
                  <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span>Provisioned URL: <code className="font-bold">{req.assignedSystemUrl}</code></span>
                    <a
                      href={req.assignedSystemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Open Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons for Pending */}
              {req.status === "PENDING" && (
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => openApproveModal(req)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Provision</span>
                  </button>
                  <button
                    onClick={() => {
                      setRejectModal(req);
                      setRejectionReason("");
                    }}
                    className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approval & Provisioning Modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Approve Application
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Provision {approveModal.coachingName}
                </h3>
              </div>
              <button
                onClick={() => setApproveModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Live Coaching Website URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://al-hikmah-five.vercel.app or https://yourcoaching.com"
                  value={systemUrl}
                  onChange={(e) => setSystemUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Provide the live deployed website URL for this coaching center (Vercel deployment or custom domain).
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Initial Portal Password for Director *
                </label>
                <input
                  type="text"
                  required
                  value={initialPassword}
                  onChange={(e) => setInitialPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  The director can use their email ({approveModal.email}) and this password to log
                  into EduCoach Client Portal.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 block uppercase text-[10px]">
                  What happens upon approval:
                </span>
                <p className="text-slate-600">
                  ✓ Creates Tenant record with license key
                </p>
                <p className="text-slate-600">
                  ✓ Initializes active {approveModal.planCode} subscription
                </p>
                <p className="text-slate-600">
                  ✓ Generates billing invoice & marks request as APPROVED
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-60"
              >
                {processing ? "Provisioning..." : "Confirm & Provision System"}
              </button>
              <button
                onClick={() => setApproveModal(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Decline Application
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Reject {rejectModal.coachingName}
                </h3>
              </div>
              <button
                onClick={() => setRejectModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Rejection Reason (Visible to applicant):
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Duplicate request or incomplete coaching institute credentials."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-60"
              >
                {processing ? "Rejecting..." : "Confirm Rejection"}
              </button>
              <button
                onClick={() => setRejectModal(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

