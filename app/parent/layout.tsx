"use client";

import React, { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { SelectedChildProvider } from "@/context/SelectedChildContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { menuItems } from "@/data";
import { useParentNavigation } from "@/hooks/layout/useParentNavigation";
import { SidebarContent } from "@/components/layouts/parent/SidebarContent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ParentLayout({
  children: pageContent,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const { activeTab, handleTabClick } = useParentNavigation();

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SelectedChildProvider>
      <div className="min-h-screen bg-gray-100 flex" suppressHydrationWarning>
        <div
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } bg-white shadow-lg transition-all duration-300 overflow-hidden`}
          suppressHydrationWarning
        >
          <div className="p-6" suppressHydrationWarning>
            <div
              className="flex items-center justify-between mb-6"
              suppressHydrationWarning
            >
              <h2 className="text-xl font-bold text-gray-800">Danh sách con</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>

        <div className="flex-1 flex flex-col" suppressHydrationWarning>
          <div className="bg-white shadow-sm border-b" suppressHydrationWarning>
            <div
              className="px-6 py-4 flex items-center justify-between"
              suppressHydrationWarning
            >
              <div
                className="flex items-center space-x-4"
                suppressHydrationWarning
              >
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div suppressHydrationWarning>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Parent Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    Quản lý bữa ăn học đường
                  </p>
                </div>
              </div>

              <div
                className="flex items-center space-x-4"
                suppressHydrationWarning
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      suppressHydrationWarning
                    >
                      <div
                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold"
                        suppressHydrationWarning
                      >
                        {user?.fullName
                          ? user.fullName.substring(0, 2).toUpperCase()
                          : "PH"}
                      </div>
                      <div suppressHydrationWarning className="hidden md:block">
                        <p className="font-semibold text-sm">
                          {user?.fullName || "Phụ huynh"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {user?.email || "Đang tải ... "}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 hover:!text-red-600 hover:!bg-red-50 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div
            className="bg-white border-b overflow-x-auto"
            suppressHydrationWarning
          >
            <div className="flex space-x-1 px-6 py-2" suppressHydrationWarning>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        activeTab === item.id ? item.color : ""
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6" suppressHydrationWarning>
            <div className="max-w-5xl mx-auto" suppressHydrationWarning>
              {pageContent}
            </div>
          </div>
        </div>
      </div>
    </SelectedChildProvider>
  );
}
