import React, { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { PurchasePlanLine } from "@/types/kitchen-purchasePlan";

interface PurchasePlanTableProps {
  lines: PurchasePlanLine[];
  isDraft: boolean;
  onUpdateLine: (index: number, field: string, value: string) => void;
  onDeleteLine: (index: number) => void;
}

export default function PurchasePlanTable({
  lines,
  isDraft,
  onUpdateLine,
  onDeleteLine,
}: PurchasePlanTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLines = lines.filter((item) =>
    item.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-700">Danh sách nguyên liệu</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-4 py-3 text-left w-1/4">Tên mặt hàng</th>
              <th className="px-4 py-3 text-center">SL (g)</th>
              <th className="px-4 py-3 text-right bg-green-50/50 text-green-700 w-40">
                Thành tiền (VNĐ)
              </th>
              <th className="px-4 py-3 text-left">Số lô (Batch)</th>
              <th className="px-4 py-3 text-left">Xuất xứ</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              {isDraft && <th className="px-4 py-3 text-center w-16"></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filteredLines.map((item, index) => {
               const realIndex = lines.indexOf(item);
               return (
              <tr
                key={realIndex} 
                className="hover:bg-orange-50/30 transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {item.ingredientName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.category || "Nguyên liệu"}
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-medium text-gray-700 bg-gray-50/30">
                  {item.rqQuanityGram}
                </td>

                <td className="px-4 py-3 text-right bg-green-50/20">
                  <input
                    type="number"
                    disabled={!isDraft}
                    className="w-full text-right font-bold text-green-700 bg-transparent border border-transparent hover:border-green-300 focus:border-green-500 rounded px-2 py-1 outline-none transition-all focus:bg-white placeholder-green-200"
                    value={item.actualPrice || ""}
                    placeholder="0"
                    onChange={(e) =>
                      onUpdateLine(realIndex, "actualPrice", e.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-3">
                  <input
                    type="text"
                    disabled={!isDraft}
                    className="w-full text-left bg-transparent border border-gray-200 rounded px-2 py-1 text-xs focus:border-orange-500 outline-none focus:bg-white"
                    placeholder="---"
                    value={item.batchNo || ""}
                    onChange={(e) =>
                      onUpdateLine(realIndex, "batchNo", e.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-3">
                  <input
                    type="text"
                    disabled={!isDraft}
                    className="w-full text-left bg-transparent border border-gray-200 rounded px-2 py-1 text-xs focus:border-orange-500 outline-none focus:bg-white"
                    placeholder="VN..."
                    value={item.origin || ""}
                    onChange={(e) =>
                      onUpdateLine(realIndex, "origin", e.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold border ${
                      item.status === "Purchased"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {item.status === "Purchased" ? "Đã nhập" : "Chờ"}
                  </span>
                </td>

                {isDraft && (
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onDeleteLine(realIndex)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {lines.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Chưa có nguyên liệu nào trong danh sách.
        </div>
      )}
    </div>
  );
}