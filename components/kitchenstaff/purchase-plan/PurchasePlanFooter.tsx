import React from "react";
import { Save, Check } from "lucide-react";

interface PurchasePlanFooterProps {
  onSaveDraft: () => void;
  onConfirm: () => void;
}

export default function PurchasePlanFooter({
  onSaveDraft,
  onConfirm,
}: PurchasePlanFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 flex justify-end gap-3 md:pr-10 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center mr-auto text-sm text-gray-500 ml-4">
        <Save size={16} className="mr-1.5 text-orange-500" />
        <span>Vui lòng lưu nháp trước khi xác nhận</span>
      </div>
      <button
        onClick={onSaveDraft}
        className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        Lưu nháp
      </button>
      <button
        onClick={onConfirm}
        className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2"
      >
        <Check size={20} /> Hoàn tất & Tạo Đơn
      </button>
    </div>
  );
}
