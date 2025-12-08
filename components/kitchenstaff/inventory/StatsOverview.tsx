import React from "react";
import { Package, Clock } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { InventoryItemDto } from "@/types/kitchen-inventory";

interface StatsOverviewProps {
  totalCount: number;
  items: InventoryItemDto[];
}

export default function StatsOverview({
  totalCount,
  items,
}: StatsOverviewProps) {
  const expiringCount = items.filter(
    (i) =>
      i.expirationDate &&
      differenceInDays(parseISO(i.expirationDate), new Date()) <= 3
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Tổng mặt hàng
            </p>
            <h3 className="text-3xl font-bold text-gray-800">{totalCount}</h3>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Package size={24} className="text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Cảnh báo hết hạn (3 ngày)
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {expiringCount}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Trong trang này</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <Clock size={24} className="text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
