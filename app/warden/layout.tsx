"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Activity,
  Image as ImageIcon,
  AlertCircle,
  Bell,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";

import { useAuth } from "@/hooks/auth/useAuth";
import { SidebarItemProps } from "@/types";
import { WardenNotificationBell } from "@/components/warden/WardenNotificationBell";
const NAV_ITEMS = [
  { href: "/warden/dashboard", label: "Trang chủ", icon: Home, exact: true },
  { href: "/warden/classView", label: "Xem lớp học", icon: Users },
  { href: "/warden/health", label: "Theo dõi sức khỏe", icon: Activity },
  { href: "/warden/gallery", label: "Quản lý ảnh", icon: ImageIcon },
  { href: "/warden/feedback", label: "Báo cáo vấn đề", icon: AlertCircle },
];

export default function WardenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (logout) logout();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-orange-500 text-white fixed h-full z-20 flex flex-col shadow-lg">
        <div className="p-6 border-b border-orange-400">
          <h1 className="text-2xl font-bold tracking-tight">Warden Portal</h1>
          <p className="text-sm text-orange-100 opacity-90">Hệ thống quản lý</p>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={
                item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              }
            />
          ))}
        </nav>

        <div className="p-4 border-t border-orange-400">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-orange-100 hover:text-white hover:bg-orange-600 rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Dashboard Quản Sinh
          </h2>

          <div className="flex items-center space-x-5">
            <WardenNotificationBell />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 bg-orange-50 pl-2 pr-3 py-1.5 rounded-full border border-orange-100 hover:bg-orange-100 transition-colors focus:outline-none"
              >
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full h-9 w-9 flex items-center justify-center shadow-sm">
                  <span className="font-bold text-sm tracking-widest">
                    {getInitials(user?.fullName)}
                  </span>
                </div>
                <div className="text-left hidden md:block">
                  <p className="font-semibold text-sm text-gray-800 leading-tight">
                    {user?.fullName || "Đang tải..."}
                  </p>
                  <p className="text-xs text-gray-500 font-medium leading-tight">
                    {user?.role || "Warden"}
                  </p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

function SidebarItem({ href, icon: Icon, label, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
        ${
          isActive
            ? "bg-white text-orange-600 shadow-sm font-medium"
            : "text-white hover:bg-orange-600 hover:shadow-inner"
        }
      `}
    >
      <Icon
        size={20}
        className={`mr-3 transition-transform group-hover:scale-110 ${
          isActive ? "text-orange-600" : "text-orange-100"
        }`}
      />
      <span>{label}</span>
    </Link>
  );
}
