import React from "react";

export default function PurchasePlanStats({ total }: { total: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500 flex flex-col justify-between">
        <div className="text-sm font-medium text-gray-500 mb-1">
          Tổng chi phí thực tế (Dự tính nhập)
        </div>
        <div className="text-3xl font-bold text-green-700">
          {new Intl.NumberFormat("vi-VN").format(total)}{" "}
          <span className="text-sm font-normal text-gray-500">vnđ</span>
        </div>
      </div>
    </div>
  );
}
