"use client";
import React, { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  CreateSchoolPaymentSettingRequest,
  SchoolPaymentSettingDto,
  UpdateSchoolPaymentSettingRequest,
} from "@/types/manager-payment";
import { getSchoolId } from "@/utils";
import { paymentService } from "@/services/managerPaymentService";
import { PaymentSettingCard } from "@/components/manager/paymentSettings/PaymentSettingCard";
import { PaymentSettingModal } from "@/components/manager/paymentSettings/PaymentSettingModal";

export default function ManagerPaymentSettings() {
  const [settingsList, setSettingsList] = useState<SchoolPaymentSettingDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SchoolPaymentSettingDto | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const schoolId = getSchoolId();
      if (!schoolId) {
        toast.error("Không tìm thấy thông tin trường học.");
        return;
      }
      const data = await paymentService.getBySchool(schoolId);
      setSettingsList(data.sort((a, b) => a.fromMonth - b.fromMonth));
    } catch (err: any) {
      console.error(err);
      toast.error("Không thể tải danh sách cấu hình.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SchoolPaymentSettingDto) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá cấu hình này không?")) return;

    await toast.promise(
      paymentService.delete(id).then(() => {
         loadData();
      }),
      {
        loading: 'Đang xoá...',
        success: 'Xoá thành công!',
        error: (err) => `Xoá thất bại: ${err.response?.data?.message || err.message}`,
      }
    );
  };

  const handleSave = async (formData: any) => {
    setIsSaving(true);
    try {
      const schoolId = getSchoolId();
      if (!schoolId) return;

      if (editingItem) {
        const updatePayload: UpdateSchoolPaymentSettingRequest = {
          fromMonth: formData.fromMonth,
          toMonth: formData.toMonth,
          totalAmount: formData.totalAmount,
          note: formData.note,
          isActive: formData.isActive,
        };
        await paymentService.update(editingItem.settingId, updatePayload);
        toast.success("Cập nhật thành công!");
      } else {
        const createPayload: CreateSchoolPaymentSettingRequest = {
          schoolId: schoolId,
          fromMonth: formData.fromMonth,
          toMonth: formData.toMonth,
          totalAmount: formData.totalAmount,
          note: formData.note,
        };
        await paymentService.create(createPayload);
        toast.success("Tạo mới thành công!");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Cấu hình thu phí ăn
          </h1>
          <p className="text-gray-600 text-sm">
            Quản lý các đợt thu phí theo tháng cho toàn trường
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <Plus size={18} className="mr-2" /> Thêm đợt thu
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsList.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 italic bg-white rounded-lg border border-dashed border-gray-300">
              Chưa có cấu hình nào. Hãy tạo mới.
            </div>
          ) : (
            settingsList.map((item) => (
              <PaymentSettingCard
                key={item.settingId}
                item={item}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      <PaymentSettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingItem}
        isSaving={isSaving}
      />
    </div>
  );
}