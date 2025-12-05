"use client";
import React, { useState, useEffect } from "react";
import {
  Utensils,
  Plus,
  Save,
  Sparkles,
  Search,
  X,
  Loader2,
  Calendar,
  ChevronRight,
  Filter,
} from "lucide-react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import toast from "react-hot-toast";
import {
  FoodItemDto,
  MenuTemplateDto,
  DailyMealRequestDto,
  AiMenuResponse,
  AiDishDto,
} from "@/types/kitchen-menu-create";
import { kitchenMenuService } from "@/services/kitchenMenu.service";
import { useRouter } from "next/navigation";

// --- CẤU HÌNH NGÀY & BỮA ---
const DAYS_OF_WEEK = [
  { value: 2, label: "Thứ 2" },
  { value: 3, label: "Thứ 3" },
  { value: 4, label: "Thứ 4" },
  { value: 5, label: "Thứ 5" },
  { value: 6, label: "Thứ 6" },
];

const MEAL_TYPES = [
  { key: "Lunch", label: "🍽️ Bữa Trưa" },
  { key: "SideDish", label: "🍎 Bữa Phụ" },
];

export default function KitchenStaffMenuCreationPage() {
  const [activeTab, setActiveTab] = useState<"manual" | "library">("manual");
  const router = useRouter();

  const [weekStart, setWeekStart] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [weekEnd, setWeekEnd] = useState(
    format(
      addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
      "yyyy-MM-dd"
    )
  );

  const [gridData, setGridData] = useState<Record<string, FoodItemDto[]>>({});
  const [foodLibrary, setFoodLibrary] = useState<FoodItemDto[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItemDto[]>([]);
  const [templates, setTemplates] = useState<MenuTemplateDto[]>([]);

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiMenuResponse | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Chỉ cần lưu DAY, không cần mealType nữa vì AI tự quyết định
  const [selectingContext, setSelectingContext] = useState<{
    day: number;
    mealType: string; // Vẫn giữ để dùng cho Manual Modal
  }>({ day: 2, mealType: "Lunch" });

  // State riêng cho AI Modal chỉ cần chọn Ngày
  const [aiSelectedDay, setAiSelectedDay] = useState<number>(2);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const foods = await kitchenMenuService.getFoodItems();
        setFoodLibrary(foods);
        setFilteredFoods(foods);
        const tmpls = await kitchenMenuService.getMenuTemplates();
        setTemplates(tmpls);
      } catch (error) {
        console.error("Init Error:", error);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (!searchTerm) setFilteredFoods(foodLibrary);
    else
      setFilteredFoods(
        foodLibrary.filter((f) =>
          f.foodName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  }, [searchTerm, foodLibrary]);

  const handleWeekStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startVal = e.target.value;
    if (startVal) {
      setWeekStart(startVal);
      const startDate = parseISO(startVal);
      const endDate = addDays(startDate, 6);
      setWeekEnd(format(endDate, "yyyy-MM-dd"));
    }
  };

  const openAddDish = (day: number, mealType: string) => {
    setSelectingContext({ day, mealType });
    setSearchTerm("");
    setIsDishModalOpen(true);
  };

  const addToGrid = (dish: FoodItemDto, day: number, mealType: string) => {
    const key = `${day}_${mealType}`;
    setGridData((prev) => {
      const existing = prev[key] || [];
      if (existing.find((x) => x.foodId === dish.foodId)) {
        toast.error("Món này đã có trong bữa ăn!");
        return prev;
      }
      return { ...prev, [key]: [...existing, dish] };
    });

    // Toast thông báo rõ ràng hơn
    const mealLabel = mealType === "Lunch" ? "Bữa Trưa" : "Bữa Phụ";
    toast.success(`Đã thêm "${dish.foodName}" vào Thứ ${day} (${mealLabel})`);
  };

  const handleSelectDish = (dish: FoodItemDto) => {
    addToGrid(dish, selectingContext.day, selectingContext.mealType);
  };

  const removeDish = (day: number, mealType: string, foodId: number) => {
    const key = `${day}_${mealType}`;
    setGridData((prev) => ({
      ...prev,
      [key]: prev[key].filter((d) => d.foodId !== foodId),
    }));
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const result = await kitchenMenuService.getAiSuggestion({
        maxMainKcal: 700,
        maxSideKcal: 300,
      });
      setAiResult(result);
      toast.success("AI đã đề xuất thực đơn!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi gọi AI Suggestion");
    } finally {
      setAiLoading(false);
    }
  };

  // --- LOGIC TỰ ĐỘNG CHỌN BỮA ---
  const handleSelectAiDish = (dish: AiDishDto) => {
    const foodItem: FoodItemDto = {
      foodId: dish.food_id,
      foodName: dish.food_name,
      foodType: dish.is_main_dish ? "Món chính" : "Món phụ",
      imageUrl: "",
    };

    // Logic quan trọng:
    // - Nếu là Món chính (is_main_dish = true) -> Chắc chắn vào Lunch
    // - Nếu là Món phụ (is_main_dish = false) -> Vào SideDish (Bữa Phụ)
    // (Bạn có thể tùy chỉnh logic này nếu muốn món phụ cũng vào Lunch)

    const targetMealType = dish.is_main_dish ? "Lunch" : "SideDish";

    // Sử dụng ngày đang chọn trong AI Modal
    addToGrid(foodItem, aiSelectedDay, targetMealType);
  };

  const handleSubmit = async () => {
    if (Object.keys(gridData).length === 0) {
      toast.error("Thực đơn đang trống");
      return;
    }
    setSubmitting(true);
    try {
      const startOfWeekDate = parseISO(weekStart);
      const groupedMeals: Record<string, DailyMealRequestDto> = {};

      Object.entries(gridData).forEach(([key, foods]) => {
        if (foods.length === 0) return;
        const [dayStr, mealType] = key.split("_");
        const dayOfWeek = parseInt(dayStr);
        const mealDateObj = addDays(startOfWeekDate, dayOfWeek - 2);
        const mealDateStr = format(mealDateObj, "yyyy-MM-dd");
        const groupKey = `${mealDateStr}_${mealType}`;

        if (!groupedMeals[groupKey]) {
          groupedMeals[groupKey] = {
            mealDate: mealDateStr,
            mealType: mealType,
            notes: "",
            foodIds: [],
          };
        }
        foods.forEach((f) => groupedMeals[groupKey].foodIds.push(f.foodId));
      });

      const payload = {
        weekStart: weekStart,
        weekEnd: weekEnd,
        dailyMeals: Object.values(groupedMeals),
      };

      const res = await kitchenMenuService.createSchedule(payload);
      const id = res.scheduleMealId || res.data?.scheduleMealId;

      if (id) {
        toast.success("Lưu thực đơn thành công!");
        await kitchenMenuService.createPurchasePlanFromSchedule(id);
        toast.success("Đã tạo kế hoạch đi chợ!");
        router.push("/kitchen-staff/purchase-plan");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Lỗi khi lưu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-32">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Lên thực đơn tuần</h1>
          <p className="text-sm text-gray-500">
            Chọn món ăn cho từng ngày trong tuần
          </p>
        </div>
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium transition-colors border border-purple-200"
        >
          <Sparkles size={18} /> AI Gợi ý & Thêm nhanh
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day.value} className="flex flex-col gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm font-bold text-gray-700">
              {day.label}
            </div>
            {MEAL_TYPES.map((meal) => {
              const key = `${day.value}_${meal.key}`;
              const items = gridData[key] || [];
              return (
                <div
                  key={meal.key}
                  className={`bg-white p-3 rounded-lg border border-gray-200 min-h-[140px] flex flex-col group hover:shadow-md transition-shadow ${
                    meal.key === "Lunch"
                      ? "border-l-4 border-l-orange-400"
                      : "border-l-4 border-l-green-400"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                      {meal.label}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {items.map((food, idx) => (
                      <div
                        key={`${key}_${food.foodId}_${idx}`}
                        className="flex justify-between bg-gray-50 p-1.5 rounded text-sm group/item border border-gray-100"
                      >
                        <span className="text-gray-700 truncate text-xs font-medium">
                          {food.foodName}
                        </span>
                        <button
                          onClick={() =>
                            removeDish(day.value, meal.key, food.foodId)
                          }
                          className="text-red-400 opacity-0 group-hover/item:opacity-100 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => openAddDish(day.value, meal.key)}
                    className="mt-2 w-full py-1.5 border border-dashed border-gray-300 rounded text-gray-400 hover:text-orange-500 hover:bg-orange-50 text-xs flex justify-center items-center gap-1"
                  >
                    <Plus size={14} /> Thêm món
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 md:pl-72 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <span className="text-sm font-medium">Tuần bắt đầu (T2):</span>
              <input
                type="date"
                value={weekStart}
                onChange={handleWeekStartChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Kết thúc (CN):</span>
              <input
                type="date"
                value={weekEnd}
                disabled
                className="border border-gray-200 bg-gray-100 text-gray-500 rounded px-2 py-1 text-sm cursor-not-allowed"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Lưu & Tạo Kế Hoạch
          </button>
        </div>
      </div>

      {/* Manual Dish Modal */}
      {isDishModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">
                Thêm món vào:{" "}
                <span className="text-orange-600">
                  {
                    DAYS_OF_WEEK.find((d) => d.value === selectingContext.day)
                      ?.label
                  }{" "}
                  -{" "}
                  {
                    MEAL_TYPES.find((m) => m.key === selectingContext.mealType)
                      ?.label
                  }
                </span>
              </h3>
              <button onClick={() => setIsDishModalOpen(false)}>
                <X />
              </button>
            </div>
            <div className="p-4 border-b bg-gray-50">
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:border-orange-500"
                  placeholder="Tìm tên món ăn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredFoods.map((food) => (
                <div
                  key={food.foodId}
                  onClick={() => handleSelectDish(food)}
                  className="border p-3 rounded-lg hover:border-orange-500 cursor-pointer flex flex-col gap-2 hover:bg-orange-50 transition-colors"
                >
                  <div className="h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                    {food.imageUrl ? (
                      <img
                        src={food.imageUrl}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <Utensils className="text-gray-400" />
                    )}
                    <div className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow-sm">
                      <Plus size={14} className="text-orange-500" />
                    </div>
                  </div>
                  <span className="font-medium text-sm text-gray-800 line-clamp-2">
                    {food.foodName}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestion Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Sparkles className="text-yellow-300" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI Trợ lý Thực đơn</h3>
                  <p className="text-purple-100 text-sm">
                    Gợi ý món ăn cân bằng dinh dưỡng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {/* AI Toolbar: CHỈ CÒN CHỌN NGÀY */}
            <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-4 flex-wrap">
              <span className="text-sm font-semibold text-purple-800">
                <Filter size={16} className="inline mr-1" />
                Đang chọn cho:
              </span>
              <select
                className="px-3 py-1.5 rounded-lg border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                value={aiSelectedDay} // Dùng state riêng cho AI
                onChange={(e) => setAiSelectedDay(Number(e.target.value))}
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>

              <div className="ml-auto text-xs text-purple-600 italic">
                * Bấm vào món để thêm tự động vào Bữa Trưa hoặc Bữa Phụ
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2
                    className="animate-spin text-purple-600 mb-4"
                    size={48}
                  />
                  <h4 className="text-lg font-semibold text-gray-700">
                    Đang phân tích dinh dưỡng...
                  </h4>
                </div>
              ) : !aiResult ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-6">
                    Bấm nút để AI đề xuất thực đơn tối ưu.
                  </p>
                  <button
                    onClick={handleAiSuggest}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700"
                  >
                    ✨ Tạo đề xuất ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Luôn hiện cả 2 danh sách */}

                  {/* Món Chính -> Auto vào Lunch */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                      Gợi ý Món Chính (Vào Bữa Trưa)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiResult.recommendedMain.map((dish) => (
                        <AiDishCard
                          key={dish.food_id}
                          dish={dish}
                          onSelect={handleSelectAiDish}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Món Phụ -> Auto vào SideDish */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                      Gợi ý Món Phụ (Vào Bữa Phụ)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiResult.recommendedSide.map((dish) => (
                        <AiDishCard
                          key={dish.food_id}
                          dish={dish}
                          onSelect={handleSelectAiDish}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AiDishCard({
  dish,
  onSelect,
}: {
  dish: AiDishDto;
  onSelect: (d: AiDishDto) => void;
}) {
  return (
    <div
      onClick={() => onSelect(dish)}
      className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group relative"
    >
      <div className="flex justify-between items-start">
        <span className="font-semibold text-gray-800 group-hover:text-purple-700">
          {dish.food_name}
        </span>
        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          {Math.round(dish.score * 100)}%
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        🔥 {dish.total_kcal} Kcal
      </div>
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-100 text-purple-700 p-1 rounded-full">
        <Plus size={16} />
      </div>
    </div>
  );
}
