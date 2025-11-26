"use client";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 flex justify-center border-b border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
            <AlertTriangle className="text-red-600 w-8 h-8" />
          </div>
        </div>

        <div className="p-6 text-center">
          <h2 className="font-bold text-xl text-gray-900 mb-2">Xác nhận xóa?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Bạn có chắc chắn muốn xóa thông báo này? <br />
            <span className="font-semibold text-red-600">Hành động này không thể hoàn tác</span> và thông báo sẽ bị gỡ khỏi người nhận.
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-gray-50 to-red-50 border-t border-gray-200 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 font-semibold transition-all active:scale-95"
          >
            Hủy bỏ
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/30 font-semibold transition-all hover:scale-105 active:scale-95"
            onClick={onConfirm}
          >
            Xóa ngay
          </Button>
        </div>
      </div>
    </div>
  );
}