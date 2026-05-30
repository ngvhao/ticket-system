"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { NotificationMessage } from "@/lib/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";

export function useNotificationSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationMessage[]>(
    [],
  );

  const addNotification = useCallback(
    (text: string, type: NotificationMessage["type"] = "info") => {
      setNotifications((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          text,
          receivedAt: new Date().toISOString(),
          type,
        },
        ...prev,
      ]);
    },
    [],
  );

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      addNotification("Đã kết nối WebSocket", "success");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", () => {
      setConnected(false);
    });

    socket.on("notification", (payload: string | Record<string, unknown>) => {
      const text =
        typeof payload === "string"
          ? payload
          : JSON.stringify(payload, null, 2);
      console.log("Received notification:", text);
      addNotification(text, "success");
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [addNotification]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    connected,
    notifications,
    clearNotifications,
    addNotification,
  };
}
