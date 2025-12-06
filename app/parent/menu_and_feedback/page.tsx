"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelectedChild } from "@/context/SelectedChildContext";
import { CalendarDays, Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/axiosInstance";
import { DayMenuDto, WeekMenuDto, WeekOptionDto } from "@/types/parent";
import WeekSelector from "@/components/parents/menu/WeekSelector";
import DailyMenuCard from "@/components/parents/menu/DailyMenuCard";
import MealDetailModal from "@/components/parents/menu/MealDetailModal";

export default function MenuAndFeedbackPage() {
  const { selectedChild } = useSelectedChild();

  const [availableWeeks, setAvailableWeeks] = useState<WeekOptionDto[]>([]);
  const [selectedDateInWeek, setSelectedDateInWeek] = useState<string>("");
  const [menuData, setMenuData] = useState<WeekMenuDto | null>(null);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DayMenuDto | null>(null);

  useEffect(() => {
    if (!selectedChild?.studentId) return;
    const fetchWeeks = async () => {
      try {
        const res = await axiosInstance.get<WeekOptionDto[]>(
          `/weekly-menu/available-weeks`,
          { params: { studentId: selectedChild.studentId } }
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
  }, [selectedChild?.studentId]);

  useEffect(() => {
    if (!selectedChild?.studentId || !selectedDateInWeek) return;
    const fetchMenu = async () => {
      setLoadingMenu(true);
      setSelectedMeal(null);
      try {
        const dateParam = selectedDateInWeek.includes("T")
          ? selectedDateInWeek.split("T")[0]
          : selectedDateInWeek;
        console.log(">>> [FE Request] Gửi lên:", {
          studentId: selectedChild.studentId,
          date: dateParam,
        });
        const res = await axiosInstance.get<WeekMenuDto>(
          "/weekly-menu/week-menu",
          {
            params: {
              studentId: selectedChild.studentId,
              date: dateParam,
            },
          }
        );
        console.log(">>> [FE Response] Dữ liệu nhận về:", res.data);
        if (res.data && res.data.days) {
          console.log(">>> List Days:", res.data.days);
          res.data.days.forEach((d) =>
            console.log(`   Day: ${d.mealDate} - Type: ${d.mealType}`)
          );
        }
        setMenuData(res.data);
      } catch (error) {
        console.error("Lỗi tải menu:", error);
        setMenuData(null);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [selectedChild?.studentId, selectedDateInWeek]);

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

  if (!selectedChild)
    return (
      <div className="p-4 text-yellow-600 bg-yellow-50 rounded">
        Vui lòng chọn học sinh.
      </div>
    );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4 bg-gray-50">
      <div className="flex-none space-y-4 px-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarDays className="text-orange-500" size={28} />
          Thực đơn tuần
        </h2>
        <WeekSelector
          availableWeeks={availableWeeks}
          selectedDateInWeek={selectedDateInWeek}
          onSelectDate={setSelectedDateInWeek}
        />
      </div>

      <div className="flex-1 px-4 pb-4 overflow-auto">
        {loadingMenu ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : weekDays.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            Không có dữ liệu hiển thị.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
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
