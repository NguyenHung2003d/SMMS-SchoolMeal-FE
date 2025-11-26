import React from "react";
import { AlertTriangle } from "lucide-react";
import { ClassDto } from "@/types/manager-class";

interface DeleteClassModalProps {
  classData: ClassDto | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteClassModal({
  classData,
  onClose,
  onConfirm,
}: DeleteClassModalProps) {
  if (!classData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600 h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
          <p className="text-gray-500 mb-6">
            Bạn có chắc chắn muốn xóa lớp{" "}
            <span className="font-bold text-gray-800">
              {classData.className}
            </span>{" "}
            không? Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-lg shadow-red-200 transition-all"
            >
              Xóa ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
