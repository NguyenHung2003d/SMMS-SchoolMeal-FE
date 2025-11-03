"use client";

import {
  Bell,
  ChefHat,
  BarChart3,
  Utensils,
  Package,
  AlertCircle,
  Search,
  Menu,
  Home,
  Settings,
  LogOut,
  Users,
  ShoppingCart,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react"; // Thêm useEffect và useRef

export default function KitchenStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const pathname = usePathname();
  const accountMenuRef = useRef<HTMLDivElement>(null); // Ref cho menu tài khoản

  const isActive = (href: string) => pathname?.startsWith(href);

  // Tự động đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountMenuRef]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg fixed h-full transition-all duration-300 z-30 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div
            className={`flex items-center ${
              !isSidebarOpen && "justify-center w-full"
            }`}
          >
            <div className="bg-orange-500 p-2 rounded-lg">
              <ChefHat size={isSidebarOpen ? 24 : 20} className="text-white" />
            </div>
            {isSidebarOpen && (
              <h1 className="ml-3 font-bold text-xl text-gray-800">EduMeal</h1>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-orange-500 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
        <div className="flex-grow py-4 overflow-y-auto">
          <nav className="px-2">
            {/* TỔNG QUAN */}
            <div className={`mb-4 ${isSidebarOpen ? "px-4" : "px-0"}`}>
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
                    href="/kitchen-staff"
                    className={`flex items-center ${
                      isSidebarOpen ? "justify-start" : "justify-center"
                    } py-2 px-3 rounded-lg ${
                      isActive("/kitchen-staff") &&
                      !pathname.includes("/kitchen-staff/")
                        ? "bg-orange-50 text-orange-500 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Home size={20} />
                    {isSidebarOpen && <span className="ml-3">Trang chủ</span>}
                  </Link>
                </li>
              </ul>
            </div>
            {/* QUẢN LÝ */}
            <div className={`mb-4 ${isSidebarOpen ? "px-4" : "px-0"}`}>
              <p
                className={`text-xs font-medium text-gray-400 mb-2 ${
                  !isSidebarOpen && "text-center"
                }`}
              >
                {isSidebarOpen ? "QUẢN LÝ" : ""}
              </p>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/kitchen-staff/menu"
                    className={`flex items-center ${
                      isSidebarOpen ? "justify-start" : "justify-center"
                    } py-2 px-3 rounded-lg ${
                      isActive("/kitchen-staff/menu")
                        ? "bg-orange-50 text-orange-500 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Utensils size={20} />
                    {isSidebarOpen && <span className="ml-3">Thực đơn</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kitchen-staff/students"
                    className={`flex items-center ${
                      isSidebarOpen ? "justify-start" : "justify-center"
                    } py-2 px-3 rounded-lg ${
                      isActive("/kitchen-staff/students")
                        ? "bg-orange-50 text-orange-500 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Users size={20} />
                    {isSidebarOpen && <span className="ml-3">Học sinh</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kitchen-staff/inventory"
                    className={`flex items-center ${
                      isSidebarOpen ? "justify-start" : "justify-center"
                    } py-2 px-3 rounded-lg ${
                      isActive("/kitchen-staff/inventory")
                        ? "bg-orange-50 text-orange-500 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Package size={20} />
                    {isSidebarOpen && (
                      <span className="ml-3">Kho nguyên liệu</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kitchen-staff/purchase-plan"
                    className={`flex items-center ${
                      isSidebarOpen ? "justify-start" : "justify-center"
                    } py-2 px-3 rounded-lg ${
                      isActive("/kitchen-staff/purchase-plan")
                        ? "bg-orange-50 text-orange-500 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ShoppingCart size={20} />
                    {isSidebarOpen && (
                      <span className="ml-3">Kế hoạch mua sắm</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kitchen-staff/allergies"
                    className={`flex items-center ${
                      isSidebarOpen ? "justify-start" : "justify-center"
                    } py-2 px-3 rounded-lg ${
                      isActive("/kitchen-staff/allergies")
                        ? "bg-orange-50 text-orange-500 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <AlertCircle size={20} />
                    {isSidebarOpen && (
                      <>
                        <span className="ml-3">Dị ứng</span>
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          1
                        </span>
                      </>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kitchen-staff/feedback"
                    className={`flex items-center ${
                      isSidebarOpen ? "justify-start" : "justify-center"
                    } py-2 px-3 rounded-lg ${
                      isActive("/kitchen-staff/feedback")
                        ? "bg-orange-50 text-orange-500 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <MessageCircle size={20} />
                    {isSidebarOpen && (
                      <>
                        <span className="ml-3">Phản hồi & Đánh giá</span>
                      </>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        {/* --- PHẦN TÀI KHOẢN ĐÃ ĐƯỢC DỜI ĐI --- */}
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Quản lý bữa trưa
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 rounded-lg p-2 text-gray-600 hover:bg-gray-200 cursor-pointer">
                <Search size={20} />
              </div>
              <div className="relative">
                <div className="bg-gray-100 rounded-lg p-2 text-gray-600 hover:bg-gray-200 cursor-pointer">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>
              </div>

              {/* --- PHẦN TÀI KHOẢN ĐÃ CHUYỂN VÀO ĐÂY --- */}
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <span className="font-medium text-orange-600">NT</span>
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-10">
                    <div className="p-2 border-b">
                      <p className="font-medium text-sm text-gray-800">
                        Nguyễn Thị Tâm
                      </p>
                      <p className="text-xs text-gray-500">Quản lý bếp</p>
                    </div>
                    <ul className="p-1">
                      <li>
                        <a
                          href="#"
                          className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                          <Settings size={16} className="mr-2" />
                          Cài đặt
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <LogOut size={16} className="mr-2" />
                          Đăng xuất
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
