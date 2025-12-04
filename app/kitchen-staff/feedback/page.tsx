"use client";
import React, { useState } from "react";
import {
  MessageCircle,
  Search,
  Filter,
  RefreshCw,
  User,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FeedbackDetailModal } from "@/components/kitchenstaff/feedback/FeedbackDetailModal";
import { FeedbackDto } from "@/types/kitchen-feedback";
import { useKitchenFeedback } from "@/hooks/kitchenStaff/useKitchenFeedbacks";

export default function KitchenStaffFeedbackPage() {
  const {
    feedbacks,
    loading,
    refresh,
    onSearch,
    onFilterType,
    selectedFeedback,
    onSelectFeedback,
    loadingDetail,
    onClearDetail,
  } = useKitchenFeedback();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<FeedbackDto | undefined>(
    undefined
  );
  const [filterType, setFilterType] = useState("all");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFilterType(val);
    onFilterType(val);
  };

  const handleOpenDetail = (item: FeedbackDto) => {
    setPreviewItem(item);
    onSelectFeedback(item.feedbackId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    onClearDetail();
    setPreviewItem(undefined);
  };

  const renderTypeBadge = (type?: string) => {
    if (type === "kitchen")
      return (
        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
          Bếp ăn
        </span>
      );
    if (type === "parents")
      return (
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
          Phụ huynh
        </span>
      );
    return (
      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
        Khác
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-xl">
                <MessageCircle className="text-orange-600" size={28} />
              </div>
              Danh Sách Phản Hồi
            </h1>
            <p className="text-gray-500 mt-2 ml-1">
              Tiếp nhận ý kiến từ giám thị và phụ huynh học sinh
            </p>
          </div>
          <button
            onClick={refresh}
            className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm text-gray-600"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo nội dung, người gửi..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 min-w-[200px]">
              <Filter size={18} className="text-gray-500 ml-2" />
              <select
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                value={filterType}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả loại</option>
                <option value="kitchen">Về Bếp ăn</option>
                <option value="parents">Từ Phụ huynh</option>
              </select>
            </div>
          </form>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-orange-600 mb-2"></div>
              <span>Đang tải dữ liệu...</span>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-gray-300" size={32} />
              </div>
              <h3 className="text-gray-800 font-medium text-lg">
                Không tìm thấy phản hồi nào
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {feedbacks.map((item) => (
                <div
                  key={item.feedbackId}
                  onClick={() => handleOpenDetail(item)}
                  className="p-5 hover:bg-orange-50/30 cursor-pointer transition-all group relative"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {renderTypeBadge(item.targetType)}
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {format(
                            new Date(item.createdAt),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors text-lg">
                        {item.title || "Phản hồi không tiêu đề"}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-2 mb-4 text-sm leading-relaxed">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={14} className="text-gray-500" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {item.senderName || "Ẩn danh"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {item.targetRef && (
                        <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100 text-xs text-gray-600">
                          Học sinh: {item.targetRef}
                        </span>
                      )}
                      {item.dailyMealId && (
                        <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100 text-xs text-gray-600">
                          Thực đơn #{item.dailyMealId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FeedbackDetailModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        detail={selectedFeedback}
        previewData={previewItem}
        loading={loadingDetail}
      />
    </div>
  );
}
