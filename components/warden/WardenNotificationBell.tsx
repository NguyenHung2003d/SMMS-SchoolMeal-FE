"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
  HttpTransportType,
} from "@microsoft/signalr";
import { useAuth } from "@/hooks/auth/useAuth";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { axiosInstance } from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { parseDate } from "@/helpers";

interface NotificationDto {
  notificationId: number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sendType?: string;
}

export function WardenNotificationBell() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/WardensHome/notifications");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        const sortedData = data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setNotifications(sortedData);
        setUnreadCount(
          sortedData.filter((n: NotificationDto) => !n.isRead).length
        );
      } catch (error) {
        console.error("Lỗi tải thông báo Warden:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const HUB_URL =
      process.env.NEXT_PUBLIC_HUB_URL ||
      "http://localhost:5000/hubs/notifications";

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        withCredentials: true,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("🟢 [SignalR] Connected successfully");
        connection.on("ReceiveNotification", (newNotif: NotificationDto) => {
          console.log("🔥 [SOCKET] Đã nhận tin nhắn Realtime:", newNotif); // <--- LOG NÀY QUAN TRỌNG
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);
          toast.success(`Thông báo mới: ${newNotif.title}`, {
            position: "bottom-right",
          });
        });
      } catch (err) {
        console.error("🔴 [SignalR] Connection failed:", err);
      }
    };

    startConnection();
    connectionRef.current = connection;

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [isAuthenticated]);

  const handleNotificationClick = async (notif: NotificationDto) => {
    if (!notif.isRead) {
      try {
        await axiosInstance.put(
          `/WardensHome/notifications/${notif.notificationId}/read`
        );

        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === notif.notificationId
              ? { ...n, isRead: true }
              : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Lỗi mark read:", error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group outline-none focus:ring-2 focus:ring-orange-200">
          <Bell
            size={22}
            className={cn(
              "text-gray-500 group-hover:text-orange-600 transition-colors",
              unreadCount > 0 && "text-orange-600 animate-pulse" // Thêm hiệu ứng rung nếu có noti
            )}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white animate-in zoom-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 shadow-xl border-orange-100 rounded-xl bg-white z-50"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-orange-50/80 border-b border-orange-100 rounded-t-xl backdrop-blur-sm">
          <span className="font-bold text-gray-800">Thông báo</span>
        </div>

        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-orange-400 w-6 h-6" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Bell className="text-gray-400" size={20} />
              </div>
              <p className="text-gray-500 text-sm font-medium">
                Bạn chưa có thông báo nào
              </p>
            </div>
          ) : (
            notifications.map((item, index) => (
              <DropdownMenuItem
                key={item.notificationId || index}
                onClick={() => handleNotificationClick(item)}
                className={cn(
                  "flex flex-col items-start px-4 py-3 border-b last:border-0 cursor-pointer transition-colors focus:bg-orange-50",
                  !item.isRead
                    ? "bg-orange-50/40 hover:bg-orange-50/60"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="flex justify-between w-full mb-1.5 items-start">
                  <div className="flex items-center gap-2">
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 animate-pulse" />
                    )}
                    <span
                      className={cn(
                        "text-sm text-gray-800",
                        !item.isRead ? "font-bold" : "font-semibold"
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 flex-shrink-0">
                    {formatDistanceToNow(parseDate(item.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm line-clamp-2 w-full",
                    !item.isRead ? "text-gray-700" : "text-gray-500"
                  )}
                >
                  {item.content}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
