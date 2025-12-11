"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { FoodItemDto } from "@/types/kitchen-nutrition";
import { kitchenNutritionService } from "@/services/kitchenStaff/kitchenNutrion.service";
import { FoodCard } from "@/components/kitchenstaff/food-library/FoodCard";
import { DishModal } from "@/components/kitchenstaff/food-library/DishModal";
import { ConfirmDeleteModal } from "@/components/kitchenstaff/food-library/ConfirmDeleteModal";

export default function KitchenStaffFoodLibraryPage() {
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState<FoodItemDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<FoodItemDto | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, [searchQuery]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const data = await kitchenNutritionService.getFoods(searchQuery);
      setFoods(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = useMemo(() => {
    if (filterType === "all") {
      return foods;
    }
    return foods.filter((food) => food.foodType === filterType);
  }, [foods, filterType]);

  const handleOpenCreate = () => {
    setEditingDish(null);
    setIsDishModalOpen(true);
  };

  const handleOpenEdit = (dish: FoodItemDto) => {
    setEditingDish(dish);
    setIsDishModalOpen(true);
  };

  const handleClickDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await kitchenNutritionService.deleteFood(deleteId);
      toast.success("Đã xóa món ăn thành công");

      setFoods((prev) => prev.filter((f) => f.foodId !== deleteId));

      setDeleteId(null);
    } catch (error) {
      toast.error("Không thể xóa (món ăn đang được sử dụng)");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thư viện món ăn</h1>
          <p className="text-gray-600 text-sm">
            Quản lý danh sách món ăn và công thức dinh dưỡng
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Tạo món mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả loại</option>
            <option value="Món chính">Món chính</option>
            <option value="Tráng miệng">Tráng miệng</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food) => (
              <FoodCard
                key={food.foodId}
                food={food}
                onEdit={handleOpenEdit}
                onDelete={handleClickDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Không tìm thấy món ăn nào phù hợp.
            </div>
          )}
        </div>
      )}

      {isDishModalOpen && (
        <DishModal
          isOpen={isDishModalOpen}
          onClose={() => setIsDishModalOpen(false)}
          onSuccess={fetchFoods}
          initialData={editingDish}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Xác nhận xóa món ăn?"
        description="Món ăn này sẽ bị xóa khỏi thư viện. Hành động này không thể hoàn tác."
      />
    </div>
  );
}
