import React from "react";
import { X, User, Calendar, Tag, Utensils } from "lucide-react";
import { format } from "date-fns";
import { FeedbackDto } from "@/types/kitchen-feedback";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  detail: FeedbackDto | null;
  previewData?: FeedbackDto;
  loading: boolean;
}

export const FeedbackDetailModal = ({
  isOpen,
  onClose,
  detail,
  previewData,
  loading,
}: Props) => {
  if (!isOpen) return null;

  const displayData = detail || previewData;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 rounded-t-xl">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {displayData?.title || "Chi tiết phản hồi"}
            </h3>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <User size={14} className="mr-1.5" />
              <span className="font-medium">
                {displayData?.senderName || "Người gửi ẩn danh"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && !detail ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-orange-500 mb-3"></div>
              <span>Đang tải nội dung...</span>
            </div>
          ) : displayData ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                  <Calendar size={14} className="mr-2" />
                  {displayData.createdAt
                    ? format(
                        new Date(displayData.createdAt),
                        "dd/MM/yyyy HH:mm"
                      )
                    : "-"}
                </div>

                <div className="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg border border-orange-100">
                  <Tag size={14} className="mr-2" />
                  <span className="capitalize font-medium">
                    {displayData.targetType === "kitchen"
                      ? "Bếp ăn"
                      : displayData.targetType === "parents"
                      ? "Phụ huynh"
                      : "Khác"}
                  </span>
                  {displayData.targetRef && (
                    <span className="ml-1 text-orange-600">
                      ({displayData.targetRef})
                    </span>
                  )}
                </div>

                {displayData.dailyMealId && (
                  <div className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-100">
                    <Utensils size={14} className="mr-2" />
                    Thực đơn #{displayData.dailyMealId}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Nội dung phản hồi
                </h4>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {displayData.content}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Phản hồi lại
                </h4>
                <textarea
                  disabled
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-sm focus:outline-none resize-none cursor-not-allowed"
                  rows={3}
                  placeholder="Tính năng trả lời đang được phát triển..."
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Không tìm thấy dữ liệu phản hồi.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
