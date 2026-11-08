"use client";

import { useEffect, useState } from "react";
import { FileText, Shield, Clock, Search, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.recentLogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Audit & Access Logs</h1>
          <p className="text-xs text-slate-500">
            Real-time security trail of accessibility switches, renewals, and system modifications
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading audit records...</div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">No activity logged yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log, i) => (
              <div key={i} className="py-4 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">
                      {log.tenantName || log.performedBy}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-semibold">{log.category}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{log.details}</p>
                  <div className="text-[11px] text-slate-400">
                    Performed by: <span className="font-semibold text-slate-600">{log.performedBy}</span>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap text-slate-400 font-mono text-[11px]">
                  {formatDate(log.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

