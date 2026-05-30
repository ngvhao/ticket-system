import Link from "next/link";
import type { ReactNode } from "react";

interface BookingHeaderProps {
  title: string;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}

export function BookingHeader({
  title,
  eyebrow = "Ticket System",
  backHref = "/",
  backLabel = "← Trang chủ",
  actions,
}: BookingHeaderProps) {
  return (
    <header className="top-nav">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link
            href={backHref}
            className="body-sm hidden shrink-0 text-[var(--color-ink-subtle)] transition hover:text-[var(--color-ink)] sm:inline"
          >
            {backLabel}
          </Link>
          <div className="min-w-0">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="truncate text-xl font-semibold tracking-[-0.4px] text-[var(--color-ink)]">
              {title}
            </h1>
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
