import { X } from "lucide-react";
import type { ReactNode } from "react";

interface AdminModalProps {
  show: boolean;
  title: string;
  subtitle: string;
  actionLabel: string;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
  children: ReactNode;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export default function AdminModal({
  show,
  title,
  subtitle,
  actionLabel,
  onClose,
  onSubmit,
  loading = false,
  children,
  secondaryLabel,
  onSecondary,
}: AdminModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/30 flex flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50">
          <div className="min-w-0">
            <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-500">{subtitle}</div>
            <h2 className="truncate text-xl font-bold text-slate-900">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {secondaryLabel && onSecondary && (
              <button
                onClick={onSecondary}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {secondaryLabel}
              </button>
            )}
            <button
              onClick={onSubmit}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-105 disabled:opacity-50"
            >
              {loading ? "Saving..." : actionLabel}
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-slate-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white/80">{children}</div>
      </div>
    </div>
  );
}
