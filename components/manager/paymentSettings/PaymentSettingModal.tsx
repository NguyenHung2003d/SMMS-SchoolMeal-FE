import React, { useEffect, useState } from "react";
import { X, DollarSign, Loader2 } from "lucide-react";
import { formatCurrency, months } from "@/helpers";
import { SchoolPaymentSettingDto } from "@/types/manager-payment";
import toast from "react-hot-toast";

interface FormData {
  fromMonth: number;
  toMonth: number;
  totalAmount: number;
  note: string;
  isActive: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData: SchoolPaymentSettingDto | null;
  isSaving: boolean;
}

const defaultFormData: FormData = {
  fromMonth: 9,
  toMonth: 12,
  totalAmount: 0,
  note: "",
  isActive: true,
};

export const PaymentSettingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSaving,
}) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          fromMonth: initialData.fromMonth,
          toMonth: initialData.toMonth,
          totalAmount: initialData.totalAmount,
          note: initialData.note || "",
          isActive: initialData.isActive,
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (formData.totalAmount < 0) {
      toast.error("Số tiền không hợp lệ.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">
            {initialData ? "Chỉnh sửa đợt thu" : "Tạo đợt thu mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ tháng
              </label>
              <select
                value={formData.fromMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fromMonth: Number(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến tháng
              </label>
              <select
                value={formData.toMonth}
                onChange={(e) =>
                  setFormData({ ...formData, toMonth: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tổng số tiền (VND)
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalAmount: Number(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                placeholder="0"
              />
              <DollarSign
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formatCurrency(formData.totalAmount)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              placeholder="Nhập ghi chú (tùy chọn)..."
            />
          </div>

          {initialData && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Đang kích hoạt
              </label>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            disabled={isSaving}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors font-medium flex items-center shadow-sm disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" /> Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
