import React from "react";
import { Utensils, Coffee, AlertCircle } from "lucide-react";
export interface DayMenuRow {
  dailyMealId: number;
  dateStr: string;
  dayName: string;
  mainDishes: string[];
  sideDishes: string[];
}

interface Props {
  data: DayMenuRow[];
}

export const WeeklyMenuTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-50/80 border-b border-orange-100">
            <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-[20%]">
              Ngày trong tuần
            </th>
            <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-[40%]">
              <div className="flex items-center">
                <Utensils size={16} className="mr-2" /> Món Chính
              </div>
            </th>
            <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-[40%]">
              <div className="flex items-center">
                <Coffee size={16} className="mr-2" /> Tráng miệng / Phụ
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="py-12 text-center text-gray-400 italic"
              >
                <div className="flex flex-col items-center justify-center">
                  <Utensils size={48} className="mb-3 text-gray-200" />
                  Chưa có thực đơn cho tuần này.
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.dailyMealId}
                className="hover:bg-orange-50/30 transition-colors group"
              >
                <td className="py-5 px-6 align-top border-r border-dashed border-gray-100">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-lg capitalize group-hover:text-orange-600 transition-colors">
                      {row.dayName}
                    </span>
                    <span className="text-sm text-gray-500 font-medium mt-1">
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
                    <span className="text-gray-400 text-sm italic flex items-center bg-gray-50 px-3 py-1 rounded-full w-fit">
                      <AlertCircle size={14} className="mr-1" /> Chưa cập nhật
                    </span>
                  )}
                </td>

                <td className="py-5 px-6 align-top border-l border-dashed border-gray-100">
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
