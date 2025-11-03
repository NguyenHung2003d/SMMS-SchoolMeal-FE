"use client";
import React, { useState } from "react";
import {
  Bell,
  Search,
  Filter,
  Plus,
  Send,
  Users,
  UserCheck,
  Calendar,
  Clock,
  Edit,
  Trash,
  CheckCircle,
  X,
  FileText,
  Image,
} from "lucide-react";
import { Button } from "../ui/button";
import { notifications } from "@/data/dashboard/notifications";

export default function ManagerNotifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationContent, setNotificationContent] = useState("");
  const [notificationType, setNotificationType] = useState("announcement");
  const [selectedRecipients, setSelectedRecipients] = useState("all");
  // Mock notifications data

  // Filter notifications based on search query and selected type
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType === "all" || notification.type === selectedType)
  );
  const getTypeInfo = (type: any) => {
    switch (type) {
      case "announcement":
        return {
          text: "Thông báo chung",
          className: "bg-blue-100 text-blue-800",
        };
      case "academic":
        return {
          text: "Học tập",
          className: "bg-green-100 text-green-800",
        };
      case "event":
        return {
          text: "Sự kiện",
          className: "bg-purple-100 text-purple-800",
        };
      case "emergency":
        return {
          text: "Khẩn cấp",
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          text: type,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };
  const getRecipientsInfo = (recipients: any) => {
    switch (recipients) {
      case "all":
        return {
          text: "Tất cả",
          className: "bg-blue-100 text-blue-800",
        };
      case "parents":
        return {
          text: "Phụ huynh",
          className: "bg-green-100 text-green-800",
        };
      case "teachers":
        return {
          text: "Giáo viên",
          className: "bg-purple-100 text-purple-800",
        };
      case "class":
        return {
          text: "Lớp học",
          className: "bg-orange-100 text-orange-800",
        };
      default:
        return {
          text: recipients,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "sent":
        return {
          text: "Đã gửi",
          className: "bg-green-100 text-green-800",
        };
      case "scheduled":
        return {
          text: "Đã lên lịch",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "draft":
        return {
          text: "Bản nháp",
          className: "bg-gray-100 text-gray-800",
        };
      default:
        return {
          text: status,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };
  const handleCreateNotification = (e: any) => {
    e.preventDefault();
    // Handle notification creation
    setShowCreateModal(false);
    // Reset form
    setNotificationTitle("");
    setNotificationContent("");
    setNotificationType("announcement");
    setSelectedRecipients("all");
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gửi thông báo</h1>
          <p className="text-gray-600">
            Tạo và gửi thông báo đến phụ huynh, giáo viên và nhân viên
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Tạo thông báo mới
        </Button>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Bell size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Tổng thông báo
              </p>
              <h3 className="text-3xl font-bold text-gray-800">24</h3>
              <p className="mt-1 text-sm text-gray-500">Trong 30 ngày qua</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <UserCheck size={24} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Tỷ lệ đọc
              </p>
              <h3 className="text-3xl font-bold text-gray-800">87%</h3>
              <p className="mt-1 text-sm text-gray-500">Trung bình</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <Calendar size={24} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Đã lên lịch
              </p>
              <h3 className="text-3xl font-bold text-gray-800">3</h3>
              <p className="mt-1 text-sm text-gray-500">Thông báo sắp gửi</p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center cursor-pointer hover:bg-gray-50">
              <Filter size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Lọc</span>
            </div>
            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Tất cả loại</option>
              <option value="announcement">Thông báo chung</option>
              <option value="academic">Học tập</option>
              <option value="event">Sự kiện</option>
              <option value="emergency">Khẩn cấp</option>
            </select>
          </div>
        </div>
      </div>
      {/* Notifications list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người nhận
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày gửi
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ đọc
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const typeInfo = getTypeInfo(notification.type);
                const recipientsInfo = getRecipientsInfo(
                  notification.recipients
                );
                const statusInfo = getStatusInfo(notification.status);
                const readRate = Math.round(
                  (notification.read / notification.sentTo) * 100
                );
                return (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">
                        {notification.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {notification.content}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.className}`}
                      >
                        {typeInfo.text}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${recipientsInfo.className}`}
                      >
                        {recipientsInfo.text}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-800">
                        {notification.date}
                      </div>
                      <div className="text-xs text-gray-500">
                        {notification.time}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              readRate >= 80
                                ? "bg-green-500"
                                : readRate >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${readRate}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs whitespace-nowrap font-medium">
                          {readRate}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {notification.read}/{notification.sentTo}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                          <Edit size={18} />
                        </button>
                        <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredNotifications.length} trong tổng số{" "}
          {notifications.length} thông báo
        </p>
        <div className="flex items-center space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
            Trước
          </button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-md">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
            Sau
          </button>
        </div>
      </div>
      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tạo thông báo mới</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateNotification}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập tiêu đề thông báo"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={6}
                    placeholder="Nhập nội dung thông báo"
                    value={notificationContent}
                    onChange={(e) => setNotificationContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại thông báo
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={notificationType}
                      onChange={(e) => setNotificationType(e.target.value)}
                      required
                    >
                      <option value="announcement">Thông báo chung</option>
                      <option value="academic">Học tập</option>
                      <option value="event">Sự kiện</option>
                      <option value="emergency">Khẩn cấp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Người nhận
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={selectedRecipients}
                      onChange={(e) => setSelectedRecipients(e.target.value)}
                      required
                    >
                      <option value="all">Tất cả</option>
                      <option value="parents">Phụ huynh</option>
                      <option value="teachers">Giáo viên</option>
                      <option value="class">Lớp học cụ thể</option>
                    </select>
                  </div>
                </div>
                {selectedRecipients === "class" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn lớp
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">-- Chọn lớp --</option>
                      <option value="1A">Lớp 1A</option>
                      <option value="1B">Lớp 1B</option>
                      <option value="2A">Lớp 2A</option>
                      <option value="2B">Lớp 2B</option>
                      <option value="3A">Lớp 3A</option>
                      <option value="3B">Lớp 3B</option>
                      <option value="4A">Lớp 4A</option>
                      <option value="5A">Lớp 5A</option>
                    </select>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian gửi
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <input type="checkbox" id="sendNow" className="mr-2" />
                    <label htmlFor="sendNow" className="text-sm text-gray-700">
                      Gửi ngay
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tệp đính kèm (tùy chọn)
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <FileText size={16} className="mr-2" />
                      Thêm tệp
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Image size={16} className="mr-2" />
                      Thêm ảnh
                    </button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Hủy
                  </button>
                  <Button type="submit" className="flex items-center">
                    <Send size={16} className="mr-2" />
                    Gửi thông báo
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
