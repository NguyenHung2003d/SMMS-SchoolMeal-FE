import React from "react";
import { Plus, X } from "lucide-react";
import { FoodItemDto } from "@/types/kitchen-menu-create";
import { DAYS_OF_WEEK, MEAL_TYPES } from "@/constants";

interface WeeklyGridProps {
  gridData: Record<string, FoodItemDto[]>;
  onRemoveDish: (day: number, mealType: string, foodId: number) => void;
  onOpenManualAdd: (day: number, mealType: string) => void;
}

export default function WeeklyGrid({
  gridData,
  onRemoveDish,
  onOpenManualAdd,
}: WeeklyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {DAYS_OF_WEEK.map((day) => (
        <div key={day.value} className="flex flex-col gap-3">
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm font-bold text-gray-700">
            {day.label}
          </div>

          {MEAL_TYPES.map((meal) => {
            const key = `${day.value}_${meal.key}`;
            const items = gridData[key] || [];

            return (
              <div
                key={meal.key}
                className={`bg-white p-3 rounded-lg border border-gray-200 min-h-[140px] flex flex-col group hover:shadow-md transition-shadow ${
                  meal.key === "Lunch"
                    ? "border-l-4 border-l-orange-400"
                    : "border-l-4 border-l-green-400"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
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
                      <button
                        onClick={() =>
                          onRemoveDish(day.value, meal.key, food.foodId)
                        }
                        className="text-red-400 opacity-0 group-hover/item:opacity-100 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="h-full flex items-center justify-center text-xs text-gray-300 italic pt-4">
                      Chưa có món
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onOpenManualAdd(day.value, meal.key)}
                  className="mt-auto w-full py-1.5 border border-dashed rounded text-xs flex justify-center items-center gap-1 transition-all border-gray-300 text-gray-400 hover:text-orange-500 hover:bg-orange-50 hover:border-orange-300 cursor-pointer"
                >
                  <Plus size={14} /> Thêm món
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
