"use client";

import { useState } from "react";
import type { Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";
import useAuth from "@/hooks/use-auth";

interface BookingFormProps {
  event: Event | null;
  loading: boolean;
  onSubmit: (userId: number, quantity: number) => void;
}

export function BookingForm({ event, loading, onSubmit }: BookingFormProps) {
  const { user } = useAuth(); // Get authenticated user info
  const [quantity, setQuantity] = useState("1");

  if (!event) {
    return (
      <div className="feature-card flex min-h-[320px] flex-col items-center justify-center border-dashed p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-2)] text-2xl">
          🎫
        </div>
        <h3 className="card-title text-lg">Chọn sự kiện</h3>
        <p className="body-sm mt-2 max-w-xs">
          Chọn một sự kiện từ danh sách bên trái để bắt đầu đặt vé.
        </p>
      </div>
    );
  }

  const maxQty = Math.max(0, event.remainingInventory);
  const parsedQty = Math.min(Math.max(1, Number(quantity) || 1), maxQty);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const uid = user?.id;
    if (!uid || uid < 1) return;
    onSubmit(uid, parsedQty);
  }

  return (
    <form onSubmit={handleSubmit} className="feature-card flex h-full flex-col">
      <div className="mb-6">
        <p className="eyebrow">Đặt vé</p>
        <h2 className="card-title mt-1">{event.name}</h2>
        <p className="body-sm mt-1">{formatEventDate(event.date)}</p>
        <p className="body-sm">{event.location}</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
            Mã người dùng
          </span>
          <input
            disabled
            type="number"
            min={1}
            required
            value={user?.id}
            className="text-input"
            placeholder="VD: 1"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
            Số lượng vé
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(String(Math.max(1, parsedQty - 1)))}
              className="btn-icon text-lg"
              aria-label="Giảm số lượng"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={maxQty}
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="text-input text-center"
            />
            <button
              type="button"
              onClick={() =>
                setQuantity(String(Math.min(maxQty, parsedQty + 1)))
              }
              className="btn-icon text-lg"
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>
          <p className="caption mt-1.5">Tối đa {maxQty} vé còn lại</p>
        </label>
      </div>

      <div className="mt-auto pt-6">
        <button
          type="submit"
          disabled={loading || event.inventory <= 0}
          className="btn-primary w-full"
        >
          {loading ? (
            <>
              <Spinner />
              Đang gửi yêu cầu...
            </>
          ) : (
            "Xác nhận đặt vé"
          )}
        </button>
      </div>
    </form>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
