"use client";
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  FileText,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  MessageSquare,
  Send,
  X,
  Edit,
  Trash,
  TrendingUp,
  Plus,
  Loader2,
} from "lucide-react";
import { wardenFeedbackService } from "@/services/wardenFeedbackServices";
import { getWardenIdFromToken } from "@/utils";
import { FeedbackDto } from "@/types/warden";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  getCategoryColor,
  getCategoryLabel,
  getStatusColor,
  getStatusLabel,
} from "@/helpers";

export default function TeacherIssueReport() {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [issueSeverity, setIssueSeverity] = useState("medium");
  const [issueStudent, setIssueStudent] = useState("");

  // 1. Fetch Data
  const fetchFeedbacks = async () => {
    try {
      const wardenId = getWardenIdFromToken();
      if (wardenId) {
        const data = await wardenFeedbackService.getFeedbacks(wardenId);
        setFeedbacks(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách phản hồi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 2. Filter Logic
  const filteredIssues = feedbacks.filter((issue) => {
    if (activeTab === "all") return true;
    // Mapping status backend sang tab frontend
    // Backend có thể trả về: "Pending", "Processing", "Resolved" (cần check case-insensitive)
    const status = issue.status.toLowerCase();
    if (activeTab === "pending") return status === "pending";
    if (activeTab === "inProgress")
      return status === "processing" || status === "inprogress";
    if (activeTab === "resolved")
      return status === "resolved" || status === "completed";
    return true;
  });

  // 3. Stats Counting
  const stats = {
    pending: feedbacks.filter((i) => i.status.toLowerCase() === "pending")
      .length,
    inProgress: feedbacks.filter((i) =>
      ["processing", "inprogress"].includes(i.status.toLowerCase())
    ).length,
    resolved: feedbacks.filter((i) =>
      ["resolved", "completed"].includes(i.status.toLowerCase())
    ).length,
  };

  // 4. Handle Create
  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();

    const wardenId = getWardenIdFromToken();
    if (!wardenId) {
      alert("Phiên đăng nhập không hợp lệ");
      return;
    }

    setSubmitting(true);
    try {
      await wardenFeedbackService.createFeedback({
        title: issueTitle,
        content: issueDescription,
        category: issueCategory,
        severity: issueSeverity,
        studentName: issueStudent || undefined,
        wardenId: wardenId,
      });

      alert("Gửi báo cáo thành công!");
      setShowCreateModal(false);
      // Reset form
      setIssueTitle("");
      setIssueDescription("");
      setIssueCategory("");
      setIssueSeverity("medium");
      setIssueStudent("");

      // Reload data
      fetchFeedbacks();
    } catch (error) {
      console.error("Lỗi tạo phản hồi:", error);
      alert("Gửi báo cáo thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Báo cáo vấn đề
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi các vấn đề trong trường học
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center">
              <Plus
                size={20}
                className="mr-2 group-hover:rotate-90 transition-transform duration-300"
              />
              Báo cáo mới
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-amber-100 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-4 rounded-xl shadow-lg shadow-amber-500/30">
                  <Clock size={28} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Chờ xử lý
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    {stats.pending}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp size={14} className="mr-1 text-amber-500" />
                <span>Cần xử lý ngay</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl shadow-lg shadow-blue-500/30">
                  <FileText size={28} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Đang xử lý
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {stats.inProgress}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp size={14} className="mr-1 text-blue-500" />
                <span>Đang được giải quyết</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-emerald-100 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-4 rounded-xl shadow-lg shadow-emerald-500/30">
                  <CheckCircle size={28} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Đã giải quyết
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {stats.resolved}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle size={14} className="mr-1 text-emerald-500" />
                <span>Hoàn thành tốt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6">
            <nav className="flex space-x-2">
              {[
                { key: "all", label: "Tất cả báo cáo" },
                { key: "pending", label: "Chờ xử lý" },
                { key: "inProgress", label: "Đang xử lý" },
                { key: "resolved", label: "Đã giải quyết" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-6 py-4 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? "text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg shadow-orange-500/50"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-4">
              <div className="relative w-full md:w-96 group">
                <input
                  type="text"
                  placeholder="Tìm kiếm báo cáo..."
                  className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-300"
                />
                <Search
                  className="absolute left-4 top-3.5 text-gray-400 group-hover:text-orange-500 transition-colors duration-300"
                  size={20}
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select className="appearance-none bg-white border-2 border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300 hover:shadow-md cursor-pointer">
                    <option value="all">Tất cả phân loại</option>
                    <option value="food">🍽️ Thức ăn</option>
                    <option value="facility">🏫 Cơ sở vật chất</option>
                    <option value="health">❤️ Sức khỏe</option>
                    <option value="activity">🎨 Hoạt động</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
                <button className="p-3 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-orange-300 hover:shadow-md">
                  <Filter size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <div
                  key={issue.feedbackId}
                  className="p-6 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-3 flex-wrap gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-300">
                          {issue.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${getCategoryColor(
                            issue.category
                          )} backdrop-blur-sm`}
                        >
                          {getCategoryLabel(issue.category)}
                        </span>
                        {issue.severity === "high" && (
                          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-lg font-medium shadow-lg shadow-red-500/30">
                            ⚠️ Ưu tiên cao
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {issue.content}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Calendar
                            size={14}
                            className="mr-1.5 text-orange-500"
                          />
                          <span className="font-medium">
                            {format(
                              new Date(issue.createdAt),
                              "dd/MM/yyyy HH:mm",
                              { locale: vi }
                            )}
                          </span>
                        </div>
                        {issue.studentName && (
                          <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                            <span className="font-medium text-blue-700">
                              👤 {issue.studentName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      <span
                        className={`px-4 py-2 text-xs font-semibold rounded-xl ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {getStatusLabel(issue.status)}
                      </span>
                      {issue.replyCount && issue.replyCount > 0 ? (
                        <div className="mt-3 text-xs text-gray-500 flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                          <MessageSquare
                            size={14}
                            className="mr-1.5 text-blue-500"
                          />
                          <span className="font-medium">
                            {issue.replyCount} phản hồi
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="px-4 py-2 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 text-sm flex items-center rounded-lg transition-all duration-300 border border-blue-200 hover:border-transparent hover:shadow-lg hover:shadow-blue-500/30">
                      <MessageSquare size={16} className="mr-1.5" />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Không có báo cáo nào
                </h3>
                <p className="text-gray-500">
                  Không tìm thấy báo cáo phù hợp với bộ lọc hiện tại
                </p>
              </div>
            )}
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-orange-50 to-pink-50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Báo cáo vấn đề mới
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateIssue}>
                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-rounded-full scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300 hover:bg-gray-100"
                      placeholder="Nhập tiêu đề vấn đề"
                      value={issueTitle}
                      onChange={(e) => setIssueTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300 resize-none hover:bg-gray-100"
                      rows={4}
                      placeholder="Mô tả chi tiết vấn đề"
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Phân loại <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300 cursor-pointer appearance-none hover:bg-gray-100"
                        value={issueCategory}
                        onChange={(e) => setIssueCategory(e.target.value)}
                        required
                      >
                        <option value="">-- Chọn phân loại --</option>
                        <option value="food">🍽️ Thức ăn</option>
                        <option value="facility">🏫 Cơ sở vật chất</option>
                        <option value="health">❤️ Sức khỏe</option>
                        <option value="activity">🎨 Hoạt động</option>
                        <option value="other">📋 Khác</option>
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 mt-3 text-gray-400 pointer-events-none"
                        size={20}
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Mức độ ưu tiên
                      </label>
                      <select
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300 cursor-pointer appearance-none hover:bg-gray-100"
                        value={issueSeverity}
                        onChange={(e) => setIssueSeverity(e.target.value)}
                        required
                      >
                        <option value="low">🟢 Thấp</option>
                        <option value="medium">🟡 Trung bình</option>
                        <option value="high">🔴 Cao</option>
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 mt-3 text-gray-400 pointer-events-none"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Học sinh liên quan (nếu có)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300 hover:bg-gray-100"
                      placeholder="Nhập tên học sinh (không bắt buộc)"
                      value={issueStudent}
                      onChange={(e) => setIssueStudent(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" /> Đang
                        gửi...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" /> Gửi báo cáo
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
