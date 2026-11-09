"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Server,
  Plus,
  Search,
  ExternalLink,
  Activity,
  Sliders,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Lock,
  Trash2,
  RefreshCw,
  Edit,
  Key,
  Globe,
  Sparkles,
  Share2,
  BookOpen,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminSystemsPage() {
  const [systems, setSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<any | null>(null);

  // Modals state
  const [accessibilityModal, setAccessibilityModal] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>("ACTIVE");
  const [statusReason, setStatusReason] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSystemData, setNewSystemData] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    tagline: "",
    facebookUrl: "",
    batchTypes: ["Class 9-10 (SSC Program)", "Class 11-12 (HSC Science)"] as string[],
    systemUrl: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    planCode: "FREE",
    subscriptionMonths: 12,
  });
  const [addingSystem, setAddingSystem] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Edit System Modal state
  const [editModal, setEditModal] = useState<any | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({
    name: "",
    systemUrl: "",
    logoUrl: "",
    tagline: "",
    facebookUrl: "",
    planCode: "FREE",
    subscriptionStatus: "ACTIVE",
    subscriptionExpiresAt: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    features: {
      smsAlerts: false,
      onlineAdmission: true,
      examPortal: true,
      accountsManagement: true,
      customDomain: false,
      prioritySupport: false,
    },
    notes: "",
  });

  const openEditModal = (sys: any) => {
    setEditModal(sys);
    setEditError(null);
    const expireDateStr = sys.subscriptionExpiresAt
      ? new Date(sys.subscriptionExpiresAt).toISOString().split("T")[0]
      : "";
    setEditForm({
      name: sys.name || "",
      systemUrl: sys.systemUrl || "",
      logoUrl: sys.logoUrl || "",
      tagline: sys.tagline || "",
      facebookUrl: sys.facebookUrl || "",
      planCode: sys.planCode || "FREE",
      subscriptionStatus: sys.subscriptionStatus || "ACTIVE",
      subscriptionExpiresAt: expireDateStr,
      ownerName: sys.ownerName || "",
      ownerEmail: sys.ownerEmail || "",
      ownerPhone: sys.ownerPhone || "",
      features: {
        smsAlerts: !!sys.features?.smsAlerts,
        onlineAdmission: !!sys.features?.onlineAdmission,
        examPortal: !!sys.features?.examPortal,
        accountsManagement: !!sys.features?.accountsManagement,
        customDomain: !!sys.features?.customDomain,
        prioritySupport: !!sys.features?.prioritySupport,
      },
      notes: sys.notes || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    setSavingEdit(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/systems/${editModal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update coaching system.");
      setEditModal(null);
      loadSystems();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const loadSystems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/systems?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (res.ok) {
        setSystems(data.systems || []);
      }
    } catch (err) {
      console.error("Failed to load systems:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystems();
  }, [statusFilter]);

  const handlePing = async (id: string) => {
    setPingingId(id);
    setPingResult(null);
    try {
      const res = await fetch(`/api/systems/${id}/ping`, { method: "POST" });
      const data = await res.json();
      setPingResult({ id, ...data });
      // Refresh list to update status
      loadSystems();
    } catch (err: any) {
      setPingResult({ id, success: false, message: err.message });
    } finally {
      setPingingId(null);
    }
  };

  const handleUpdateAccessibility = async () => {
    if (!accessibilityModal) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/systems/${accessibilityModal._id}/accessibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason: statusReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update accessibility.");
      setAccessibilityModal(null);
      loadSystems();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setAddingSystem(true);

    try {
      const res = await fetch("/api/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSystemData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register system.");
      setAddModalOpen(false);
      setNewSystemData({
        name: "",
        slug: "",
        logoUrl: "",
        tagline: "",
        facebookUrl: "",
        batchTypes: ["Class 9-10 (SSC Program)", "Class 11-12 (HSC Science)"],
        systemUrl: "",
        ownerName: "",
        ownerEmail: "",
        ownerPhone: "",
        planCode: "FREE",
        subscriptionMonths: 12,
      });
      loadSystems();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setAddingSystem(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Coaching Systems Management</h1>
          <p className="text-xs text-slate-500">
            Control remote accessibility, deployed coaching websites, and subscription tiers
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coaching System</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadSystems();
          }}
          className="flex items-center gap-2 w-full sm:w-80 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, slug, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {["ALL", "ACTIVE", "MAINTENANCE", "SUSPENDED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
          <button
            onClick={loadSystems}
            title="Refresh"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Health Ping Feedback Banner */}
      {pingResult && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
            pingResult.status === "ONLINE"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {pingResult.status === "ONLINE" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{pingResult.message}</span>
          </div>
          <button
            onClick={() => setPingResult(null)}
            className="text-slate-400 hover:text-slate-700 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Systems Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading systems...</div>
      ) : systems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-4">
          <Server className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-800">No coaching systems registered in database yet.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Register a new coaching institute manually or review incoming registration requests submitted from the registration page.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-blue-100" />
              <span>Add Coaching System</span>
            </button>
            <Link
              href="/admin/requests"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-2"
            >
              <span>View Registration Requests</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {systems.map((sys) => (
            <div
              key={sys._id}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 sm:space-y-5 flex flex-col justify-between"
            >
              <div>
                {/* Top header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {sys.logoUrl ? (
                      <div className="w-12 h-12 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 p-1 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sys.logoUrl}
                          alt={sys.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center shrink-0">
                        {sys.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">{sys.name}</h3>
                      {sys.tagline && (
                        <p className="text-xs text-slate-500 italic mt-0.5">&ldquo;{sys.tagline}&rdquo;</p>
                      )}
                      <p className="text-xs text-slate-500 mt-0.5">
                        Director: {sys.ownerName} ({sys.ownerEmail})
                      </p>
                    </div>
                  </div>

                  {/* Accessibility Badge & Social link */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {sys.facebookUrl && (
                      <a
                        href={sys.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {sys.status === "ACTIVE" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        ACTIVE
                      </span>
                    )}
                    {sys.status === "MAINTENANCE" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        MAINTENANCE
                      </span>
                    )}
                    {sys.status === "SUSPENDED" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        SUSPENDED
                      </span>
                    )}
                  </div>
                </div>

                {/* Batch Types Pills if any */}
                {sys.batchTypes && sys.batchTypes.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 mr-0.5">
                      <BookOpen className="w-3 h-3" /> Batches:
                    </span>
                    {sys.batchTypes.map((batch: string) => (
                      <span
                        key={batch}
                        className="text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200/60 px-2 py-0.5 rounded-md"
                      >
                        {batch}
                      </span>
                    ))}
                  </div>
                )}

                {/* Status Notice if Maintenance or Suspended */}
                {(sys.status === "MAINTENANCE" || sys.status === "SUSPENDED") && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900">Reason: </span>
                    <span>{sys.maintenanceReason || sys.suspensionReason || "Administrative hold"}</span>
                  </div>
                )}

                {/* Details Box */}
                <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-500" /> Live Web Address:
                    </span>
                    <a
                      href={sys.systemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-mono font-bold flex items-center gap-1"
                    >
                      <span>{sys.systemUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Subscription Plan:
                    </span>
                    <span className="font-bold text-slate-800">
                      {sys.planCode} (Expires: {formatDate(sys.subscriptionExpiresAt)})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-500" /> License Key:
                    </span>
                    <span className="font-mono text-[11px] text-slate-600 select-all">
                      {sys.licenseKey}
                    </span>
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      sys.features?.smsAlerts
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-400 line-through"
                    }`}
                  >
                    SMS Alerts
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      sys.features?.onlineAdmission
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-400 line-through"
                    }`}
                  >
                    Online Admission
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      sys.features?.examPortal
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-400 line-through"
                    }`}
                  >
                    Exam Portal
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      sys.features?.accountsManagement
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-400 line-through"
                    }`}
                  >
                    Fee Accounts
                  </span>
                </div>
              </div>

              {/* Bottom Actions Bar - Responsive wrap for mobile cards */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handlePing(sys._id)}
                    disabled={pingingId === sys._id}
                    className="flex-1 sm:flex-none px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    <Activity
                      className={`w-3.5 h-3.5 ${pingingId === sys._id ? "animate-spin text-blue-600" : ""}`}
                    />
                    <span>{pingingId === sys._id ? "Pinging..." : "Ping"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => openEditModal(sys)}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      setAccessibilityModal(sys);
                      setNewStatus(sys.status);
                      setStatusReason(sys.maintenanceReason || sys.suspensionReason || "");
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Control Access</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accessibility Switch Modal */}
      {accessibilityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  System Accessibility Control
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {accessibilityModal.name}
                </h3>
              </div>
              <button
                onClick={() => setAccessibilityModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Accessibility State:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus("ACTIVE")}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      newStatus === "ACTIVE"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    ACTIVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus("MAINTENANCE")}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      newStatus === "MAINTENANCE"
                        ? "bg-amber-500 text-white border-amber-500 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    MAINTENANCE
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus("SUSPENDED")}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      newStatus === "SUSPENDED"
                        ? "bg-rose-600 text-white border-rose-600 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    SUSPENDED
                  </button>
                </div>
              </div>

              {newStatus !== "ACTIVE" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    User-facing Notice Reason:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Server maintenance underway. Back online at 4:00 PM."
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    This message will be served to the child website via EduCoach License API.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleUpdateAccessibility}
                disabled={updatingStatus}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-60"
              >
                {updatingStatus ? "Applying Changes..." : "Save Accessibility State"}
              </button>
              <button
                onClick={() => setAccessibilityModal(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Coaching System Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Manual Registration
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Add Coaching System</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddSystem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Coaching Institute Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al Hikma Coaching Center"
                  value={newSystemData.name}
                  onChange={(e) =>
                    setNewSystemData({
                      ...newSystemData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Live Coaching Website URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://yourcoaching.vercel.app or https://yourcoaching.com"
                  value={newSystemData.systemUrl}
                  onChange={(e) =>
                    setNewSystemData({ ...newSystemData, systemUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Provide the live deployed website URL for this coaching center.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Slogan / Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. জ্ঞানের আলোয় উদ্ভাসিত"
                    value={newSystemData.tagline}
                    onChange={(e) =>
                      setNewSystemData({ ...newSystemData, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Logo Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={newSystemData.logoUrl}
                    onChange={(e) =>
                      setNewSystemData({ ...newSystemData, logoUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Facebook Page / Group URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/yourcoaching"
                  value={newSystemData.facebookUrl}
                  onChange={(e) =>
                    setNewSystemData({ ...newSystemData, facebookUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Director / Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mohammad Hasan"
                    value={newSystemData.ownerName}
                    onChange={(e) =>
                      setNewSystemData({ ...newSystemData, ownerName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Owner Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="director@coaching.com"
                    value={newSystemData.ownerEmail}
                    onChange={(e) =>
                      setNewSystemData({ ...newSystemData, ownerEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Plan Code
                  </label>
                  <select
                    value={newSystemData.planCode}
                    onChange={(e) =>
                      setNewSystemData({ ...newSystemData, planCode: e.target.value })
                    }
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
                    Subscription Duration
                  </label>
                  <select
                    value={newSystemData.subscriptionMonths}
                    onChange={(e) =>
                      setNewSystemData({
                        ...newSystemData,
                        subscriptionMonths: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months (1 Year)</option>
                    <option value={24}>24 Months (2 Years)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={addingSystem}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-60"
                >
                  {addingSystem ? "Registering..." : "Register Coaching System"}
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coaching System Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  System Configuration
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Edit {editModal.name}
                </h3>
              </div>
              <button
                onClick={() => setEditModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-5 text-xs">
              {/* Section 1: Core System & URL */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-600 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Core System &amp; Web Address</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Coaching Institute Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Live Coaching Website URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={editForm.systemUrl}
                      onChange={(e) => setEditForm({ ...editForm, systemUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Subscription & Expiration */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-600 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Subscription Tier &amp; Status</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Plan Tier
                    </label>
                    <select
                      value={editForm.planCode}
                      onChange={(e) => setEditForm({ ...editForm, planCode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="FREE">Free MVP Tier</option>
                      <option value="STARTER">Starter Tier</option>
                      <option value="STANDARD">Standard Growth</option>
                      <option value="PRO">Institutional Pro</option>
                      <option value="ENTERPRISE">Enterprise Multi-Campus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Subscription Status
                    </label>
                    <select
                      value={editForm.subscriptionStatus}
                      onChange={(e) => setEditForm({ ...editForm, subscriptionStatus: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="ACTIVE">ACTIVE (Active License)</option>
                      <option value="TRIAL">TRIAL (Evaluation)</option>
                      <option value="EXPIRED">EXPIRED (Suspended/Grace)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Expires On
                    </label>
                    <input
                      type="date"
                      value={editForm.subscriptionExpiresAt}
                      onChange={(e) => setEditForm({ ...editForm, subscriptionExpiresAt: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Branding & Social */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-600 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Branding &amp; Social Links</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Slogan / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. জ্ঞানের আলোয় উদ্ভাসিত"
                      value={editForm.tagline}
                      onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Logo Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={editForm.logoUrl}
                      onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/yourcoaching"
                    value={editForm.facebookUrl}
                    onChange={(e) => setEditForm({ ...editForm, facebookUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Section 4: Director Information */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-600 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <span>Director &amp; Owner Contact</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Director Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.ownerName}
                      onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Owner Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={editForm.ownerEmail}
                      onChange={(e) => setEditForm({ ...editForm, ownerEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editForm.ownerPhone}
                      onChange={(e) => setEditForm({ ...editForm, ownerPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Feature Flags */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-600 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <span>System Modules &amp; Feature Flags</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { key: "onlineAdmission", label: "Online Admission" },
                    { key: "examPortal", label: "Exam & Results Portal" },
                    { key: "accountsManagement", label: "Fee Accounts & Receipts" },
                    { key: "smsAlerts", label: "SMS Alerts Gateway" },
                    { key: "customDomain", label: "Custom Domain Mapping" },
                    { key: "prioritySupport", label: "Priority SLA Support" },
                  ].map((feat) => {
                    const isChecked = !!editForm.features?.[feat.key];
                    return (
                      <button
                        type="button"
                        key={feat.key}
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            features: {
                              ...editForm.features,
                              [feat.key]: !isChecked,
                            },
                          })
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? "bg-blue-50 border-blue-400 text-blue-900 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}
                      >
                        <span className="text-[11px]">{feat.label}</span>
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isChecked ? "bg-blue-600 text-white" : "border border-slate-300"
                          }`}
                        >
                          {isChecked ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-60 cursor-pointer"
                >
                  {savingEdit ? "Saving Changes..." : "Save System Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
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

