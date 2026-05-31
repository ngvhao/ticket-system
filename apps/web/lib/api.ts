import axios, { isAxiosError } from "axios";
import type { ApiResponse, BookingRequest, BookingResponse, Event } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

function normalizeEvent(raw: Record<string, unknown>): Event {
  const date = raw.date;
  return {
    id: Number(raw.id),
    name: String(raw.name),
    date:
      typeof date === "string"
        ? date
        : new Date(date as string | number).toISOString(),
    location: String(raw.location),
    inventory: Number(raw.inventory ?? 0),
    remainingInventory: Number(raw.remainingInventory ?? 0),
  };
}

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (typeof data?.message === "string") return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Đã xảy ra lỗi. Vui lòng thử lại.";
}

export async function fetchEvents(): Promise<Event[]> {
  const { data } = await client.get<ApiResponse<Record<string, unknown>[]>>(
    "/event",
  );
  return data.data.map((item) => normalizeEvent(item));
}

export async function fetchEvent(id: number): Promise<Event> {
  const { data } = await client.get<ApiResponse<Record<string, unknown>>>(
    `/event/${id}`,
  );
  return normalizeEvent(data.data);
}

export async function createBooking(
  payload: BookingRequest,
): Promise<BookingResponse> {
  const { data } = await client.post<ApiResponse<BookingResponse>>(
    "/booking",
    payload,
  );
  return data.data;
}

export { API_URL };
