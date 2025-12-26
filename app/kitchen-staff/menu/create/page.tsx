"use client";
import React, { useEffect, useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  parseISO,
  isMonday,
  isValid,
} from "date-fns";
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
import WeeklyGrid from "@/components/kitchenstaff/menu-create/WeeklyGrid";
import { DAYS_OF_WEEK, MEAL_TYPES } from "@/constants";
import FooterControl from "@/components/kitchenstaff/menu-create/FooterControl";

export default function KitchenStaffMenuCreationPage() {
  const router = useRouter();

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

  const [offDates, setOffDates] = useState<string[]>([]);
  const [gridData, setGridData] = useState<Record<string, FoodItemDto[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [context, setContext] = useState<{ day: number; mealType: string }>({
    day: 2,
    mealType: "Lunch",
  });
  const [aiSelectedDay, setAiSelectedDay] = useState(2);

  useEffect(() => {
    const fetchOffDates = async () => {
      try {
        const res = await kitchenMenuService.checkOffDates(weekStart, weekEnd);
        const rawDates = res?.offDates || [];

        const formattedDates = rawDates
          .map((dateItem: any) => {
            if (!dateItem) return null;

            const targetDate =
              typeof dateItem === "object" ? dateItem.date : dateItem;

            if (!targetDate) return null;

            const dateStr =
              typeof targetDate === "string"
                ? targetDate.replace(" ", "T")
                : targetDate;

            const parsed = new Date(dateStr);
            if (!isValid(parsed)) return null;

            return format(parsed, "yyyy-MM-dd HH:mm:ss");
          })
          .filter(Boolean) as string[];

        setOffDates(formattedDates);
      } catch (error) {
        console.error("Lỗi khi check ngày nghỉ:", error);
      }
    };
    fetchOffDates();
  }, [weekStart, weekEnd]);

  const isOffDay = (dayValue: number) => {
    if (!weekStart || offDates.length === 0) return false;

    const start = parseISO(weekStart);
    if (!isValid(start)) return false;

    const dateOfSlot = format(addDays(start, dayValue - 2), "yyyy-MM-dd");

    return offDates.some((offDate) => offDate.startsWith(dateOfSlot));
  };

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
  const openManualAdd = (day: number, mealType: string) => {
    setContext({ day, mealType });
    setIsManualModalOpen(true);
  };

  const addDishToGrid = (dish: FoodItemDto, day: number, mealType: string) => {
    if (isOffDay(day)) {
      toast.error("Không thể thêm món vào ngày nghỉ học!");
      return;
    }
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

  const handleSubmit = async () => {
    const startDate = parseISO(weekStart);
    if (!isMonday(startDate))
      return toast.error("Vui lòng chọn ngày bắt đầu là Thứ 2!");

    try {
      const dailyMealsPayload: DailyMealRequestDto[] = [];
      for (const dayItem of DAYS_OF_WEEK) {
        if (isOffDay(dayItem.value)) continue;
        for (const mealItem of MEAL_TYPES) {
          const key = `${dayItem.value}_${mealItem.key}`;
          const foods = gridData[key] || [];
          if (foods.length === 0) continue;

          dailyMealsPayload.push({
            mealDate: format(
              addDays(startDate, dayItem.value - 2),
              "yyyy-MM-dd"
            ),
            mealType: mealItem.key,
            notes: "",
            foodIds: foods.map((f) => f.foodId),
          });
        }
      }
      if (dailyMealsPayload.length === 0 && offDates.length < 5) {
        toast.error("Chưa có món ăn nào được chọn!");
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
        router.push("/kitchen-staff/purchase-plan");
      }
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;

        if (status === 400) {
          if (data.errors) {
            const validationErrors = Object.values(data.errors).flat();
            toast.error(validationErrors[0] as string);
          } else if (data.error) {
            toast.error(data.error);
          } else if (data.title) {
            toast.error(data.title);
          } else {
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
          }
        } else if (status >= 500) {
          toast.error("Lỗi hệ thống từ máy chủ. Vui lòng thử lại sau!");
        }
      } else if (error.request) {
        toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!");
      } else {
        toast.error("Đã có lỗi xảy ra: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTemplateSelect = (templateData: any) => {
    if (templateData && Array.isArray(templateData.days)) {
      const newGridData = { ...gridData };
      let skippedOffDays = false;

      templateData.days.forEach((dayItem: any) => {
        const { dayOfWeek, mealType, foodItems } = dayItem;

        if (isOffDay(dayOfWeek)) {
          skippedOffDays = true;
          return;
        }

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

      if (skippedOffDays) {
        toast.success("Đã điền menu mẫu (đã tự động bỏ qua các ngày nghỉ)");
      } else {
        toast.success("Đã điền menu mẫu vào lịch!");
      }
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
        offDates={offDates}
        weekStart={weekStart}
        onRemoveDish={removeDish}
        onOpenManualAdd={(day, meal) => {
          if (!isOffDay(day)) openManualAdd(day, meal);
        }}
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
    </div>
  );
}
