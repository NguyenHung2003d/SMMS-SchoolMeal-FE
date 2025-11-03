'use client'
import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  PieChart,
  Users,
  TrendingUp,
  BookOpen,
  DollarSign,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ManagerStatistics() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedYear, setSelectedYear] = useState("2023");
  const handleViewAttendanceDetails = () => {
    router.push("/manager/absence-requests");
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thống kê nội bộ</h1>
          <p className="text-gray-600">
            Xem báo cáo thống kê chi tiết về hoạt động của trường
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-gray-500" />
            <select
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter size={16} className="mr-2" />
            Bộ lọc
          </Button>
          <Button className="flex items-center">
            <Download size={16} className="mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>
      {/* Stats overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Tổng số học sinh
              </p>
              <h3 className="text-3xl font-bold text-gray-800">450</h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUp size={14} className="mr-0.5" /> 5%
                </span>
                <span className="text-gray-500">so với tháng trước</span>
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Tổng số nhân viên
              </p>
              <h3 className="text-3xl font-bold text-gray-800">32</h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUp size={14} className="mr-0.5" /> 2%
                </span>
                <span className="text-gray-500">so với tháng trước</span>
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users size={24} className="text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Tỷ lệ điểm danh
              </p>
              <h3 className="text-3xl font-bold text-gray-800">96%</h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUp size={14} className="mr-0.5" /> 1%
                </span>
                <span className="text-gray-500">so với tháng trước</span>
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Thu nhập</p>
              <h3 className="text-3xl font-bold text-gray-800">3.5M</h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-red-500 flex items-center mr-1">
                  <ArrowDown size={14} className="mr-0.5" /> 2%
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
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Student enrollment chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg">
              Số lượng học sinh theo thời gian
            </h2>
            <div className="flex items-center space-x-2">
              <select className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none">
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
          </div>
          <div className="p-6 h-80 flex items-center justify-center">
            <div className="text-center text-gray-500 flex flex-col items-center">
              <BarChart3 size={48} className="mb-2 text-gray-300" />
              <p>Biểu đồ số lượng học sinh theo thời gian</p>
            </div>
          </div>
        </div>
        {/* Attendance rate chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg">Tỷ lệ điểm danh theo lớp</h2>
            <div className="flex items-center space-x-2">
              <select className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none">
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
              </select>
            </div>
          </div>
          <div className="p-6 h-80 flex flex-col items-center justify-center">
            <div className="text-center text-gray-500 flex flex-col items-center mb-4">
              <BarChart3 size={48} className="mb-2 text-gray-300" />
              <p>Biểu đồ tỷ lệ điểm danh theo lớp</p>
            </div>
            <Button
              onClick={handleViewAttendanceDetails}
              className="flex items-center mt-4"
            >
              <span>Xem chi tiết đơn xin nghỉ phép</span>
              <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg">Phân bố học sinh theo khối</h2>
          </div>
          <div className="p-6 h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 flex flex-col items-center">
              <PieChart size={48} className="mb-2 text-gray-300" />
              <p>Biểu đồ phân bố học sinh theo khối lớp</p>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Khối 1</span>
                </div>
                <span className="text-sm font-medium">95 học sinh (21%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Khối 2</span>
                </div>
                <span className="text-sm font-medium">85 học sinh (19%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Khối 3</span>
                </div>
                <span className="text-sm font-medium">90 học sinh (20%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm">Khối 4</span>
                </div>
                <span className="text-sm font-medium">92 học sinh (20%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Khối 5</span>
                </div>
                <span className="text-sm font-medium">88 học sinh (20%)</span>
              </div>
            </div>
          </div>
        </div>
        {/* Staff distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg">
              Phân bố nhân viên theo vai trò
            </h2>
          </div>
          <div className="p-6 h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 flex flex-col items-center">
              <PieChart size={48} className="mb-2 text-gray-300" />
              <p>Biểu đồ phân bố nhân viên theo vai trò</p>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Giáo viên</span>
                </div>
                <span className="text-sm font-medium">24 (75%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Nhân viên hỗ trợ</span>
                </div>
                <span className="text-sm font-medium">4 (13%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Nhân viên bếp</span>
                </div>
                <span className="text-sm font-medium">3 (9%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Quản lý</span>
                </div>
                <span className="text-sm font-medium">1 (3%)</span>
              </div>
            </div>
          </div>
        </div>
        {/* Revenue breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg">Phân tích thu nhập</h2>
          </div>
          <div className="p-6 h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 flex flex-col items-center">
              <BarChart3 size={48} className="mb-2 text-gray-300" />
              <p>Biểu đồ phân tích thu nhập theo nguồn</p>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Học phí</span>
                </div>
                <span className="text-sm font-medium">2.8M (80%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Bữa ăn</span>
                </div>
                <span className="text-sm font-medium">525K (15%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Hoạt động ngoại khóa</span>
                </div>
                <span className="text-sm font-medium">175K (5%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
