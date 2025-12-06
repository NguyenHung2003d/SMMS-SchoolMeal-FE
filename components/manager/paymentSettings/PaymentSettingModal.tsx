import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { SchoolPaymentSettingDto } from "@/types/manager-payment";
import { toast } from "react-hot-toast";

interface PaymentSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: SchoolPaymentSettingDto | null;
  isSaving: boolean;
}

export const PaymentSettingModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSaving,
}: PaymentSettingModalProps) => {
  const [form, setForm] = useState({
    fromMonth: 1,
    toMonth: 1,
    totalAmount: 0,
    note: "",
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          fromMonth: initialData.fromMonth,
          toMonth: initialData.toMonth,
          totalAmount: initialData.totalAmount,
          note: initialData.note || "",
          isActive: initialData.isActive,
        });
      } else {
        const currentMonth = new Date().getMonth() + 1;
        setForm({
          fromMonth: currentMonth,
          toMonth: currentMonth,
          totalAmount: 0,
          note: "",
          isActive: true,
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate cơ bản
    if (form.fromMonth > form.toMonth) {
      toast.error("Tháng bắt đầu không được lớn hơn tháng kết thúc");
      return;
    }
    if (form.totalAmount <= 0) {
      toast.error("Số tiền phải lớn hơn 0");
      return;
    }
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Cập nhật cấu hình" : "Thêm đợt thu mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ tháng
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                value={form.fromMonth}
                onChange={(e) =>
                  setForm({ ...form, fromMonth: Number(e.target.value) })
                }
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến tháng
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                value={form.toMonth}
                onChange={(e) =>
                  setForm({ ...form, toMonth: Number(e.target.value) })
                }
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền (VNĐ)
            </label>
            <input
              type="number"
              min="0"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              value={form.totalAmount}
              onChange={(e) =>
                setForm({ ...form, totalAmount: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 min-h-[80px]"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Nhập ghi chú cho đợt thu này..."
            />
          </div>

          {initialData && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700 select-none cursor-pointer"
              >
                Đang kích hoạt
              </label>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-md transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isSaving ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                "Lưu cấu hình"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
