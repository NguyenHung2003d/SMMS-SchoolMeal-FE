"use client";
import React, { useState } from "react";
import { X, Loader2, CalendarPlus } from "lucide-react";
import { GenerateInvoiceRequest } from "@/types/invoices";

interface GenerateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenerateInvoiceRequest) => Promise<any>;
  isSubmitting: boolean;
}

export const GenerateInvoiceModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: GenerateInvoiceModalProps) => {
  const [formData, setFormData] = useState<GenerateInvoiceRequest>({
    dateFrom: "",
    dateTo: "",
    skipExisting: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarPlus className="text-blue-600" size={24} />
            Tạo Hóa Đơn Hàng Loạt
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Từ ngày <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.dateFrom}
                onChange={(e) =>
                  setFormData({ ...formData, dateFrom: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Đến ngày <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.dateTo}
                onChange={(e) =>
                  setFormData({ ...formData, dateTo: e.target.value })
                }
              />
            </div>

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="skip"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                checked={formData.skipExisting}
                onChange={(e) =>
                  setFormData({ ...formData, skipExisting: e.target.checked })
                }
              />
              <label
                htmlFor="skip"
                className="ml-2.5 text-sm text-gray-700 cursor-pointer select-none"
              >
                Bỏ qua học sinh đã có hóa đơn trong khoảng này
              </label>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md shadow-blue-200 transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang
                    tạo...
                  </>
                ) : (
                  "Xác nhận tạo"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
