import React from "react";
import { Edit, Trash2, Calendar, AlertCircle } from "lucide-react";
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
      className={`bg-white rounded-xl shadow-sm border p-5 transition-all hover:shadow-md ${
        !item.isActive ? "border-gray-200 bg-gray-50/50" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              Tháng {item.fromMonth}{" "}
              {item.fromMonth !== item.toMonth && `- ${item.toMonth}`}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                item.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {item.isActive ? "Đang hoạt động" : "Đã tắt"}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Sửa"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(item.settingId)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Mức thu phí</p>
        <p className="text-2xl font-bold text-gray-800">
          {formatCurrency(item.totalAmount)}
        </p>
      </div>

      {item.note && (
        <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
          <AlertCircle
            size={16}
            className="text-gray-400 mt-0.5 flex-shrink-0"
          />
          <p className="line-clamp-2">{item.note}</p>
        </div>
      )}
    </div>
  );
};
