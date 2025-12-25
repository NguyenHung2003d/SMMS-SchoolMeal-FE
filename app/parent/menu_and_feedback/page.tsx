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
        const data = await menuService.getAllWeekMenus(
          selectedStudent.studentId
        );
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
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
                  <div className="flex items-center gap-3 px-6 py-2 bg-white rounded-full border border-orange-100 shadow-sm">
                    <CalendarDays size={18} className="text-orange-500" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700">
                        {new Date(week.weekStart).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                      <span className="text-gray-300 font-light">—</span>
                      <span className="text-sm font-bold text-gray-700">
                        {new Date(week.weekEnd).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {week.notes && (
                  <div className="flex items-center gap-2 text-blue-700 bg-blue-50/80 backdrop-blur-sm px-4 py-2 rounded-2xl text-xs border border-blue-100 shadow-sm self-start md:self-center">
                    <div className="p-1 bg-blue-500 rounded-full">
                      <AlertTriangle size={10} className="text-white" />
                    </div>
                    <span className="font-medium">Lưu ý: {week.notes}</span>
                  </div>
                )}

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
