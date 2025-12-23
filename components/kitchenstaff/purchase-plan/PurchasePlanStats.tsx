import React from "react";
import { Calculator, Package, Info } from "lucide-react";

interface StatsProps {
  totalCost: number;
  totalItems: number;
}

export default function PurchasePlanStats({
  totalCost,
  totalItems,
}: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 border-l-4 border-l-green-500 flex items-center gap-4">
        <div className="p-3 bg-green-50 rounded-lg text-green-600">
          <Calculator size={24} />
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tổng chi phí dự tính
          </div>
          <div className="text-xl font-bold text-gray-800">
            {new Intl.NumberFormat("vi-VN").format(totalCost)}
            <span className="text-sm font-normal text-gray-400 ml-1">đ</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 border-l-4 border-l-blue-500 flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
          <Package size={24} />
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Mặt hàng cần mua
          </div>
          <div className="text-xl font-bold text-gray-800">
            {totalItems}{" "}
            <span className="text-sm font-normal text-gray-400">loại</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100 border-l-4 border-l-orange-500 flex items-center gap-4">
        <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
          <Info size={24} />
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Số lượng đề xuất
          </div>
          <div className="text-xs text-orange-700 font-semibold italic leading-tight">
            Đã tự động tính toán dựa trên sĩ số thực tế và khấu trừ tồn kho hiện
            tại.
          </div>
        </div>
      </div>
    </div>
  );
}
