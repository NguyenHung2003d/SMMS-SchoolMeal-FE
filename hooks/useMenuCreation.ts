import { useState, useEffect } from "react";
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
import { kitchenMenuService } from "@/services/kitchenStaff/kitchenMenu.service";
import { FoodItemDto, DailyMealRequestDto } from "@/types/kitchen-menu-create";
import { DAYS_OF_WEEK, MEAL_TYPES } from "@/constants";

export const useMenuCreation = () => {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [weekEnd, setWeekEnd] = useState(
    format(addDays(parseISO(weekStart), 6), "yyyy-MM-dd")
  );
  const [offDates, setOffDates] = useState<string[]>([]);
  const [gridData, setGridData] = useState<Record<string, FoodItemDto[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isValid(parseISO(weekStart))) {
      setWeekEnd(format(addDays(parseISO(weekStart), 6), "yyyy-MM-dd"));
    }
  }, [weekStart]);

  useEffect(() => {
    const fetchOffDates = async () => {
      try {
        const res = await kitchenMenuService.checkOffDates(weekStart, weekEnd);
        const formatted = (res?.offDates || []).map((d: any) => {
          const target = typeof d === "object" ? d.date : d;
          return format(new Date(target.replace(" ", "T")), "yyyy-MM-dd");
        });
        setOffDates(formatted);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOffDates();
  }, [weekStart, weekEnd]);

  const isOffDay = (dayValue: number) => {
    const dateOfSlot = format(
      addDays(parseISO(weekStart), dayValue - 2),
      "yyyy-MM-dd"
    );
    return offDates.includes(dateOfSlot);
  };

  const addDishToGrid = (dish: FoodItemDto, day: number, mealType: string) => {
    if (isOffDay(day)) return toast.error("Ngày này học sinh nghỉ học!");
    const key = `${day}_${mealType}`;
    const current = gridData[key] || [];
    if (current.some((x) => x.foodId === dish.foodId))
      return toast.error("Món đã tồn tại!");

    setGridData((prev) => ({ ...prev, [key]: [...current, dish] }));
    toast.success(`Đã thêm vào Thứ ${day}`);
  };

  const removeDish = (day: number, mealType: string, foodId: number) => {
    const key = `${day}_${mealType}`;
    setGridData((prev) => ({
      ...prev,
      [key]: prev[key].filter((d) => d.foodId !== foodId),
    }));
  };

  const applyTemplate = (templateData: any) => {
    const newGrid = { ...gridData };
    templateData.days.forEach((item: any) => {
      if (!isOffDay(item.dayOfWeek)) {
        newGrid[`${item.dayOfWeek}_${item.mealType}`] = item.foodItems.map(
          (f: any) => ({
            foodId: f.foodId,
            foodName: f.foodName,
            imageUrl: f.imageUrl || "",
            foodType: f.foodType || (f.isMainDish ? "Món chính" : "Món phụ"),
          })
        );
      }
    });
    setGridData(newGrid);
    toast.success("Đã áp dụng menu mẫu!");
  };

  const submitMenu = async () => {
    const startDate = parseISO(weekStart);
    if (!isMonday(startDate)) return toast.error("Phải bắt đầu từ Thứ 2!");

    try {
      setSubmitting(true);
      const dailyMeals: DailyMealRequestDto[] = [];

      DAYS_OF_WEEK.forEach((day) => {
        if (isOffDay(day.value)) return;
        MEAL_TYPES.forEach((meal) => {
          const foods = gridData[`${day.value}_${meal.key}`] || [];
          if (foods.length > 0) {
            dailyMeals.push({
              mealDate: format(addDays(startDate, day.value - 2), "yyyy-MM-dd"),
              mealType: meal.key,
              notes: "",
              foodIds: foods.map((f) => f.foodId),
            });
          }
        });
      });

      if (dailyMeals.length === 0) return toast.error("Chưa có món ăn nào!");

      const res = await kitchenMenuService.createSchedule({
        weekStart,
        weekEnd,
        dailyMeals,
      });
      const scheduleId = res.scheduleMealId || res.data?.scheduleMealId;

      if (scheduleId) {
        await kitchenMenuService.createPurchasePlanFromSchedule(scheduleId);
        toast.success("Thành công!");
        router.push("/kitchen-staff/purchase-plan");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi hệ thống");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    weekStart,
    setWeekStart,
    weekEnd,
    offDates,
    gridData,
    submitting,
    isOffDay,
    addDishToGrid,
    removeDish,
    applyTemplate,
    submitMenu,
  };
};
