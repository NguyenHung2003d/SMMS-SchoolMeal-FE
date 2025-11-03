"use client";

import { Clock } from "lucide-react";

export default function MealSchedule({
  mealSchedule,
  selectedClass,
}: {
  mealSchedule: { time: string; class: string; students: number }[];
  selectedClass: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium flex items-center">
          <Clock className="mr-2" size={20} />
          Lịch bữa trưa hôm nay
        </h2>
      </div>
      <div className="p-4">
        {mealSchedule.map((schedule, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              index !== mealSchedule.length - 1 ? "mb-3" : ""
            } ${
              selectedClass === schedule.class
                ? "bg-orange-50 border border-orange-100"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Lớp {schedule.class}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Clock size={14} className="mr-1" />
                  {schedule.time}
                </div>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {schedule.students} học sinh
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
