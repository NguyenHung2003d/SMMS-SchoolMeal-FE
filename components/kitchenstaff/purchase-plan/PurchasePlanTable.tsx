"use client";
import React, { useState } from "react";
import { Search, Trash2, Info, Package } from "lucide-react";
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
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-700">
            Chi tiết nguyên liệu đề xuất
          </h3>
          <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
            Tự động tính toán
          </span>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Tìm tên nguyên liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left w-1/4">Nguyên liệu</th>
              <th className="px-4 py-3 text-center text-blue-600 bg-blue-50/30">
                <div className="flex items-center justify-center gap-1">
                  <Package size={14} /> Cần mua (g)
                </div>
              </th>
              <th className="px-4 py-3 text-right bg-green-50/50 text-green-700 w-40">
                Giá nhập (VNĐ)
              </th>
              <th className="px-4 py-3 text-left">Số lô / Hạn dùng</th>
              <th className="px-4 py-3 text-left">Xuất xứ</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              {isDraft && <th className="px-4 py-3 text-center w-12"></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filteredLines.map((item, index) => {
              const realIndex = lines.indexOf(item);
              return (
                <tr
                  key={`${item.ingredientId}-${realIndex}`}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">
                      {item.ingredientName}
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Info size={10} />
                      {item.category || "Gia vị & Thực phẩm"}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold border border-blue-100">
                      {item.rqQuanityGram.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right bg-green-50/10">
                    <input
                      type="number"
                      disabled={!isDraft}
                      className="w-full text-right font-bold text-green-700 bg-transparent border-b border-transparent hover:border-green-300 focus:border-green-500 outline-none transition-all placeholder-green-200"
                      value={item.actualPrice || ""}
                      placeholder="Nhập giá..."
                      onChange={(e) =>
                        onUpdateLine(realIndex, "actualPrice", e.target.value)
                      }
                    />
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="text"
                      disabled={!isDraft}
                      className="w-full text-left bg-transparent border border-gray-100 rounded px-2 py-1 text-xs focus:border-orange-400 outline-none focus:bg-white"
                      placeholder="Batch-2024..."
                      value={item.batchNo || ""}
                      onChange={(e) =>
                        onUpdateLine(realIndex, "batchNo", e.target.value)
                      }
                    />
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    <input
                      type="text"
                      disabled={!isDraft}
                      className="w-full text-left bg-transparent border border-gray-100 rounded px-2 py-1 text-xs focus:border-orange-400 outline-none focus:bg-white"
                      placeholder="VietGAP..."
                      value={item.origin || ""}
                      onChange={(e) =>
                        onUpdateLine(realIndex, "origin", e.target.value)
                      }
                    />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === "Purchased"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}
                    >
                      {item.status === "Purchased" ? "● Đã nhập" : "○ Chờ nhập"}
                    </span>
                  </td>

                  {isDraft && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onDeleteLine(realIndex)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        title="Xóa dòng này"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredLines.length === 0 && (
        <div className="p-12 text-center flex flex-col items-center">
          <div className="bg-gray-100 p-3 rounded-full mb-3 text-gray-400">
            <Search size={24} />
          </div>
          <p className="text-gray-500 font-medium">
            Không tìm thấy nguyên liệu phù hợp
          </p>
        </div>
      )}
    </div>
  );
}
