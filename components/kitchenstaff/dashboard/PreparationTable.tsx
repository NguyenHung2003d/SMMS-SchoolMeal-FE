import React, { useState } from "react";
import {
  Eye,
  Pencil,
  ArrowUpDown,
  UtensilsCrossed,
  Trash2,
  X,
  Save,
  Info,
  AlertTriangle, 
} from "lucide-react";
import { MenuDayFoodItem } from "@/types/kitchen-dashboard";
import { kitchenDashboardService } from "@/services/kitchenDashboard.service";
import toast from "react-hot-toast";

interface Props {
  items: MenuDayFoodItem[];
  onRefresh: () => void;
}

export const PreparationTable: React.FC<Props> = ({ items, onRefresh }) => {
  const [editingItem, setEditingItem] = useState<MenuDayFoodItem | null>(null);
  const [newSortOrder, setNewSortOrder] = useState<number>(0);

  const [viewingItem, setViewingItem] = useState<MenuDayFoodItem | null>(null);

  const [deletingItem, setDeletingItem] = useState<MenuDayFoodItem | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const openDeleteModal = (item: MenuDayFoodItem) => {
    setDeletingItem(item);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setIsLoading(true);
      await kitchenDashboardService.deleteMenuDayFoodItem(
        deletingItem.menuDayId,
        deletingItem.foodId
      );
      toast.success(
        `Đã xóa món "${deletingItem.food?.foodName}" khỏi thực đơn.`
      );
      setDeletingItem(null)
      onRefresh();
    } catch (error) {
      console.error("Lỗi khi xóa món ăn:", error);
      toast.error("Xảy ra lỗi khi xóa món ăn. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (item: MenuDayFoodItem) => {
    setEditingItem(item);
    setNewSortOrder(item.sortOrder || 0);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      setIsLoading(true);
      const updatedItem: MenuDayFoodItem = {
        ...editingItem,
        sortOrder: newSortOrder,
        menuDayId: editingItem.menuDayId,
        foodId: editingItem.foodId,
      };
      await kitchenDashboardService.updateMenuDayFoodItem(
        editingItem.menuDayId,
        editingItem.foodId,
        updatedItem
      );
      toast.success(`Cập nhật thứ tự món ăn thành công.`);
      setEditingItem(null);
      onRefresh();
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn:", error);
      toast.error(`Xảy ra lỗi khi cập nhật món ăn. Vui lòng thử lại.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (item: MenuDayFoodItem) => {
    setViewingItem(item);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <UtensilsCrossed size={20} className="mr-2 text-orange-500" />
            Chi tiết thực đơn & Thứ tự nấu
          </h2>
          <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
            {items.length} món
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tên món ăn
                </th>
                <th className="py-3 px-6 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Thứ tự (Priority)
                </th>
                <th className="py-3 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-gray-400 italic"
                  >
                    Chưa có món ăn nào trong danh sách chuẩn bị.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={`${item.menuDayId}-${item.foodId}`}
                    className="hover:bg-orange-50/50 transition-colors duration-150 group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 text-base">
                          {item.food
                            ? item.food.foodName
                            : `Món ăn #${item.foodId}`}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">
                          Ref: M-{item.menuDayId} | F-{item.foodId}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
                        <ArrowUpDown
                          size={14}
                          className="mr-1.5 text-gray-500"
                        />
                        <span className="font-bold text-gray-700">
                          {item.sortOrder ?? "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Xóa món này"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Cập nhật món ăn
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setEditingItem(null)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên món ăn
              </label>
              <input
                type="text"
                value={
                  editingItem.food?.foodName || `ID: ${editingItem.foodId}`
                }
                disabled
                className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thứ tự ưu tiên (Sort Order)
              </label>
              <input
                type="number"
                value={newSortOrder}
                onChange={(e) => setNewSortOrder(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Số nhỏ hơn sẽ được chuẩn bị trước.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center"
              >
                {isLoading ? (
                  "Đang lưu..."
                ) : (
                  <>
                    <Save size={18} className="mr-2" /> Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL VIEW DETAILS (XEM CHI TIẾT) --- */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-800 flex items-center">
                <Info size={20} className="mr-2" /> Chi tiết món ăn
              </h3>
              <button
                className="text-blue-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100"
                onClick={() => setViewingItem(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <div className="w-1/3 text-gray-500 text-sm font-medium">
                  Tên món:
                </div>
                <div className="w-2/3 text-gray-800 font-bold text-lg leading-tight">
                  {viewingItem.food?.foodName || "Không xác định"}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/3 text-gray-500 text-sm font-medium">
                  Mã món (ID):
                </div>
                <div className="w-2/3 text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded text-sm inline-block">
                  #{viewingItem.foodId}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/3 text-gray-500 text-sm font-medium">
                  Mã thực đơn:
                </div>
                <div className="w-2/3 text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded text-sm inline-block">
                  #{viewingItem.menuDayId}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/3 text-gray-500 text-sm font-medium">
                  Thứ tự nấu:
                </div>
                <div className="w-2/3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ưu tiên: {viewingItem.sortOrder ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 text-right border-t border-gray-100">
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa món{" "}
                <span className="font-bold text-gray-800">
                  "{deletingItem.food?.foodName}"
                </span>{" "}
                khỏi danh sách không? Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="p-4 bg-white flex gap-3">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium shadow-sm transition-colors"
                disabled={isLoading}
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm flex items-center justify-center transition-colors"
              >
                {isLoading ? (
                  <span className="animate-pulse">Đang xóa...</span>
                ) : (
                  <>
                    <Trash2 size={18} className="mr-2" /> Xóa ngay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};