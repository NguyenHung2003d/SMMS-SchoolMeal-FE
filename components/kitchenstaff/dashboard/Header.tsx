"use client";
import { useState, useRef, useEffect } from "react";
import { Menu, ChevronRight, LogOut } from "lucide-react";
import { KitchenStaffNotificationBell } from "@/components/layouts/kitchenStaff/KitchenStaffNotificationBell";
import { getInitials } from "@/helpers";
import { SearchBox } from "./SearchBox";

export function Header({ user, logout, toggleSidebar }: any) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      )
        setIsAccountMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="px-4 md:px-6 py-3 flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Menu size={20} />
          </button>
          <div className="hidden md:block">
            <div className="flex items-center text-sm text-gray-400 space-x-1">
              <span>Bếp ăn</span> <ChevronRight size={14} />{" "}
              <span>Tổng quan</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 leading-none">
              Quản lý bữa trưa
            </h2>
          </div>
        </div>

        <SearchBox />

        <div className="flex items-center space-x-4">
          <KitchenStaffNotificationBell />
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50"
            >
              <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white shadow-sm text-orange-600 font-bold text-sm">
                {getInitials(user?.fullName || "S")}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-700 leading-tight">
                  {user?.fullName || "Staff"}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-medium">
                  {user?.role || "Kitchen"}
                </p>
              </div>
            </button>
            {isAccountMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border p-1 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="mr-2" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
