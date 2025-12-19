"use client";
import React, { useState } from "react";
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
import HeaderControl from "@/components/kitchenstaff/menu-create/HeaderControl";
import MissingNotesModal from "@/components/kitchenstaff/menu-create/MissingNotesModal";
import WeeklyGrid from "@/components/kitchenstaff/menu-create/WeeklyGrid";
import { DAYS_OF_WEEK, MEAL_TYPES } from "@/constants";
import FooterControl from "@/components/kitchenstaff/menu-create/FooterControl";

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

    if (currentItems.some((x) => x.foodId === dish.foodId)) {
      toast.error("Món này đã có trong bữa ăn!", { id: `dup-${dish.foodId}` });
      return;
    }

    setGridData((prev) => ({ ...prev, [key]: [...currentItems, dish] }));
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

          if (mealItem.key === "SideDish" && !hasFood) continue;
          if (!hasFood && !rawNote.trim()) continue;

          dailyMealsPayload.push({
            mealDate: format(
              addDays(startDate, dayItem.value - 2),
              "yyyy-MM-dd"
            ),
            mealType: mealItem.key,
            notes: hasFood ? "" : rawNote.trim(),
            foodIds: hasFood ? foods.map((f) => f.foodId) : [],
          });
        }
      }

      if (dailyMealsPayload.length === 0) {
        toast.error("Chưa có dữ liệu bữa ăn nào để lưu!");
        setSubmitting(false);
        return;
      }

      const res = await kitchenMenuService.createSchedule({
        weekStart,
        weekEnd,
        dailyMeals: dailyMealsPayload,
      });

      if (res.scheduleMealId || res.data?.scheduleMealId) {
        await kitchenMenuService.createPurchasePlanFromSchedule(
          res.scheduleMealId || res.data?.scheduleMealId
        );
        toast.success("Tạo kế hoạch thành công!");
        setIsMissingNoteModalOpen(false);
        router.push("/kitchen-staff/purchase-plan");
      }
    } catch (e: any) {
      console.error(e);
      const errorMsg = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat()[0]
        : e.response?.data?.title || e.response?.data?.error || "Lỗi khi lưu!";
      toast.error(errorMsg as string);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const startDate = parseISO(weekStart);
    if (!isMonday(startDate))
      return toast.error("Vui lòng chọn ngày bắt đầu là Thứ 2!");

    const missing = DAYS_OF_WEEK.reduce((acc, dayItem) => {
      const mealKey = "Lunch";
      const key = `${dayItem.value}_${mealKey}`;
      const foods = gridData[key] || [];
      const savedNote = mealNotes[key] || "";

      if (foods.length === 0 && !savedNote.trim()) {
        acc.push({
          day: dayItem.value,
          meal: mealKey,
          label: `${dayItem.label} - Bữa Trưa`,
        });
      }
      return acc;
    }, [] as typeof missingSlots);

    if (missing.length > 0) {
      setMissingSlots(missing);
      setIsMissingNoteModalOpen(true);
      return;
    }

    await submitFinalData();
  };

  const handleConfirmMissingNotes = () => {
    const stillMissing = missingSlots.some(
      (s) => !mealNotes[`${s.day}_${s.meal}`]?.trim()
    );
    if (stillMissing) {
      toast.error("Vui lòng điền lý do cho tất cả các ngày nghỉ!");
      return;
    }
    submitFinalData();
  };

  const handleTemplateSelect = (templateData: any) => {
    if (templateData && Array.isArray(templateData.days)) {
      const newGridData = { ...gridData };
      templateData.days.forEach((dayItem: any) => {
        const { dayOfWeek, mealType, foodItems } = dayItem;
        if (dayOfWeek && mealType && foodItems?.length) {
          newGridData[`${dayOfWeek}_${mealType}`] = foodItems.map((f: any) => ({
            foodId: f.foodId,
            foodName: f.foodName,
            foodType: f.foodType || (f.isMainDish ? "Món chính" : "Món phụ"),
            imageUrl: f.imageUrl || "",
          }));
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
      <HeaderControl
        onOpenTemplate={() => setIsTemplateModalOpen(true)}
        onOpenAi={() => setIsAiModalOpen(true)}
      />

      <WeeklyGrid
        gridData={gridData}
        onRemoveDish={removeDish}
        onOpenManualAdd={openManualAdd}
      />

      <FooterControl
        weekStart={weekStart}
        weekEnd={weekEnd}
        submitting={submitting}
        onWeekStartChange={handleWeekStartChange}
        onSubmit={handleSubmit}
      />

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

      <MissingNotesModal
        isOpen={isMissingNoteModalOpen}
        onClose={() => setIsMissingNoteModalOpen(false)}
        missingSlots={missingSlots}
        mealNotes={mealNotes}
        onNoteChange={handleNoteChange}
        onConfirm={handleConfirmMissingNotes}
        submitting={submitting}
      />
    </div>
  );
}
