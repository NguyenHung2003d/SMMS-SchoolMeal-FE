import React from "react";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/helpers";
import { SchoolPaymentSettingDto } from "@/types/manager-payment";

interface Props {
  item: SchoolPaymentSettingDto;
  onEdit: (item: SchoolPaymentSettingDto) => void;
  onDelete: (id: number) => void;
}

export const PaymentSettingCard: React.FC<Props> = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`bg-white rounded-lg border shadow-sm p-5 relative group transition-all hover:shadow-md ${
        !item.isActive ? "opacity-70 bg-gray-50" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full text-sm">
          <Calendar size={14} className="mr-2" />
          Tháng {item.fromMonth} - Tháng {item.toMonth}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(item.settingId)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-gray-500 text-xs uppercase font-medium">Mức thu</p>
        <p className="text-xl font-bold text-gray-800">
          {formatCurrency(item.totalAmount)}
        </p>
      </div>

      {item.note && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-2">
          <span className="font-medium text-xs text-gray-500 block">
            Ghi chú:
          </span>
          {item.note}
        </div>
      )}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            item.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {item.isActive ? "Đang kích hoạt" : "Ngưng kích hoạt"}
        </span>
        <span className="text-xs text-gray-400">
          Tạo ngày: {new Date(item.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </div>
    </div>
  );
};
