"use client";
import React, { useState } from "react";
import { Plus, Loader2, Settings, AlertTriangle } from "lucide-react";
import { PaymentSettingCard } from "@/components/manager/paymentSettings/PaymentSettingCard";
import { PaymentSettingModal } from "@/components/manager/paymentSettings/PaymentSettingModal";
import { PayOsConfigModal } from "@/components/manager/paymentSettings/PayOsConfigModal";
import { SchoolPaymentSettingDto } from "@/types/manager-payment";
import { usePaymentSettings } from "@/hooks/manager/usePaymentSettings";
import toast from "react-hot-toast";

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
  const [isPayOsModalOpen, setIsPayOsModalOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<SchoolPaymentSettingDto | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SchoolPaymentSettingDto) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: number) => {
    setItemToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (itemToDeleteId) {
      try {
        setIsDeleting(true);
        await deleteSetting(itemToDeleteId);
        setIsDeleteModalOpen(false);
        setItemToDeleteId(null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const payload = {
        fromMonth: Number(formData.fromMonth),
        mealPricePerDay: Number(formData.mealPricePerDay),
        note: formData.note,
      };

      if (editingItem) {
        await updateSetting({
          id: editingItem.settingId,
          data: {
            ...payload,
            isActive: formData.isActive,
          },
        });
      } else {
        await createSetting(payload);
      }

      setIsModalOpen(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra khi lưu.";
      toast.error(message);
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
            Quản lý đơn giá và đợt thu phí theo tháng
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsPayOsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md transition-all transform active:scale-95"
          >
            <Settings size={18} className="mr-2" /> Kết nối PayOS
          </button>

          <button
            onClick={handleOpenCreate}
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md transition-all transform active:scale-95"
          >
            <Plus size={18} className="mr-2" /> Thêm đợt thu
          </button>
        </div>
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
                onDelete={confirmDelete}
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

      <PayOsConfigModal
        isOpen={isPayOsModalOpen}
        onClose={() => setIsPayOsModalOpen(false)}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 mx-4 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle size={24} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận xoá
              </h3>

              <p className="text-gray-500 mb-6">
                Bạn có chắc chắn muốn xoá cấu hình này không? <br />
                Hành động này không thể hoàn tác.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>

                <button
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" /> Đang
                      xoá...
                    </>
                  ) : (
                    "Xoá ngay"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
