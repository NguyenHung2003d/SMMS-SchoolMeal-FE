"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import { issues } from "@/data";

export default function TeacherIssueReport() {
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [issueSeverity, setIssueSeverity] = useState("medium");
  const [issueStudent, setIssueStudent] = useState("");

  const filteredIssues = issues.filter((issue) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return issue.status === "pending";
    if (activeTab === "inProgress") return issue.status === "inProgress";
    if (activeTab === "resolved") return issue.status === "resolved";
    return true;
  });

  const getCategoryLabel = (category: any) => {
    switch (category) {
      case "food":
        return "Thức ăn";
      case "facility":
        return "Cơ sở vật chất";
      case "health":
        return "Sức khỏe";
      case "activity":
        return "Hoạt động";
      default:
        return "Khác";
    }
  };

  const getCategoryColor = (category: any) => {
    switch (category) {
      case "food":
        return "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200";
      case "facility":
        return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200";
      case "health":
        return "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200";
      case "activity":
        return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200";
      default:
        return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusLabel = (status: any) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "inProgress":
        return "Đang xử lý";
      case "resolved":
        return "Đã giải quyết";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30";
      case "inProgress":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30";
      case "resolved":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const handleCreateIssue = (e: any) => {
    e.preventDefault();
    // Reset form
    setShowCreateModal(false);
    setIssueTitle("");
    setIssueDescription("");
    setIssueCategory("");
    setIssueSeverity("medium");
    setIssueStudent("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Stats */}
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
                    1
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
                    1
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
                    2
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

        {/* Issues list */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Tabs */}
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

          {/* Search and filters */}
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
                <div className="relative">
                  <select className="appearance-none bg-white border-2 border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300 hover:shadow-md cursor-pointer">
                    {/* === THAY ĐỔI: Thêm Emoji === */}
                    <option value="newest">🕒 Mới nhất</option>
                    <option value="oldest">🕤 Cũ nhất</option>
                    <option value="priority">🔥 Ưu tiên cao</option>
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

          {/* Issues */}
          <div className="divide-y divide-gray-100">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <div
                  key={issue.id}
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
                        {issue.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Calendar
                            size={14}
                            className="mr-1.5 text-orange-500"
                          />
                          <span className="font-medium">
                            {issue.date} {issue.time}
                          </span>
                        </div>
                        {issue.student && (
                          <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                            <span className="font-medium text-blue-700">
                              👤 {issue.student}
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
                      {issue.responses.length > 0 && (
                        <div className="mt-3 text-xs text-gray-500 flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                          <MessageSquare
                            size={14}
                            className="mr-1.5 text-blue-500"
                          />
                          <span className="font-medium">
                            {issue.responses.length} phản hồi
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="px-4 py-2 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 text-sm flex items-center rounded-lg transition-all duration-300 border border-blue-200 hover:border-transparent hover:shadow-lg hover:shadow-blue-500/30">
                      <MessageSquare size={16} className="mr-1.5" />
                      Xem chi tiết
                    </button>
                    {issue.status === "pending" && (
                      <>
                        <button className="px-4 py-2 text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-500 text-sm flex items-center rounded-lg transition-all duration-300 border border-emerald-200 hover:border-transparent hover:shadow-lg hover:shadow-emerald-500/30">
                          <Edit size={16} className="mr-1.5" />
                          Chỉnh sửa
                        </button>
                        <button className="px-4 py-2 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 text-sm flex items-center rounded-lg transition-all duration-300 border border-red-200 hover:border-transparent hover:shadow-lg hover:shadow-red-500/30">
                          <Trash size={16} className="mr-1.5" />
                          Xóa
                        </button>
                      </>
                    )}
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

        {/* Create Issue Modal */}
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
                {/* === THAY ĐỔI: Thêm class scrollbar === */}
                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-rounded-full scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                  <div>
                    {/* === THAY ĐỔI: Sửa style Label === */}
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      // === THAY ĐỔI: Thêm bg-gray-50, hover:bg-gray-100, transition-colors ===
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300 hover:bg-gray-100"
                      placeholder="Nhập tiêu đề vấn đề"
                      value={issueTitle}
                      onChange={(e) => setIssueTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    {/* === THAY ĐỔI: Sửa style Label === */}
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      // === THAY ĐỔI: Thêm bg-gray-50, hover:bg-gray-100, transition-colors ===
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300 resize-none hover:bg-gray-100"
                      rows={4}
                      placeholder="Mô tả chi tiết vấn đề"
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* === THAY ĐỔI: Thêm div relative === */}
                    <div className="relative">
                      {/* === THAY ĐỔI: Sửa style Label === */}
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Phân loại
                      </label>
                      <select
                        // === THAY ĐỔI: Thêm appearance-none, bg-white, pl-4 pr-10, hover:bg-gray-100 ===
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
                      {/* === THAY ĐỔI: Thêm icon ChevronDown === */}
                      <ChevronDown
                        className="absolute right-4 top-1/2 mt-3 text-gray-400 pointer-events-none"
                        size={20}
                      />
                    </div>
                    {/* === THAY ĐỔI: Thêm div relative === */}
                    <div className="relative">
                      {/* === THAY ĐỔI: Sửa style Label === */}
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Mức độ ưu tiên
                      </label>
                      <select
                        // === THAY ĐỔI: Thêm appearance-none, bg-white, pl-4 pr-10, hover:bg-gray-100 ===
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300 cursor-pointer appearance-none hover:bg-gray-100"
                        value={issueSeverity}
                        onChange={(e) => setIssueSeverity(e.target.value)}
                        required
                      >
                        <option value="low">🟢 Thấp</option>
                        <option value="medium">🟡 Trung bình</option>
                        <option value="high">🔴 Cao</option>
                      </select>
                      {/* === THAY ĐỔI: Thêm icon ChevronDown === */}
                      <ChevronDown
                        className="absolute right-4 top-1/2 mt-3 text-gray-400 pointer-events-none"
                        size={20}
                      />
                    </div>
                  </div>
                  {/* === THAY ĐỔI: Thêm div relative === */}
                  <div className="relative">
                    {/* === THAY ĐỔI: Sửa style Label === */}
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Liên quan đến học sinh (nếu có)
                    </label>
                    <select
                      // === THAY ĐỔI: Thêm appearance-none, bg-white, pl-4 pr-10, hover:bg-gray-100 ===
                      className="w-full pl-4 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300 cursor-pointer appearance-none hover:bg-gray-100"
                      value={issueStudent}
                      onChange={(e) => setIssueStudent(e.target.value)}
                    >
                      <option value="">
                        -- Không liên quan đến học sinh cụ thể --
                      </option>
                      <option value="Nguyễn Minh Anh">Nguyễn Minh Anh</option>
                      <option value="Trần Hoàng Nam">Trần Hoàng Nam</option>
                      <option value="Lê Thu Hà">Lê Thu Hà</option>
                      <option value="Phạm Minh Đức">Phạm Minh Đức</option>
                      <option value="Vũ Thị Mai">Vũ Thị Mai</option>
                    </select>
                    {/* === THAY ĐỔI: Thêm icon ChevronDown === */}
                    <ChevronDown
                      className="absolute right-4 top-1/2 mt-3 text-gray-400 pointer-events-none"
                      size={20}
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
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center"
                  >
                    <Send size={18} className="mr-2" />
                    Gửi báo cáo
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
