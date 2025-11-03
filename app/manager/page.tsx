"use client";
import React from "react";
import {
  Users,
  BookOpen,
  Bell,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  UserPlus,
  School,
  Utensils,
  MessageSquare,
  BarChart3,
  Upload,
  Download,
  DollarSign,
  ShoppingCart,
  Inbox,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { stats } from "@/data/dashboard/stats";
import { kitchenPurchases } from "@/data/kitchen/expenses";

export default function ManagerDashboardPage() {
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  // Mock kitchen purchase data

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý trường học
          </h1>
          <p className="text-gray-600">Chào mừng trở lại, Nguyễn Hoàng</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-gray-500" />
            <select
              defaultValue="month"
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
            >
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
          <Button className="flex items-center">
            <Plus size={16} className="mr-2" />
            Tạo mới
          </Button>
        </div>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Teachers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Quản sinh
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.teachers.total}
              </h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <TrendingUp size={14} className="mr-0.5" />{" "}
                  {stats.teachers.growth}
                </span>
                <span className="text-gray-500">Quản sinh mới</span>
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        {/* Students */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Học sinh</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {formatNumber(stats.students.total)}
              </h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <TrendingUp size={14} className="mr-0.5" />{" "}
                  {stats.students.growth}%
                </span>
                <span className="text-gray-500">so với tháng trước</span>
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <School size={24} className="text-green-500" />
            </div>
          </div>
        </div>
        {/* Classes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Lớp học</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.classes.total}
              </h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-blue-500 flex items-center mr-1">
                  <CheckCircle size={14} className="mr-0.5" />
                </span>
                <span className="text-gray-500">đã phân công giáo viên</span>
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BookOpen size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
        {/* Finance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Tài chính
              </p>
              <h3 className="text-3xl font-bold text-gray-800">3.5M VND</h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <TrendingUp size={14} className="mr-0.5" /> 5%
                </span>
                <span className="text-gray-500">so với tháng trước</span>
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <DollarSign size={24} className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>
      {/* Quick access */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Truy cập nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link
            href="/manager/staff"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <UserPlus size={24} className="text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">
              Tạo tài khoản nhân viên
            </h3>
            <p className="text-xs text-gray-500">
              Thêm giáo viên và nhân viên mới
            </p>
          </Link>
          <Link
            href="/manager/parents"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <Users size={24} className="text-green-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">
              Tạo tài khoản phụ huynh
            </h3>
            <p className="text-xs text-gray-500">Quản lý tài khoản phụ huynh</p>
          </Link>
          <Link
            href="/manager/classes"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="bg-purple-100 p-3 rounded-full mb-3">
              <BookOpen size={24} className="text-purple-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Tạo lớp học</h3>
            <p className="text-xs text-gray-500">
              Quản lý lớp và phân công giáo viên
            </p>
          </Link>
          <Link
            href="/manager/students"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="bg-yellow-100 p-3 rounded-full mb-3">
              <Upload size={24} className="text-yellow-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Nhập học sinh</h3>
            <p className="text-xs text-gray-500">
              Nhập danh sách học sinh từ file
            </p>
          </Link>
          <Link
            href="/manager/notifications"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="bg-red-100 p-3 rounded-full mb-3">
              <Bell size={24} className="text-red-500" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Gửi thông báo</h3>
            <p className="text-xs text-gray-500">
              Gửi thông báo tới phụ huynh và giáo viên
            </p>
          </Link>
        </div>
      </div>
      {/* Reports section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Báo cáo và thống kê</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/manager/statistics"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <BarChart3 size={24} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Thống kê nội bộ</h3>
                <p className="text-xs text-gray-500">
                  Xem báo cáo thống kê chi tiết
                </p>
              </div>
            </div>
            <button className="w-full py-2 text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center">
              <span>Xem thống kê</span>
              <ArrowUpRight size={16} className="ml-1" />
            </button>
          </Link>
          <Link
            href="/manager/invoices"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <CreditCard size={24} className="text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Báo cáo hóa đơn</h3>
                <p className="text-xs text-gray-500">
                  Xem tất cả hóa đơn và thanh toán
                </p>
              </div>
            </div>
            <button className="w-full py-2 text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center">
              <span>Xem hóa đơn</span>
              <ArrowUpRight size={16} className="ml-1" />
            </button>
          </Link>
          <Link
            href="/manager/finance"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <Download size={24} className="text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Báo cáo tài chính</h3>
                <p className="text-xs text-gray-500">
                  Xuất báo cáo tài chính chi tiết
                </p>
              </div>
            </div>
            <button className="w-full py-2 text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center">
              <span>Xuất báo cáo</span>
              <ArrowUpRight size={16} className="ml-1" />
            </button>
          </Link>
        </div>
      </div>
      {/* Kitchen Purchase Report */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Báo cáo thu mua bếp</h2>
          <Link
            href="/manager/kitchen-purchases"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
          >
            Xem tất cả
            <ArrowUpRight size={14} className="ml-1" />
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <ShoppingCart className="mr-2" size={18} />
              Các khoản thu mua gần đây
            </h3>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download size={14} className="mr-1" />
              Xuất báo cáo
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhà cung cấp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng mặt hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kitchenPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {purchase.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {purchase.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {purchase.items} mặt hàng
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {purchase.amount.toLocaleString("vi-VN")} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {purchase.status === "completed" ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Đã hoàn thành
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Đang xử lý
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-500 hover:text-blue-700">
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tổng chi phí tháng 11:</span>{" "}
              {(13500000).toLocaleString("vi-VN")} VND
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Ngân sách còn lại:</span>{" "}
              {(6500000).toLocaleString("vi-VN")} VND
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
