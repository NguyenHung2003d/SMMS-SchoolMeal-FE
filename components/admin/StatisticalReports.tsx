'use client'
import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Calendar,
  School,
  TrendingUp,
  Users,
  Utensils,
  AlertTriangle,
  FileText,
} from "lucide-react";

export default function StatisticalReports() {
  const [reportType, setReportType] = useState("meals");
  const [timeRange, setTimeRange] = useState("month");
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [dateFrom, setDateFrom] = useState("2024-09-01");
  const [dateTo, setDateTo] = useState("2024-10-02");

  const mealData = [
    { date: "01/10", registered: 450, actual: 420, missed: 30 },
    { date: "02/10", registered: 455, actual: 440, missed: 15 },
    { date: "03/10", registered: 460, actual: 445, missed: 15 },
    { date: "04/10", registered: 458, actual: 430, missed: 28 },
    { date: "05/10", registered: 462, actual: 450, missed: 12 },
  ];

  const revenueData = [
    { month: "Tháng 6", revenue: 450000000 },
    { month: "Tháng 7", revenue: 480000000 },
    { month: "Tháng 8", revenue: 520000000 },
    { month: "Tháng 9", revenue: 580000000 },
  ];

  const schoolDistribution = [
    { name: "THCS Nguyễn Du", value: 450, color: "#f97316" },
    { name: "THPT Lê Quý Đôn", value: 680, color: "#3b82f6" },
    { name: "TH Trần Phú", value: 320, color: "#10b981" },
  ];

  const userStats = [
    { type: "Học sinh", count: 9050, change: "+8%" },
    { type: "Phụ huynh", count: 6800, change: "+5%" },
    { type: "Giáo viên", count: 320, change: "+3%" },
    { type: "Quản lý", count: 40, change: "+12%" },
  ];

  const incidentData = [
    { type: "Dị ứng thức ăn", count: 12, severity: "high" },
    { type: "Bỏ bữa không báo", count: 45, severity: "medium" },
    { type: "Khiếu nại chất lượng", count: 8, severity: "medium" },
    { type: "Vấn đề vệ sinh", count: 3, severity: "high" },
  ];

  const exportReport = (format: "Excel" | "PDF") => {
    alert(
      `Đang xuất báo cáo định dạng ${format}...\nBáo cáo sẽ được tải xuống trong giây lát.`
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Báo cáo Thống kê</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => exportReport("Excel")}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <Download size={18} />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => exportReport("PDF")}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <Download size={18} />
            <span>Xuất PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="font-bold mb-4">Tùy chọn báo cáo</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Loại báo cáo
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
            >
              <option value="revenue">Doanh thu</option>
              <option value="users">Người dùng</option>
              <option value="incidents">Sự cố</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Khoảng thời gian
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm này</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phạm vi</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Toàn hệ thống</option>
              <option value="school1">THCS Nguyễn Du</option>
              <option value="school2">THPT Lê Quý Đôn</option>
              <option value="school3">TH Trần Phú</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Từ ngày - Đến ngày
            </label>
            <div className="flex space-x-1">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {reportType === "revenue" && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-bold mb-4">Doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  `${(value / 1000000).toFixed(0)}M VND`
                }
              />
              <Bar dataKey="revenue" fill="#f97316" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-bold mb-4">Phân bố học sinh theo trường</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={schoolDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) =>
                  `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {schoolDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-bold mb-4">Thống kê người dùng</h3>
          <div className="space-y-4">
            {userStats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      index === 0
                        ? "bg-orange-100"
                        : index === 1
                        ? "bg-blue-100"
                        : index === 2
                        ? "bg-green-100"
                        : "bg-purple-100"
                    }`}
                  >
                    <Users
                      size={20}
                      className={
                        index === 0
                          ? "text-orange-600"
                          : index === 1
                          ? "text-blue-600"
                          : index === 2
                          ? "text-green-600"
                          : "text-purple-600"
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.type}</p>
                    <p className="text-2xl font-bold">
                      {stat.count.toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <span className="text-green-600 font-medium text-sm">
                  {stat.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold mb-4">Báo cáo sự cố bữa ăn</h3>
        <div className="space-y-3">
          {incidentData.map((incident, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    incident.severity === "high"
                      ? "bg-red-100"
                      : "bg-yellow-100"
                  }`}
                >
                  <AlertTriangle
                    size={20}
                    className={
                      incident.severity === "high"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  />
                </div>
                <div>
                  <p className="font-medium">{incident.type}</p>
                  <p className="text-sm text-gray-600">
                    {incident.count} trường hợp trong tháng
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  incident.severity === "high"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {incident.severity === "high" ? "Nghiêm trọng" : "Trung bình"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
