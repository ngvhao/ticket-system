"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookingForm } from "@/components/booking/booking-form";
import { BookingHeader } from "@/components/booking/booking-header";
import { EventDetail } from "@/components/booking/event-detail";
import { NotificationPanel } from "@/components/booking/notification-panel";
import { useBooking } from "@/contexts/booking-context";
import { fetchEvent, getApiErrorMessage } from "@/lib/api";
import type { Event } from "@/lib/types";

export default function EventBookingPage() {
  const params = useParams();
  const eventId = Number(params.id);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    connected,
    notifications,
    pendingBookings,
    clearNotifications,
    isBookingConfirmed,
    submitBooking,
    submitting,
  } = useBooking();

  const loadEvent = useCallback(async () => {
    if (!Number.isFinite(eventId) || eventId < 1) {
      setError("Mã sự kiện không hợp lệ.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvent(eventId);
      setEvent(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!Number.isFinite(eventId) || eventId < 1) {
        if (!cancelled) {
          setError("Mã sự kiện không hợp lệ.");
          setLoading(false);
        }
        return;
      }

      try {
        const data = await fetchEvent(eventId);
        if (cancelled) return;
        setEvent(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(getApiErrorMessage(err));
        setEvent(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  async function handleBooking(userId: number, quantity: number) {
    if (!event) return;
    const ok = await submitBooking(event, userId, quantity);
    if (ok) {
      setEvent((prev) =>
        prev
          ? { ...prev, inventory: Math.max(0, prev.inventory - quantity) }
          : null,
      );
    }
  }

  const eventPending = pendingBookings.filter(
    (b) => b.eventId === eventId && !isBookingConfirmed(b),
  );

  return (
    <div className="min-h-full bg-[var(--color-canvas)]">
      <BookingHeader
        title={event?.name ?? "Chi tiết sự kiện"}
        backHref="/booking"
        backLabel="← Danh sách sự kiện"
        actions={
          <button
            type="button"
            onClick={loadEvent}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px_320px]">
            <div className="h-64 animate-pulse rounded-[var(--radius-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)]" />
            <div className="h-80 animate-pulse rounded-[var(--radius-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)]" />
            <div className="h-80 animate-pulse rounded-[var(--radius-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)]" />
          </div>
        ) : error || !event ? (
          <div className="feature-card max-w-lg py-12 text-center">
            <p className="body-sm">{error ?? "Không tìm thấy sự kiện."}</p>
            <button
              type="button"
              onClick={loadEvent}
              className="btn-secondary mt-4"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px_320px]">
            <EventDetail event={event} />

            <section className="lg:sticky lg:top-6 lg:self-start">
              <BookingForm
                event={event}
                loading={submitting}
                onSubmit={handleBooking}
              />
            </section>

            <section className="lg:sticky lg:top-6 lg:self-start">
              <NotificationPanel
                connected={connected}
                notifications={notifications}
                pendingBookings={eventPending}
                onClear={clearNotifications}
              />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
