"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  UtensilsCrossed,
  ChefHat,
  CalendarDays,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  DayMenuDto,
  FeedbackDto,
  WeekMenuDto,
  WeekOptionDto,
} from "@/types/parent";
import WeekSelector from "@/components/parents/menu/WeekSelector";
import DailyMenuCard from "@/components/parents/menu/DailyMenuCard";
import MealDetailModal from "@/components/parents/menu/MealDetailModal";

import { useSelectedStudent } from "@/context/SelectedChildContext";
import toast from "react-hot-toast";

export default function MenuAndFeedbackPage() {
  const { selectedStudent } = useSelectedStudent();

  const [myFeedbacks, setMyFeedbacks] = useState<FeedbackDto[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<WeekOptionDto[]>([]);
  const [selectedDateInWeek, setSelectedDateInWeek] = useState<string>("");

  const [menuData, setMenuData] = useState<WeekMenuDto | null>(null);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DayMenuDto | null>(null);

  const fetchMyFeedbacks = useCallback(async () => {
    try {
      const res = await axiosInstance.get<FeedbackDto[]>(
        "/ParentFeedback/my-feedbacks"
      );
      setMyFeedbacks(res.data);
    } catch (error) {
      console.error("Lỗi tải lịch sử đánh giá:", error);
    }
  }, []);

  useEffect(() => {
    fetchMyFeedbacks();
  }, [fetchMyFeedbacks]);

  useEffect(() => {
    if (!selectedStudent?.studentId) return;
    const fetchWeeks = async () => {
      try {
        const res = await axiosInstance.get<WeekOptionDto[]>(
          `/weekly-menu/available-weeks`,
          { params: { studentId: selectedStudent.studentId } }
        );

        setAvailableWeeks(res.data);
      } catch (error) {
        console.error("Lỗi tải tuần:", error);
      }
    };
    fetchWeeks();
  }, [selectedStudent?.studentId]);

  useEffect(() => {
    if (!selectedStudent?.studentId || !selectedDateInWeek) return;
    const fetchMenu = async () => {
      setLoadingMenu(true);
      setSelectedMeal(null);
      try {
        const dateParam = selectedDateInWeek.includes("T")
          ? selectedDateInWeek.split("T")[0]
          : selectedDateInWeek;

        const res = await axiosInstance.get<WeekMenuDto>(
          "/weekly-menu/week-menu",
          {
            params: {
              studentId: selectedStudent.studentId,
              date: dateParam,
            },
          }
        );

        setMenuData(res.data);
      } catch (error) {
        console.error("Lỗi tải menu:", error);
        setMenuData(null);
        toast.error("Không thể tải thực đơn cho tuần này");
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [selectedStudent?.studentId, selectedDateInWeek]);

  const calendarDays = useMemo(() => {
    if (!menuData) return [];

    console.log(
      "LOG 3: Bắt đầu tính CalendarDays từ:",
      menuData.weekStart,
      "đến",
      menuData.weekEnd
    );

    const start = new Date(menuData.weekStart);
    const end = new Date(menuData.weekEnd);
    const days: string[] = [];

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      days.push(`${year}-${month}-${day}`);
    }

    return days;
  }, [menuData]);

  const mealsByDate = useMemo(() => {
    const rawDays = menuData?.days || (menuData as any)?.Days || [];

    if (!rawDays || rawDays.length === 0) {
      return {};
    }
    const map: Record<string, DayMenuDto[]> = {};

    rawDays.forEach((dayMenu: any) => {
      const rawDate = dayMenu.mealDate || dayMenu.MealDate;
      if (!rawDate) {
        return;
      }

      const dateKey = rawDate.split("T")[0];

      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(dayMenu);
    });

    return map;
  }, [menuData]);

  const existingFeedback = useMemo(() => {
    if (!selectedMeal) return null;
    return (
      myFeedbacks.find((f) => f.dailyMealId === selectedMeal.dailyMealId) ||
      null
    );
  }, [selectedMeal, myFeedbacks]);

  const handleOpenModal = (meal: DayMenuDto) => {
    setSelectedMeal(meal);
  };

  if (!selectedStudent)
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-xl border border-dashed border-gray-300 m-4">
        <div className="bg-orange-50 p-4 rounded-full mb-4">
          <ChefHat size={48} className="text-orange-400" />
        </div>
        <p className="text-gray-500 font-medium">
          Vui lòng chọn học sinh để xem thực đơn.
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl min-h-screen mx-auto pb-6">
      <div className="px-4 pt-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 rounded-xl text-orange-600 shadow-sm">
            <UtensilsCrossed size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Thực đơn dinh dưỡng
            </h2>
            <p className="text-sm text-gray-500">
              Theo dõi khẩu phần ăn hàng ngày của bé
            </p>
          </div>
        </div>

        <WeekSelector
          availableWeeks={availableWeeks}
          selectedDateInWeek={selectedDateInWeek}
          onSelectDate={setSelectedDateInWeek}
        />
      </div>

      <div className="px-4 mt-6">
        {loadingMenu ? (
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="text-gray-400 text-sm font-medium">
              Đang tải thực đơn...
            </p>
          </div>
        ) : !menuData || calendarDays.length === 0 ? (
          <div className="flex flex-col h-full items-center justify-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 py-10">
            <CalendarDays size={48} className="mb-2 opacity-50" />
            <p>Không có dữ liệu hiển thị cho tuần này.</p>
            {menuData && (
              <p className="text-xs text-red-400 mt-2">
                (Data loaded but calendarDays empty or mismatch)
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {calendarDays.map((date) => {
              const mealsInDay = mealsByDate[date] || [];

              if (mealsInDay.length === 0) return null;
              const allFoods = mealsInDay.flatMap(
                (m) => m.items || (m as any).Items || []
              );

              const primaryMealInfo = mealsInDay[0];

              const combinedMeal = {
                ...primaryMealInfo,
                foods: allFoods,
                items: allFoods,
              };

              const hasAllergyWarning = allFoods.some(
                (f: any) => f.isAllergenic || f.IsAllergenic
              );

              return (
                <div key={date} className="flex flex-col gap-4">
                  <div
                    key={
                      combinedMeal.dailyMealId ||
                      (combinedMeal as any).DailyMealId
                    }
                    className="relative"
                  >
                    {hasAllergyWarning && (
                      <div
                        className="absolute -top-2 -right-2 z-10 bg-red-100 text-red-600 p-1.5 rounded-full shadow-sm border border-red-200"
                        title="Có thành phần gây dị ứng!"
                      >
                        <AlertTriangle size={16} />
                      </div>
                    )}

                    <DailyMenuCard
                      date={date}
                      meal={combinedMeal}
                      onOpenModal={handleOpenModal}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedMeal && (
        <MealDetailModal
          selectedMeal={selectedMeal}
          existingFeedback={existingFeedback}
          onSuccess={fetchMyFeedbacks}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
}
