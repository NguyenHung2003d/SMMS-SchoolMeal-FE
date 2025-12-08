"use client";
import React, { useState } from "react";
import { Plus, Save, Sparkles, Loader2, Calendar, X } from "lucide-react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  FoodItemDto,
  DailyMealRequestDto,
  AiDishDto,
} from "@/types/kitchen-menu-create";
import { kitchenMenuService } from "@/services/kitchenStaff/kitchenMenu.service";
import ManualDishModal from "@/components/kitchenstaff/menu-create/ManualDishModal";
import AiSuggestionModal from "@/components/kitchenstaff/menu-create/AiSuggestionModal";

const DAYS_OF_WEEK = [
  { value: 2, label: "Thứ 2" },
  { value: 3, label: "Thứ 3" },
  { value: 4, label: "Thứ 4" },
  { value: 5, label: "Thứ 5" },
  { value: 6, label: "Thứ 6" },
];

const MEAL_TYPES = [
  { key: "Lunch", label: "🍽️ Bữa Trưa" },
  { key: "SideDish", label: "🍎 Bữa Phụ" },
];

export default function KitchenStaffMenuCreationPage() {
  const router = useRouter();

  const [weekStart, setWeekStart] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [weekEnd, setWeekEnd] = useState(
    format(
      addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
      "yyyy-MM-dd"
    )
  );

  const [gridData, setGridData] = useState<Record<string, FoodItemDto[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [context, setContext] = useState<{ day: number; mealType: string }>({
    day: 2,
    mealType: "Lunch",
  });
  const [aiSelectedDay, setAiSelectedDay] = useState(2);

  const handleWeekStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      setWeekStart(val);
      setWeekEnd(format(addDays(parseISO(val), 6), "yyyy-MM-dd"));
    }
  };

  const openManualAdd = (day: number, mealType: string) => {
    setContext({ day, mealType });
    setIsManualModalOpen(true);
  };

  const addDishToGrid = (dish: FoodItemDto, day: number, mealType: string) => {
    const key = `${day}_${mealType}`;
    setGridData((prev) => {
      const existing = prev[key] || [];
      if (existing.find((x) => x.foodId === dish.foodId)) {
        toast.error("Món này đã có trong bữa ăn!");
        return prev;
      }
      return { ...prev, [key]: [...existing, dish] };
    });
    toast.success(`Đã thêm món vào Thứ ${day}`);
  };

  const handleManualSelect = (dish: FoodItemDto) => {
    addDishToGrid(dish, context.day, context.mealType);
  };

  const handleAiSelect = (dish: AiDishDto) => {
    const foodItem: FoodItemDto = {
      foodId: dish.food_id,
      foodName: dish.food_name,
      foodType: dish.is_main_dish ? "Món chính" : "Món phụ",
      imageUrl: "",
    };
    const targetMeal = dish.is_main_dish ? "Lunch" : "SideDish";
    addDishToGrid(foodItem, aiSelectedDay, targetMeal);
  };

  const removeDish = (day: number, mealType: string, foodId: number) => {
    const key = `${day}_${mealType}`;
    setGridData((prev) => ({
      ...prev,
      [key]: prev[key].filter((d) => d.foodId !== foodId),
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(gridData).length === 0)
      return toast.error("Thực đơn trống");
    setSubmitting(true);
    try {
      const startDate = parseISO(weekStart);
      const groupedMeals: Record<string, DailyMealRequestDto> = {};

      Object.entries(gridData).forEach(([key, foods]) => {
        if (!foods.length) return;
        const [dayStr, mealType] = key.split("_");
        const mealDateStr = format(
          addDays(startDate, parseInt(dayStr) - 2),
          "yyyy-MM-dd"
        );
        const groupKey = `${mealDateStr}_${mealType}`;

        if (!groupedMeals[groupKey]) {
          groupedMeals[groupKey] = {
            mealDate: mealDateStr,
            mealType,
            notes: "",
            foodIds: [],
          };
        }
        foods.forEach((f) => groupedMeals[groupKey].foodIds.push(f.foodId));
      });

      const res = await kitchenMenuService.createSchedule({
        weekStart,
        weekEnd,
        dailyMeals: Object.values(groupedMeals),
      });

      const id = res.scheduleMealId || res.data?.scheduleMealId;
      if (id) {
        await kitchenMenuService.createPurchasePlanFromSchedule(id);
        toast.success("Tạo kế hoạch thành công!");
        router.push("/kitchen-staff/purchase-plan");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Lỗi khi lưu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-32">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Lên thực đơn tuần</h1>
          <p className="text-sm text-gray-500">Chọn món ăn cho từng ngày</p>
        </div>
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium border border-purple-200"
        >
          <Sparkles size={18} /> AI Gợi ý & Thêm nhanh
        </button>
      </div>

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
                  <div className="flex-1 space-y-2">
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
                            removeDish(day.value, meal.key, food.foodId)
                          }
                          className="text-red-400 opacity-0 group-hover/item:opacity-100 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => openManualAdd(day.value, meal.key)}
                    className="mt-2 w-full py-1.5 border border-dashed border-gray-300 rounded text-gray-400 hover:text-orange-500 hover:bg-orange-50 text-xs flex justify-center items-center gap-1"
                  >
                    <Plus size={14} /> Thêm món
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 md:pl-72 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <span className="text-sm font-medium">Tuần bắt đầu (T2):</span>
              <input
                type="date"
                value={weekStart}
                onChange={handleWeekStartChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Kết thúc (CN):</span>
              <input
                type="date"
                value={weekEnd}
                disabled
                className="border border-gray-200 bg-gray-100 text-gray-500 rounded px-2 py-1 text-sm cursor-not-allowed"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Lưu & Tạo Kế Hoạch
          </button>
        </div>
      </div>

      <ManualDishModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        dayLabel={
          DAYS_OF_WEEK.find((d) => d.value === context.day)?.label || ""
        }
        mealType={context.mealType}
        onSelectDish={handleManualSelect}
      />

      <AiSuggestionModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectDish={handleAiSelect}
        daysOfWeek={DAYS_OF_WEEK}
        selectedDay={aiSelectedDay}
        onDayChange={setAiSelectedDay}
      />
    </div>
  );
}
