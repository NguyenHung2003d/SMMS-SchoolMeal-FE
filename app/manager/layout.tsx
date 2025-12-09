"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  BookOpen,
  Bell,
  Settings,
  LogOut,
  Search,
  Menu, // Icon Menu
  ChevronDown,
  User,
  FileText,
  BarChart3,
  PackageCheck,
  Receipt,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { getInitials } from "@/helpers";
import ManagerNotificationBell from "@/components/layouts/manager/ManagerNotificationBell";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout, isLoading, isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  const isActive = (href: string) => pathname.startsWith(href);

  const SidebarItem = ({ href, icon: Icon, label, isOpen, active }: any) => (
    <Link
      href={href}
      className={`flex items-center w-full ${
        isOpen ? "justify-start px-4" : "justify-center"
      } py-3 my-1 rounded-xl transition-all duration-200 group relative ${
        active
          ? "bg-white text-orange-600 shadow-md font-bold"
          : "text-orange-50 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon
        size={20}
        className={`${
          active ? "text-orange-600" : "text-orange-100 group-hover:text-white"
        } transition-colors`}
      />
      {isOpen && <span className="ml-3">{label}</span>}

      {!isOpen && (
        <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
          {label}
        </div>
      )}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-[#fff7ed]">
      <div
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-b from-orange-600 to-orange-500 shadow-2xl fixed h-full transition-all duration-300 z-30 flex flex-col`}
      >
        <div
          className={`p-5 flex items-center border-b border-orange-400/30 h-[73px] ${
            isSidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/20 text-white">
                  <GraduationCap size={24} />
                </div>
                <div className="text-white">
                  <h1 className="font-extrabold text-lg leading-tight">
                    Manager Portal
                  </h1>
                  <p className="text-[10px] text-orange-100 font-medium tracking-wider opacity-80">
                    Quán lý
                  </p>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="h-10 w-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/20 text-white transition-all cursor-pointer"
              title="Mở rộng"
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-none space-y-8">
          <div>
            {isSidebarOpen && (
              <p className="px-4 text-xs font-bold text-orange-200 mb-2 uppercase tracking-widest">
                Tổng quan
              </p>
            )}
            <SidebarItem
              href="/manager/dashboard"
              icon={Home}
              label="Trang chủ"
              isOpen={isSidebarOpen}
              active={isActive("/manager/dashboard")}
            />
          </div>

          <div>
            {isSidebarOpen && (
              <p className="px-4 text-xs font-bold text-orange-200 mb-2 uppercase tracking-widest">
                Quản trị
              </p>
            )}

            <div
              className={`rounded-xl transition-all ${
                isAccountDropdownOpen ? "bg-orange-700/20" : ""
              }`}
            >
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className={`flex items-center w-full ${
                  isSidebarOpen ? "justify-between px-4" : "justify-center"
                } py-3 rounded-xl text-orange-50 hover:bg-white/10 hover:text-white transition-all`}
              >
                <div className="flex items-center">
                  <Users size={20} className="text-orange-100" />
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium">Tài khoản</span>
                  )}
                </div>
                {isSidebarOpen && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isAccountDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isAccountDropdownOpen
                    ? "max-h-40 opacity-100 mt-1 space-y-1"
                    : "max-h-0 opacity-0"
                }`}
              >
                <Link
                  href="/manager/staff"
                  className={`flex items-center px-4 py-2 text-sm rounded-lg ml-4 ${
                    isActive("/manager/staff")
                      ? "text-white font-bold bg-white/20"
                      : "text-orange-100 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current mr-2"></div>
                  {isSidebarOpen && "Nhân viên"}
                </Link>
                <Link
                  href="/manager/parents"
                  className={`flex items-center px-4 py-2 text-sm rounded-lg ml-4 ${
                    isActive("/manager/parents")
                      ? "text-white font-bold bg-white/20"
                      : "text-orange-100 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current mr-2"></div>
                  {isSidebarOpen && "Phụ huynh"}
                </Link>
              </div>
            </div>

            <SidebarItem
              href="/manager/classes"
              icon={BookOpen}
              label="Lớp học"
              isOpen={isSidebarOpen}
              active={isActive("/manager/classes")}
            />
            <SidebarItem
              href="/manager/notifications"
              icon={Bell}
              label="Thông báo"
              isOpen={isSidebarOpen}
              active={isActive("/manager/notifications")}
            />
          </div>

          <div>
            {isSidebarOpen && (
              <p className="px-4 text-xs font-bold text-orange-200 mb-2 uppercase tracking-widest">
                Nghiệp vụ
              </p>
            )}
            <SidebarItem
              href="/manager/purchase-orders"
              icon={PackageCheck}
              label="Kho & Bếp"
              isOpen={isSidebarOpen}
              active={isActive("/manager/purchase-orders")}
            />
            <SidebarItem
              href="/manager/invoices"
              icon={Receipt}
              label="Hóa đơn"
              isOpen={isSidebarOpen}
              active={isActive("/manager/invoices")}
            />
            <SidebarItem
              href="/manager/finance"
              icon={BarChart3}
              label="Tài chính"
              isOpen={isSidebarOpen}
              active={isActive("/manager/finance")}
            />
            <SidebarItem
              href="/manager/payment-settings"
              icon={Settings}
              label="Cấu hình phí"
              isOpen={isSidebarOpen}
              active={isActive("/manager/payment-settings")}
            />
          </div>
        </nav>
      </div>

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-orange-100 px-6 py-4 flex justify-between items-center shadow-sm h-[73px]">
          <div className="flex-1 max-w-xl flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeftOpen size={20} />
              )}
            </button>

            <div className="relative group w-full">
              <input
                type="text"
                placeholder="Tìm kiếm nhanh..."
                className="w-full pl-10 pr-4 py-2.5 bg-orange-50/50 border border-orange-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all text-gray-700 placeholder:text-gray-400"
              />
              <Search
                className="absolute left-3.5 top-3 text-orange-300 group-focus-within:text-orange-500 transition-colors"
                size={18}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <ManagerNotificationBell />

            <div className="relative">
              <button
                onClick={() => setShowAccountMenu((prev) => !prev)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-700 leading-none">
                    {user?.fullName || "Manager"}
                  </p>
                  <p className="text-[10px] font-medium text-orange-500 uppercase mt-1">
                    Quản lý cấp cao
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 p-0.5 shadow-lg shadow-orange-200">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                    <span className="font-bold text-orange-600 text-sm">
                      {getInitials(user?.fullName || "AD")}
                    </span>
                  </div>
                </div>
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-orange-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
