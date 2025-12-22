"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  UtensilsCrossed,
  ChefHat,
  CalendarDays,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { DayMenuDto, FeedbackDto, WeekMenuDto } from "@/types/parent";
import DailyMenuCard from "@/components/parents/menu/DailyMenuCard";
import MealDetailModal from "@/components/parents/menu/MealDetailModal";
import { useSelectedStudent } from "@/context/SelectedChildContext";
import toast from "react-hot-toast";
import { menuService } from "@/services/parent/menu.service";

export default function MenuAndFeedbackPage() {
  const { selectedStudent } = useSelectedStudent();

  const [myFeedbacks, setMyFeedbacks] = useState<FeedbackDto[]>([]);
  const [allMenus, setAllMenus] = useState<WeekMenuDto[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DayMenuDto | null>(null);

  const fetchMyFeedbacks = useCallback(async () => {
    try {
      const data = await menuService.getMyFeedbacks();
      setMyFeedbacks(data);
    } catch (error) {
      console.error("Lỗi tải lịch sử đánh giá:", error);
    }
  }, []);

  useEffect(() => {
    fetchMyFeedbacks();
  }, [fetchMyFeedbacks]);

  useEffect(() => {
    if (!selectedStudent?.studentId) {
      setAllMenus([]);
      return;
    }

    const fetchAllMenus = async () => {
      setLoadingMenu(true);
      try {
        const data = await menuService.getAllWeekMenus(selectedStudent.studentId);
        setAllMenus(data);
      } catch (error) {
        console.error("Lỗi tải toàn bộ menu:", error);
        toast.error("Không thể tải danh sách thực đơn");
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchAllMenus();
  }, [selectedStudent?.studentId]);

  const existingFeedback = useMemo(() => {
    if (!selectedMeal) return null;
    return (
      myFeedbacks.find((f) => f.dailyMealId === selectedMeal.dailyMealId) ||
      null
    );
  }, [selectedMeal, myFeedbacks]);

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
              Toàn bộ lịch trình ăn uống của bé
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        {loadingMenu ? (
          <div className="flex flex-col h-[40vh] items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="text-gray-400 text-sm font-medium">
              Đang tải dữ liệu thực đơn...
            </p>
          </div>
        ) : allMenus.length === 0 ? (
          <div className="flex flex-col h-[40vh] items-center justify-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 py-10">
            <CalendarDays size={48} className="mb-2 opacity-50" />
            <p>Hiện chưa có thực đơn nào được công bố.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {allMenus.map((week) => (
              <section
                key={`${week.yearNo}-${week.weekNo}`}
                className="animate-in fade-in duration-500"
              >
                <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold">
                      Tuần {week.weekNo}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">
                        Năm học {week.yearNo}
                      </p>
                      <p className="text-xs text-gray-500">
                        Từ{" "}
                        {new Date(week.weekStart).toLocaleDateString("vi-VN")}{" "}
                        đến {new Date(week.weekEnd).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  {week.notes && (
                    <div className="hidden md:flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">
                      <AlertTriangle size={14} />
                      <span className="max-w-xs truncate">{week.notes}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {week.days.map((dayMenu) => {
                    const allFoods = dayMenu.items || [];
                    const hasAllergyWarning = allFoods.some(
                      (f: any) => f.isAllergenic
                    );

                    const combinedMeal = {
                      ...dayMenu,
                      foods: allFoods,
                    };

                    return (
                      <div key={dayMenu.dailyMealId} className="relative">
                        {hasAllergyWarning && (
                          <div className="absolute -top-2 -right-2 z-10 bg-red-100 text-red-600 p-1.5 rounded-full shadow-sm border border-red-200">
                            <AlertTriangle size={16} />
                          </div>
                        )}
                        <DailyMenuCard
                          date={dayMenu.mealDate.toString()}
                          meal={combinedMeal}
                          onOpenModal={setSelectedMeal}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
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
