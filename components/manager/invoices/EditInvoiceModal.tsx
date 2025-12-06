"use client";
import React, { useEffect, useState } from "react";
import { X, Loader2, FilePenLine } from "lucide-react";
import { Invoice, UpdateInvoiceRequest } from "@/types/invoices";

interface EditInvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onSubmit: (args: { id: number; data: UpdateInvoiceRequest }) => Promise<any>;
  isSubmitting: boolean;
}

export const EditInvoiceModal = ({
  invoice,
  onClose,
  onSubmit,
  isSubmitting,
}: EditInvoiceModalProps) => {
  const [formData, setFormData] = useState<UpdateInvoiceRequest>({
    dateFrom: "",
    dateTo: "",
    absentDay: 0,
    status: "Unpaid",
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        dateFrom: invoice.dateFrom.split("T")[0],
        dateTo: invoice.dateTo.split("T")[0],
        absentDay: invoice.absentDay,
        status: invoice.status,
      });
    }
  }, [invoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    await onSubmit({
      id: invoice.invoiceId,
      data: formData,
    });
    onClose();
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FilePenLine className="text-orange-600" size={20} />
              Cập nhật hóa đơn
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Mã hóa đơn: #{invoice.invoiceId}
            </p>
          </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                  value={formData.dateFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, dateFrom: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                  value={formData.dateTo}
                  onChange={(e) =>
                    setFormData({ ...formData, dateTo: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Số ngày nghỉ (Có phép)
              </label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                value={formData.absentDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    absentDay: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Trạng thái thanh toán
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Unpaid">Chưa thanh toán (Unpaid)</option>
                <option value="Paid">Đã thanh toán (Paid)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-md shadow-orange-200 transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lưu thay
                    đổi
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
