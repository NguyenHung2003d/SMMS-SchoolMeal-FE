"use client";

import { dashboardStats } from "@/data";
import { Utensils, MessageCircle, AlertCircle, Package } from "lucide-react";

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {/* Tổng số bữa ăn */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 mb-1">Tổng số bữa ăn</p>
            <h3 className="text-3xl font-bold">{dashboardStats.totalMeals}</h3>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <Utensils size={24} className="text-orange-500" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <span className="text-green-500 font-medium">+12%</span> so với hôm
          qua
        </div>
      </div>

      {/* Yêu cầu đặc biệt */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 mb-1">Yêu cầu đặc biệt</p>
            <h3 className="text-3xl font-bold">
              {dashboardStats.specialRequests}
            </h3>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <MessageCircle size={24} className="text-blue-500" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <span className="text-orange-500 font-medium">+3</span> yêu cầu mới
        </div>
      </div>

      {/* Cảnh báo dị ứng */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 mb-1">Cảnh báo dị ứng</p>
            <h3 className="text-3xl font-bold">{dashboardStats.allergies}</h3>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertCircle size={24} className="text-red-500" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <span className="text-red-500 font-medium">Cần chú ý</span> cho bữa
          trưa
        </div>
      </div>

      {/* Tình trạng kho */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 mb-1">Tình trạng kho</p>
            <h3 className="text-3xl font-bold">{dashboardStats.inventory}%</h3>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Package size={24} className="text-green-500" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <span className="text-yellow-500 font-medium">3 mặt hàng</span> sắp
          hết
        </div>
      </div>
    </div>
  );
}
