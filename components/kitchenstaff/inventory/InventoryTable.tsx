import React from "react";
import { Edit, AlertTriangle, Loader2 } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { formatQuantity, getExpiryStatus } from "@/helpers";
import { InventoryItemDto } from "@/types/kitchen-inventory";

interface InventoryTableProps {
  loading: boolean;
  items: InventoryItemDto[];
  pageIndex: number;
  pageSize: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  onEdit: (item: InventoryItemDto) => void;
}

export default function InventoryTable({
  loading,
  items,
  pageIndex,
  pageSize,
  setPageIndex,
  onEdit,
}: InventoryTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm mb-6 p-12 text-center text-gray-500 flex justify-center items-center gap-2">
        <Loader2 className="animate-spin" /> Đang tải dữ liệu kho...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên nguyên liệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng tồn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hạn sử dụng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lô / Xuất xứ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {items.length > 0 ? (
              items.map((item) => {
                const expiry = getExpiryStatus(item.expirationDate);
                return (
                  <tr key={item.itemId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      #{item.itemId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {item.ingredientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-md font-medium ${
                          item.quantityGram < 1000
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {formatQuantity(item.quantityGram)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`flex items-center gap-1 ${expiry.color}`}
                      >
                        {expiry.label}
                        {item.expirationDate &&
                          differenceInDays(
                            parseISO(item.expirationDate),
                            new Date()
                          ) <= 3 && <AlertTriangle size={14} />}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      <div>Batch: {item.batchNo || "-"}</div>
                      <div>Origin: {item.origin || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 p-2 rounded transition-colors"
                        title="Cập nhật kho"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Kho trống
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
        <button
          disabled={pageIndex === 1}
          onClick={() => setPageIndex((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
        >
          Trước
        </button>
        <span className="px-3 py-1 text-sm flex items-center">
          Trang {pageIndex}
        </span>
        <button
          disabled={items.length < pageSize}
          onClick={() => setPageIndex((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
