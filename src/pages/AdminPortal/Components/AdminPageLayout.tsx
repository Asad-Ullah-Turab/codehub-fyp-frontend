import type { ReactNode } from "react";

interface AdminPageLayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminPageLayout({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: AdminPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {(title || breadcrumbs || actions) && (
          <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                {breadcrumbs ? (
                  <p className="text-sm text-gray-500">{breadcrumbs}</p>
                ) : null}
                {title ? (
                  <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className="mt-3 text-sm text-gray-600 max-w-3xl">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              {actions ? (
                <div className="flex flex-col gap-3">{actions}</div>
              ) : null}
            </div>
          </div>
        )}

        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
