"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  CreateNotificationRequest,
  ManagerNotification,
} from "@/types/notification";
import NotificationTable from "@/components/manager/notification/NotificationTable";
import CreateNotificationModal from "@/components/manager/notification/CreateNotificationModal";
import DeleteConfirmModal from "@/components/manager/notification/DeleteConfirmModal";

export default function ManagerNotifications() {
  const [notifications, setNotifications] = useState<ManagerNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/ManagerNotifications");
      setNotifications(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axiosInstance.delete(`/ManagerNotifications/${deleteId}`);
      toast.success("Đã xóa thông báo!");

      setNotifications((prev) =>
        prev.filter((n) => n.notificationId !== deleteId)
      );
    } catch {
      toast.error("Xóa thất bại!");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const [formData, setFormData] = useState<CreateNotificationRequest>({
    title: "",
    content: "",
    attachmentUrl: "",
    sendToParents: true,
    sendToTeachers: false,
    sendToKitchenStaff: false,
    sendType: "Immediate",
    scheduleCron: "",
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/ManagerNotifications", formData);
      toast.success("Đã tạo thông báo!");

      setNotifications((prev) => [res.data.data, ...prev]);
      setShowCreateModal(false);
      setFormData({
        title: "",
        content: "",
        attachmentUrl: "",
        sendToParents: true,
        sendToTeachers: false,
        sendToKitchenStaff: false,
        sendType: "Immediate",
        scheduleCron: "",
      });
    } catch {
      toast.error("Tạo thông báo thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Quản lý thông báo
            </h1>
            <p className="text-gray-500 mt-1">
              Tạo và quản lý các thông báo cho toàn trường
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} /> Tạo thông báo
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : (
          <NotificationTable
            data={notifications}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onDeleteClick={(id) => {
              setDeleteId(id);
              setShowDeleteModal(true);
            }}
            onRefresh={fetchData}
          />
        )}

        <CreateNotificationModal
          open={showCreateModal}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateSubmit}
          onClose={() => {
            setShowCreateModal(false);
            setFormData({
              title: "",
              content: "",
              attachmentUrl: "",
              sendToParents: true,
              sendToTeachers: false,
              sendToKitchenStaff: false,
              sendType: "Immediate",
              scheduleCron: "",
            });
          }}
        />

        <DeleteConfirmModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
