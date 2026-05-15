import { useState, useEffect, useCallback } from "react";
import {
  DollarSign, Users, Zap, Link, RefreshCw, Play, RotateCcw,
  CheckCircle, Clock, XCircle, AlertTriangle, ChevronDown, ChevronUp,
} from "lucide-react";
import AdminPageLayout from "./AdminPageLayout";
import { adminAPI } from "../../../services/adminAPI";
import { useToast } from "../../../contexts/ToastContext";
import { getProfileImageUrl } from "../../../utils/imageUtils";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const statusBadge = (status: string) => {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    paid:       { cls: "bg-green-100 text-green-800",   icon: <CheckCircle className="w-3 h-3" /> },
    pending:    { cls: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3" /> },
    processing: { cls: "bg-blue-100 text-blue-800",     icon: <Clock className="w-3 h-3" /> },
    failed:     { cls: "bg-red-100 text-red-800",       icon: <XCircle className="w-3 h-3" /> },
    skipped:    { cls: "bg-slate-100 text-slate-600",   icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const s = map[status] || map.skipped;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${s.cls}`}>
      {s.icon}{status}
    </span>
  );
};

interface CreatorRow {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  creatorPlan: "free" | "pro";
  creatorPlanStatus: string;
  stripeConnectPayoutsEnabled: boolean;
  stripeConnectOnboardingComplete: boolean;
  stats: {
    totalEarned: number;
    pendingAmount: number;
    payoutCount: number;
    lastPayout: string | null;
  };
}

interface Payout {
  _id: string;
  month: number;
  year: number;
  payoutAmount: number;
  enrollmentShare: number;
  creatorEnrollments: number;
  totalEnrollments: number;
  sharePool: number;
  status: string;
  paidAt: string | null;
  notes: string | null;
}

interface Summary {
  totalPaidOut: number;
  totalPending: number;
  proCreators: number;
  connectedCreators: number;
  totalCreators: number;
}

export default function AdminCreatorRevenue() {
  const { showToast } = useToast();
  const [creators, setCreators] = useState<CreatorRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [expandedCreator, setExpandedCreator] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<Record<string, Payout[]>>({});
  const [loadingPayouts, setLoadingPayouts] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getCreatorRevenue();
      setCreators(res.data.creators);
      setSummary(res.data.summary);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to load creator revenue", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const toggleCreator = async (creatorId: string) => {
    if (expandedCreator === creatorId) {
      setExpandedCreator(null);
      return;
    }
    setExpandedCreator(creatorId);
    if (!payouts[creatorId]) {
      setLoadingPayouts(creatorId);
      try {
        const res = await adminAPI.getCreatorPayoutHistory(creatorId);
        setPayouts((prev) => ({ ...prev, [creatorId]: res.data }));
      } catch {
        showToast("Failed to load payout history", "error");
      } finally {
        setLoadingPayouts(null);
      }
    }
  };

  const handleTriggerPayouts = async () => {
    if (!confirm("Process monthly creator payouts now? This will calculate and send payouts for all eligible creators.")) return;
    setTriggering(true);
    try {
      await adminAPI.triggerCreatorPayouts();
      showToast("Payouts processed successfully", "success");
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to trigger payouts", "error");
    } finally {
      setTriggering(false);
    }
  };

  const handleRetry = async (payoutId: string, creatorId: string) => {
    setRetrying(payoutId);
    try {
      await adminAPI.retryCreatorPayout(payoutId);
      showToast("Payout retried successfully", "success");
      const res = await adminAPI.getCreatorPayoutHistory(creatorId);
      setPayouts((prev) => ({ ...prev, [creatorId]: res.data }));
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Retry failed", "error");
    } finally {
      setRetrying(null);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout title="Creator Revenue" subtitle="Revenue share & payout management">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Creator Revenue"
      subtitle="Manage creator revenue share, payout accounts, and process monthly payments."
      actions={
        <div className="flex gap-3">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            onClick={handleTriggerPayouts}
            disabled={triggering}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            <Play className="h-4 w-4" />
            {triggering ? "Processing…" : "Trigger Payouts"}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary cards */}
        {summary && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Paid Out</p>
              <p className="mt-2 text-2xl font-bold text-green-600">${summary.totalPaidOut.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Pending Payouts</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">${summary.totalPending.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-500" />
                <p className="text-sm font-medium text-slate-500">Creator Pro</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{summary.proCreators} <span className="text-sm font-normal text-slate-400">/ {summary.totalCreators}</span></p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-purple-500" />
                <p className="text-sm font-medium text-slate-500">Payout Connected</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{summary.connectedCreators} <span className="text-sm font-normal text-slate-400">/ {summary.totalCreators}</span></p>
            </div>
          </div>
        )}

        {/* Creators table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-base font-semibold text-slate-900">All Creators</h3>
            <p className="text-sm text-slate-500">Click a row to view payout history</p>
          </div>

          {creators.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No creators found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {creators.map((creator) => (
                <div key={creator._id}>
                  <button
                    onClick={() => toggleCreator(creator._id)}
                    className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="h-9 w-9 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                        {getProfileImageUrl(creator.profilePicture) ? (
                          <img src={getProfileImageUrl(creator.profilePicture) || ""} alt={creator.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-indigo-600">{creator.name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>

                      {/* Name + email */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{creator.name}</p>
                        <p className="text-xs text-slate-500 truncate">{creator.email}</p>
                      </div>

                      {/* Pro badge */}
                      {creator.creatorPlan === "pro" && creator.creatorPlanStatus === "active" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                          <Zap className="h-3 w-3" /> Pro
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Free</span>
                      )}

                      {/* Connect badge */}
                      {creator.stripeConnectPayoutsEnabled ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                          <CheckCircle className="h-3 w-3" /> Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Not connected</span>
                      )}

                      {/* Earnings */}
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-green-700">${creator.stats.totalEarned.toFixed(2)}</p>
                        <p className="text-xs text-slate-400">{creator.stats.payoutCount} payouts</p>
                      </div>

                      {/* Expand icon */}
                      {expandedCreator === creator._id ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Expanded payout history */}
                  {expandedCreator === creator._id && (
                    <div className="bg-slate-50 border-t border-slate-100 px-6 py-4">
                      {loadingPayouts === creator._id ? (
                        <div className="flex justify-center py-4">
                          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-indigo-600" />
                        </div>
                      ) : !payouts[creator._id] || payouts[creator._id].length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">No payout records for this creator.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-left text-slate-500 uppercase tracking-wide">
                                <th className="pb-2 pr-4">Period</th>
                                <th className="pb-2 pr-4">Enrollments</th>
                                <th className="pb-2 pr-4">Share</th>
                                <th className="pb-2 pr-4">Pool</th>
                                <th className="pb-2 pr-4">Payout</th>
                                <th className="pb-2 pr-4">Status</th>
                                <th className="pb-2 pr-4">Paid On</th>
                                <th className="pb-2">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {payouts[creator._id].map((p) => (
                                <tr key={p._id} className="text-slate-700">
                                  <td className="py-2 pr-4 font-medium">{MONTH_NAMES[p.month - 1]} {p.year}</td>
                                  <td className="py-2 pr-4">{p.creatorEnrollments} / {p.totalEnrollments}</td>
                                  <td className="py-2 pr-4">{(p.enrollmentShare * 100).toFixed(1)}%</td>
                                  <td className="py-2 pr-4">${p.sharePool.toFixed(2)}</td>
                                  <td className="py-2 pr-4 font-bold">${p.payoutAmount.toFixed(2)}</td>
                                  <td className="py-2 pr-4">{statusBadge(p.status)}</td>
                                  <td className="py-2 pr-4">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}</td>
                                  <td className="py-2">
                                    {(p.status === "failed" || p.status === "pending") && creator.stripeConnectPayoutsEnabled && (
                                      <button
                                        onClick={() => handleRetry(p._id, creator._id)}
                                        disabled={retrying === p._id}
                                        className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                                      >
                                        <RotateCcw className="h-3 w-3" />
                                        {retrying === p._id ? "…" : "Retry"}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue share explanation */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-indigo-500" /> How Payouts Work
          </p>
          <p className="text-sm text-slate-600">
            On the 1st of each month, <strong>40% of all user premium subscription revenue</strong> is pooled and
            distributed proportionally based on course enrollments. Creators must have Creator Pro and a connected
            Stripe account to receive automatic payouts. Failed or pending payouts can be retried manually above.
            In development mode, transfers are simulated.
          </p>
        </div>
      </div>
    </AdminPageLayout>
  );
}
