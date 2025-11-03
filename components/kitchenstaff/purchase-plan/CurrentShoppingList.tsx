"use client";
import { Check, X, RefreshCw, MoreHorizontal } from "lucide-react";

export default function CurrentShoppingList({
  shoppingItems,
  handleStatusChange,
  setSelectedItem,
  setIsReplacementModalOpen,
}: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Tên mặt hàng
              </th>
              <th className="px-6 py-3">Danh mục</th>
              <th className="px-6 py-3">Số lượng</th>
              <th className="px-6 py-3">Nhà cung cấp</th>
              <th className="px-6 py-3">Chi phí</th>
              <th className="px-6 py-3">Mức độ ưu tiên</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shoppingItems.map((item: any) => (
              <tr
                key={item.id}
                className={item.status === "outOfStock" ? "bg-red-50" : ""}
              >
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-6 py-4">{item.supplier}</td>
                <td className="px-6 py-4">
                  {item.estimatedCost.toLocaleString("vi-VN")} VND
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.urgency === "high"
                        ? "bg-red-100 text-red-800"
                        : item.urgency === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.urgency === "high"
                      ? "Cao"
                      : item.urgency === "medium"
                      ? "Trung bình"
                      : "Thấp"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "purchased"
                        ? "bg-green-100 text-green-800"
                        : item.status === "outOfStock"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status === "purchased"
                      ? "Đã mua"
                      : item.status === "outOfStock"
                      ? "Hết hàng"
                      : "Chưa mua"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end space-x-2">
                  {item.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(item.id, "purchased")}
                        className="text-green-600"
                      >
                        <Check />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(item.id, "outOfStock")
                        }
                        className="text-red-600"
                      >
                        <X />
                      </button>
                    </>
                  )}
                  {item.status === "outOfStock" && (
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsReplacementModalOpen(true);
                      }}
                      className="text-blue-600"
                    >
                      <RefreshCw />
                    </button>
                  )}
                  <button className="text-gray-600">
                    <MoreHorizontal />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
