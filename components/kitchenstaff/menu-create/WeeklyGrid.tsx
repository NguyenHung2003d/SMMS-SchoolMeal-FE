import React from "react";
import { Plus, X, Coffee, Utensils, Moon } from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { FoodItemDto } from "@/types/kitchen-menu-create";
import { DAYS_OF_WEEK, MEAL_TYPES } from "@/constants";

interface WeeklyGridProps {
  gridData: Record<string, FoodItemDto[]>;
  onRemoveDish: (day: number, mealType: string, foodId: number) => void;
  onOpenManualAdd: (day: number, mealType: string) => void;
  offDates: string[]; // Danh sách các ngày nghỉ "yyyy-MM-dd"
  weekStart: string; // Ngày bắt đầu tuần "yyyy-MM-dd"
}

export default function WeeklyGrid({
  gridData,
  onRemoveDish,
  onOpenManualAdd,
  offDates,
  weekStart,
}: WeeklyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {DAYS_OF_WEEK.map((day) => {
        const currentDateStr = format(
          addDays(parseISO(weekStart), day.value - 2),
          "yyyy-MM-dd"
        );

        const isOffDay = offDates.some((d) => d.startsWith(currentDateStr));
        return (
          <div
            key={day.value}
            className={`flex flex-col gap-3 transition-all duration-300 ${
              isOffDay ? "opacity-60" : ""
            }`}
          >
            <div
              className={`text-center p-3 rounded-lg border shadow-sm font-bold flex flex-col items-center justify-center gap-1 ${
                isOffDay
                  ? "bg-gray-100 border-gray-300 text-gray-400"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <span>{day.label}</span>
              {isOffDay && (
                <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Moon size={10} /> NGÀY NGHỈ
                </span>
              )}
            </div>

            {MEAL_TYPES.map((meal) => {
              const key = `${day.value}_${meal.key}`;
              const items = gridData[key] || [];

              return (
                <div
                  key={meal.key}
                  className={`relative p-3 rounded-lg border min-h-[140px] flex flex-col group transition-all ${
                    isOffDay
                      ? "bg-gray-50/50 border-gray-200 border-l-4 border-l-gray-300"
                      : meal.key === "Lunch"
                      ? "bg-white border-gray-200 border-l-4 border-l-orange-400 hover:shadow-md"
                      : "bg-white border-gray-200 border-l-4 border-l-green-400 hover:shadow-md"
                  }`}
                >
                  {isOffDay && (
                    <div
                      className="absolute inset-0 z-10 cursor-not-allowed"
                      title="Ngày nghỉ không được chọn món"
                    />
                  )}

                  <div className="flex justify-between items-center mb-2">
                    <div
                      className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                        isOffDay ? "text-gray-300" : "text-gray-400"
                      }`}
                    >
                      {meal.key === "Lunch" ? (
                        <Utensils size={12} />
                      ) : (
                        <Coffee size={12} />
                      )}
                      {meal.label}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 mb-2">
                    {items.map((food, idx) => (
                      <div
                        key={`${key}_${food.foodId}_${idx}`}
                        className="flex justify-between bg-gray-50 p-1.5 rounded text-sm group/item border border-gray-100"
                      >
                        <span className="text-gray-700 truncate text-xs font-medium">
                          {food.foodName}
                        </span>
                        {!isOffDay && (
                          <button
                            onClick={() =>
                              onRemoveDish(day.value, meal.key, food.foodId)
                            }
                            className="text-red-400 opacity-0 group-hover/item:opacity-100 hover:text-red-600 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}

                    {items.length === 0 && (
                      <div className="h-full flex items-center justify-center text-xs text-gray-300 italic pt-4">
                        {isOffDay ? "Nghỉ học" : "Trống"}
                      </div>
                    )}
                  </div>

                  {!isOffDay && (
                    <button
                      onClick={() => onOpenManualAdd(day.value, meal.key)}
                      className="mt-auto w-full py-1.5 border border-dashed rounded text-xs flex justify-center items-center gap-1 transition-all border-gray-300 text-gray-400 hover:text-orange-500 hover:bg-orange-50 hover:border-orange-300 cursor-pointer"
                    >
                      <Plus size={14} /> Thêm món
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
