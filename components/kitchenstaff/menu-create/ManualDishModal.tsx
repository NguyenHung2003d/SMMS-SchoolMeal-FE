import React, { useState, useEffect } from "react";
import { Search, X, Loader2, Utensils, Plus } from "lucide-react";
import Image from "next/image";
import { FoodItemDto } from "@/types/kitchen-menu-create";
import { kitchenMenuService } from "@/services/kitchenStaff/kitchenMenu.service";
import toast from "react-hot-toast";

interface ManualDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayLabel: string;
  mealType: string;
  onSelectDish: (dish: FoodItemDto) => void;
}

export default function ManualDishModal({
  isOpen,
  onClose,
  dayLabel,
  mealType,
  onSelectDish,
}: ManualDishModalProps) {
  const [foods, setFoods] = useState<FoodItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchFoods = async () => {
      setLoading(true);
      try {
        const isMainDish = mealType === "Lunch";
        const data = await kitchenMenuService.getFoodItemsByMainDish(
          isMainDish,
          searchTerm
        );
        setFoods(data);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi tải danh sách món ăn");
      } finally {
        setLoading(false);
      }
    };

    // Debounce initial and search calls
    const timer = setTimeout(() => fetchFoods(), 300);
    return () => clearTimeout(timer);
  }, [isOpen, searchTerm, mealType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">
            Thêm món vào:{" "}
            <span className="text-orange-600">
              {dayLabel} - {mealType === "Lunch" ? "Bữa Trưa" : "Bữa Phụ"}
            </span>
            <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {mealType === "Lunch" ? "Chỉ hiện món chính" : "Chỉ hiện món phụ"}
            </span>
          </h3>
          <button onClick={onClose}>
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

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Loader2
                className="animate-spin mb-2 text-orange-500"
                size={32}
              />
              <p>Đang tải danh sách món...</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Không tìm thấy món ăn nào phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {foods.map((food) => (
                <div
                  key={food.foodId}
                  onClick={() => onSelectDish(food)}
                  className="border p-3 rounded-lg hover:border-orange-500 cursor-pointer flex flex-col gap-2 hover:bg-orange-50 transition-colors"
                >
                  <div className="h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden relative">
                    {food.imageUrl ? (
                      <Image
                        src={food.imageUrl}
                        width={200}
                        height={200}
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
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-800 line-clamp-2">
                      {food.foodName}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {food.foodType ||
                        (mealType === "Lunch" ? "Món chính" : "Món phụ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
