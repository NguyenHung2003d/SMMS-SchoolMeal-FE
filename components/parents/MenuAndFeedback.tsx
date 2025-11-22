"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectedChild } from "@/context/SelectedChildContext";
import {
  Loader2,
  MessageSquare,
  Utensils,
  CalendarDays,
  Send,
  AlertCircle,
  X,
  ChevronRight,
  Info,
} from "lucide-react";

import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { formatDateForInput, getDayName } from "@/helpers";
import Image from "next/image";
import { DayMenuDto, MenuFoodItemDto, WeekMenuDto, WeekOptionDto } from "@/types/parent";

export default function MenuAndFeedback() {
  const { selectedChild } = useSelectedChild();

  const [availableWeeks, setAvailableWeeks] = useState<WeekOptionDto[]>([]);
  const [selectedDateInWeek, setSelectedDateInWeek] = useState<string>("");
  const [menuData, setMenuData] = useState<WeekMenuDto | null>(null);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState<DayMenuDto | null>(null);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //fetch data tu
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
        const res = await axiosInstance.get<WeekMenuDto>(
          "/weekly-menu/week-menu",
          {
            params: {
              studentId: selectedChild.studentId,
              date: selectedDateInWeek,
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
    setFeedbackContent("");
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
  };

  //featch cái feedback
  const handleSubmitFeedback = async () => {
    if (!selectedMeal || !feedbackContent.trim()) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/ParentFeedback/create", {
        dailyMealId: selectedMeal.dailyMealId,
        content: feedbackContent,
      });
      toast.success("Gửi đánh giá thành công!");
      setFeedbackContent("");
      handleCloseModal();
    } catch (error) {
      toast.error("Gửi thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
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

        {availableWeeks.length > 0 ? (
          <Tabs
            value={selectedDateInWeek}
            onValueChange={setSelectedDateInWeek}
          >
            <TabsList className="w-full justify-start overflow-x-auto bg-white border p-1 h-auto scrollbar-hide">
              {availableWeeks.map((week) => (
                <TabsTrigger
                  key={week.scheduleMealId || week.ScheduleMealId}
                  value={week.weekStart}
                  className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 px-3 py-1.5 text-sm whitespace-nowrap"
                >
                  Tuần {week.weekNo}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <p className="text-gray-500 italic">Chưa có lịch thực đơn.</p>
        )}
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
              const foodsList = meal?.items || meal?.foods || [];
              const hasFood = meal && foodsList.length > 0;

              return (
                <div
                  key={date}
                  className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all h-fit"
                >
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 border-b border-orange-200">
                    <p className="font-bold text-orange-700 text-base">
                      {getDayName(date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDateForInput(date)}
                    </p>
                  </div>

                  <div className="flex-1 p-4 flex flex-col">
                    {hasFood ? (
                      <>
                        <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                          🍽️ Bữa Trưa
                        </p>
                        <div className="space-y-2 mb-4">
                          {foodsList.slice(0, 3).map((food: any) => (
                            <div
                              key={food.foodId || food.FoodId}
                              className="flex gap-2"
                            >
                              <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300 relative">
                                <Image
                                  src={
                                    food.imageUrl ||
                                    food.ImageUrl ||
                                    "/placeholder.png"
                                  }
                                  alt={food.foodName || food.FoodName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-700 line-clamp-2">
                                  {food.foodName || food.FoodName}
                                </p>
                              </div>
                            </div>
                          ))}
                          {foodsList.length > 3 && (
                            <p className="text-xs text-gray-500 italic pl-2">
                              +{foodsList.length - 3} món khác
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleOpenModal(meal)}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 rounded-lg font-medium mt-auto flex items-center justify-center gap-2 transition-all"
                        >
                          Xem chi tiết <ChevronRight size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-gray-400 text-center">
                        <p className="text-sm">Chưa cập nhật</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full h-[80vh] flex flex-col overflow-hidden">
            <div className="bg-white p-4 border-b flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {getDayName(
                  selectedMeal.mealDate ||
                    selectedMeal.MealDate ||
                    selectedMeal.date ||
                    ""
                )}
                <span className="text-gray-400 font-normal text-sm">
                  |{" "}
                  {formatDateForInput(
                    selectedMeal.mealDate ||
                      selectedMeal.MealDate ||
                      selectedMeal.date
                  )}
                </span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <Tabs
              defaultValue="info"
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="px-4 pt-2 border-b">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info" className="flex items-center gap-2">
                    <Info size={16} /> Chi tiết món
                  </TabsTrigger>
                  <TabsTrigger
                    value="feedback"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare size={16} /> Gửi góp ý
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="info"
                className="flex-1 overflow-hidden flex flex-col p-0 m-0 data-[state=active]:flex"
              >
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    {selectedMeal.foods && selectedMeal.foods.length > 0 ? (
                      selectedMeal.foods.map((food: MenuFoodItemDto) => (
                        <div
                          key={food.foodId || food.FoodId}
                          className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"
                        >
                          <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
                            <Image
                              src={
                                food.imageUrl ||
                                food.ImageUrl ||
                                "/placeholder.png"
                              }
                              alt={food.foodName || food.FoodName || "Food"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="font-bold text-gray-800 text-sm line-clamp-2">
                              {food.foodName || food.FoodName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {food.foodDesc ||
                                food.FoodDesc ||
                                "Món ăn dinh dưỡng cho bé"}
                            </p>
                            {(food.isAllergenic || food.IsAllergenic) && (
                              <span className="text-[10px] text-red-600 font-bold flex items-center gap-1 mt-2 bg-red-50 w-fit px-2 py-0.5 rounded-full">
                                <AlertCircle size={10} /> Dị ứng:{" "}
                                {food.allergenicNames?.join(", ") ||
                                  food.AllergenicNames?.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-400">
                        <Utensils
                          size={40}
                          className="mx-auto mb-2 opacity-20"
                        />
                        <p>Không có thông tin món ăn</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t bg-gray-50">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCloseModal}
                  >
                    Đóng
                  </Button>
                </div>
              </TabsContent>

              <TabsContent
                value="feedback"
                className="flex-1 overflow-hidden flex flex-col p-0 m-0 data-[state=active]:flex"
              >
                <ScrollArea className="flex-1">
                  <div className="p-4">
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-4">
                      <h4 className="text-orange-800 font-semibold text-sm mb-1 flex items-center gap-2">
                        <MessageSquare size={16} /> Góp ý của phụ huynh
                      </h4>
                      <p className="text-xs text-orange-600">
                        Ý kiến của quý phụ huynh giúp nhà trường cải thiện chất
                        lượng bữa ăn cho các bé.
                      </p>
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung góp ý:
                    </label>
                    <Textarea
                      placeholder="Ví dụ: Bé rất thích món gà hôm nay, nhưng canh hơi nhạt..."
                      value={feedbackContent}
                      onChange={(e) => setFeedbackContent(e.target.value)}
                      className="min-h-[200px] resize-none focus-visible:ring-orange-500 p-3 text-base"
                    />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t bg-white">
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-base shadow-lg shadow-orange-200"
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting || !feedbackContent.trim()}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-5 w-5" />
                    )}
                    Gửi phản hồi ngay
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
