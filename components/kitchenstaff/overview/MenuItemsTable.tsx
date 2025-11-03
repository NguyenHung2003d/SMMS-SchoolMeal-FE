"use client";

import { foodData } from "@/data";
import { ArrowUpRight, AlertTriangle, Eye, Pencil } from "lucide-react";

export default function MenuItemsTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Món ăn cần chuẩn bị</h2>
          <button className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium">
            Xem tất cả
            <ArrowUpRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên món
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại bữa
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cảnh báo dị ứng
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiến độ
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {foodData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.ingredients.join(", ")}
                  </div>
                </td>
                <td className="py-4 px-6">{item.category}</td>
                <td className="py-4 px-6">
                  {item.allergies.length > 0 ? (
                    <div className="flex items-center">
                      <AlertTriangle
                        size={16}
                        className="text-orange-500 mr-1"
                      />
                      <span>{item.allergies.join(", ")}</span>
                    </div>
                  ) : (
                    <span className="text-green-500">Không</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-orange-500 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (item.prepared / item.needed) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      {item.prepared}/{item.needed}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-600">
                      <Eye size={18} />
                    </button>
                    <button className="p-1 text-orange-500 hover:text-orange-600">
                      <Pencil size={18} />
                    </button>
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
