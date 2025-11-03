"use client";
import {
  BarChart3,
  School,
  Users,
  Utensils,
  DollarSign,
  FileText,
  User,
  UserPlus,
  Bell,
  Send,
  AlertCircle,
  FilePlus,
} from "lucide-react";
import DashboardCharts from "./DashboardCharts";

// === 1. Dashboard stats cards ===
function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {[
        {
          label: "Tổng trường học",
          value: "4",
          change: "+12% so với tháng trước",
          icon: <School size={20} className="text-white" />,
        },
        {
          label: "Tổng học sinh",
          value: "9,050",
          change: "+8% so với tháng trước",
          icon: <Users size={20} className="text-white" />,
        },
        {
          label: "Doanh thu",
          value: "5.3B VND",
          change: "+22% so với tháng trước",
          icon: <DollarSign size={20} className="text-white" />,
        },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-orange-50 rounded-lg p-5 border-t-4 border-orange-500"
        >
          <p className="text-xs text-gray-500 uppercase mb-1">{item.label}</p>
          <h3 className="text-3xl font-bold">{item.value}</h3>
          <p className="mt-2 text-xs text-green-600">{item.change}</p>
          <div className="bg-orange-500 p-2 rounded-md inline-block mt-3">
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

// === 3. Hoạt động gần đây ===
function RecentActivities() {
  const activities = [
    {
      icon: <School size={16} />,
      text: "Trường THCS Nguyễn Du được tạo",
      time: "2 phút trước",
    },
    {
      icon: <Utensils size={16} />,
      text: "Thông báo thực đơn tuần được gửi",
      time: "1 giờ trước",
    },
    {
      icon: <FileText size={16} />,
      text: "Báo cáo tháng 9 đã được tạo",
      time: "3 giờ trước",
    },
    {
      icon: <User size={16} />,
      text: "Cập nhật thông báo mới",
      time: "5 ngày trước",
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-bold">Hoạt động gần đây</h2>
      </div>
      <div className="p-4 space-y-4">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start space-x-3">
            <div className="bg-orange-500 p-1.5 rounded-md text-white flex-shrink-0">
              {a.icon}
            </div>
            <div>
              <p className="text-sm font-medium">{a.text}</p>
              <p className="text-xs text-gray-500">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === 4. Công việc cần làm + Thao tác nhanh ===
function TasksAndActions() {
  const tasks = [
    {
      title: "Phê duyệt tài khoản mới",
      desc: "3 tài khoản đang chờ phê duyệt",
      color: "text-red-600",
      icon: <UserPlus size={16} className="text-red-500" />,
      time: "Hôm nay",
    },
    {
      title: "Cập nhật thực đơn tuần",
      desc: "Cần cập nhật thực đơn cho tuần tới",
      color: "text-orange-600",
      icon: <FileText size={16} className="text-orange-500" />,
      time: "Hôm nay",
    },
    {
      title: "Gửi báo cáo tháng",
      desc: "Tạo và gửi báo cáo tháng 10",
      color: "text-blue-600",
      icon: <Send size={16} className="text-blue-500" />,
      time: "31/10/2023",
    },
    {
      title: "Kiểm tra phản hồi",
      desc: "12 phản hồi mới từ phụ huynh",
      color: "text-green-600",
      icon: <AlertCircle size={16} className="text-green-500" />,
      time: "Ngày mai",
    },
  ];

  const quickActions = [
    {
      title: "Thêm trường",
      icon: <School size={20} />,
      color: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      title: "Thêm tài khoản",
      icon: <UserPlus size={20} />,
      color: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Gửi thông báo",
      icon: <Bell size={20} />,
      color: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Tạo báo cáo",
      icon: <FilePlus size={20} />,
      color: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
      {/* Công việc cần làm */}
      <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Công việc cần làm</h2>
          <button className="text-sm text-orange-500 hover:underline">
            Xem tất cả
          </button>
        </div>
        <ul className="space-y-4">
          {tasks.map((task, i) => (
            <li key={i} className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                {task.icon}
                <div>
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.desc}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{task.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Thao tác nhanh */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="font-semibold text-lg mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((a, i) => (
            <button
              key={i}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 ${a.color} hover:shadow-md transition`}
            >
              <div className={a.text}>{a.icon}</div>
              <span className={`text-sm font-medium ${a.text}`}>{a.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// === 5. Main dashboard ===
export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tổng quan hệ thống</h1>
        <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition">
          + Thao tác mới
        </button>
      </div>

      {/* Cards */}
      <DashboardStats />

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>

      {/* Tasks + Quick actions */}
      <TasksAndActions />
    </div>
  );
}
