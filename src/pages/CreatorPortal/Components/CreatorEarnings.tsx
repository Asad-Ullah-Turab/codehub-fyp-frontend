import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Zap,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Link,
  RefreshCw,
} from "lucide-react";
import { creatorSubscriptionAPI } from "../../../services/creatorSubscriptionAPI";
import { useToast } from "../../../contexts/ToastContext";
import AdminPageLayout from "../../AdminPortal/Components/AdminPageLayout";

interface CreatorStatus {
  creatorPlan: "free" | "pro";
  creatorPlanStatus: "none" | "active" | "past_due" | "canceled";
  creatorPlanStart: string | null;
  isCreatorPro: boolean;
  stripeConnectAccountId: string | null;
  stripeConnectOnboardingComplete: boolean;
  stripeConnectPayoutsEnabled: boolean;
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
  totalPremiumRevenue: number;
  status: "pending" | "processing" | "paid" | "failed" | "skipped";
  paidAt: string | null;
  notes: string | null;
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const statusBadge = (status: Payout["status"]) => {
  const map = {
    paid:       { cls: "bg-green-100 text-green-800",  icon: <CheckCircle className="w-3.5 h-3.5" /> },
    pending:    { cls: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3.5 h-3.5" /> },
    processing: { cls: "bg-blue-100 text-blue-800",    icon: <Clock className="w-3.5 h-3.5" /> },
    failed:     { cls: "bg-red-100 text-red-800",      icon: <XCircle className="w-3.5 h-3.5" /> },
    skipped:    { cls: "bg-slate-100 text-slate-600",  icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${s.cls}`}>
      {s.icon}{status}
    </span>
  );
};

export default function CreatorEarnings() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [status, setStatus] = useState<CreatorStatus | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [payoutTotal, setPayoutTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    try {
      const [statusRes, payoutsRes] = await Promise.all([
        creatorSubscriptionAPI.getStatus(),
        creatorSubscriptionAPI.getPayouts(1, 12),
      ]);
      setStatus(statusRes.data);
      setPayouts(payoutsRes.data || []);
      setPayoutTotal(payoutsRes.pagination?.total || 0);
    } catch (err: any) {
      showToast(err.message || "Failed to load earnings data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
    // Handle Stripe Connect return redirects
    const connect = searchParams.get("connect");
    if (connect === "success") showToast("Stripe account connected successfully!", "success");
    if (connect === "refresh") showToast("Please re-complete the Stripe onboarding.", "warning");
    // Handle Creator Pro checkout return
    const session = searchParams.get("session_id");
    if (session) showToast("Creator Pro subscription activated!", "success");
  }, [load, searchParams, showToast]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await creatorSubscriptionAPI.createCheckoutSession();
      window.location.href = res.url;
    } catch (err: any) {
      showToast(err.message || "Failed to start checkout", "error");
    } finally {
      setUpgrading(false);
    }
  };

  const handleConnectOnboard = async () => {
    setConnecting(true);
    try {
      const res = await creatorSubscriptionAPI.startConnectOnboarding();
      window.location.href = res.url;
    } catch (err: any) {
      showToast(err.message || "Failed to start Stripe Connect", "error");
    } finally {
      setConnecting(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel your Creator Pro subscription? You'll lose Pro features at the end of the billing period.")) return;
    setCancelling(true);
    try {
      await creatorSubscriptionAPI.cancel();
      showToast("Creator Pro cancelled.", "success");
      load();
    } catch (err: any) {
      showToast(err.message || "Failed to cancel", "error");
    } finally {
      setCancelling(false);
    }
  };

  const totalEarned = payouts.filter(p => p.status === "paid").reduce((s, p) => s + p.payoutAmount, 0);
  const pendingAmount = payouts.filter(p => p.status === "pending" || p.status === "processing").reduce((s, p) => s + p.payoutAmount, 0);

  if (loading) {
    return (
      <AdminPageLayout title="Earnings" subtitle="Creator Pro & revenue share">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Earnings"
      subtitle="Manage your Creator Pro subscription, connect your payout account, and track monthly revenue share."
      actions={
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      }
    >
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Earned</p>
            <p className="mt-2 text-3xl font-bold text-green-600">${totalEarned.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Pending Payout</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Payout Records</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{payoutTotal}</p>
          </div>
        </div>

        {/* Creator Pro card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                <Zap className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Creator Pro</h3>
                <p className="text-sm text-slate-500">$9.99 / month · Unlock unlimited courses & advanced analytics</p>
              </div>
            </div>
            {status?.isCreatorPro ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                <CheckCircle className="h-3.5 w-3.5" /> Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Free tier
              </span>
            )}
          </div>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {[
              "Unlimited course uploads",
              "Priority listing in catalog",
              "Detailed enrollment analytics",
              "AI-assisted course generation",
              "Revenue share payouts",
              "Early access to new features",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
            {status?.isCreatorPro ? (
              <>
                <p className="text-sm text-slate-500">
                  Active since{" "}
                  {status.creatorPlanStart
                    ? new Date(status.creatorPlanStart).toLocaleDateString()
                    : "—"}
                </p>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  {cancelling ? "Cancelling…" : "Cancel subscription"}
                </button>
              </>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="theme-primary-button inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-60"
              >
                <Zap className="h-4 w-4" />
                {upgrading ? "Redirecting…" : "Upgrade to Creator Pro — $9.99/mo"}
              </button>
            )}
          </div>
        </div>

        {/* Stripe Connect card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Payout Account</h3>
                <p className="text-sm text-slate-500">
                  Connect a Stripe account to receive your monthly revenue share automatically
                </p>
              </div>
            </div>
            {status?.stripeConnectPayoutsEnabled ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                <CheckCircle className="h-3.5 w-3.5" /> Payouts enabled
              </span>
            ) : status?.stripeConnectOnboardingComplete ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                <Clock className="h-3.5 w-3.5" /> Under review
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Not connected
              </span>
            )}
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-800 mb-1 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-indigo-500" /> How revenue share works
            </p>
            <p>
              Each month, <strong>40% of all user premium subscription revenue</strong> is pooled and
              distributed to creators proportionally based on course enrollments that month.
              For example, if you account for 20% of enrollments you receive 20% of the pool.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {status?.stripeConnectPayoutsEnabled ? (
              <p className="text-sm text-green-700 font-medium flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Your account is ready to receive payouts
              </p>
            ) : (
              <button
                onClick={handleConnectOnboard}
                disabled={connecting}
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
              >
                <Link className="h-4 w-4" />
                {connecting
                  ? "Redirecting…"
                  : status?.stripeConnectAccountId
                  ? "Continue Stripe onboarding"
                  : "Connect Stripe account"}
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </button>
            )}
          </div>
        </div>

        {/* Payout history */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-base font-semibold text-slate-900">Payout History</h3>
            <p className="text-sm text-slate-500">Monthly revenue share records</p>
          </div>

          {payouts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <DollarSign className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No payouts yet. Payouts are processed on the 1st of each month.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Period</th>
                    <th className="px-6 py-3">Your Enrollments</th>
                    <th className="px-6 py-3">Share</th>
                    <th className="px-6 py-3">Pool</th>
                    <th className="px-6 py-3">Payout</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Paid On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payouts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-900">
                        {MONTH_NAMES[p.month - 1]} {p.year}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {p.creatorEnrollments} / {p.totalEnrollments}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {(p.enrollmentShare * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        ${p.sharePool.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 font-semibold text-slate-900">
                        ${p.payoutAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-3">{statusBadge(p.status)}</td>
                      <td className="px-6 py-3 text-slate-500">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}
