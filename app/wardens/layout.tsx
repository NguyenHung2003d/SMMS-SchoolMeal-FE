"use client";
import React from "react";
import {
  Home,
  BookOpen,
  Calendar,
  Image,
  FileText,
  BarChart2,
  Bell,
  AlertCircle,
  Activity,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-orange-500 text-white fixed h-full">
        <div className="p-4 border-b border-orange-400">
          <h1 className="text-xl font-bold">Warden Portal</h1>
          <p className="text-sm text-orange-200">Hệ thống quản lý học sinh</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/wardens"
                className={`flex items-center px-4 py-3 rounded-lg ${
                  isActive("/wardens")
                    ? "bg-white text-orange-500"
                    : "hover:bg-orange-600"
                }`}
              >
                <Home size={20} className="mr-3" />
                <span>Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link
                href="/wardens/classView"
                className={`flex items-center px-4 py-3 rounded-lg ${
                  isActive("/wardens/class")
                    ? "bg-white text-orange-500"
                    : "hover:bg-orange-600"
                }`}
              >
                <Users size={20} className="mr-3" />
                <span>Xem lớp học</span>
              </Link>
            </li>
            <li>
              <Link
                href="/wardens/health"
                className={`flex items-center px-4 py-3 rounded-lg ${
                  isActive("/wardens/health")
                    ? "bg-white text-orange-500"
                    : "hover:bg-orange-600"
                }`}
              >
                <Activity size={20} className="mr-3" />
                <span>Theo dõi sức khỏe</span>
              </Link>
            </li>
            <li>
              <Link
                href="/wardens/gallery"
                className={`flex items-center px-4 py-3 rounded-lg ${
                  isActive("/wardens/gallery")
                    ? "bg-white text-orange-500"
                    : "hover:bg-orange-600"
                }`}
              >
                <Image size={20} className="mr-3" />
                <span>Quản lý ảnh</span>
              </Link>
            </li>
            <li>
              <Link
                href="/wardens/issues"
                className={`flex items-center px-4 py-3 rounded-lg ${
                  isActive("/wardens/issues")
                    ? "bg-white text-orange-500"
                    : "hover:bg-orange-600"
                }`}
              >
                <AlertCircle size={20} className="mr-3" />
                <span>Báo cáo vấn đề</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main content */}
      <div className="ml-64 flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Quản sinh
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell size={20} className="text-gray-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-orange-50 p-2 rounded-lg">
              <div className="bg-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                <span className="font-bold">LA</span>
              </div>
              <div>
                <p className="font-medium text-sm">Cô Lan Anh</p>
                <p className="text-xs text-gray-500">Quản sinh lớp 1A</p>
              </div>
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
