"use client";

import { Edit, Trash2 } from "lucide-react";

export default function InventoryTable({ items }: { items: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên nguyên liệu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạn sử dụng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cập nhật cuối</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4 text-gray-500">{item.category}</td>
                <td className="px-6 py-4">
                  {item.quantity} {item.unit}
                  <div className="text-xs text-gray-500">Tối thiểu: {item.minimumLevel} {item.unit}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 inline-flex text-xs rounded-full font-semibold
                    ${item.status === "Đầy đủ" ? "bg-green-100 text-green-800" :
                      item.status === "Thấp" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">{item.expiryDate}</td>
                <td className="px-6 py-4 text-gray-500">{item.lastUpdated}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                    <button className="p-1 text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
