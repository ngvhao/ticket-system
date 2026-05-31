import type { Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

interface EventDetailProps {
  event: Event;
}

export function EventDetail({ event }: EventDetailProps) {
  const soldOut = event.remainingInventory <= 0;

  return (
    <article className="feature-card">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Chi tiết sự kiện</p>
          <h2 className="card-title mt-1">{event.name}</h2>
        </div>
        <span
          className={[
            "status-badge",
            !soldOut && event.remainingInventory > 0 ? "status-badge-success" : "",
          ].join(" ")}
        >
          {soldOut ? "Hết vé" : `Còn ${event.remainingInventory} vé`}
        </span>
      </div>

      <dl className="space-y-4">
        <DetailRow label="Thời gian" value={formatEventDate(event.date)} />
        <DetailRow label="Địa điểm" value={event.location} />
        <DetailRow label="Mã sự kiện" value={`#${event.id}`} mono />
      </dl>
    </article>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border-t border-[var(--color-hairline)] pt-4 first:border-0 first:pt-0">
      <dt className="caption">{label}</dt>
      <dd
        className={[
          "mt-1 text-[var(--color-ink)]",
          mono ? "font-mono text-sm text-[var(--color-ink-muted)]" : "body-sm",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}
