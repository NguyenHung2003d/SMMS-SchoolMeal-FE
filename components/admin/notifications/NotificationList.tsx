import { formatDate } from "@/helpers";
import { NotificationDto } from "@/types/notification";
import {
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Loader2,
  Users,
} from "lucide-react";

interface NotificationListProps {
  notifications: NotificationDto[];
  loading: boolean;
  onViewDetail: (id: number) => void;
  onOpenForm: () => void;
}

export default function NotificationList({
  notifications,
  loading,
  onViewDetail,
  onOpenForm,
}: NotificationListProps) {
  const getSendTypeInfo = (type: string) => {
    if (type === "Immediate" || type === "Tức thời") {
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        label: "🚨 Tức thời",
        icon: CheckCircle2,
      };
    }
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      label: "📅 Định kỳ",
      icon: Clock,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
        <Bell size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Chưa có thông báo nào trong lịch sử.</p>
        <button
          onClick={onOpenForm}
          className="mt-4 text-orange-600 font-medium hover:text-orange-700 hover:underline"
        >
          Tạo thông báo đầu tiên
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {notifications.map((notification) => {
        const typeInfo = getSendTypeInfo(notification.sendType);
        const readPercent =
          notification.totalRecipients > 0
            ? Math.round(
                (notification.totalRead / notification.totalRecipients) * 100
              )
            : 0;

        return (
          <div
            key={notification.notificationId}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {notification.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.text} ${typeInfo.bg} flex items-center gap-1`}
                    >
                      <typeInfo.icon size={14} />
                      {typeInfo.label}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {notification.content}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-50 mt-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-orange-500" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Người nhận</p>
                    <p className="font-semibold text-gray-700">
                      {notification.totalRecipients}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-blue-500" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Đã xem</p>
                    <p className="font-semibold text-gray-700">
                      {notification.totalRead}{" "}
                      <span className="text-gray-400 font-normal">
                        ({readPercent}%)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-green-500" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Thời gian gửi</p>
                    <p className="font-semibold text-gray-700">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end items-center">
                  <button
                    onClick={() => onViewDetail(notification.notificationId)}
                    className="text-orange-500 hover:text-orange-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <FileText size={16} /> Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
