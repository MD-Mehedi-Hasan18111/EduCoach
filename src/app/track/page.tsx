"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Building2,
  Globe,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSearch = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/requests/track?q=${encodeURIComponent(searchVal.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No matching registration request found.");
      }

      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Application Tracker
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Track Coaching Registration Status
            </h1>
            <p className="text-sm text-slate-600">
              Enter your tracking reference code (e.g. <code>REQ-XXXXXX</code>) or director email.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              placeholder="e.g. REQ-7X8A91 or director@email.com"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-2 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-60"
            >
              {loading ? "Searching..." : "Track Status"}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results List */}
          {results && results.length > 0 && (
            <div className="space-y-6">
              {results.map((req, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        REF: {req.referenceCode}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{req.coachingName}</h3>
                      <p className="text-xs text-slate-500">
                        Director: {req.directorName} • {req.email}
                      </p>
                    </div>

                    <div>
                      {req.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          Under Review
                        </span>
                      )}
                      {req.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved & Active
                        </span>
                      )}
                      {req.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" />
                          Application Declined
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Requested Plan:</span>
                      <span className="font-bold text-slate-800">{req.planCode} ({req.billingCycle})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Submitted On:</span>
                      <span className="font-bold text-slate-800">{formatDate(req.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Subdomain:</span>
                      <span className="font-bold text-blue-600 font-mono">{req.requestedSlug}.educoach.app</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Reviewed On:</span>
                      <span className="font-bold text-slate-800">
                        {req.reviewedAt ? formatDate(req.reviewedAt) : "Pending"}
                      </span>
                    </div>
                  </div>

                  {req.status === "APPROVED" && req.assignedSystemUrl && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 uppercase">
                          🎉 Your Website is Ready!
                        </span>
                        <a
                          href={req.assignedSystemUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                        >
                          <span>Launch System</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Assigned Live URL: <code className="font-bold font-mono">{req.assignedSystemUrl}</code>
                      </p>
                    </div>
                  )}

                  {req.status === "REJECTED" && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                      <span className="font-bold block uppercase">Reviewer Feedback:</span>
                      <p>{req.rejectionReason || "Please contact support for more details."}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}

