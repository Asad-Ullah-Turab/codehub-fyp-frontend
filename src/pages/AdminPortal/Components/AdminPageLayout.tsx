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
    <div className="admin-theme min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {(title || breadcrumbs || actions) && (
          <div className="admin-page-header mb-8 rounded-3xl p-6 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                {breadcrumbs ? (
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{breadcrumbs}</p>
                ) : null}
                {title ? (
                  <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              {actions ? (
                <div className="flex flex-col gap-3">
                  {actions}
                </div>
              ) : null}
            </div>
          </div>
        )}

        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
