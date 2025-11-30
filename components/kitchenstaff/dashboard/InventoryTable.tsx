import React from "react";
import { TriangleAlert } from "lucide-react";
import { format } from "date-fns";
import { InventoryAlertShortDto } from "@/types/kitchen-dashboard"; // Import type của bạn
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./EmptyState";

interface InventoryTableProps {
  items: InventoryAlertShortDto[];
}

export const InventoryTable = ({ items }: InventoryTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <TriangleAlert className="mr-2 text-red-500" size={20} />
        Cảnh báo Nguyên liệu & Kho
      </h3>
      {items.length === 0 ? (
        <EmptyState message="Kho hàng ổn định, không có cảnh báo." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Tên nguyên liệu</th>
                <th className="px-4 py-3">Số lượng</th>
                <th className="px-4 py-3">Hạn dùng</th>
                <th className="px-4 py-3 rounded-r-lg text-center">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr
                  key={item.itemId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.itemName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.quantityGram} g
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.expirationDate
                      ? format(new Date(item.expirationDate), "dd/MM/yyyy")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge type={item.alertType} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
