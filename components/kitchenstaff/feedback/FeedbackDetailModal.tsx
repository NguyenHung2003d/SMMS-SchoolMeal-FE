import React from "react";
import { X, User, Calendar, Tag, Utensils } from "lucide-react";
import { format } from "date-fns";
import { FeedbackDetailDto, FeedbackDto } from "@/types/kitchen-feedback";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  detail: FeedbackDetailDto | null;
  // Truyền thêm thông tin từ list vào vì Backend Detail DTO đang thiếu SenderName/Title
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

  return (
    <div className="fixed inset-0 bg-gray-400/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {previewData?.title || "Chi tiết phản hồi"}
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <User size={14} className="mr-1" />{" "}
              {previewData?.senderName || "Người gửi ẩn danh"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : detail ? (
            <div className="space-y-6">
              <div className="flex gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-500" />
                  {detail.createdAt
                    ? format(new Date(detail.createdAt), "dd/MM/yyyy HH:mm")
                    : "-"}
                </div>
                <div className="flex items-center">
                  <Tag size={16} className="mr-2 text-orange-500" />
                  <span className="capitalize">
                    {detail.targetType || "Chung"}
                  </span>
                  {detail.targetRef && (
                    <span className="ml-1">({detail.targetRef})</span>
                  )}
                </div>
                {detail.dailyMealId && (
                  <div className="flex items-center">
                    <Utensils size={16} className="mr-2 text-green-500" />
                    Món ăn ID: {detail.dailyMealId}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Nội dung phản hồi:
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-800">
                  {detail.content}
                </div>
              </div>

              {/* Placeholder cho Reply (Backend chưa hỗ trợ) */}
              <div className="border-t pt-4 mt-4">
                <p className="text-xs text-gray-400 italic text-center">
                  Tính năng trả lời phản hồi đang được phát triển.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Không tải được thông tin chi tiết.
            </p>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
