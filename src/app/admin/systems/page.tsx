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
  Database,
  Calendar,
  Lock,
  Trash2,
  RefreshCw,
  Edit,
  Key,
  Globe,
  Sparkles,
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

  // DB Stats Modal state
  const [dbModal, setDbModal] = useState<any | null>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbData, setDbData] = useState<any | null>(null);
  const [seedingDemo, setSeedingDemo] = useState(false);

  const handleSeedDemoSystems = async () => {
    setSeedingDemo(true);
    try {
      const res = await fetch("/api/systems/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize demo systems.");
      loadSystems();
      alert("Al-Hikmah & Shikkhon live systems have been initialized in your cloud database!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSeedingDemo(false);
    }
  };

  const handleInspectDb = async (sys: any) => {
    setDbModal(sys);
    setDbData(null);
    setDbLoading(true);
    try {
      const res = await fetch(`/api/systems/${sys._id}/stats`);
      const data = await res.json();
      setDbData(data);
    } catch (err: any) {
      setDbData({ success: false, message: err.message });
    } finally {
      setDbLoading(false);
    }
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSystemData, setNewSystemData] = useState({
    name: "",
    slug: "",
    systemUrl: "https://",
    databaseName: "",
    mongoUri: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    planCode: "FREE",
    subscriptionMonths: 12,
  });
  const [addingSystem, setAddingSystem] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

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
        systemUrl: "https://",
        databaseName: "",
        mongoUri: "",
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
            Control remote accessibility, dedicated cloud databases, and subscription tiers
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
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div>
                {/* Top header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{sys.name}</h3>
                      <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                        {sys.slug}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Director: {sys.ownerName} ({sys.ownerEmail})
                    </p>
                  </div>

                  {/* Accessibility Badge */}
                  <div>
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
                      <Database className="w-3.5 h-3.5 text-indigo-500" /> Dedicated Database:
                    </span>
                    <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {sys.databaseName}
                    </span>
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

              {/* Bottom Actions Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePing(sys._id)}
                    disabled={pingingId === sys._id}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-60"
                  >
                    <Activity
                      className={`w-3.5 h-3.5 ${pingingId === sys._id ? "animate-spin text-blue-600" : ""}`}
                    />
                    <span>{pingingId === sys._id ? "Pinging..." : "Ping"}</span>
                  </button>

                  <button
                    onClick={() => handleInspectDb(sys)}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Inspect DB</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAccessibilityModal(sys);
                      setNewStatus(sys.status);
                      setStatusReason(sys.maintenanceReason || sys.suspensionReason || "");
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
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
                      databaseName: newSystemData.databaseName || `${e.target.value.toLowerCase().replace(/\s+/g, "_")}_db`,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Slug / Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="alhikma"
                    value={newSystemData.slug}
                    onChange={(e) => setNewSystemData({ ...newSystemData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    System Live URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://yourcoaching.vercel.app"
                    value={newSystemData.systemUrl}
                    onChange={(e) =>
                      setNewSystemData({ ...newSystemData, systemUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Separate Database Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="coaching_management_system"
                  value={newSystemData.databaseName}
                  onChange={(e) =>
                    setNewSystemData({ ...newSystemData, databaseName: e.target.value })
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
      {/* Database Inspection Modal */}
      {dbModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Dedicated Database Diagnostics
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{dbModal.name}</h3>
                <p className="text-xs text-slate-500 font-mono">DB: {dbModal.databaseName}</p>
              </div>
              <button
                onClick={() => setDbModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {dbLoading ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold">Connecting to child database instance...</span>
              </div>
            ) : dbData ? (
              <div className="space-y-4">
                {dbData.connected ? (
                  <>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Database connection established. {dbData.totalCollections} collections detected.</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Students</span>
                        <span className="text-2xl font-black text-slate-900">{dbData.counts?.students || 0}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Teachers</span>
                        <span className="text-2xl font-black text-slate-900">{dbData.counts?.teachers || 0}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Batches</span>
                        <span className="text-2xl font-black text-slate-900">{dbData.counts?.batches || 0}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Exams</span>
                        <span className="text-2xl font-black text-slate-900">{dbData.counts?.exams || 0}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Payments</span>
                        <span className="text-2xl font-black text-slate-900">{dbData.counts?.payments || 0}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Collections</span>
                        <span className="text-2xl font-black text-blue-600">{dbData.totalCollections || 0}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Detected Collections:</span>
                      <div className="flex flex-wrap gap-1">
                        {dbData.collections?.map((c: string) => (
                          <span key={c} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl space-y-1">
                    <span className="font-bold block">Could not query child database directly:</span>
                    <p>{dbData.message || dbData.error}</p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Check that child database access permissions allow connections from your current network IP address.
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            <div className="pt-2 text-right">
              <button
                onClick={() => setDbModal(null)}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

