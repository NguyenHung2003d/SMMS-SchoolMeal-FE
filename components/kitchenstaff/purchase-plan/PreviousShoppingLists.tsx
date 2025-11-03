"use client";
import { Eye, Download, Share2 } from "lucide-react";

export default function PreviousShoppingLists({ previousLists }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Ngày tạo</th>
              <th className="px-6 py-3">Số mặt hàng</th>
              <th className="px-6 py-3">Tổng chi phí</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {previousLists.map((list: any) => (
              <tr key={list.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">#{list.id}</td>
                <td className="px-6 py-4">{list.date}</td>
                <td className="px-6 py-4">{list.items} mặt hàng</td>
                <td className="px-6 py-4">{list.totalCost}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {list.status === "completed"
                      ? "Đã hoàn thành"
                      : "Đang xử lý"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex space-x-2 justify-end">
                  <button className="text-blue-600">
                    <Eye />
                  </button>
                  <button className="text-gray-600">
                    <Download />
                  </button>
                  <button className="text-gray-600">
                    <Share2 />
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
