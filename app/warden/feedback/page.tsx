"use client";

import React, { useState, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FeedbackDto } from "@/types/warden-feedback";
import toast from "react-hot-toast";

import { wardenFeedbackService } from "@/services/wardens/wardenFeedback.service";

import { FeedbackFilterBar } from "@/components/warden/feedback/FeedbackFilterBar";
import { FeedbackItem } from "@/components/warden/feedback/FeedbackItem";
import { EmptyFeedbackState } from "@/components/warden/feedback/EmptyFeedbackState";
import { CreateFeedbackModal } from "@/components/warden/feedback/CreateFeedbackModal";
import { DeleteConfirmModal } from "@/components/warden/feedback/DeleteConfirmModal";

import { getNormalizedCategory } from "@/helpers";

export default function TeacherFeedbackPage() {
  const queryClient = useQueryClient();

  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FeedbackDto | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["wardenFeedbacks"],
    queryFn: async () => {
      const data = await wardenFeedbackService.getFeedbacks();
      return data.map((item) => ({
        ...item,
        status: item.status || "pending",
        targetType: item.targetType || "other",
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: wardenFeedbackService.deleteFeedback,
    onSuccess: () => {
      toast.success("Đã xóa thành công");
      setShowDeleteModal(false);
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["wardenFeedbacks"] });
    },
    onError: () => toast.error("Xóa thất bại"),
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (editingItem) {
        return wardenFeedbackService.updateFeedback(
          editingItem.feedbackId,
          formData
        );
      } else {
        return wardenFeedbackService.createFeedback(formData);
      }
    },
    onSuccess: () => {
      toast.success(
        editingItem ? "Cập nhật thành công" : "Tạo báo cáo thành công"
      );
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["wardenFeedbacks"] });
    },
    onError: () => toast.error("Thao tác thất bại"),
  });

  const filteredIssues = useMemo(() => {
    return feedbacks.filter((issue) => {
      let categoryMatch = true;
      if (filterCategory !== "all") {
        const issueCategory = getNormalizedCategory(issue.targetType);
        categoryMatch = issueCategory === filterCategory;
      }

      let searchMatch = true;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        searchMatch =
          (issue.title || "").toLowerCase().includes(term) ||
          (issue.content || "").toLowerCase().includes(term) ||
          (issue.targetRef || "").toLowerCase().includes(term);
      }

      return categoryMatch && searchMatch;
    });
  }, [feedbacks, filterCategory, searchTerm]);

  const handleDeleteClick = (feedbackId: number) => {
    setDeleteId(feedbackId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleCreateOrUpdate = (formData: any) => {
    saveMutation.mutate(formData);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (item: FeedbackDto) => {
    setEditingItem(item);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50 p-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Báo cáo vấn đề
            </h1>
            <p className="text-gray-600">
              Quản lý phản hồi từ giám thị (Warden)
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

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <FeedbackFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className="divide-y divide-gray-100">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <FeedbackItem
                  key={issue.feedbackId}
                  issue={issue}
                  onEdit={openEditModal}
                  onDelete={handleDeleteClick}
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
          submitting={saveMutation.isPending}
          initialData={
            editingItem
              ? {
                  title: editingItem.title,
                  content: editingItem.content,
                  targetRef: editingItem.targetRef,
                  category: getNormalizedCategory(editingItem.targetType),
                }
              : undefined
          }
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          isDeleting={deleteMutation.isPending}
          title="Xóa báo cáo"
          message="Bạn có chắc chắn muốn xóa báo cáo này không? Hành động này sẽ không thể khôi phục."
        />
      </div>
    </div>
  );
}
