"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { parseISO } from "date-fns";
import { kitchenMenuService } from "@/services/kitchenMenu.service";
import { DailyMeal, MenuFoodItem, ScheduleMeal } from "@/types/kitchen-menu";
import { formatDateForInput, getDayName } from "@/helpers";
import {
  DayMenuRow,
  WeeklyMenuTable,
} from "@/components/kitchenstaff/menu/WeeklyMenuTable";
import { WeeklyMenuHeader } from "@/components/kitchenstaff/menu/WeeklyMenuHeader";
import { WeeklyMenuNote } from "@/components/kitchenstaff/menu/WeeklyMenuNote";

export default function UpcomingMenu() {
  const [schedules, setSchedules] = useState<ScheduleMeal[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [tableData, setTableData] = useState<DayMenuRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Gọi song song các API
        const [schedulesRes, dailyMealsRes, menuItemsRes] = await Promise.all([
          kitchenMenuService.getScheduleMeals(),
          kitchenMenuService.getAllDailyMeals(),
          kitchenMenuService.getMenuFoodItems(),
        ]);

        // 1. Sắp xếp lịch theo ngày bắt đầu
        const sortedSchedules = schedulesRes.sort(
          (a, b) =>
            new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime()
        );
        setSchedules(sortedSchedules);

        // 2. Tìm lịch cho tuần hiện tại
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        let activeIndex = sortedSchedules.findIndex((s) => {
          const start = new Date(s.weekStart);
          const end = new Date(s.weekEnd);
          return start <= now && end >= now;
        });

        // Nếu không có tuần hiện tại, lấy tuần kế tiếp gần nhất
        if (activeIndex === -1) {
          activeIndex = sortedSchedules.findIndex(
            (s) => new Date(s.weekStart) > now
          );
        }

        // Mặc định hiển thị tuần cuối cùng nếu không tìm thấy
        const targetIndex =
          activeIndex >= 0 ? activeIndex : sortedSchedules.length - 1;

        setCurrentIdx(targetIndex);

        // 3. Xử lý dữ liệu hiển thị cho bảng
        if (sortedSchedules.length > 0) {
          processTableData(
            sortedSchedules[targetIndex],
            dailyMealsRes,
            menuItemsRes
          );
        }

        // Cache dữ liệu vào window để dùng khi chuyển trang (prev/next)
        window.cachedDailyMeals = dailyMealsRes;
        window.cachedMenuItems = menuItemsRes;
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Logic Xử lý dữ liệu bảng ---
  const processTableData = (
    schedule: ScheduleMeal,
    allDailyMeals: DailyMeal[],
    allMenuItems: MenuFoodItem[]
  ) => {
    if (!schedule) return;

    // Lọc các bữa ăn thuộc schedule hiện tại
    const weekMeals = allDailyMeals.filter(
      (d) => d.scheduleMealId === schedule.scheduleMealId
    );

    // Sắp xếp bữa ăn theo ngày
    weekMeals.sort(
      (a, b) => new Date(a.mealDate).getTime() - new Date(b.mealDate).getTime()
    );

    const rows: DayMenuRow[] = weekMeals.map((meal) => {
      // Lấy danh sách món ăn của bữa này
      const itemsOfDate = allMenuItems.filter(
        (i) => i.dailyMealId === meal.dailyMealId
      );

      // Phân loại món chính/phụ
      const main = itemsOfDate
        .filter((i) => i.food?.isMainDish === true)
        .map((i) => i.food?.foodName || "Món chưa đặt tên");

      const side = itemsOfDate
        .filter((i) => i.food?.isMainDish === false)
        .map((i) => i.food?.foodName || "Món chưa đặt tên");

      return {
        dateObj: parseISO(meal.mealDate),
        dateStr: formatDateForInput(meal.mealDate),
        dayName: getDayName(meal.mealDate),
        dailyMealId: meal.dailyMealId,
        mainDishes: main,
        sideDishes: side,
      };
    });

    setTableData(rows);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    let newIndex = currentIdx;
    if (direction === "prev") {
      if (currentIdx > 0) newIndex = currentIdx - 1;
    } else {
      if (currentIdx < schedules.length - 1) newIndex = currentIdx + 1;
    }

    if (newIndex !== currentIdx) {
      setCurrentIdx(newIndex);
      // Lấy dữ liệu từ cache để không phải gọi lại API
      const cachedDaily = window.cachedDailyMeals;
      const cachedMenu = window.cachedMenuItems;

      if (schedules[newIndex] && cachedDaily && cachedMenu) {
        processTableData(schedules[newIndex], cachedDaily, cachedMenu);
      }
    }
  };

  const currentSchedule = schedules[currentIdx];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-10 flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-orange-500 mr-2" />
        <span className="text-gray-500">Đang tải dữ liệu thực đơn...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <WeeklyMenuHeader
        currentSchedule={currentSchedule}
        onPrev={() => handleNavigate("prev")}
        onNext={() => handleNavigate("next")}
        disablePrev={currentIdx === 0}
        disableNext={currentIdx === schedules.length - 1}
      />

      <WeeklyMenuTable data={tableData} />

      <WeeklyMenuNote note={currentSchedule?.notes} />
    </div>
  );
}
