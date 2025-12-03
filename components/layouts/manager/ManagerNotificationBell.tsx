"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, Check } from "lucide-react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useAuth } from "@/hooks/auth/useAuth";
import { axiosInstance } from "@/lib/axiosInstance";
import { ManagerNotification } from "@/types/notification";
import toast from "react-hot-toast";
import Link from "next/link";
import { formatDate } from "@/helpers";

export default function ManagerNotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/ManagerNotifications/notifications");
      const data = res.data;
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchNotifications();

    const HUB_URL =
      process.env.NEXT_PUBLIC_HUB_URL ||
      "http://localhost:5000/hubs/notifications";
    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, [token]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("🔔 Bell Connected to Hub");

          connection.on(
            "ReceiveNotification",
            (notification: ManagerNotification) => {
              setUnreadCount((prev) => prev + 1);

              setNotifications((prev) => [
                { ...notification, createdAt: new Date(), isRead: false },
                ...prev,
              ]);

              toast(notification.title || "Có thông báo mới!", {
                icon: "🔔",
                position: "bottom-right",
                style: { background: "#333", color: "#fff" },
              });
            }
          );
        })
        .catch((err) => console.error("SignalR Error:", err));
    }
    return () => {
      connection?.stop();
    };
  }, [connection]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-orange-50 rounded-full transition-colors focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-orange-100 overflow-hidden z-50 origin-top-right transform transition-all">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Thông báo</h3>
            <Link
              href="/manager/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-orange-600 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Bell size={32} className="text-gray-300 mb-2" />
                <p className="text-sm">Chưa có thông báo nào</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((notif, index) => (
                  <li
                    key={index}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notif.isRead ? "bg-orange-50/50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                          !notif.isRead ? "bg-orange-500" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <p
                          className={`text-sm ${
                            !notif.isRead
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {notif.content}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {formatDate(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
            <button
              className="text-xs font-medium text-gray-500 hover:text-orange-600 transition-colors flex items-center justify-center w-full gap-1"
              onClick={() => {
                setUnreadCount(0);
              }}
            >
              <Check size={14} /> Đánh dấu tất cả là đã đọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
