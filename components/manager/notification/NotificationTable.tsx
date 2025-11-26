"use client";
import {
  Search,
  Trash,
  Users,
  Calendar,
  Clock,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ManagerNotification } from "@/types/notification";
import { Button } from "@/components/ui/button";

export default function NotificationTable({
  data,
  searchQuery,
  setSearchQuery,
  onDeleteClick,
  onRefresh,
}: {
  data: ManagerNotification[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onDeleteClick: (id: number) => void;
  onRefresh: () => void;
}) {
  const filtered = data.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm thông báo theo tiêu đề..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={onRefresh} title="Tải lại">
          <RefreshCw size={18} />
        </Button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Nội dung thông báo
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Hình thức
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Người nhận
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filtered.map((n) => (
              <tr
                key={n.notificationId}
                className="hover:bg-blue-50/50 transition-colors group"
              >
                <td className="px-6 py-5 max-w-sm">
                  <div className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {n.title}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-1">
                    {n.content}
                  </div>
                </td>

                <td className="px-6 py-5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      n.sendType === "Immediate"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : "bg-purple-100 text-purple-700 border-purple-300"
                    }`}
                  >
                    {n.sendType === "Immediate" ? (
                      <>
                        <SendIcon size={12} /> Gửi ngay
                      </>
                    ) : (
                      <>
                        <Clock size={12} /> Lên lịch
                      </>
                    )}
                  </span>
                  {n.scheduleCron && (
                    <div className="text-[10px] text-gray-400 font-mono mt-2 ml-0.5">
                      {n.scheduleCron}
                    </div>
                  )}
                </td>

                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      {n.totalRecipients}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    {format(new Date(n.createdAt), "HH:mm dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </div>
                </td>

                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => onDeleteClick(n.notificationId)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Xóa thông báo"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-semibold">
            Không tìm thấy thông báo
          </h3>
          <p className="text-gray-500 text-sm mt-1 max-w-xs">
            {searchQuery
              ? "Thử tìm kiếm với từ khóa khác."
              : "Chưa có thông báo nào được tạo."}
          </p>
        </div>
      )}
    </div>
  );
}

function SendIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}
