"use client";

import type { NotificationMessage, PendingBooking } from "@/lib/types";
import { formatTime } from "@/lib/format";

interface NotificationPanelProps {
  connected: boolean;
  notifications: NotificationMessage[];
  pendingBookings: PendingBooking[];
  onClear: () => void;
}

export function NotificationPanel({
  connected,
  notifications,
  pendingBookings,
  onClear,
}: NotificationPanelProps) {
  return (
    <aside className="feature-card flex h-full flex-col p-0">
      <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-5 py-4">
        <div>
          <h2 className="text-sm font-medium text-[var(--color-ink)]">
            Thông báo realtime
          </h2>
          <p className="caption">WebSocket · localhost:3001</p>
        </div>
        <ConnectionBadge connected={connected} />
      </div>

      {pendingBookings.length > 0 && (
        <div className="border-b border-[var(--color-hairline)] px-5 py-4">
          <h3 className="eyebrow mb-2">Đang xử lý</h3>
          <ul className="space-y-2">
            {pendingBookings.map((booking) => (
              <li
                key={booking.jobId}
                className="notify-item border-[var(--color-hairline-strong)]"
              >
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {booking.eventName}
                </p>
                <p className="caption mt-0.5">
                  {booking.quantity} vé · User #{booking.userId}
                </p>
                <p className="mt-1 font-mono text-[11px] text-[var(--color-ink-tertiary)]">
                  {booking.jobId}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-3">
        <h3 className="eyebrow">Lịch sử ({notifications.length})</h3>
        {notifications.length > 0 && (
          <button type="button" onClick={onClear} className="link-accent">
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {notifications.length === 0 ? (
          <p className="notify-item text-center text-sm">
            Chưa có thông báo. Kết quả đặt vé sẽ hiển thị tại đây qua WebSocket.
          </p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((item) => (
              <li
                key={item.id}
                className={[
                  "notify-item",
                  item.type === "success" ? "notify-item-success" : "",
                  item.type === "error" ? "notify-item-error" : "",
                ].join(" ")}
              >
                <p>{item.text}</p>
                <p className="caption mt-1">{formatTime(item.receivedAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <span
      className={[
        "status-badge",
        connected ? "status-badge-success" : "",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          connected
            ? "bg-[var(--color-semantic-success)] animate-pulse"
            : "bg-[var(--color-ink-tertiary)]",
        ].join(" ")}
      />
      {connected ? "Đã kết nối" : "Mất kết nối"}
    </span>
  );
}
