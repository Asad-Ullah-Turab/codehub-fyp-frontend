import { useState, useEffect, useCallback } from "react";
import {
  Star, RefreshCw, CheckCircle, Clock, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight, TrendingUp,
} from "lucide-react";
import AdminPageLayout from "./AdminPageLayout";
import { adminAPI } from "../../../services/adminAPI";
import { useToast } from "../../../contexts/ToastContext";

const TYPE_LABELS: Record<string, string> = {
  subscription_created: "New Subscription",
  subscription_renewed: "Renewal",
  subscription_cancelled: "Cancellation",
  payment_failed: "Failed Payment",
  refund: "Refund",
};

const statusBadge = (status: string) => {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    completed: { cls: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> },
    pending:   { cls: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3" /> },
    failed:    { cls: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3" /> },
    refunded:  { cls: "bg-slate-100 text-slate-600", icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${s.cls}`}>
      {s.icon}{status}
    </span>
  );
};

interface Summary {
  totalRevenue: number;
  totalTransactions: number;
  revenueThisMonth: number;
  premiumUsers: number;
  newSubsThisMonth: number;
  renewalsThisMonth: number;
  cancellationsThisMonth: number;
  revenueByDate: { date: string; revenue: number; count: number }[];
}

export default function AdminUserRevenue() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getSubscriptionTransactions(page, 20, typeFilter, statusFilter);
      setTransactions(res.data.transactions);
      setSummary(res.data.summary);
      setPagination(res.pagination);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to load transactions", "error");
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter, showToast]);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminPageLayout
      title="User Premium Revenue"
      subtitle="Track user premium subscription transactions, revenue, and subscriber metrics."
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
        {summary && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-green-600">${summary.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-slate-400 mt-1">{summary.totalTransactions} transactions</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">This Month</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">${summary.revenueThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-slate-400 mt-1">{summary.newSubsThisMonth} new · {summary.renewalsThisMonth} renewals</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-yellow-500" />
                <p className="text-sm font-medium text-slate-500">Active Subscribers</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{summary.premiumUsers}</p>
              <p className="text-xs text-slate-400 mt-1">MRR: ${(summary.premiumUsers * 9.99).toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Cancellations (30d)</p>
              <p className="mt-2 text-2xl font-bold text-red-600">{summary.cancellationsThisMonth}</p>
              <p className="text-xs text-slate-400 mt-1">
                Churn rate: {summary.premiumUsers > 0 ? ((summary.cancellationsThisMonth / summary.premiumUsers) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
          </div>
        )}

        {/* Mini chart */}
        {summary && summary.revenueByDate.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900">Revenue — Last 30 Days</h3>
            </div>
            <div className="flex items-end gap-1 h-16">
              {summary.revenueByDate.map((d, i) => {
                const max = Math.max(...summary.revenueByDate.map(x => x.revenue), 1);
                return (
                  <div key={i} title={`${d.date}: $${d.revenue}`} className="flex-1 bg-green-400 rounded-sm min-h-[2px]" style={{ height: `${(d.revenue / max) * 100}%` }} />
                );
              })}
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-400">
              <span>{summary.revenueByDate[0]?.date ? new Date(summary.revenueByDate[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
              <span>{summary.revenueByDate[summary.revenueByDate.length - 1]?.date ? new Date(summary.revenueByDate[summary.revenueByDate.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
            </div>
          </div>
        )}

        {/* Filters + Transaction table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4 flex flex-wrap gap-3 items-center">
            <h3 className="text-base font-semibold text-slate-900 mr-auto">Transactions</h3>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-300"
            >
              <option value="">All types</option>
              <option value="subscription_created">New Subscriptions</option>
              <option value="subscription_renewed">Renewals</option>
              <option value="subscription_cancelled">Cancellations</option>
              <option value="payment_failed">Failed Payments</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-300"
            >
              <option value="">All statuses</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-7 w-7 animate-spin rounded-full border-b-2 border-indigo-600" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">No transactions found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                      <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-medium text-slate-900">{t.user?.name || '—'}</p>
                          <p className="text-xs text-slate-400">{t.user?.email || ''}</p>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            t.type === 'subscription_created' ? 'bg-green-100 text-green-700' :
                            t.type === 'subscription_renewed' ? 'bg-blue-100 text-blue-700' :
                            t.type === 'subscription_cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {TYPE_LABELS[t.type] || t.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-semibold text-slate-900">
                          {t.amount ? `$${parseFloat(t.amount).toFixed(2)}` : '—'}
                        </td>
                        <td className="px-6 py-3">{statusBadge(t.status)}</td>
                        <td className="px-6 py-3 text-slate-500">
                          {new Date(t.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-slate-500 text-xs max-w-xs truncate">
                          {t.description || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="border-t border-slate-100 px-6 py-3 flex items-center justify-between text-sm text-slate-600">
                <span>{pagination.total} total transactions</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs">Page {page} of {pagination.pages || 1}</span>
                  <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}
