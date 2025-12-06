import { notificationService } from "@/services/manager/managerNotification.service";
import { ManagerNotification } from "@/types/notification";
import { format } from "date-fns";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  RefreshCw,
  Trash2,
  Calendar,
  Bell,
  ChevronDown,
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

  const [pageSize, setPageSize] = useState(10);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = async (page: number, currentSize: number) => {
    try {
      setLoading(true);

      const res = await notificationService.getMyNotifications(
        page,
        currentSize
      );

      const calculatedPages = Math.ceil(res.count / currentSize);

      if (res.data.length === 0 && page > 1) {
        setCurrentPage(page - 1);
        return;
      }

      setData(res.data);
      setTotalCount(res.count);
      setTotalPages(calculatedPages);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast.error("Không thể tải lịch sử thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await notificationService.delete(deleteId);
      toast.success("Đã xóa thông báo");
      setShowDeleteModal(false);
      fetchData(currentPage, pageSize);
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại");
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/30 gap-4">
        <div>
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Bell size={20} className="text-orange-600" />
            Lịch sử gửi thông báo
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các thông báo đã gửi
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
            <span className="hidden sm:inline text-gray-400">Hiển thị:</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="appearance-none bg-transparent pr-6 font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <button
            onClick={() => fetchData(currentPage, pageSize)}
            className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-full text-gray-500 hover:text-orange-600 transition-all"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 w-[40%]">Nội dung thông báo</th>
              <th className="px-6 py-4 w-[20%]">Người nhận</th>
              <th className="px-6 py-4 w-[20%]">Thời gian gửi</th>
              <th className="px-6 py-4 w-[15%] text-center">Trạng thái</th>
              <th className="px-6 py-4 w-[5%] text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col justify-center items-center gap-3 text-gray-500">
                    <Loader2
                      className="animate-spin text-orange-500"
                      size={32}
                    />
                    <span className="font-medium">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="bg-gray-100 p-4 rounded-full">
                      <Bell size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      Chưa có thông báo nào được gửi.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.notificationId}
                  className="hover:bg-orange-50/20 transition-colors group"
                >
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-gray-900 text-base line-clamp-1">
                        {item.title}
                      </span>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 align-top">
                    <div className="text-gray-700 font-medium">
                      {renderRecipientsInfo(item)}
                    </div>
                  </td>

                  <td className="px-6 py-4 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Calendar size={14} className="text-gray-400" />
                        {format(new Date(item.createdAt), "dd/MM/yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs pl-5">
                        {format(new Date(item.createdAt), "HH:mm")}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 align-middle text-center">
                    {item.sendType === "Immediate" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <CheckCircle size={12} className="mr-1.5" /> Gửi ngay
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                        <Clock size={12} className="mr-1.5" /> Lên lịch
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 align-middle text-center">
                    <button
                      onClick={() => handleDeleteClick(item.notificationId)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
        <div className="px-6 py-4 border-t border-gray-100 flex justify-center items-center bg-gray-50/30">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1) ? (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-orange-500 text-white shadow-md shadow-orange-200 border border-orange-500"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ) : page === currentPage - 2 || page === currentPage + 2 ? (
                  <span key={page} className="text-gray-400 px-1 select-none">
                    ...
                  </span>
                ) : null
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
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
