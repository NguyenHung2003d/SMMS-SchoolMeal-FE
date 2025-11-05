"use client";
import { useState } from "react";
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  Users,
  School,
  Send,
  Clock,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { FormData, Notification, NotificationStatus } from "@/types";
import toast from "react-hot-toast";

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

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const deleteNotification = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      setNotifications(notifications.filter((n) => n.id !== id));
      toast.success("Đã xóa thông báo!");
    }
  };

  const getStatusInfo = (status: NotificationStatus) => {
    const statusMap: Record<
      NotificationStatus,
      { bg: string; text: string; icon: any }
    > = {
      sent: {
        bg: "bg-green-50 border-green-200",
        text: "text-green-700",
        icon: CheckCircle2,
      },
      scheduled: {
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-700",
        icon: Clock,
      },
      draft: {
        bg: "bg-gray-50 border-gray-200",
        text: "text-gray-700",
        icon: FileText,
      },
    };
    return statusMap[status];
  };

  const getStatusLabel = (status: NotificationStatus): string => {
    const texts: Record<NotificationStatus, string> = {
      sent: "Đã gửi",
      scheduled: "Đã lên lịch",
      draft: "Bản nháp",
    };
    return texts[status];
  };

  const getTypeInfo = (type: string) => {
    return type === "immediate"
      ? { bg: "bg-red-50", text: "text-red-700", label: "🚨 Tức thời" }
      : { bg: "bg-purple-50", text: "text-purple-700", label: "📅 Định kỳ" };
  };

  const getReadPercentage = (read: number, sent: number): number => {
    return sent > 0 ? Math.round((read / sent) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Bell size={32} className="text-orange-500" />
              Quản lý Thông báo
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý các thông báo cho phụ huynh, giáo viên và học sinh
            </p>
          </div>
          <button
            onClick={() => openForm()}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            <span className="font-medium">Tạo thông báo mới</span>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId
                    ? "✏️ Chỉnh sửa thông báo"
                    : "📝 Tạo thông báo mới"}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                    placeholder="VD: Thực đơn tuần 40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition resize-none"
                    rows={5}
                    placeholder="Nhập nội dung thông báo chi tiết..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loại thông báo
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "immediate" | "periodic",
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-orange-500 transition"
                    >
                      <option value="immediate">Tức thời</option>
                      <option value="periodic">Định kỳ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Đối tượng nhận
                    </label>
                    <select
                      value={formData.target}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          target: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-orange-500 transition"
                    >
                      <option value="all">Tất cả</option>
                      <option value="parents">Phụ huynh</option>
                      <option value="teachers">Giáo viên</option>
                      <option value="students">Học sinh</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={closeForm}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    if (!formData.title || !formData.content) {
                      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
                      return;
                    }

                    if (editingId) {
                      // Cập nhật
                      setNotifications(
                        notifications.map((n) =>
                          n.id === editingId ? { ...n, ...formData } : n
                        )
                      );
                      toast.success("Cập nhật thông báo thành công!");
                    } else {
                      const newNotification: Notification = {
                        id: Date.now(),
                        title: formData.title,
                        content: formData.content,
                        type: formData.type,
                        target: formData.target,
                        schools: formData.schools,
                        schedule: "Đã gửi",
                        status: "sent",
                        sent: 100,
                        read: 0,
                        createdDate: new Date().toLocaleDateString("vi-VN"),
                      };
                      setNotifications([...notifications, newNotification]);
                      toast.success("Tạo thông báo mới thành công!");
                    }

                    closeForm();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2"
                >
                  <Send size={18} />
                  {editingId ? "Cập nhật" : "Tạo"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="grid gap-5">
          {notifications.map((notification) => {
            const statusInfo = getStatusInfo(notification.status);
            const StatusIcon = statusInfo.icon;
            const typeInfo = getTypeInfo(notification.type);
            const readPercent = getReadPercentage(
              notification.read,
              notification.sent
            );

            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 ${
                  notification.status === "sent"
                    ? "border-green-500"
                    : "border-blue-500"
                } overflow-hidden`}
              >
                <div className="p-6">
                  {/* Top Section */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {notification.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.text} ${statusInfo.bg}`}
                        >
                          <StatusIcon size={14} />
                          {getStatusLabel(notification.status)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.text} ${typeInfo.bg}`}
                        >
                          {typeInfo.label}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {notification.content}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openForm(notification)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-orange-500" />
                      <div className="text-sm">
                        <p className="text-gray-500">Đối tượng</p>
                        <p className="font-semibold text-gray-700">
                          {notification.target}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <School size={16} className="text-orange-500" />
                      <div className="text-sm">
                        <p className="text-gray-500">Trường</p>
                        <p className="font-semibold text-gray-700">
                          {notification.schools.length} trường
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-orange-500" />
                      <div className="text-sm">
                        <p className="text-gray-500">Lịch</p>
                        <p className="font-semibold text-gray-700">
                          {notification.schedule}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Send size={16} className="text-orange-500" />
                      <div className="text-sm">
                        <p className="text-gray-500">Gửi</p>
                        <p className="font-semibold text-gray-700">
                          {notification.sent}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <div className="text-sm">
                        <p className="text-gray-500">Đã đọc</p>
                        <p className="font-semibold text-gray-700">
                          {notification.read} ({readPercent}%)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 text-xs text-gray-400">
                    Tạo ngày: {notification.createdDate}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center">
            <Bell size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Không có thông báo nào</p>
            <button
              onClick={() => openForm()}
              className="mt-4 text-orange-600 font-semibold hover:text-orange-700"
            >
              Tạo thông báo đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
