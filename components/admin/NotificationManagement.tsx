'use client'
import { useState } from "react";
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Send,
  Calendar,
  Users,
  School,
} from "lucide-react";
import { FormData, Notification, NotificationStatus } from "@/types";

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Thực đơn tuần 40",
      content: "Thực đơn tuần 40 từ ngày 01/10 đến 05/10/2024",
      type: "periodic",
      target: "Phụ huynh",
      schools: ["THCS Nguyễn Du", "THPT Lê Quý Đôn"],
      schedule: "Mỗi thứ 6 lúc 15:00",
      status: "scheduled",
      sent: 450,
      read: 320,
      createdDate: "25/09/2024",
    },
    {
      id: 2,
      title: "Nghỉ học đột xuất",
      content: "Trường nghỉ học ngày 03/10 do thời tiết xấu",
      type: "immediate",
      target: "Tất cả",
      schools: ["THCS Nguyễn Du"],
      schedule: "Đã gửi",
      status: "sent",
      sent: 680,
      read: 650,
      createdDate: "02/10/2024",
    },
    {
      id: 3,
      title: "Cảnh báo dị ứng - Học sinh Nguyễn A",
      content: "Học sinh lớp 6A1 bị dị ứng hải sản",
      type: "immediate",
      target: "Giáo viên",
      schools: ["THCS Nguyễn Du"],
      schedule: "Đã gửi",
      status: "sent",
      sent: 15,
      read: 15,
      createdDate: "01/10/2024",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    type: "immediate",
    target: "all",
    schools: [],
    classes: [],
    scheduleType: "now",
    scheduleDate: "",
    scheduleTime: "",
    repeatType: "none",
    file: null,
  });

  // Mở form
  const openForm = (notification: Notification | null = null) => {
    if (notification) {
      setEditingId(notification.id);
      setFormData({
        title: notification.title,
        content: notification.content,
        type: notification.type,
        target: notification.target,
        schools: notification.schools,
        classes: [],
        scheduleType: "now",
        scheduleDate: "",
        scheduleTime: "",
        repeatType: "none",
        file: null,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        type: "immediate",
        target: "all",
        schools: [],
        classes: [],
        scheduleType: "now",
        scheduleDate: "",
        scheduleTime: "",
        repeatType: "none",
        file: null,
      });
    }
    setShowForm(true);
  };

  // Submit
  const handleSubmit = () => {
    if (editingId) {
      setNotifications(
        notifications.map((n) =>
          n.id === editingId
            ? {
                ...n,
                ...formData,
                updatedDate: new Date().toLocaleDateString("vi-VN"),
              }
            : n
        )
      );
      alert("Đã cập nhật thông báo thành công!");
    } else {
      const newNotification: Notification = {
        id: notifications.length + 1,
        ...formData,
        schedule:
          formData.scheduleType === "now"
            ? "Đã gửi"
            : `${formData.scheduleDate} ${formData.scheduleTime}`,
        status: formData.scheduleType === "now" ? "sent" : "scheduled",
        sent: 0,
        read: 0,
        createdDate: new Date().toLocaleDateString("vi-VN"),
      };
      setNotifications([newNotification, ...notifications]);
      alert(
        `Thông báo đã được ${
          formData.scheduleType === "now" ? "gửi" : "lên lịch"
        } thành công!`
      );
    }
    setShowForm(false);
  };

  // Xoá
  const deleteNotification = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      setNotifications(notifications.filter((n) => n.id !== id));
      alert("Đã xóa thông báo!");
    }
  };

  // CSS theo trạng thái
  const getStatusColor = (status: NotificationStatus): string => {
    const colors: Record<NotificationStatus, string> = {
      sent: "bg-green-100 text-green-700",
      scheduled: "bg-blue-100 text-blue-700",
      draft: "bg-gray-100 text-gray-700",
    };
    return colors[status];
  };

  const getStatusText = (status: NotificationStatus): string => {
    const texts: Record<NotificationStatus, string> = {
      sent: "Đã gửi",
      scheduled: "Đã lên lịch",
      draft: "Bản nháp",
    };
    return texts[status];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Thông báo</h1>
        <button
          onClick={() => openForm()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Tạo thông báo mới</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  placeholder="VD: Thực đơn tuần 40"
                />
              </div>

              {/* Nội dung */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nội dung *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  rows={4}
                  placeholder="Nhập nội dung thông báo..."
                />
              </div>
              {/* ... (các input khác giữ nguyên, chỉ sửa rows -> number, event -> typed) */}
            </div>
          </div>
        </div>
      )}

      {/* Danh sách thông báo */}
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-orange-500"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-lg">{notification.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      notification.status
                    )}`}
                  >
                    {getStatusText(notification.status)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notification.type === "immediate"
                        ? "bg-red-100 text-red-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {notification.type === "immediate" ? "Tức thời" : "Định kỳ"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {notification.content}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openForm(notification)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-gray-400" />
                <span className="text-gray-600">{notification.target}</span>
              </div>
              <div className="flex items-center space-x-2">
                <School size={16} className="text-gray-400" />
                <span className="text-gray-600">
                  {notification.schools.length} trường
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-600">{notification.schedule}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bell size={16} className="text-gray-400" />
                <span className="text-gray-600">
                  {notification.sent} gửi / {notification.read} đọc
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              Tạo ngày: {notification.createdDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
