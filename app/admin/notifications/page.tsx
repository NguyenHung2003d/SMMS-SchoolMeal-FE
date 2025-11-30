"use client";
import CreateNotificationModal from "@/components/admin/notifications/CreateNotificationModal";
import NotificationDetailModal from "@/components/admin/notifications/NotificationDetailModal";
import NotificationHeader from "@/components/admin/notifications/NotificationHeader";
import NotificationList from "@/components/admin/notifications/NotificationList";
import { adminNotificationService } from "@/services/adminNotification.service";
import {
  CreateNotificationDto,
  NotificationDetailDto,
  NotificationDto,
} from "@/types/admin-notification";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [viewingNotification, setViewingNotification] =
    useState<NotificationDetailDto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await adminNotificationService.getHistory();
      setNotifications(data);
    } catch (error) {
      toast.error("Không thể tải lịch sử thông báo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleViewDetail = async (id: number) => {
    try {
      setLoadingDetail(true);
      const detail = await adminNotificationService.getById(id);
      setViewingNotification(detail);
    } catch (error) {
      toast.error("Không thể tải chi tiết thông báo.");
      console.error(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetail = () => {
    setViewingNotification(null);
  };

  const handleSubmit = async (formData: CreateNotificationDto) => {
    try {
      setIsSubmitting(true);
      await adminNotificationService.create(formData);

      toast.success("Đã gửi thông báo thành công!");
      closeForm();
      loadNotifications();
    } catch (error) {
      toast.error("Gửi thông báo thất bại. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <NotificationHeader onOpenForm={openForm} />

        <NotificationList
          notifications={notifications}
          loading={loading}
          onViewDetail={handleViewDetail}
          onOpenForm={openForm}
        />

        <CreateNotificationModal
          isOpen={showForm}
          onClose={closeForm}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <NotificationDetailModal
          notification={viewingNotification}
          onClose={closeDetail}
        />

        {loadingDetail && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-[60]">
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
              <Loader2 className="animate-spin text-orange-500" />
              <span className="text-gray-700 font-medium">
                Đang tải chi tiết...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
