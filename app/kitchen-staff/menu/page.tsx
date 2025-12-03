"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { format, parseISO, addDays, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { kitchenMenuService } from "@/services/kitchenMenu.service";
import { WeeklyScheduleDto } from "@/types/kitchen-menu";
import {
  DayMenuRow,
  WeeklyMenuTable,
} from "@/components/kitchenstaff/menu/WeeklyMenuTable";
import { WeeklyMenuHeader } from "@/components/kitchenstaff/menu/WeeklyMenuHeader";
import { WeeklyMenuNote } from "@/components/kitchenstaff/menu/WeeklyMenuNote";

export default function Menu() {
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());

  const [schedule, setSchedule] = useState<WeeklyScheduleDto | null>(null);
  const [tableData, setTableData] = useState<DayMenuRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await kitchenMenuService.getWeekMenuByDate(
          currentViewDate
        );
        setSchedule(data);

        if (data) {
          processTableData(data);
        } else {
          setTableData([]); 
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        setSchedule(null);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [currentViewDate]);

  const processTableData = (data: WeeklyScheduleDto) => {
    const sortedDailyMeals = [...data.dailyMeals].sort(
      (a, b) => new Date(a.mealDate).getTime() - new Date(b.mealDate).getTime()
    );

    const rows: DayMenuRow[] = sortedDailyMeals.map((meal) => {
      const main = meal.foodItems
        .filter((f) => f.isMainDish)
        .map((f) => f.foodName);

      const side = meal.foodItems
        .filter((f) => !f.isMainDish)
        .map((f) => f.foodName);

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
    const daysToAdd = direction === "next" ? 7 : -7;
    const newDate = addDays(currentViewDate, daysToAdd);
    setCurrentViewDate(newDate);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-10 flex flex-col justify-center items-center h-96 border border-gray-100">
        <Loader2 className="animate-spin text-orange-500 mb-4 h-10 w-10" />
        <span className="text-gray-500 font-medium">
          Đang tải dữ liệu thực đơn tuần...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <WeeklyMenuHeader
        currentSchedule={
          schedule || {
            weekStart: format(
              startOfWeek(currentViewDate, { weekStartsOn: 1 }),
              "yyyy-MM-dd"
            ),
            weekEnd: format(
              addDays(startOfWeek(currentViewDate, { weekStartsOn: 1 }), 6),
              "yyyy-MM-dd"
            ),
            weekNo: 0,
            yearNo: currentViewDate.getFullYear(),
            scheduleMealId: 0,
            status: "Unknown",
            dailyMeals: [],
          }
        }
        onPrev={() => handleNavigate("prev")}
        onNext={() => handleNavigate("next")}
        disablePrev={false}
        disableNext={false}
      />

      {!schedule && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-700 text-sm flex items-center justify-center">
          Chưa có kế hoạch thực đơn được tạo cho tuần này.
        </div>
      )}

      <WeeklyMenuTable data={tableData} />

      <WeeklyMenuNote note={schedule?.notes} />
    </div>
  );
}
