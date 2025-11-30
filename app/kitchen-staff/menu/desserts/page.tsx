"use client";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  ImageOff,
  X,
  Save,
} from "lucide-react";
import { kitchenMenuService } from "@/services/kitchenMenu.service";
import { FoodItem, UpdateFoodItemRequest } from "@/types/kitchen-menu";
import toast from "react-hot-toast";

export default function DessertMenu() {
  const [desserts, setDesserts] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UpdateFoodItemRequest | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const fetchDesserts = async () => {
    try {
      setLoading(true);
      const allFoods = await kitchenMenuService.getFoodItems();

      console.log("1. Tổng số món ăn trả về từ API:", allFoods.length);
      console.log("2. Dữ liệu thô (Raw Data):", allFoods);

      if (allFoods.length > 0) {
        console.log("   --> Mẫu món ăn đầu tiên:", {
          id: allFoods[0].foodId,
          name: allFoods[0].foodName,
          type: allFoods[0].foodType,
          isMain: allFoods[0].isMainDish,
        });
      }

      const dessertList = allFoods.filter((f) => {
        // Logic lọc hiện tại của bạn:
        // 1. Không phải món chính (isMainDish === false)
        // HOẶC 2. Loại món có chữ "tráng miệng"
        // HOẶC 3. Loại món có chữ "dessert"

        const isNotMain = f.isMainDish === false;
        const typeRaw = f.foodType || ""; // Handle null/undefined
        const typeLower = typeRaw.toLowerCase();
        const isTypeMatch =
          typeLower.includes("tráng miệng") || typeLower.includes("dessert");

        // Log những món bị nghi ngờ (nếu cần debug kỹ hơn thì bỏ comment dòng dưới)
        // console.log(`Check món [${f.foodName}]: isMainDish=${f.isMainDish}, Type=${f.foodType} => Kết quả: ${isNotMain || isTypeMatch}`);

        return isNotMain || isTypeMatch;
      });

      console.log("3. Danh sách sau khi lọc (Desserts):", dessertList);

      setDesserts(dessertList);
    } catch (error) {
      console.error("Failed to fetch desserts:", error);
      toast.error("Không thể tải danh sách món tráng miệng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesserts();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa món "${name}" không?`)) return;

    try {
      await kitchenMenuService.deleteFoodItem(id);

      toast.success("Đã xóa thành công");

      setDesserts((prev) => prev.filter((item) => item.foodId !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        "Xóa thất bại. Có thể món ăn đang được sử dụng trong thực đơn."
      );
    }
  };

  // 3. Handle Open Edit Modal
  const handleEditClick = (item: FoodItem) => {
    setEditingItem({
      foodId: item.foodId,
      foodName: item.foodName,
      foodType: item.foodType || "Tráng miệng",
      foodDesc: item.foodDesc || "",
      imageUrl: item.imageUrl || "",
      isMainDish: item.isMainDish,
      isActive: item.isActive ?? true,
      schoolId: item.schoolId || "00000000-0000-0000-0000-000000000000", // Cần ID thực tế hoặc Backend tự xử lý
    });
    setIsEditOpen(true);
  };

  // 4. Handle Save Changes
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsSaving(true);

      // Gọi API Update
      await kitchenMenuService.updateFoodItem(editingItem.foodId, editingItem);

      toast.success("Cập nhật món ăn thành công!");

      // Update lại State local để UI thay đổi ngay
      setDesserts((prev) =>
        prev.map((item) =>
          item.foodId === editingItem.foodId
            ? { ...item, ...editingItem }
            : item
        )
      );

      setIsEditOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Cập nhật thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-orange-500 mr-2" />
        <span className="text-gray-500">Đang tải món tráng miệng...</span>
      </div>
    );
  }

  return (
    <>
      {/* --- LIST VIEW --- */}
      {desserts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            Chưa có món tráng miệng nào trong thực đơn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {desserts.map((item) => (
            <div
              key={item.foodId}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden group">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.foodName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageOff size={48} className="mb-2 opacity-50" />
                    <span className="text-xs">Không có hình ảnh</span>
                  </div>
                )}

                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-bold text-purple-600 px-2 py-1 rounded-full shadow-sm">
                    #{item.foodId}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="font-bold text-lg text-gray-800 line-clamp-1"
                    title={item.foodName}
                  >
                    {item.foodName}
                  </h3>
                </div>

                <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">
                  {item.foodDesc || "Món tráng miệng bổ dưỡng cho học sinh."}
                </p>

                <div className="flex items-center mb-4 bg-red-50 px-2 py-1 rounded w-fit">
                  <AlertCircle size={14} className="text-red-500 mr-1.5" />
                  <span className="text-xs text-red-600 font-medium">
                    Loại: {item.foodType}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      ID: {item.foodId}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Nút Sửa */}
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Nút Xóa */}
                      <button
                        onClick={() => handleDelete(item.foodId, item.foodName)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa món này"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {isEditOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Pencil size={18} className="mr-2 text-orange-500" />
                Cập nhật món ăn
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-4 space-y-4">
              {/* Tên món */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên món ăn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.foodName}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, foodName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Nhập tên món..."
                />
              </div>

              {/* Loại món */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại món
                </label>
                <select
                  value={editingItem.foodType}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, foodType: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="Tráng miệng">Tráng miệng</option>
                  <option value="Sữa chua">Sữa chua</option>
                  <option value="Trái cây">Trái cây</option>
                  <option value="Bánh ngọt">Bánh ngọt</option>
                </select>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={editingItem.foodDesc}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, foodDesc: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Mô tả ngắn về món ăn..."
                />
              </div>

              {/* Link ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link hình ảnh (URL)
                </label>
                <input
                  type="text"
                  value={editingItem.imageUrl}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, imageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
