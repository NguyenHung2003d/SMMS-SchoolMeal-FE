"use client";
import React, { useState } from "react";
import { Plus, Save, Sparkles, Loader2, Calendar, X, Copy } from "lucide-react";
import { format, startOfWeek, addDays, parseISO, isMonday } from "date-fns";
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
import MenuTemplateModal from "@/components/kitchenstaff/menu/MenuTemplateModal";

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

  const [missingSlots, setMissingSlots] = useState<
    { day: number; meal: string; label: string }[]
  >([]);
  const [isMissingNoteModalOpen, setIsMissingNoteModalOpen] = useState(false);
  const [mealNotes, setMealNotes] = useState<Record<string, string>>({});

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
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
      const dateObj = parseISO(val);
      if (!isMonday(dateObj)) {
        toast("Lưu ý: Tuần học phải bắt đầu từ Thứ 2", { icon: "⚠️" });
      }
      setWeekStart(val);
      setWeekEnd(format(addDays(parseISO(val), 6), "yyyy-MM-dd"));
    }
  };

  const handleNoteChange = (day: number, mealType: string, note: string) => {
    const key = `${day}_${mealType}`;
    setMealNotes((pre) => ({ ...pre, [key]: note }));
  };

  const openManualAdd = (day: number, mealType: string) => {
    setContext({ day, mealType });
    setIsManualModalOpen(true);
  };

  const addDishToGrid = (dish: FoodItemDto, day: number, mealType: string) => {
    const key = `${day}_${mealType}`;
    const currentItems = gridData[key] || [];

    const isDuplicate = currentItems.some((x) => x.foodId === dish.foodId);
    if (isDuplicate) {
      toast.error("Món này đã có trong bữa ăn!", { id: `dup-${dish.foodId}` });
      return;
    }

    setGridData((prev) => {
      const existing = prev[key] || [];
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

  const submitFinalData = async () => {
    const startDate = parseISO(weekStart);
    setSubmitting(true);
    try {
      const dailyMealsPayload: DailyMealRequestDto[] = [];

      for (const dayItem of DAYS_OF_WEEK) {
        for (const mealItem of MEAL_TYPES) {
          const key = `${dayItem.value}_${mealItem.key}`;
          const foods = gridData[key] || [];
          const rawNote = mealNotes[key] || "";

          const hasFood = foods.length > 0;
          const finalNote = hasFood ? "" : rawNote.trim();
          const finalFoodIds = hasFood ? foods.map((f) => f.foodId) : [];

          dailyMealsPayload.push({
            mealDate: format(
              addDays(startDate, dayItem.value - 2),
              "yyyy-MM-dd"
            ),
            mealType: mealItem.key,
            notes: finalNote,
            foodIds: finalFoodIds,
          });
        }
      }

      const res = await kitchenMenuService.createSchedule({
        weekStart,
        weekEnd,
        dailyMeals: dailyMealsPayload,
      });

      const id = res.scheduleMealId || res.data?.scheduleMealId;
      if (id) {
        await kitchenMenuService.createPurchasePlanFromSchedule(id);
        toast.success("Tạo kế hoạch thành công!");
        setIsMissingNoteModalOpen(false);
        router.push("/kitchen-staff/purchase-plan");
      }
    } catch (e: any) {
      console.error(e);
      if (e.response?.data?.errors) {
        const errorMessages = Object.values(e.response.data.errors).flat();
        toast.error((errorMessages[0] as string) || "Dữ liệu không hợp lệ!");
      } else if (e.response?.data?.title) {
        toast.error(e.response.data.title);
      } else {
        toast.error(e.response?.data?.error || "Đã có lỗi xảy ra khi lưu!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const startDate = parseISO(weekStart);
    if (!isMonday(startDate))
      return toast.error("Vui lòng chọn ngày bắt đầu là Thứ 2!");

    const missing: { day: number; meal: string; label: string }[] = [];

    for (const dayItem of DAYS_OF_WEEK) {
      for (const mealItem of MEAL_TYPES) {
        const key = `${dayItem.value}_${mealItem.key}`;
        const foods = gridData[key] || [];
        const savedNote = mealNotes[key] || "";

        if (foods.length === 0 && !savedNote.trim()) {
          missing.push({
            day: dayItem.value,
            meal: mealItem.key,
            label: `${dayItem.label} - ${mealItem.label}`,
          });
        }
      }
    }

    if (missing.length > 0) {
      setMissingSlots(missing);
      setIsMissingNoteModalOpen(true);
      return;
    }

    await submitFinalData();
  };

  const handleTemplateSelect = (templateData: any) => {
    if (templateData && Array.isArray(templateData.days)) {
      const newGridData = { ...gridData };

      templateData.days.forEach((dayItem: any) => {
        const dayValue = dayItem.dayOfWeek;
        const mealType = dayItem.mealType;

        if (dayValue && mealType) {
          const gridKey = `${dayValue}_${mealType}`;
          const foods: FoodItemDto[] = (dayItem.foodItems || []).map(
            (f: any) => ({
              foodId: f.foodId,
              foodName: f.foodName,
              foodType: f.foodType || (f.isMainDish ? "Món chính" : "Món phụ"),
              imageUrl: f.imageUrl || "",
            })
          );

          if (foods.length > 0) {
            newGridData[gridKey] = foods;
          }
        }
      });

      setGridData(newGridData);
      toast.success("Đã điền menu mẫu vào lịch!");
    } else {
      toast.error("Dữ liệu menu mẫu không hợp lệ");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-32">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Lên thực đơn tuần</h1>
          <p className="text-sm text-gray-500">Chọn món ăn cho từng ngày</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium shadow-sm transition-colors"
          >
            <Copy size={18} /> Dùng menu mẫu
          </button>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium border border-purple-200"
          >
            <Sparkles size={18} /> AI Gợi ý & Thêm nhanh
          </button>
        </div>
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
              const noteContent = mealNotes[key] || "";
              const hasFood = items.length > 0;
              const hasNote = noteContent.trim().length > 0;

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

                  <div className="mb-2 mt-2">
                    <input
                      type="text"
                      placeholder={
                        hasFood ? "Đang có món" : "Nhập lý do nghỉ..."
                      }
                      value={noteContent}
                      onChange={(e) =>
                        handleNoteChange(day.value, meal.key, e.target.value)
                      }
                      disabled={hasFood}
                      className={`w-full text-xs border rounded px-2 py-1 outline-none transition-colors 
                        ${
                          hasFood
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : hasNote
                            ? "border-orange-300 bg-orange-50 text-gray-700"
                            : "border-gray-200 focus:border-orange-400"
                        }
                      `}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (hasNote) {
                        toast.error("Vui lòng xóa ghi chú trước khi thêm món!");
                        return;
                      }
                      openManualAdd(day.value, meal.key);
                    }}
                    disabled={hasNote}
                    className={`mt-auto w-full py-1.5 border border-dashed rounded text-xs flex justify-center items-center gap-1 transition-all
                      ${
                        hasNote
                          ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                          : "border-gray-300 text-gray-400 hover:text-orange-500 hover:bg-orange-50 hover:border-orange-300 cursor-pointer"
                      }
                    `}
                  >
                    {hasNote ? (
                      <>🚫 Đang là ngày nghỉ</>
                    ) : (
                      <>
                        <Plus size={14} /> Thêm món
                      </>
                    )}
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
            className="px-8 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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

      <MenuTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleTemplateSelect}
      />

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

      {isMissingNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 bg-orange-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  ⚠️ Xác nhận ngày nghỉ
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Các bữa ăn sau chưa có món. Vui lòng nhập lý do nghỉ (VD: Nghỉ
                  lễ).
                </p>
              </div>
              <button
                onClick={() => setIsMissingNoteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {missingSlots.map((slot, index) => {
                const key = `${slot.day}_${slot.meal}`;
                return (
                  <div key={index} className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">
                      {slot.label}
                    </label>
                    <input
                      type="text"
                      autoFocus={index === 0}
                      placeholder="VD: Nghỉ lễ, Tự túc, Họp hội đồng..."
                      value={mealNotes[key] || ""}
                      onChange={(e) =>
                        handleNoteChange(slot.day, slot.meal, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none w-full"
                    />
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsMissingNoteModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg text-sm"
              >
                Quay lại
              </button>
              <button
                onClick={() => {
                  const stillMissing = missingSlots.some(
                    (s) => !mealNotes[`${s.day}_${s.meal}`]?.trim()
                  );
                  if (stillMissing) {
                    toast.error(
                      "Vui lòng điền lý do cho tất cả các ngày nghỉ!"
                    );
                    return;
                  }
                  submitFinalData();
                }}
                disabled={submitting}
                className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg shadow hover:bg-orange-700 text-sm flex items-center gap-2 disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Lưu tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
