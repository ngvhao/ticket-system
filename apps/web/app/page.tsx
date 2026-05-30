import Link from "next/link";
import { SiteHeader } from "@/components/home/site-header";
import { FeatureGrid } from "@/components/home/feature-grid";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-[var(--color-canvas)]">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Hệ thống bán vé</p>
            <h1 className="display-md mt-4">
              Đặt vé sự kiện
              <span className="text-[var(--color-ink-muted)]"> — nhanh, an toàn, realtime.</span>
            </h1>
            <p className="subhead mt-6 max-w-xl">
              Chọn sự kiện, gửi yêu cầu đặt vé vào hàng đợi và nhận thông báo kết
              quả qua WebSocket — không cần chờ reload.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/booking" className="btn-primary px-5">
                Xem sự kiện
              </Link>
              <Link href="/booking" className="btn-secondary">
                Bắt đầu đặt vé
              </Link>
            </div>
          </div>

          {/* Product panel — preview strip */}
          <div
            className="mt-16 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-6 sm:p-8"
            style={{
              boxShadow: "inset 0 1px 0 color-mix(in srgb, white 4%, transparent)",
            }}
          >
            <div className="mb-4 flex items-center justify-between border-b border-[var(--color-hairline)] pb-4">
              <span className="caption">Preview · Booking flow</span>
              <span className="status-badge status-badge-success">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-semantic-success)]" />
                API ready
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <PreviewTile label="GET /event" value="Danh sách sự kiện" />
              <PreviewTile label="POST /booking" value="Đặt vé → jobId" />
              <PreviewTile label="WS :3001" value="notification event" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-[var(--color-hairline)] bg-[var(--color-canvas)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <FeatureGrid />
          </div>
        </section>

        {/* CTA banner */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="cta-banner flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="headline">Sẵn sàng đặt vé?</h2>
              <p className="body-lg mt-2 max-w-md">
                Khám phá các sự kiện đang mở bán và trải nghiệm luồng đặt vé
                tích hợp API.
              </p>
            </div>
            <Link href="/booking" className="btn-primary shrink-0 px-6">
              Đi tới trang đặt vé →
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Ticket System · Monorepo demo</p>
          <p className="text-[var(--color-ink-tertiary)]">
            NestJS API · Next.js Web · Redis Queue · Socket.IO
          </p>
        </div>
      </footer>
    </div>
  );
}

function PreviewTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface-2)] px-4 py-3">
      <p className="font-mono text-xs text-[var(--color-primary)]">{label}</p>
      <p className="body-sm mt-1 text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
