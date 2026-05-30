import Link from "next/link";
import type { Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const soldOut = event.inventory <= 0;

  return (
    <Link
      href={`/booking/${event.id}`}
      className="feature-card group relative block w-full p-5 transition-colors duration-150 hover:border-[var(--color-hairline-strong)]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="card-title text-lg group-hover:text-[var(--color-ink)]">
          {event.name}
        </h3>
        <span
          className={[
            "status-badge shrink-0",
            !soldOut && event.inventory > 0 ? "status-badge-success" : "",
          ].join(" ")}
        >
          {soldOut ? "Hết vé" : `Còn ${event.inventory} vé`}
        </span>
      </div>

      <div className="body-sm space-y-1.5">
        <p className="flex items-center gap-2">
          <CalendarIcon />
          {formatEventDate(event.date)}
        </p>
        <p className="flex items-center gap-2">
          <LocationIcon />
          {event.location}
        </p>
      </div>

      <span className="link-accent mt-4 inline-block text-sm">
        {soldOut ? "Xem chi tiết" : "Xem chi tiết & đặt vé"} →
      </span>
    </Link>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[var(--color-ink-tertiary)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[var(--color-ink-tertiary)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}
