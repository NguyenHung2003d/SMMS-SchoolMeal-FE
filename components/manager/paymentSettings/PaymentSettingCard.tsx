import React from "react";
import {
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  Utensils,
  Coins,
} from "lucide-react";
import { SchoolPaymentSettingDto } from "@/types/manager-payment";
import { formatCurrency } from "@/helpers";

interface PaymentSettingCardProps {
  item: SchoolPaymentSettingDto;
  onEdit: (item: SchoolPaymentSettingDto) => void;
  onDelete: (id: number) => void;
}

export const PaymentSettingCard = ({
  item,
  onEdit,
  onDelete,
}: PaymentSettingCardProps) => {
  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        !item.isActive ? "border-gray-200 bg-gray-50/80" : "border-gray-200"
      }`}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <span
          className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-wide ${
            item.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600 shadow-sm">
          <Calendar size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Tháng áp dụng
          </p>
          <h3 className="font-bold text-gray-800 text-lg">
            Tháng {item.fromMonth}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
          <div className="flex items-center gap-1.5 mb-1 text-blue-700">
            <Utensils size={14} />
            <span className="text-xs font-semibold">Tiền ăn/ngày</span>
          </div>
          <p className="font-bold text-blue-900 text-lg">
            {formatCurrency(item.mealPricePerDay)}
          </p>
        </div>

        <div className="bg-green-50/50 p-3 rounded-xl border border-green-100">
          <div className="flex items-center gap-1.5 mb-1 text-green-700">
            <Coins size={14} />
            <span className="text-xs font-semibold">Tổng thu (Dự kiến)</span>
          </div>
          <p className="font-bold text-green-900 text-lg">
            {formatCurrency(item.totalAmount)}
          </p>
        </div>
      </div>

      {item.note && (
        <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg text-xs text-gray-600 mb-4 border border-gray-100">
          <AlertCircle
            size={14}
            className="text-gray-400 mt-0.5 flex-shrink-0"
          />
          <p className="line-clamp-2 leading-relaxed">{item.note}</p>
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
        >
          <Edit size={16} /> Chỉnh sửa
        </button>
        <button
          onClick={() => onDelete(item.settingId)}
          className="flex-none p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          title="Xóa cấu hình"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};