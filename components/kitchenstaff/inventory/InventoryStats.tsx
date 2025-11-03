"use client";

import {
  Package,
  AlertTriangle,
  Clock,
  RefreshCw,
  ShoppingCart,
  ArrowUp,
} from "lucide-react";

export default function InventoryStats({
  items,
  orders,
  alerts,
}: {
  items: any[];
  orders: any[];
  alerts: any[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Tổng số nguyên liệu
            </p>
            <h3 className="text-3xl font-bold text-gray-800">{items.length}</h3>
            <p className="mt-2 text-sm flex items-center text-gray-500">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp size={14} className="mr-0.5" /> 2
              </span>
              từ tháng trước
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Package size={24} className="text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Nguyên liệu sắp hết
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {items.filter((i) => i.status === "Thấp").length}
            </h3>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <AlertTriangle size={24} className="text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Sắp hết hạn
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {alerts.length}
            </h3>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <Clock size={24} className="text-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Đơn đặt hàng
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {orders.length}
            </h3>
            <p className="mt-2 text-sm flex items-center text-gray-500">
              <RefreshCw size={14} className="mr-1 text-blue-500" /> Đang xử lý
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <ShoppingCart size={24} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
