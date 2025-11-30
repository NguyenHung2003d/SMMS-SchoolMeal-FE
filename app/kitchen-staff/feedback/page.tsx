"use client";
import React, { useState } from "react";
import { MessageCircle, Search, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { FeedbackDetailModal } from "@/components/kitchenstaff/feedback/FeedbackDetailModal";
import { FeedbackDto } from "@/types/kitchen-feedback";
import { useKitchenFeedback } from "@/hooks/kitchenStaff/useKitchenFeedbacks";

export default function KitchenStaffFeedbackPage() {
  const {
    feedbacks,
    loading,
    refresh,
    onSearch,
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 flex items-center">
              <MessageCircle className="mr-3 text-gray-700" size={32} />
              Danh Sách Phản Hồi
            </h1>
            <p className="text-gray-500 mt-2">
              Xem ý kiến đóng góp từ giám thị và phụ huynh
            </p>
          </div>
          <button
            onClick={refresh}
            className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Làm mới"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm phản hồi..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter size={18} className="mr-2" />
              Bộ lọc
            </button>
          </form>
        </div>

        {/* Feedback List */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              Không tìm thấy phản hồi nào
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {feedbacks.map((item) => (
                <div
                  key={item.feedbackId}
                  onClick={() => handleOpenDetail(item)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-l-transparent hover:border-l-blue-500"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors flex-1">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between text-xs gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>{item.senderName}</span>
                      {item.targetRef && (
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {item.targetType}: {item.targetRef}
                        </span>
                      )}
                    </div>
                    {item.dailyMealId && (
                      <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                        Thực đơn #{item.dailyMealId}
                      </span>
                    )}
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
