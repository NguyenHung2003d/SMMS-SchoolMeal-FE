import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteSchoolModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteSchoolModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Xác nhận xóa trường học
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Bạn có chắc chắn muốn xóa trường học này không? Hành động này sẽ vô
            hiệu hóa tài khoản trường và không thể hoàn tác ngay lập tức.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-lg shadow-red-200 transition-all flex items-center justify-center disabled:opacity-70"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa ngay"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
