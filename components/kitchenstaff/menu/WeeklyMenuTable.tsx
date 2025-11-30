import React from "react";
import { Utensils, Coffee, AlertCircle } from "lucide-react";

// Định nghĩa lại DayMenuRow ở đây hoặc import từ types chung
export interface DayMenuRow {
  dateObj: Date;
  dateStr: string;
  dayName: string;
  dailyMealId: number;
  mainDishes: string[];
  sideDishes: string[];
}

interface Props {
  data: DayMenuRow[];
}

export const WeeklyMenuTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-50/70 border-b border-orange-100">
            <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-1/5">
              Ngày trong tuần
            </th>
            <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-2/5">
              <div className="flex items-center">
                <Utensils size={16} className="mr-2" /> Món Chính
              </div>
            </th>
            <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-2/5">
              <div className="flex items-center">
                <Coffee size={16} className="mr-2" /> Tráng miệng / Phụ
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-8 text-center text-gray-400 italic">
                Tuần này chưa có món ăn nào được thiết lập.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.dailyMealId}
                className="hover:bg-orange-50/30 transition-colors"
              >
                <td className="py-5 px-6 align-top">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-lg capitalize">
                      {row.dayName}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {row.dateStr}
                    </span>
                  </div>
                </td>

                <td className="py-5 px-6 align-top">
                  {row.mainDishes.length > 0 ? (
                    <ul className="space-y-2">
                      {row.mainDishes.map((dish, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-gray-700 font-medium"
                        >
                          <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 mr-3 flex-shrink-0"></span>
                          {dish}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 text-sm italic flex items-center">
                      <AlertCircle size={14} className="mr-1" /> Chưa cập nhật
                    </span>
                  )}
                </td>

                <td className="py-5 px-6 align-top">
                  {row.sideDishes.length > 0 ? (
                    <ul className="space-y-2">
                      {row.sideDishes.map((dish, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-gray-600"
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3 flex-shrink-0"></span>
                          {dish}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 text-sm italic">--</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
