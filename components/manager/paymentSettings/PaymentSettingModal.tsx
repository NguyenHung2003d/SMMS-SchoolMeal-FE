import React, { useEffect, useState } from "react";
import { X, Loader2, Utensils, DollarSign } from "lucide-react";
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
    mealPricePerDay: 0,
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
          mealPricePerDay: initialData.mealPricePerDay,
          note: initialData.note || "",
          isActive: initialData.isActive,
        });
      } else {
        const currentMonth = new Date().getMonth() + 1;
        setForm({
          fromMonth: currentMonth,
          toMonth: currentMonth,
          totalAmount: 0,
          mealPricePerDay: 0, // Mặc định 0
          note: "",
          isActive: true,
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.fromMonth > form.toMonth) {
      toast.error("Tháng bắt đầu không được lớn hơn tháng kết thúc");
      return;
    }
    if (form.totalAmount < 0) {
      toast.error("Tổng số tiền không được âm");
      return;
    }
    if (form.mealPricePerDay < 0) {
      toast.error("Tiền ăn mỗi ngày không được âm");
      return;
    }

    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {initialData ? "Cập nhật cấu hình" : "Thêm đợt thu mới"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Thiết lập thông tin thu phí cho học kỳ
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Từ tháng
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 block p-3 outline-none transition-all"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Đến tháng
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 block p-3 outline-none transition-all"
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

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                <Utensils size={14} className="text-blue-500" /> Tiền ăn/ngày
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  className="w-full pl-3 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 font-medium outline-none transition-all placeholder:text-gray-300"
                  placeholder="0"
                  value={form.mealPricePerDay}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mealPricePerDay: Number(e.target.value),
                    })
                  }
                />
                <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400">
                  VNĐ
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                <DollarSign size={14} className="text-green-500" /> Tổng thu
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  required
                  className="w-full pl-3 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-800 font-medium outline-none transition-all placeholder:text-gray-300"
                  placeholder="0"
                  value={form.totalAmount}
                  onChange={(e) =>
                    setForm({ ...form, totalAmount: Number(e.target.value) })
                  }
                />
                <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400">
                  VNĐ
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ghi chú
            </label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none h-24 placeholder:text-gray-400"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Nhập ghi chú cho đợt thu này (ví dụ: Bao gồm tiền cơ sở vật chất...)"
            />
          </div>

          {initialData && (
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-5 transition-all duration-300"
                />
                <label
                  htmlFor="isActive"
                  className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-300 ${
                    form.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></label>
              </div>
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Kích hoạt cấu hình này
              </label>
            </div>
          )}

          <div className="pt-4 flex gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-sm transition-all active:scale-95 disabled:opacity-70"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Đang lưu...
                </>
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
