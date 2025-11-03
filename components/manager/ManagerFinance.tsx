'use client'
import React, { useState } from "react";
import {
  Download,
  Calendar,
  FileText,
  BarChart3,
  ArrowDown,
  ChevronDown,
  Filter,
  PieChart,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "../ui/button";
export function ManagerFinance() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("11");
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Xuất báo cáo tài chính
          </h1>
          <p className="text-gray-600">
            Tạo và xuất báo cáo tài chính theo thời gian
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-gray-500" />
            <select
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="1">Tháng 1</option>
              <option value="2">Tháng 2</option>
              <option value="3">Tháng 3</option>
              <option value="4">Tháng 4</option>
              <option value="5">Tháng 5</option>
              <option value="6">Tháng 6</option>
              <option value="7">Tháng 7</option>
              <option value="8">Tháng 8</option>
              <option value="9">Tháng 9</option>
              <option value="10">Tháng 10</option>
              <option value="11">Tháng 11</option>
              <option value="12">Tháng 12</option>
            </select>
            <select
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
        </div>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <DollarSign size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tổng thu</p>
              <h3 className="text-2xl font-bold text-gray-800">8.6M VND</h3>
              <p className="mt-1 text-xs text-gray-500">
                <span className="text-green-500">+5%</span> so với tháng trước
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <ArrowDown size={24} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tổng chi</p>
              <h3 className="text-2xl font-bold text-gray-800">5.1M VND</h3>
              <p className="mt-1 text-xs text-gray-500">
                <span className="text-red-500">+3%</span> so với tháng trước
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <TrendingUp size={24} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Lợi nhuận
              </p>
              <h3 className="text-2xl font-bold text-gray-800">3.5M VND</h3>
              <p className="mt-1 text-xs text-gray-500">
                <span className="text-green-500">+8%</span> so với tháng trước
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <div className="text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Công nợ</p>
              <h3 className="text-2xl font-bold text-gray-800">2.85M VND</h3>
              <p className="mt-1 text-xs text-gray-500">
                <span className="text-red-500">+12%</span> so với tháng trước
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Report preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4">Xem trước báo cáo</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 flex flex-col items-center">
              <FileText size={48} className="mb-2 text-gray-300" />
              <p>Xem trước báo cáo tài chính</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4">Cài đặt xuất báo cáo</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại báo cáo
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="full">Báo cáo đầy đủ</option>
                <option value="summary">Báo cáo tóm tắt</option>
                <option value="income">Chỉ thu nhập</option>
                <option value="expense">Chỉ chi phí</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Định dạng
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bao gồm
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-chart"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="include-chart" className="text-sm">
                    Biểu đồ
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-details"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="include-details" className="text-sm">
                    Chi tiết giao dịch
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-summary"
                    className="mr-2"
                    
                    defaultChecked 
                  />
                  <label htmlFor="include-summary" className="text-sm">
                    Tóm tắt
                  </label>
                </div>
              </div>
            </div>
            <Button className="w-full flex items-center justify-center mt-4">
              <Download size={16} className="mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4">Phân tích thu nhập</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 flex flex-col items-center">
              <BarChart3 size={48} className="mb-2 text-gray-300" />
              <p>Biểu đồ phân tích thu nhập theo nguồn</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Học phí</h3>
              <p className="text-lg font-bold text-gray-900">7.5M VND</p>
              <p className="text-xs text-gray-500">87% tổng thu</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Tiền ăn</h3>
              <p className="text-lg font-bold text-gray-900">750K VND</p>
              <p className="text-xs text-gray-500">9% tổng thu</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Hoạt động</h3>
              <p className="text-lg font-bold text-gray-900">350K VND</p>
              <p className="text-xs text-gray-500">4% tổng thu</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4">Phân tích chi phí</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 flex flex-col items-center">
              <PieChart size={48} className="mb-2 text-gray-300" />
              <p>Biểu đồ phân tích chi phí theo danh mục</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">
                Lương nhân viên
              </h3>
              <p className="text-lg font-bold text-gray-900">3.2M VND</p>
              <p className="text-xs text-gray-500">63% tổng chi</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">
                Cơ sở vật chất
              </h3>
              <p className="text-lg font-bold text-gray-900">1.1M VND</p>
              <p className="text-xs text-gray-500">22% tổng chi</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">
                Vật liệu học tập
              </h3>
              <p className="text-lg font-bold text-gray-900">500K VND</p>
              <p className="text-xs text-gray-500">10% tổng chi</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Khác</h3>
              <p className="text-lg font-bold text-gray-900">300K VND</p>
              <p className="text-xs text-gray-500">5% tổng chi</p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">Báo cáo gần đây</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên báo cáo
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Định dạng
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <FileText size={16} className="text-gray-400 mr-2" />
                    <span className="font-medium">
                      Báo cáo tài chính tháng 10/2023
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">Tháng 10/2023</td>
                <td className="py-3 px-4 text-sm">05/11/2023</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    PDF
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-500 hover:text-blue-700 font-medium text-sm">
                    Tải xuống
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <FileText size={16} className="text-gray-400 mr-2" />
                    <span className="font-medium">
                      Báo cáo tài chính quý 3/2023
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">Q3/2023</td>
                <td className="py-3 px-4 text-sm">10/10/2023</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Excel
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-500 hover:text-blue-700 font-medium text-sm">
                    Tải xuống
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <FileText size={16} className="text-gray-400 mr-2" />
                    <span className="font-medium">
                      Báo cáo tài chính tháng 9/2023
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">Tháng 9/2023</td>
                <td className="py-3 px-4 text-sm">05/10/2023</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    PDF
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-500 hover:text-blue-700 font-medium text-sm">
                    Tải xuống
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
