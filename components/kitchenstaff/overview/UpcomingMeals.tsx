"use client";

import { upcomingMeals } from "@/data";
import { Calendar, Filter, Clock, ChevronRight } from "lucide-react";

export default function UpcomingMeals() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Bữa ăn hôm nay</h2>
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:text-orange-500">
              <Calendar size={18} />
            </button>
            <button className="text-gray-500 hover:text-orange-500">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {upcomingMeals.map((meal, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row md:items-center justify-between py-4 ${
              index !== upcomingMeals.length - 1
                ? "border-b border-gray-100"
                : ""
            }`}
          >
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <Clock size={18} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="font-medium">{meal.type}</h3>
                  <p className="text-sm text-gray-500">{meal.time}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8">
              <div>
                <p className="text-sm text-gray-500">Đăng ký</p>
                <p className="font-medium">{meal.registered} suất</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Đã chuẩn bị</p>
                <p className="font-medium">{meal.prepared} suất</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Yêu cầu đặc biệt</p>
                <p className="font-medium text-orange-500">
                  {meal.special} suất
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p
                  className={`font-medium ${
                    meal.status === "Đang chuẩn bị"
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {meal.status}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="flex items-center text-orange-500 hover:text-orange-600">
                <span className="mr-1">Chi tiết</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
