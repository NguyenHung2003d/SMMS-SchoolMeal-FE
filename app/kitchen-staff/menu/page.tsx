"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { format, parseISO, startOfDay, isWithinInterval } from "date-fns";
import { vi } from "date-fns/locale";
import { kitchenMenuService } from "@/services/kitchenStaff/kitchenMenu.service";
import {
  DayMenuRow,
  DisplayFoodItem,
  WeeklyScheduleDto,
} from "@/types/kitchen-menu";
import { WeeklyMenuTable } from "@/components/kitchenstaff/menu/WeeklyMenuTable";
import { WeeklyMenuHeader } from "@/components/kitchenstaff/menu/WeeklyMenuHeader";
import { WeeklyMenuNote } from "@/components/kitchenstaff/menu/WeeklyMenuNote";

export default function Menu() {
  const [schedules, setSchedules] = useState<WeeklyScheduleDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [tableData, setTableData] = useState<DayMenuRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetfetchAllScheduleschMenu = async () => {
      try {
        setLoading(true);
        const data = await kitchenMenuService.getAllSchedules();
        if (data && data.length > 0) {
          const sortedData = [...data].sort(
            (a, b) =>
              new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime()
          );
          setSchedules(sortedData);
          const today = startOfDay(new Date());
          const currentWeekIndex = sortedData.findIndex((s) => {
            const start = parseISO(s.weekStart);
            const end = parseISO(s.weekEnd);
            end.setHours(23, 59, 59);
            return isWithinInterval(today, { start, end });
          });
          if (currentWeekIndex !== -1) {
            setCurrentIndex(currentWeekIndex);
          } else {
            setCurrentIndex(sortedData.length - 1);
          }
        } else {
          setSchedules([]);
          setCurrentIndex(-1);
        }
      } catch (error) {
        console.error("Error fetching menu schedules:", error);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetfetchAllScheduleschMenu();
  }, []);

  useEffect(() => {
    if (currentIndex >= 0 && schedules[currentIndex]) {
      processTableData(schedules[currentIndex]);
    } else {
      setTableData([]);
    }
  }, [currentIndex, schedules]);

  const processTableData = (data: WeeklyScheduleDto) => {
    const sortedDailyMeals = [...data.dailyMeals].sort(
      (a, b) => new Date(a.mealDate).getTime() - new Date(b.mealDate).getTime()
    );
    const mapToDisplayItem = (f: any): DisplayFoodItem => ({
      foodName: f.foodName,
      imageUrl: f.imageUrl || f.image || "",
      ingredientNames: Array.isArray(f.ingredients)
        ? f.ingredients.map((i: any) => (typeof i === "string" ? i : i.ingredientName))
        : [],
    });

    const rows: DayMenuRow[] = sortedDailyMeals.map((meal) => {
      const main = meal.foodItems
        .filter((f) => f.isMainDish)
        .map(mapToDisplayItem);
      const side = meal.foodItems
        .filter((f) => !f.isMainDish)
        .map(mapToDisplayItem);
      const dateObj = parseISO(meal.mealDate);
      return {
        dailyMealId: meal.dailyMealId,
        dateObj: dateObj,
        dateStr: format(dateObj, "dd/MM/yyyy"),
        dayName: format(dateObj, "EEEE", { locale: vi }),
        mainDishes: main,
        sideDishes: side,
      };
    });
    setTableData(rows);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "next" && currentIndex < schedules.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentSchedule = schedules[currentIndex];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-10 flex flex-col justify-center items-center h-96 border border-gray-100">
        <Loader2 className="animate-spin text-orange-500 mb-4 h-10 w-10" />
        <span className="text-gray-500 font-medium">
          Đang tải dữ liệu thực đơn...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <WeeklyMenuHeader
        currentSchedule={
          currentSchedule || {
            weekStart: format(new Date(), "yyyy-MM-dd"),
            weekEnd: format(new Date(), "yyyy-MM-dd"),
            weekNo: 0,
            yearNo: new Date().getFullYear(),
            scheduleMealId: 0,
            status: "Unknown",
            dailyMeals: [],
          }
        }
        onPrev={() => handleNavigate("prev")}
        onNext={() => handleNavigate("next")}
        disablePrev={currentIndex <= 0}
        disableNext={currentIndex >= schedules.length - 1}
      />

      {!currentSchedule && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-700 text-sm flex items-center justify-center">
          Chưa có thực đơn nào được tạo.
        </div>
      )}

      <WeeklyMenuTable data={tableData} />

      <WeeklyMenuNote note={currentSchedule?.notes} />
    </div>
  );
}
