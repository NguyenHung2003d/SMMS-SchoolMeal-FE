"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bell, User } from "lucide-react";
import {
  SelectedChildProvider,
  useSelectedChild,
} from "@/context/SelectedChildContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { Student } from "@/types/student";
import { menuItems } from "@/data";

function SidebarContent({ students }: { students: Student[] }) {
  const { selectedChild, setSelectedChild } = useSelectedChild();

  if (!students || students.length === 0) {
    return (
      <div className="text-center text-gray-500">Đang tải danh sách...</div>
    );
  }

  return (
    <div className="space-y-3" suppressHydrationWarning>
      {students.map((child) => {
        const avatarSrc = child.avatarUrl || null;

        return (
          <div
            key={child.studentId}
            onClick={() => setSelectedChild(child)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedChild?.studentId === child.studentId
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
            }`}
            suppressHydrationWarning
          >
            <div
              className="flex items-center space-x-3"
              suppressHydrationWarning
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={child.fullName}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-gray-400" />
              )}

              <div className="flex-1" suppressHydrationWarning>
                <p className="font-semibold text-gray-800">{child.fullName}</p>
                <p className="text-sm text-gray-600">{child.className}</p>
                {child.allergies && child.allergies.length > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Dị ứng: {child.allergies.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ParentLayout({
  children: pageContent,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const studentsForSidebar: Student[] = user?.children || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pathname === "/parent") {
      router.push("/parent/register-meal");
    }
  }, [pathname, router]);
  const getActiveTab = () => {
    if (pathname.includes("/register-meal")) return "register";

    if (pathname.includes("/update-profile")) return "profile";

    if (pathname.includes("/health")) return "health";

    if (pathname.includes("/menu_and_feedback")) return "menu_and_feedback";

    if (pathname.includes("/invoice")) return "invoice";

    if (pathname.includes("/leave")) return "leave";

    return "register";
  };
  const activeTab = getActiveTab();

  const handleTabClick = (tabId: string) => {
    const routes: Record<string, string> = {
      register: "/parent/register-meal",

      profile: "/parent/update-profile",

      health: "/parent/health",

      menu_and_feedback: "/parent/menu_and_feedback",

      invoice: "/parent/invoice",

      leave: "/parent/leave",
    };

    router.push(routes[tabId]);
  };
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
            <SidebarContent students={studentsForSidebar} />
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
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-6 h-6 text-gray-600" />

                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div
                  className="flex items-center space-x-2"
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

                  <div suppressHydrationWarning>
                    <p className="font-semibold text-sm">
                      {user?.fullName || "Phụ huynh"}
                    </p>

                    <p className="text-xs text-gray-600">
                      {user?.email || "Đang tải ... "}{" "}
                    </p>
                  </div>
                </div>
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
