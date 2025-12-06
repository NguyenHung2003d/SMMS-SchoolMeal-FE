import { formatDate } from "@/helpers";
import { NotificationDetailDto } from "@/types/admin-notification";
import { Check, FileText, User, Users, X } from "lucide-react";

interface NotificationDetailModalProps {
  notification: NotificationDetailDto | null;
  onClose: () => void;
}

export default function NotificationDetailModal({
  notification,
  onClose,
}: NotificationDetailModalProps) {
  if (!notification) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              Chi tiết thông báo
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              ID: #{notification.notificationId} - Gửi ngày:{" "}
              {formatDate(notification.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-2">
              {notification.title}
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {notification.content}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 border-t border-gray-200 pt-3">
              <User size={14} />
              Người gửi:{" "}
              <span className="font-medium text-gray-700">
                {notification.senderName || "Admin"}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users size={18} className="text-orange-500" />
              Danh sách người nhận ({notification.recipients.length})
            </h4>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Email người nhận</th>
                      <th className="px-4 py-3 text-center">Trạng thái</th>
                      <th className="px-4 py-3 text-right">Thời gian xem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {notification.recipients.map((recipient, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-700">
                          {recipient.userEmail || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {recipient.isRead ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <Check size={12} /> Đã xem
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Chưa xem
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500">
                          {recipient.isRead
                            ? formatDate(recipient.readAt!)
                            : "-"}
                        </td>
                      </tr>
                    ))}
                    {notification.recipients.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-gray-400 italic"
                        >
                          Chưa có người nhận nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 shadow-sm transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
