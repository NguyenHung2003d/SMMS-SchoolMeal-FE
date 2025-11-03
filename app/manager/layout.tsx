"use client";
import React, { useState } from "react";
import {
  Building,
  Home,
  Users,
  BookOpen,
  Bell,
  Settings,
  LogOut,
  Search,
  Menu,
  ChevronDown,
  School,
  User,
  FileText,
  Calendar,
  BarChart3,
  MessageSquare,
  DollarSign,
  Upload,
  UserPlus,
  Download,
  ClipboardList,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg fixed h-full transition-all duration-300 z-30`}
      >
        <div className="p-4 flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-500 to-amber-500">
          <div
            className={`flex items-center ${
              !isSidebarOpen && "justify-center w-full"
            }`}
          >
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center shadow-md">
              <Building size={18} className="text-orange-500" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl ml-3 text-white">
                Manager Portal
              </span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-orange-100 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
        <nav className="p-4">
          <div className="mb-4">
            <p
              className={`text-xs font-medium text-gray-400 mb-2 ${
                !isSidebarOpen && "text-center"
              }`}
            >
              {isSidebarOpen ? "TỔNG QUAN" : ""}
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/manager"
                  className={`flex items-center w-full ${
                    isSidebarOpen ? "justify-start px-4" : "justify-center"
                  } py-3 rounded-lg ${
                    isActive("/manager")
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <Home size={20} />
                  {isSidebarOpen && <span className="ml-3">Trang chủ</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/manager/statistics"
                  className={`flex items-center w-full ${
                    isSidebarOpen ? "justify-start px-4" : "justify-center"
                  } py-3 rounded-lg ${
                    isActive("/manager/statistics")
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <BarChart3 size={20} />
                  {isSidebarOpen && (
                    <span className="ml-3">Thống kê nội bộ</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <p
              className={`text-xs font-medium text-gray-400 mb-2 ${
                !isSidebarOpen && "text-center"
              }`}
            >
              {isSidebarOpen ? "QUẢN LÝ TÀI KHOẢN" : ""}
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() =>
                    setIsAccountDropdownOpen(!isAccountDropdownOpen)
                  }
                  className={`flex items-center w-full ${
                    isSidebarOpen ? "justify-between px-4" : "justify-center"
                  } py-3 rounded-lg ${
                    pathname.startsWith("/manager/staff") ||
                    pathname.startsWith("/manager/parents")
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <div className="flex items-center">
                    <Users size={20} />
                    {isSidebarOpen && (
                      <span className="ml-3">Quản lý tài khoản</span>
                    )}
                  </div>
                  {isSidebarOpen && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isAccountDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown con */}
                {isAccountDropdownOpen && isSidebarOpen && (
                  <ul className="ml-8 mt-2 space-y-1">
                    <li>
                      <Link
                        href="/manager/staff"
                        className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                          pathname.startsWith("/manager/staff")
                            ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600"
                            : "text-gray-600 hover:bg-orange-50"
                        }`}
                      >
                        <UserPlus size={16} className="mr-2" />
                        Tài khoản nhân viên
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/manager/parents"
                        className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                          pathname.startsWith("/manager/parents")
                            ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600"
                            : "text-gray-600 hover:bg-orange-50"
                        }`}
                      >
                        <Users size={16} className="mr-2" />
                        Tài khoản phụ huynh
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <p
              className={`text-xs font-medium text-gray-400 mb-2 ${
                !isSidebarOpen && "text-center"
              }`}
            >
              {isSidebarOpen ? "QUẢN LÝ HỌC TẬP" : ""}
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/manager/classes"
                  className={`flex items-center w-full ${
                    isSidebarOpen ? "justify-start px-4" : "justify-center"
                  } py-3 rounded-lg ${
                    isActive("/manager/classes")
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <BookOpen size={20} />
                  {isSidebarOpen && (
                    <span className="ml-3">Quản lý lớp học</span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/manager/notifications"
                  className={`flex items-center w-full ${
                    isSidebarOpen ? "justify-start px-4" : "justify-center"
                  } py-3 rounded-lg ${
                    isActive("/manager/notifications")
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <Bell size={20} />
                  {isSidebarOpen && <span className="ml-3">Gửi thông báo</span>}
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <p
              className={`text-xs font-medium text-gray-400 mb-2 ${
                !isSidebarOpen && "text-center"
              }`}
            >
              {isSidebarOpen ? "TÀI CHÍNH" : ""}
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/manager/billing"
                  className={`flex items-center w-full ${
                    isSidebarOpen ? "justify-start px-4" : "justify-center"
                  } py-3 rounded-lg ${
                    isActive("/manager/billing") ||
                    isActive("/manager/invoices")
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <FileText size={20} />
                  {isSidebarOpen && (
                    <span className="ml-3">Quản lý hóa đơn</span>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  href="/manager/finance"
                  className={`flex items-center w-full ${
                    isSidebarOpen ? "justify-start px-4" : "justify-center"
                  } py-3 rounded-lg ${
                    isActive("/manager/finance")
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <Download size={20} />
                  {isSidebarOpen && (
                    <span className="ml-3">Xuất báo cáo tài chính</span>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  href="/manager/payment-settings"
                  className={`flex items-center w-full ${
                    isSidebarOpen ? "justify-start px-4" : "justify-center"
                  } py-3 rounded-lg ${
                    isActive("/manager/payment-settings")
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm"
                      : "text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  <Settings size={20} />
                  {isSidebarOpen && (
                    <span className="ml-3">Cài đặt thanh toán</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      {/* Main content */}
      <div
        className={`flex-1 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-orange-100">
          <div className="px-6 py-4 flex justify-between items-center">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-orange-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <Search
                  className="absolute left-3 top-2.5 text-orange-400"
                  size={18}
                />
              </div>
            </div>

            {/* Notification + User Icon */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-2 text-orange-600 hover:from-orange-100 hover:to-amber-100 cursor-pointer transition-all">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  3
                </span>
              </div>

              {/* User Icon + Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu((prev) => !prev)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-sm">
                    <span className="font-medium text-orange-600">NH</span>
                  </div>
                  {isSidebarOpen && (
                    <>
                      <div className="hidden md:block text-left">
                        <p className="font-medium text-sm">Nguyễn Hoàng</p>
                        <p className="text-xs text-gray-500">
                          Trường Tiểu học A
                        </p>
                      </div>
                      <ChevronDown
                        size={16}
                        className="text-gray-500 hidden md:block"
                      />
                    </>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-orange-100 z-50">
                    <Link
                      href="/manager/account"
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <User size={16} className="mr-2" />
                      Thông tin cá nhân
                    </Link>
                    <Link
                      href="/manager/settings"
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <Settings size={16} className="mr-2" />
                      Cài đặt
                    </Link>
                    <button
                      onClick={() => {
                        /* Logic đăng xuất */
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        {/* Main content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
