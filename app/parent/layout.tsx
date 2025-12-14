"use client";

import React, { useEffect, useState } from "react";
import { X, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { menuItems } from "@/data";
import { SidebarContent } from "@/components/layouts/parent/SidebarContent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ParentNotificationBell } from "@/components/layouts/parent/ParentNotificationBell";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SelectedStudentProvider } from "@/context/SelectedChildContext";

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
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  if (!mounted) return null;

  return (
    <SelectedStudentProvider>
      <div className="h-screen w-full bg-[#f8fafc] flex overflow-hidden relative font-sans">
        {isLogoutLoading && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md transition-all animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
                <Loader2 className="relative h-12 w-12 text-orange-600 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                Đang đăng xuất an toàn...
              </p>
            </div>
          </div>
        )}

        <aside
          className={`${
            sidebarOpen
              ? "w-80 translate-x-0"
              : "w-0 -translate-x-full lg:translate-x-0 lg:w-0"
          } fixed lg:relative z-30 bg-white border-r border-gray-200 shadow-xl lg:shadow-none transition-all duration-300 ease-in-out h-full flex flex-col overflow-hidden`}
        >
          <div className="p-5 flex-shrink-0 flex justify-between items-center bg-gradient-to-r from-orange-600 to-orange-500 text-white">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold whitespace-nowrap tracking-wide">
                DANH SÁCH CON
              </h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 no-scrollbar bg-gray-50/50">
            <SidebarContent />
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative transition-all duration-300">
          <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 w-full shadow-sm">
            <div className="px-4 sm:px-6 py-3 flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-orange-600 truncate">
                    Parent Dashboard
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Quản lý thông tin học sinh
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                <ParentNotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full sm:rounded-lg transition-all border border-transparent hover:border-gray-200 focus:outline-none">
                      <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                        {user?.fullName?.substring(0, 1).toUpperCase() || "P"}
                      </div>
                      <div className="hidden md:block text-right">
                        <p className="font-semibold text-sm text-gray-700 truncate max-w-[120px]">
                          {user?.fullName}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                          Phụ huynh
                        </p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-2 rounded-xl shadow-xl border-gray-100"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.fullName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground text-gray-500">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isLogoutLoading}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer p-2"
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

            <div className="w-full border-t border-gray-100 bg-white">
              <div className="w-full overflow-x-auto no-scrollbar">
                <div className="flex items-center px-4 sm:px-6 py-2 min-w-full gap-2">
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
                        className={`
                          relative flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap
                          ${
                            isActive
                              ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                              : isHovered
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-500 hover:text-gray-700"
                          }
                        `}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isActive
                              ? "text-white"
                              : item.color || "text-gray-400"
                          }`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 no-scrollbar scroll-smooth">
            <div className="w-full mx-auto pb-10 animate-in slide-in-from-bottom-2 fade-in duration-500 transition-all ease-in-out">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SelectedStudentProvider>
  );
}
