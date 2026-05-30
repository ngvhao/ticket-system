import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="top-nav sticky top-0 z-10">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-xs font-semibold text-[var(--color-on-primary)]"
            aria-hidden
          >
            T
          </span>
          <span className="text-sm font-medium text-[var(--color-ink)]">
            Ticket System
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/booking" className="btn-secondary hidden sm:inline-flex">
            Sự kiện
          </Link>
          <Link href="/booking" className="btn-primary">
            Đặt vé
          </Link>
        </nav>
      </div>
    </header>
  );
}
