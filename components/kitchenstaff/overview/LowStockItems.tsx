"use client";

import { lowStockItems } from "@/data";
import { ChevronRight } from "lucide-react";

export default function LowStockItems() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold">Nguyên liệu sắp hết</h2>
      </div>
      <div className="p-4">
        {lowStockItems.map((item, index) => (
          <div
            key={index}
            className={`p-3 ${
              index !== lowStockItems.length - 1
                ? "border-b border-gray-100"
                : ""
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">{item.name}</p>
              <span className="text-sm text-red-500 font-medium">Thấp</span>
            </div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className={`h-2 rounded-full ${
                    item.current < item.minimum ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (item.current / item.minimum) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm whitespace-nowrap">
                {item.current}/{item.minimum} {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <button className="w-full py-2 text-orange-500 hover:text-orange-600 font-medium flex items-center justify-center">
          <span>Quản lý kho</span>
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
