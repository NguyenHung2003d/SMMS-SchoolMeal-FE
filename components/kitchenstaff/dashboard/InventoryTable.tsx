import React from "react";
import { TriangleAlert } from "lucide-react";
import { format } from "date-fns";
import { InventoryAlertShortDto } from "@/types/kitchen-dashboard";
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
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 rounded-l-lg bg-gray-50">
                  Tên nguyên liệu
                </th>
                <th className="px-4 py-3 bg-gray-50">Số lượng</th>
                <th className="px-4 py-3 bg-gray-50">Hạn dùng</th>
                <th className="px-4 py-3 rounded-r-lg text-center bg-gray-50">
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
