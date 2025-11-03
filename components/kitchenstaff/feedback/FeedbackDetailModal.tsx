"use client";
import {
  X,
  FileText,
  BarChart2,
  AlertTriangle,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

export default function FeedbackDetailModal({
  selectedFeedback,
  setIsDetailModalOpen,
}: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {selectedFeedback.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedFeedback.date} {selectedFeedback.time} • Món:{" "}
                {selectedFeedback.dish}
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsDetailModalOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-start mb-6">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
              <img
                src={
                  selectedFeedback.sender.avatar ||
                  "https://via.placeholder.com/40"
                }
                alt={selectedFeedback.sender.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {selectedFeedback.sender.name}
              </div>
              <div className="mt-2 bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">{selectedFeedback.description}</p>
              </div>
            </div>
          </div>

          {/* Responses */}
          {selectedFeedback.responses.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">
                Phản hồi ({selectedFeedback.responses.length})
              </h4>
              <div className="space-y-4">
                {selectedFeedback.responses.map((r: any) => (
                  <div key={r.id} className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                      <span className="font-medium text-orange-600">
                        {r.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {r.user.name}
                      </div>
                      <div className="mt-1 bg-orange-50 rounded-lg p-3">
                        <p className="text-gray-800 text-sm">{r.text}</p>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {r.date} {r.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply box */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Trả lời phản hồi</h4>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Nhập phản hồi của bạn..."
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
              <FileText size={18} className="mr-2" />
              Xuất báo cáo
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
              <BarChart2 size={18} className="mr-2" />
              Xem thống kê
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Đóng
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Gửi phản hồi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
