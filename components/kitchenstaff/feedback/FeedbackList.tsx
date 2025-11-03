"use client";
import {
  Search,
  Filter,
  MessageCircle,
  MessageSquare,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

export default function FeedbackList({
  activeTab,
  setActiveTab,
  selectedSeverity,
  setSelectedSeverity,
  sortBy,
  setSortBy,
  paginatedFeedback,
  handleViewFeedback,
  pendingCount,
  currentPage,
  setCurrentPage,
  totalPages,
  sortedFeedback,
  itemsPerPage,
}: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "all"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tất cả phản hồi
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "pending"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Chưa xử lý
            {pendingCount > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("inProgress")}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "inProgress"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Đang xử lý
          </button>
          <button
            onClick={() => setActiveTab("resolved")}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "resolved"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Đã giải quyết
          </button>
        </nav>
      </div>

      {/* Search + Filter */}
      <div className="p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm phản hồi..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
          >
            <option value="all">Tất cả mức độ</option>
            <option value="high">Nghiêm trọng</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
          <select
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="highSeverity">Mức độ nghiêm trọng</option>
          </select>
          <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Feedback Items */}
      <div className="divide-y divide-gray-200">
        {paginatedFeedback.length > 0 ? (
          paginatedFeedback.map((feedback: any) => (
            <div
              key={feedback.id}
              className={`p-6 hover:bg-gray-50 cursor-pointer ${
                feedback.severity === "high"
                  ? "border-l-4 border-red-500"
                  : feedback.severity === "medium"
                  ? "border-l-4 border-orange-500"
                  : ""
              }`}
              onClick={() => handleViewFeedback(feedback)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
                    <img
                      src={
                        feedback.sender.avatar ||
                        "https://via.placeholder.com/40"
                      }
                      alt={feedback.sender.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {feedback.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {feedback.description.length > 100
                        ? feedback.description.substring(0, 100) + "..."
                        : feedback.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {feedback.sender.name} ({feedback.sender.role})
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {feedback.date} {feedback.time}
                      </span>
                      {feedback.category && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              feedback.category === "food"
                                ? "bg-blue-100 text-blue-800"
                                : feedback.category === "allergy"
                                ? "bg-red-100 text-red-800"
                                : feedback.category === "compliment"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {feedback.category === "food"
                              ? "Thức ăn"
                              : feedback.category === "allergy"
                              ? "Dị ứng"
                              : feedback.category === "compliment"
                              ? "Khen ngợi"
                              : "Đề xuất"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      feedback.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : feedback.status === "inProgress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {feedback.status === "pending"
                      ? "Chưa xử lý"
                      : feedback.status === "inProgress"
                      ? "Đang xử lý"
                      : "Đã giải quyết"}
                  </span>
                  <span
                    className={`mt-2 flex items-center text-xs ${
                      feedback.severity === "high"
                        ? "text-red-600"
                        : feedback.severity === "medium"
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {feedback.severity === "high" ? (
                      <>
                        <AlertTriangle size={14} className="mr-1" /> Nghiêm
                        trọng
                      </>
                    ) : feedback.severity === "medium" ? (
                      <>
                        <AlertCircle size={14} className="mr-1" /> Trung bình
                      </>
                    ) : (
                      <>
                        <MessageCircle size={14} className="mr-1" /> Thấp
                      </>
                    )}
                  </span>
                  {feedback.responses.length > 0 && (
                    <span className="mt-2 text-xs text-gray-500 flex items-center">
                      <MessageSquare size={14} className="mr-1" />
                      {feedback.responses.length} phản hồi
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              Không có phản hồi nào
            </h3>
            <p className="text-gray-500">
              Không tìm thấy phản hồi phù hợp với bộ lọc hiện tại
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, sortedFeedback.length)} trong{" "}
            {sortedFeedback.length} phản hồi
          </div>
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
