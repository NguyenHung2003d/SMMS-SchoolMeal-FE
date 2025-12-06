"use client";
import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { wardenFeedbackService } from "@/services/wardens/wardenFeedback.service";
import { FeedbackDto } from "@/types/warden-feedback";
import toast from "react-hot-toast";
import { FeedbackFilterBar } from "@/components/warden/feedback/FeedbackFilterBar";
import { FeedbackItem } from "@/components/warden/feedback/FeedbackItem";
import { EmptyFeedbackState } from "@/components/warden/feedback/EmptyFeedbackState";
import { CreateFeedbackModal } from "@/components/warden/feedback/CreateFeedbackModal";

export default function TeacherFeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);

  const [activeTab, setActiveTab] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<FeedbackDto | null>(null);

  const fetchFeedbacks = async () => {
    try {
      const data = await wardenFeedbackService.getFeedbacks();
      const mappedData = data.map((item) => ({
        ...item,
        status: item.status || "pending",
        targetType: item.targetType || "other",
      }));
      setFeedbacks(mappedData);
    } catch (error) {
      console.error("Lỗi tải danh sách phản hồi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (feedbackId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa báo cáo này không?")) return;
    try {
      await wardenFeedbackService.deleteFeedback(feedbackId);
      setFeedbacks((prev) => prev.filter((f) => f.feedbackId !== feedbackId));
      toast.success("Đã xóa thành công");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      toast.error("Xóa thất bại");
    }
  };

  const handleCreateOrUpdate = async (formData: any) => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
      };

      if (editingItem) {
        await wardenFeedbackService.updateFeedback(
          editingItem.feedbackId,
          payload
        );
        toast.success("Cập nhật báo cáo thành công");
      } else {
        await wardenFeedbackService.createFeedback(payload);
        toast.success("Tạo báo cáo thành công");
      }

      setShowModal(false);
      fetchFeedbacks();
    } catch (error) {
      console.error("Lỗi submit:", error);
      toast.error("Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (item: FeedbackDto) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const filteredIssues = feedbacks.filter((issue) => {
    let statusMatch = true;
    const status = (issue.status || "").toLowerCase();
    if (activeTab === "pending") statusMatch = status === "pending";
    else if (activeTab === "inProgress")
      statusMatch = ["processing", "inprogress"].includes(status);
    else if (activeTab === "resolved")
      statusMatch = ["resolved", "completed"].includes(status);

    let categoryMatch = true;
    if (filterCategory !== "all") {
      categoryMatch =
        (issue.targetType || "").toLowerCase() === filterCategory.toLowerCase();
    }

    let searchMatch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      searchMatch =
        (issue.title || "").toLowerCase().includes(term) ||
        (issue.content || "").toLowerCase().includes(term) ||
        (issue.targetRef || "").toLowerCase().includes(term);
    }

    return statusMatch && categoryMatch && searchMatch;
  });

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Báo cáo vấn đề
            </h1>
            <p className="text-gray-600">
              Quản lý phản hồi từ giám thị (Warden){" "}
            </p>
          </div>
          <button
            onClick={openCreateModal}
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

        {/* Main Content Card */}
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

          <FeedbackFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />

          <div className="divide-y divide-gray-100">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <FeedbackItem
                  key={issue.feedbackId}
                  issue={issue}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyFeedbackState />
            )}
          </div>
        </div>

        <CreateFeedbackModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateOrUpdate}
          submitting={submitting}
          initialData={
            editingItem
              ? {
                  title: editingItem.title,
                  content: editingItem.content,
                  targetRef: editingItem.targetRef,
                  category: (() => {
                    const t = (editingItem.targetType || "").toLowerCase();
                    if (t.includes("kitchen") || t === "food") return "food";
                    if (t.includes("facility")) return "facility";
                    if (t.includes("health")) return "health";
                    if (t.includes("activity")) return "activity";
                    return "other";
                  })(),
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
