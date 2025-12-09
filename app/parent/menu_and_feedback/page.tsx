"use client";

import React, { useEffect, useState, useMemo } from "react";
import { UtensilsCrossed, ChefHat, CalendarDays, Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/axiosInstance";
import { DayMenuDto, WeekMenuDto, WeekOptionDto } from "@/types/parent";
import WeekSelector from "@/components/parents/menu/WeekSelector";
import DailyMenuCard from "@/components/parents/menu/DailyMenuCard";
import MealDetailModal from "@/components/parents/menu/MealDetailModal";
import { useSelectedStudent } from "@/context/SelectedChildContext";

export default function MenuAndFeedbackPage() {
  const { selectedStudent } = useSelectedStudent();

  const [availableWeeks, setAvailableWeeks] = useState<WeekOptionDto[]>([]);
  const [selectedDateInWeek, setSelectedDateInWeek] = useState<string>("");
  const [menuData, setMenuData] = useState<WeekMenuDto | null>(null);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DayMenuDto | null>(null);

  useEffect(() => {
    if (!selectedStudent?.studentId) return;
    const fetchWeeks = async () => {
      try {
        const res = await axiosInstance.get<WeekOptionDto[]>(
          `/weekly-menu/available-weeks`,
          { params: { studentId: selectedStudent.studentId } }
        );
        setAvailableWeeks(res.data);
        if (res.data.length > 0) {
          const firstWeek = res.data[0];
          setSelectedDateInWeek(
            firstWeek.weekStart || firstWeek.WeekStart || ""
          );
        }
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
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [selectedStudent?.studentId, selectedDateInWeek]);

  const weekDays = useMemo(() => {
    if (!selectedDateInWeek) return [];
    const start = new Date(selectedDateInWeek);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  }, [selectedDateInWeek]);

  const mealsMap = useMemo(() => {
    if (!menuData?.days) return {};
    const daysList = menuData.days || menuData.Days || [];
    const map: Record<string, DayMenuDto> = {};

    daysList.forEach((d: any) => {
      const rawDate = d.mealDate || d.MealDate || d.date;
      const type = d.mealType || d.MealType;

      if (rawDate && (type === "Bữa Trưa" || type === "Lunch")) {
        const dateKey = rawDate.split("T")[0];
        map[dateKey] = d;
      }
    });
    return map;
  }, [menuData]);

  const handleOpenModal = (meal: any) => {
    const foodsList = meal?.items || meal?.foods || [];
    setSelectedMeal({ ...meal, foods: foodsList });
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
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-100px)] gap-6 pb-6">
      <div className="flex-none px-4 pt-2">
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

      <div className="flex-1 px-4 overflow-y-auto min-h-0 custom-scrollbar pb-10">
        {loadingMenu ? (
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="text-gray-400 text-sm font-medium">
              Đang tải thực đơn...
            </p>
          </div>
        ) : weekDays.length === 0 ? (
          <div className="flex flex-col h-full items-center justify-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <CalendarDays size={48} className="mb-2 opacity-50" />
            <p>Không có dữ liệu hiển thị cho tuần này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {weekDays.map((date) => {
              const meal = mealsMap[date];
              return (
                <DailyMenuCard
                  key={date}
                  date={date}
                  meal={meal}
                  onOpenModal={handleOpenModal}
                />
              );
            })}
          </div>
        )}
      </div>

      {selectedMeal && (
        <MealDetailModal
          selectedMeal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
}
