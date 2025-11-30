import React, { useState } from "react";
import {
  Utensils,
  CalendarDays,
  StickyNote,
  ChevronRight,
  X,
  Clock,
  FileText,
} from "lucide-react";
import { DailyMeal } from "@/types/kitchen-dashboard";

interface Props {
  meals: DailyMeal[];
}

export const UpcomingMeals: React.FC<Props> = ({ meals }) => {
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <CalendarDays size={20} className="mr-2 text-orange-500" />
            Kế hoạch nấu ăn (Daily Meals)
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {meals.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Utensils size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">Chưa có lịch nấu ăn nào.</p>
            </div>
          ) : (
            meals.map((meal) => (
              <div
                key={meal.dailyMealId}
                className="group border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-white relative"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start">
                    <div
                      className={`p-3 rounded-xl mr-4 shrink-0 ${
                        meal.mealType === "Bữa trưa"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <Utensils size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {meal.mealType}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <CalendarDays size={14} className="mr-1.5" />
                        {meal.mealDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 md:max-w-md">
                    {meal.notes ? (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                        <p className="text-xs font-bold text-yellow-700 mb-1 flex items-center uppercase tracking-wide">
                          <StickyNote size={12} className="mr-1.5" />
                          Ghi chú bếp
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {meal.notes}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400 text-sm italic h-full py-2">
                        Không có ghi chú đặc biệt
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center h-full">
                    <button
                      onClick={() => setSelectedMeal(meal)}
                      className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                      title="Xem chi tiết"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div
              className={`p-6 border-b flex justify-between items-start ${
                selectedMeal.mealType === "Bữa trưa"
                  ? "bg-orange-50 border-orange-100"
                  : "bg-purple-50 border-purple-100"
              }`}
            >
              <div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    selectedMeal.mealType === "Bữa trưa"
                      ? "bg-orange-200 text-orange-800"
                      : "bg-purple-200 text-purple-800"
                  }`}
                >
                  Chi tiết bữa ăn
                </span>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {selectedMeal.mealType}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMeal(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-white/50"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1 flex items-center">
                    <CalendarDays size={12} className="mr-1" /> Ngày
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedMeal.mealDate}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1 flex items-center">
                    <FileText size={12} className="mr-1" /> Mã ID
                  </p>
                  <p className="font-mono font-semibold text-gray-800">
                    #{selectedMeal.dailyMealId}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
                  <p className="text-xs text-gray-500 mb-1 flex items-center">
                    <Clock size={12} className="mr-1" /> Mã Lịch (Schedule ID)
                  </p>
                  <p className="font-mono font-semibold text-gray-800">
                    #{selectedMeal.scheduleMealId}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <StickyNote size={16} className="mr-2 text-orange-500" />
                  Ghi chú cho nhà bếp
                </h4>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                  {selectedMeal.notes ? (
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedMeal.notes}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      Không có ghi chú nào.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
              <button
                onClick={() => setSelectedMeal(null)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium shadow-sm transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
