import React from "react";
import { Calendar, Trash2, Plus } from "lucide-react";
import { getStatusBadge } from "@/helpers";

interface PurchasePlanHeaderProps {
  status: string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isDraft: boolean;
  onDeletePlan: () => void;
  onOpenAddModal: () => void;
}

export default function PurchasePlanHeader({
  status,
  selectedDate,
  setSelectedDate,
  isDraft,
  onDeletePlan,
  onOpenAddModal,
}: PurchasePlanHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-800">Kế hoạch mua sắm</h1>
          {getStatusBadge(status)}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Calendar size={16} className="text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-orange-500 bg-white"
          />
        </div>
      </div>

      {isDraft && (
        <div className="flex gap-2">
          <button
            onClick={onDeletePlan}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors border border-red-200"
            title="Xóa toàn bộ kế hoạch"
          >
            <Trash2 size={18} />
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            onClick={onOpenAddModal}
          >
            <Plus size={18} /> Thêm mặt hàng
          </button>
        </div>
      )}
    </div>
  );
}
