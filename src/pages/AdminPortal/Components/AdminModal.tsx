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
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm text-gray-500 mb-1">{subtitle}</div>
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {secondaryLabel && onSecondary && (
              <button
                onClick={onSecondary}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {secondaryLabel}
              </button>
            )}
            <button
              onClick={onSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : actionLabel}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
