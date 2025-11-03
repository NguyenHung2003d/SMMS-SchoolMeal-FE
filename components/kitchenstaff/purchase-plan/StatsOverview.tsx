"use client";
import { ShoppingCart, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function StatsOverview({
  totalEstimatedCost,
  pendingCount,
  purchasedCount,
  outOfStockCount,
}: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Tổng chi phí */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Tổng chi phí ước tính
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {new Intl.NumberFormat("vi-VN").format(totalEstimatedCost)} VND
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Chưa bao gồm thuế & phí vận chuyển
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <ShoppingCart size={24} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Chưa mua */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Chưa mua</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {pendingCount} mặt hàng
            </h3>
            <p className="mt-2 text-sm flex items-center">
              <Clock size={14} className="text-orange-500 mr-1" /> Cần mua sớm
            </p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <Clock size={24} className="text-orange-500" />
          </div>
        </div>
      </div>

      {/* Đã mua */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Đã mua</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {purchasedCount} mặt hàng
            </h3>
            <p className="mt-2 text-sm flex items-center">
              <CheckCircle size={14} className="text-green-500 mr-1" /> Hoàn
              thành
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle size={24} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Hết hàng */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Hết hàng</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {outOfStockCount} mặt hàng
            </h3>
            <p className="mt-2 text-sm flex items-center">
              <AlertTriangle size={14} className="text-red-500 mr-1" /> Cần thay
              thế
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
