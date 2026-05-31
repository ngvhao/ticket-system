"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useNotificationSocket } from "@/hooks/use-notification-socket";
import { createBooking, getApiErrorMessage } from "@/lib/api";
import type { Event, PendingBooking } from "@/lib/types";
import { useState } from "react";
import { randomInt } from "crypto";
import useAuth from "@/hooks/use-auth";

interface BookingContextValue {
  connected: boolean;
  notifications: ReturnType<typeof useNotificationSocket>["notifications"];
  pendingBookings: PendingBooking[];
  clearNotifications: () => void;
  isBookingConfirmed: (booking: PendingBooking) => boolean;
  submitBooking: (
    event: Event,
    userId: number,
    quantity: number,
  ) => Promise<boolean>;
  submitting: boolean;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const {
    connected,
    notifications,
    clearNotifications,
    addNotification,
  } = useNotificationSocket();

  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isBookingConfirmed = useCallback(
    (booking: PendingBooking) =>
      notifications.some(
        (item) =>
          item.text.includes(`User ${booking.userId}`) &&
          item.text.includes(`event ${booking.eventId}`),
      ),
    [notifications],
  );

  const submitBooking = useCallback(
    async (event: Event, userId: number, quantity: number) => {
      setSubmitting(true);
      try {
        const result = await createBooking({
          eventId: event.id,
          userId,
          quantity,
        });

        setPendingBookings((prev) => [
          {
            jobId: result.jobId,
            eventId: event.id,
            eventName: event.name,
            userId,
            quantity,
            status: "queued",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);

        addNotification(
          `Yêu cầu đặt vé đã vào hàng đợi · ${result.jobId}`,
          "info",
        );
        return true;
      } catch (error) {
        addNotification(getApiErrorMessage(error), "error");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [addNotification],
  );

  const value = useMemo(
    () => ({
      connected,
      notifications,
      pendingBookings,
      clearNotifications,
      isBookingConfirmed,
      submitBooking,
      submitting,
    }),
    [
      connected,
      notifications,
      pendingBookings,
      clearNotifications,
      isBookingConfirmed,
      submitBooking,
      submitting,
    ],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return ctx;
}
