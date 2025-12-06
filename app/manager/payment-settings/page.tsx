"use client";
import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PaymentSettingCard } from "@/components/manager/paymentSettings/PaymentSettingCard";
import { PaymentSettingModal } from "@/components/manager/paymentSettings/PaymentSettingModal";
import { SchoolPaymentSettingDto } from "@/types/manager-payment";
import { usePaymentSettings } from "@/hooks/manager/usePaymentSettings";

export default function ManagerPaymentSettings() {
  const {
    settingsList,
    isLoading,
    createSetting,
    updateSetting,
    deleteSetting,
    isSaving,
  } = usePaymentSettings();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<SchoolPaymentSettingDto | null>(null);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SchoolPaymentSettingDto) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá cấu hình này không?")) {
      await deleteSetting(id);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingItem) {
        await updateSetting({
          id: editingItem.settingId,
          data: {
            fromMonth: formData.fromMonth,
            toMonth: formData.toMonth,
            totalAmount: formData.totalAmount,
            note: formData.note,
            isActive: formData.isActive,
          },
        });
      } else {
        await createSetting({
          fromMonth: formData.fromMonth,
          toMonth: formData.toMonth,
          totalAmount: formData.totalAmount,
          note: formData.note,
        });
      }
      setIsModalOpen(false); // Chỉ đóng modal khi thành công
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Cấu hình thu phí ăn
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Quản lý các đợt thu phí theo tháng cho toàn trường
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md transition-all transform active:scale-95"
        >
          <Plus size={18} className="mr-2" /> Thêm đợt thu
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsList.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium mb-2">
                Chưa có cấu hình nào
              </p>
              <button
                onClick={handleOpenCreate}
                className="text-orange-600 hover:underline text-sm font-medium"
              >
                Tạo cấu hình đầu tiên ngay
              </button>
            </div>
          ) : (
            settingsList.map((item: any) => (
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

      {isModalOpen && (
        <PaymentSettingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          initialData={editingItem}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
