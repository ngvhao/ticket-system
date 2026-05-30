export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  inventory: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface BookingRequest {
  eventId: number;
  userId: number;
  quantity: number;
}

export interface BookingResponse {
  jobId: string;
  status: string;
}

export type BookingStatus = "idle" | "submitting" | "queued" | "success" | "error";

export interface PendingBooking {
  jobId: string;
  eventId: number;
  eventName: string;
  userId: number;
  quantity: number;
  status: BookingStatus;
  message?: string;
  createdAt: string;
}

export interface NotificationMessage {
  id: string;
  text: string;
  receivedAt: string;
  type: "info" | "success" | "error";
}
