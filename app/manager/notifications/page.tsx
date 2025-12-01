"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { axiosInstance } from "@/lib/axiosInstance";
import { CreateNotificationRequest } from "@/types/notification";

import SentNotificationsTable from "@/components/manager/notification/SentNotificationsTable";
import CreateNotificationModal from "@/components/manager/notification/CreateNotificationModal";

export default function ManagerNotifications() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

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
      await axiosInstance.post("/ManagerNotifications", formData);
      toast.success("Đã tạo thông báo!");

      setShowCreateModal(false);

      setRefreshKey((prev) => prev + 1);

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

        <SentNotificationsTable key={refreshKey} />

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
      </div>
    </div>
  );
}
