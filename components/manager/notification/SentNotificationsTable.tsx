import { notificationService } from "@/services/managerNotification.service";
import { ManagerNotification } from "@/types/notification";
import { format } from "date-fns";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { renderRecipientsInfo } from "@/helpers";

export default function SentNotificationsTable() {
  const [data, setData] = useState<ManagerNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const res = await notificationService.getMyNotifications(page, pageSize);
      if (res.data.length === 0 && page > 1) {
        setCurrentPage(page - 1);
        return;
      }
      setData(res.data);
      setTotalCount(res.count);
      setTotalPages(Math.ceil(res.count / pageSize));
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast.error("Không thể tải lịch sử thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await notificationService.delete(deleteId);
      toast.success("Đã xóa thông báo");
      setShowDeleteModal(false);
      fetchData(currentPage);
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại");
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Clock size={20} className="text-orange-500" /> Lịch sử gửi thông báo
        </h3>
        <button
          onClick={() => fetchData(currentPage)}
          className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-all"
          title="Làm mới"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 w-[30%]">Tiêu đề / Nội dung</th>
              <th className="px-6 py-4">Nguời nhận</th>
              <th className="px-6 py-4">Thời gian gửi</th>
              <th className="px-6 py-4 text-center">Loại</th>
              <th className="px-6 py-4 text-center">Đính kèm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin" size={20} /> Đang tải dữ
                    liệu...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-gray-500 italic"
                >
                  Chưa có thông báo nào được gửi.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.notificationId}
                  className="hover:bg-orange-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800 line-clamp-1 mb-1">
                      {item.title}
                    </p>
                    <p className="text-gray-500 text-xs line-clamp-2">
                      {item.content}
                    </p>
                  </td>
                  <td className="px-6 py-4">{renderRecipientsInfo(item)}</td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(item.createdAt), "dd/MM/yyyy")}
                      </span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(item.createdAt), "HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.sendType === "Immediate" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" /> Gửi ngay
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock size={12} className="mr-1" /> Lên lịch
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.attachmentUrl ? (
                      <a
                        href={item.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Xem đính kèm"
                      >
                        <FileText size={16} />
                      </a>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteClick(item.notificationId)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Xóa thông báo này"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!loading && data.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <p className="text-sm text-gray-500">
            Hiển thị{" "}
            <span className="font-medium text-gray-900">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-gray-900">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-medium text-gray-900">{totalCount}</span>
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1) ? (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ) : page === currentPage - 2 || page === currentPage + 2 ? (
                  <span key={page} className="text-gray-400 px-1">
                    ...
                  </span>
                ) : null
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
