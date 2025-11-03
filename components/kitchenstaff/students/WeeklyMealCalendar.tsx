"use client";

import { Calendar } from "lucide-react";

export default function WeeklyMealCalendar() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium flex items-center">
          <Calendar className="mr-2" size={20} />
          Lịch bữa trưa tuần này
        </h2>
      </div>
      <div className="p-4">
        <div className="text-center p-12">
          <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Xem lịch bữa trưa đầy đủ</p>
          <button className="mt-2 text-orange-500 hover:text-orange-600 text-sm font-medium">
            Xem lịch
          </button>
        </div>
      </div>
    </div>
  );
}
