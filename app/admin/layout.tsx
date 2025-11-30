"use client";
import { useState } from "react";
import {
  Home,
  School,
  Users,
  Bell,
  FileText,
  Settings,
  Search,
  Menu,
  ChevronDown,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { getInitials } from "@/helpers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isActive = (href: string) => pathname?.startsWith(href);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg fixed h-full transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-orange-500 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            {isSidebarOpen && (
              <span className="ml-3 font-bold text-xl">Admin Panel</span>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href="/admin/dashboard"
            className={`flex items-center py-3 rounded-lg ${
              isActive("/admin/dashboard")
                ? "bg-orange-50 text-orange-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Home size={20} />
            {isSidebarOpen && <span className="ml-3">Tổng quát</span>}
          </Link>
          <Link
            href="/admin/schools"
            className={`flex items-center py-3 rounded-lg ${
              isActive("/admin/schools")
                ? "bg-orange-50 text-orange-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <School size={20} />
            {isSidebarOpen && <span className="ml-3">Quản lý trường</span>}
          </Link>
          <Link
            href="/admin/notifications"
            className={`flex items-center py-3 rounded-lg ${
              isActive("/admin/notifications")
                ? "bg-orange-50 text-orange-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Bell size={20} />
            {isSidebarOpen && <span className="ml-3">Thông báo</span>}
          </Link>
          <Link
            href="/admin/reports"
            className={`flex items-center py-3 rounded-lg ${
              isActive("/admin/reports")
                ? "bg-orange-50 text-orange-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FileText size={20} />
            {isSidebarOpen && <span className="ml-3">Báo cáo</span>}
          </Link>
        </nav>
      </div>

      <div
        className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all`}
      >
        <header className="bg-white shadow-sm sticky top-0 z-10 p-4 flex justify-between items-center">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition"
            >
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-medium text-sm">
                  {getInitials(user?.fullName || "Admin")}
                </span>
              </div>
              <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-medium text-gray-700">
                  {user?.fullName || "Administrator"}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
