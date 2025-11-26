"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HubConnectionBuilder, LogLevel, HubConnection, HttpTransportType } from "@microsoft/signalr";
import { useAuth } from "@/hooks/auth/useAuth";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { axiosInstance } from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";

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
  
  const { token } = useAuth();
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/WardensHome/notifications");
        
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        
        setNotifications(data);
        
        const unread = data.filter((n: NotificationDto) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Lỗi tải thông báo Warden:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (connectionRef.current) return;

    const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "http://localhost:5000/hubs/notifications";

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token, 
        skipNegotiation: true,           
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection
      .start()
      .then(() => {
        console.log("🟠 Warden SignalR Connected");

        connection.on("ReceiveNotification", (newNotif: NotificationDto) => {
          console.log("🔔 Nhận thông báo mới:", newNotif);
          
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(() => {});
          } catch (e) {}
        });
      })
      .catch((err) => console.error("🔴 SignalR Error:", err));

    connectionRef.current = connection;

    return () => {
      if (connectionRef.current) {
        connectionRef.current.off("ReceiveNotification");
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [token]);

  const handleMarkAsRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    // TODO: Gọi API PUT /WardensHome/notifications/read nếu backend hỗ trợ
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group outline-none focus:ring-2 focus:ring-orange-200">
          <Bell
            size={22}
            className={cn(
              "text-gray-500 group-hover:text-orange-600 transition-colors",
              unreadCount > 0 && "text-gray-700"
            )}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white animate-in zoom-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0 shadow-xl border-orange-100 rounded-xl bg-white z-50">
        <div className="flex items-center justify-between px-4 py-3 bg-orange-50/80 border-b border-orange-100 rounded-t-xl backdrop-blur-sm">
          <span className="font-bold text-gray-800">Thông báo Warden</span>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAsRead}
              className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline"
            >
              <CheckCheck className="w-3 h-3" />
              Đánh dấu đã đọc
            </button>
          )}
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
              <p className="text-gray-500 text-sm font-medium">Bạn chưa có thông báo nào</p>
            </div>
          ) : (
            notifications.map((item, index) => (
              <DropdownMenuItem
                key={item.notificationId || index}
                className={cn(
                  "flex flex-col items-start px-4 py-3 border-b last:border-0 cursor-pointer transition-colors focus:bg-orange-50",
                  !item.isRead ? "bg-orange-50/40 hover:bg-orange-50/60" : "hover:bg-gray-50"
                )}
              >
                <div className="flex justify-between w-full mb-1.5 items-start">
                  <div className="flex items-center gap-2">
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 animate-pulse" />
                    )}
                    <span className={cn("text-sm text-gray-800", !item.isRead ? "font-bold" : "font-semibold")}>
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 flex-shrink-0">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                </div>
                <p className={cn(
                  "text-sm line-clamp-2 w-full", 
                  !item.isRead ? "text-gray-700" : "text-gray-500"
                )}>
                  {item.content}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <div className="p-2 bg-gray-50 border-t text-center rounded-b-xl">
           <button className="text-xs text-gray-500 hover:text-orange-600 font-medium transition-colors w-full py-1">
             Xem tất cả
           </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}