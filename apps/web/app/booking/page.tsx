"use client";

import { useCallback, useEffect, useState } from "react";
import { EventCard } from "@/components/booking/event-card";
import { BookingHeader } from "@/components/booking/booking-header";
import { fetchEvents, getApiErrorMessage } from "@/lib/api";
import type { Event } from "@/lib/types";

export default function BookingListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchEvents();
        if (cancelled) return;
        setEvents(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(getApiErrorMessage(err));
        setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-full bg-[var(--color-canvas)]">
      <BookingHeader
        title="Đặt vé sự kiện"
        actions={
          <button
            type="button"
            onClick={loadEvents}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="card-title text-lg">Danh sách sự kiện</h2>
          <p className="body-sm mt-1">
            {loading
              ? "Đang tải danh sách..."
              : `${events.length} sự kiện`}
          </p>
        </div>

        {error && (
          <div className="notify-item notify-item-error mb-6 text-sm">
            <p>{error}</p>
            <button
              type="button"
              onClick={loadEvents}
              className="link-accent mt-2 inline-block"
            >
              Thử lại
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-[var(--radius-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)]"
              />
            ))}
          </div>
        ) : events.length === 0 && !error ? (
          <div className="feature-card py-12 text-center">
            <p className="body-sm">Chưa có sự kiện nào.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
