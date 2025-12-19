import React from "react";
import { Copy, Sparkles } from "lucide-react";

interface HeaderControlProps {
  onOpenTemplate: () => void;
  onOpenAi: () => void;
}

export default function HeaderControl({
  onOpenTemplate,
  onOpenAi,
}: HeaderControlProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Lên thực đơn tuần</h1>
        <p className="text-sm text-gray-500">Chọn món ăn cho từng ngày</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onOpenTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium shadow-sm transition-colors"
        >
          <Copy size={18} /> Dùng menu mẫu
        </button>
        <button
          onClick={onOpenAi}
          className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium border border-purple-200"
        >
          <Sparkles size={18} /> AI Gợi ý & Thêm nhanh
        </button>
      </div>
    </div>
  );
}
