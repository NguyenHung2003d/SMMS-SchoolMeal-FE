import React, { useState, useEffect } from "react";
import { X, Sparkles, Filter, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { AiMenuResponse, AiDishDto } from "@/types/kitchen-menu-create";
import { IngredientDto } from "@/types/kitchen-inventory";
import { kitchenInventoryService } from "@/services/kitchenStaff/kitchenInventory.service";
import { kitchenMenuService } from "@/services/kitchenStaff/kitchenMenu.service";
import IngredientSelector from "./IngredientSelector";
import AiDishCard from "./AiDishCard";

interface AiSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dish: AiDishDto) => void;
  daysOfWeek: { value: number; label: string }[];
  selectedDay: number;
  onDayChange: (day: number) => void;
}

export default function AiSuggestionModal({
  isOpen,
  onClose,
  onSelectDish,
  daysOfWeek,
  selectedDay,
  onDayChange,
}: AiSuggestionModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiMenuResponse | null>(null);

  const [mainIngs, setMainIngs] = useState<IngredientDto[]>([]);
  const [sideIngs, setSideIngs] = useState<IngredientDto[]>([]);
  const [mainSearch, setMainSearch] = useState("");
  const [sideSearch, setSideSearch] = useState("");
  const [mainSuggestions, setMainSuggestions] = useState<IngredientDto[]>([]);
  const [sideSuggestions, setSideSuggestions] = useState<IngredientDto[]>([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!mainSearch.trim()) return setMainSuggestions([]);
      try {
        const data = await kitchenInventoryService.getActiveIngredients(mainSearch);
        setMainSuggestions(data);
      } catch (e) {
        console.error(e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [mainSearch]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!sideSearch.trim()) return setSideSuggestions([]);
      try {
        const data = await kitchenInventoryService.getActiveIngredients(sideSearch);
        setSideSuggestions(data);
      } catch (e) {
        console.error(e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [sideSearch]);

  const handleAddIng = (type: "main" | "side", ing: IngredientDto) => {
    if (type === "main") {
      setMainIngs((prev) => [...prev, ing]);
      setMainSearch("");
      setMainSuggestions([]);
    } else {
      setSideIngs((prev) => [...prev, ing]);
      setSideSearch("");
      setSideSuggestions([]);
    }
  };

  const handleRemoveIng = (type: "main" | "side", id: number) => {
    if (type === "main") {
      setMainIngs((prev) => prev.filter((i) => i.ingredientId !== id));
    } else {
      setSideIngs((prev) => prev.filter((i) => i.ingredientId !== id));
    }
  };

  const handleAiSuggest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        maxMainKcal: 700,
        maxSideKcal: 300,
        mainIngredients: mainIngs.map((i) => i.ingredientId),
        sideIngredients: sideIngs.map((i) => i.ingredientId),
      };
      console.log("Payload gửi AI:", payload);
      const res = await kitchenMenuService.getAiSuggestion(payload);
      setResult(res);
      toast.success("AI đã đề xuất thực đơn!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi gọi AI Suggestion");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-blue-500 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="text-yellow-300" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Trợ lý Thực đơn</h3>
              <p className="text-purple-100 text-sm">Gợi ý món ăn theo nguyên liệu sẵn có</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-blue-800">
            <Filter size={16} className="inline mr-1" />
            Đang chọn cho:
          </span>
          <select
            className="px-3 py-1.5 rounded-lg border border-purple-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDay}
            onChange={(e) => onDayChange(Number(e.target.value))}
          >
            {daysOfWeek.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <div className="ml-auto text-xs text-blue-600 italic">* Bấm vào món để thêm tự động</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IngredientSelector
              label="Nguyên liệu Món Chính"
              type="main"
              searchTerm={mainSearch}
              setSearchTerm={setMainSearch}
              selected={mainIngs}
              suggestions={mainSuggestions}
              onAdd={handleAddIng}
              onRemove={handleRemoveIng}
            />
            <IngredientSelector
              label="Nguyên liệu Món Phụ"
              type="side"
              searchTerm={sideSearch}
              setSearchTerm={setSideSearch}
              selected={sideIngs}
              suggestions={sideSuggestions}
              onAdd={handleAddIng}
              onRemove={handleRemoveIng}
            />
          </div>

          {!result && !loading && (
            <div className="text-center mt-2">
              <button
                onClick={handleAiSuggest}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-blue-700 transition-all active:scale-95"
              >
                ✨ Phân tích & Gợi ý thực đơn
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-xl border border-dashed border-purple-200">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <h4 className="text-lg font-semibold text-gray-700">AI đang tính toán dinh dưỡng...</h4>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                  Gợi ý Món Chính (Vào Bữa Trưa)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.recommendedMain.map((dish) => (
                    <AiDishCard key={dish.food_id} dish={dish} onSelect={onSelectDish} />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                  Gợi ý Món Phụ (Vào Bữa Phụ)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.recommendedSide.map((dish) => (
                    <AiDishCard key={dish.food_id} dish={dish} onSelect={onSelectDish} />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                 <button onClick={handleAiSuggest} className="text-sm text-blue-600 underline hover:text-blue-800">
                    Thử lại với nguyên liệu khác
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}