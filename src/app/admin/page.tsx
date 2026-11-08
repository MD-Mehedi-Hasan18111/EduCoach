"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Server,
  UserCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Activity,
  Database,
  Sliders,
  DollarSign,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [systems, setSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, systemsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/systems"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
          setRecentLogs(statsData.recentLogs || []);
        }

        if (systemsRes.ok) {
          const systemsData = await systemsRes.json();
          setSystems(systemsData.systems || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading Master Analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Alert Banner for Pending Requests */}
      {stats?.pendingRequests > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {stats.pendingRequests} New Coaching Center Application(s) Awaiting Review!
              </h4>
              <p className="text-xs text-amber-700">
                New institutes have registered and are requesting dedicated coaching websites and
                database provisioning.
              </p>
            </div>
          </div>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <span>Review Applications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Connected Systems
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{stats?.totalSystems || 0}</span>
            <span className="text-xs font-bold text-emerald-600">
              {stats?.activeSystems || 0} Active
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>{stats?.maintenanceSystems || 0} Maintenance</span> •{" "}
            <span>{stats?.suspendedSystems || 0} Suspended</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registration Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{stats?.pendingRequests || 0}</span>
            <span className="text-xs font-bold text-amber-600">Pending Review</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {stats?.approvedRequests || 0} Approved Applications
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Subscriptions
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {stats?.activeSubscriptions || 0}
            </span>
            <span className="text-xs font-bold text-emerald-600">Paying Institutes</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Monthly & Yearly recurring</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">
              ৳{(stats?.totalRevenue || 0).toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">From paid invoices & renewals</div>
        </div>
      </div>

      {/* Connected Coaching Systems Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Registered Coaching Systems</h3>
            <p className="text-xs text-slate-500">
              Manage live access, dedicated database configurations, and status
            </p>
          </div>
          <Link
            href="/admin/systems"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All & Manage Accessibility</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Coaching Name</th>
                <th className="py-3 px-4">Subdomain / URL</th>
                <th className="py-3 px-4">Database</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Accessibility</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {systems.slice(0, 5).map((sys) => (
                <tr key={sys._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{sys.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {sys.ownerName} ({sys.ownerEmail})
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    <a
                      href={sys.systemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>{sys.systemUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {sys.databaseName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {sys.planCode}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {sys.status === "ACTIVE" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        ACTIVE
                      </span>
                    )}
                    {sys.status === "MAINTENANCE" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        MAINTENANCE
                      </span>
                    )}
                    {sys.status === "SUSPENDED" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        SUSPENDED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/systems`}
                      className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg font-bold transition-all"
                    >
                      Configure
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Master Activity & Audits</h3>
          <Link
            href="/admin/logs"
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View Full Audit Trail →
          </Link>
        </div>

        <div className="space-y-3">
          {recentLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">No activity logs recorded yet.</p>
          ) : (
            recentLogs.map((log, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                      {log.action}
                    </span>
                    <span>{log.tenantName || log.performedBy}</span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap ml-4">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

