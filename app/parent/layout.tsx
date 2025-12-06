"use client";

import React, { useEffect, useState } from "react";
import { Menu, X, LogOut, Loader2 } from "lucide-react";
import { SelectedChildProvider } from "@/context/SelectedChildContext";
import { useAuth } from "@/hooks/auth/useAuth"; // Import hook
import { menuItems } from "@/data";
import { SidebarContent } from "@/components/layouts/parent/SidebarContent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ParentNotificationBell } from "@/components/layouts/parent/ParentNotificationBell";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ParentLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const { user, logout, isLogoutLoading } = useAuth();

  const pathname = usePathname();

  const handleLogout = () => {
    if (logout) logout();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SelectedChildProvider>
      <div className="h-screen w-full bg-gray-100 flex overflow-hidden relative">
        {isLogoutLoading && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center space-y-4">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="text-gray-700 font-medium">Đang đăng xuất...</p>
            </div>
          </div>
        )}

        <aside
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } bg-white shadow-lg transition-all duration-300 h-full flex-shrink-0 flex flex-col border-r z-20`}
        >
          <div className="p-6 flex-shrink-0 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">
              Danh sách con
            </h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
            <SidebarContent />
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
          <header className="bg-white shadow-sm border-b flex-shrink-0 z-10">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="overflow-hidden">
                  <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap truncate">
                    Parent Dashboard
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4 flex-shrink-0">
                <ParentNotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer select-none">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.fullName?.substring(0, 2).toUpperCase() || "PH"}
                      </div>
                      <div className="hidden md:block text-right">
                        <p className="font-semibold text-sm truncate max-w-[150px]">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-600 truncate max-w-[150px]">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isLogoutLoading} // Khóa nút khi đang loading
                      className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                    >
                      {isLogoutLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="overflow-x-auto border-t no-scrollbar w-full">
              <div className="flex space-x-1 px-6 py-2 min-w-max">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  const isHovered = hoveredItemId === item.id;

                  return (
                    <Link
                      key={item.id}
                      href={item.path || "#"}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : isHovered
                          ? `bg-gray-50 ${item.color}`
                          : "text-gray-600"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive || isHovered ? item.color : "text-gray-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gray-50 p-6 no-scrollbar">
            <div className="max-w-6xl mx-auto pb-10">{children}</div>
          </main>
        </div>
      </div>
    </SelectedChildProvider>
  );
}
