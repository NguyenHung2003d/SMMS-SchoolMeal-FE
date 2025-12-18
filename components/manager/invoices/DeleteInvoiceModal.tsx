import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteInvoiceModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteInvoiceModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
          <h3 className="font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle size={20} />
            Xác nhận xóa
          </h3>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn muốn xóa hóa đơn này không?
          </p>
          <div className="bg-orange-50 text-orange-800 text-sm p-3 rounded-lg border border-orange-100">
            <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Nếu hóa
            đơn đã có lịch sử thanh toán, hệ thống có thể sẽ chặn việc xóa.
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={18} /> : null}
            {isDeleting ? "Đang xóa..." : "Xóa hóa đơn"}
          </button>
        </div>
      </div>
    </div>
  );
};
