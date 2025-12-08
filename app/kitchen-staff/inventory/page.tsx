"use client";
import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  Edit,
  ShoppingCart,
  Clock,
  AlertTriangle,
  Loader2,
  X,
  Save,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { differenceInDays, parseISO } from "date-fns";
import { formatQuantity, getExpiryStatus } from "@/helpers"; // Giả sử bạn có helper này
import { InventoryItemDto } from "@/types/kitchen-inventory";
import Link from "next/link"; // Dùng Link của Next.js cho chuyển trang
import { kitchenInventoryService } from "@/services/kitchenStaff/kitchenInventory.service";

export default function KitchenStaffInventoryPage() {
  const [activeTab, setActiveTab] = useState("inventory");

  const [items, setItems] = useState<InventoryItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItemDto | null>(null);

  const [editForm, setEditForm] = useState({
    quantityGram: 0,
    expirationDate: "",
    batchNo: "",
    origin: "",
  });

  useEffect(() => {
    if (activeTab === "inventory") {
      fetchInventory();
    }
  }, [activeTab, pageIndex]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      // FIX: Gọi đúng hàm getInventoryItems từ service
      const data = await kitchenInventoryService.getInventoryItems(
        pageIndex,
        pageSize
      );
      setItems(data.items);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Lỗi tải kho:", error);
      toast.error("Không thể tải dữ liệu kho");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: InventoryItemDto) => {
    setEditingItem(item);
    // Format date string for input type="date" (YYYY-MM-DD)
    const dateStr = item.expirationDate
      ? new Date(item.expirationDate).toISOString().split("T")[0]
      : "";

    setEditForm({
      quantityGram: item.quantityGram,
      expirationDate: dateStr,
      batchNo: item.batchNo || "",
      origin: item.origin || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUpdate = async () => {
    if (!editingItem) return;

    try {
      await kitchenInventoryService.updateInventoryItem(editingItem.itemId, {
        quantityGram: editForm.quantityGram,
        expirationDate: editForm.expirationDate || undefined,
        batchNo: editForm.batchNo,
        origin: editForm.origin,
      });

      toast.success("Cập nhật kho thành công!");
      setIsEditModalOpen(false);
      fetchInventory(); // Reload lại dữ liệu
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý kho nguyên liệu
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Tổng mặt hàng
              </p>
              <h3 className="text-3xl font-bold text-gray-800">{totalCount}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Cảnh báo hết hạn (3 ngày)
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {
                  items.filter(
                    (i) =>
                      i.expirationDate &&
                      differenceInDays(
                        parseISO(i.expirationDate),
                        new Date()
                      ) <= 3
                  ).length
                }
              </h3>
              <p className="text-xs text-gray-500 mt-1">Trong trang này</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock size={24} className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filter */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "inventory"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Kho nguyên liệu
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "orders"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Đơn đặt hàng
            </button>
          </nav>
        </div>

        <div className="p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm nguyên liệu..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="all">Tất cả trạng thái</option>
              <option value="low">Sắp hết</option>
              <option value="expired">Hết hạn</option>
            </select>
            <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content: Inventory Table */}
      {activeTab === "inventory" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {loading ? (
            <div className="p-12 text-center text-gray-500 flex justify-center items-center gap-2">
              <Loader2 className="animate-spin" /> Đang tải dữ liệu kho...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên nguyên liệu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng tồn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hạn sử dụng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lô / Xuất xứ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {items.length > 0 ? (
                    items.map((item) => {
                      const expiry = getExpiryStatus(item.expirationDate);
                      return (
                        <tr key={item.itemId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            #{item.itemId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            {item.ingredientName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-md font-medium ${
                                item.quantityGram < 1000
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {formatQuantity(item.quantityGram)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`flex items-center gap-1 ${expiry.color}`}
                            >
                              {expiry.label}
                              {item.expirationDate &&
                                differenceInDays(
                                  parseISO(item.expirationDate),
                                  new Date()
                                ) <= 3 && <AlertTriangle size={14} />}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                            <div>Batch: {item.batchNo || "-"}</div>
                            <div>Origin: {item.origin || "-"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 p-2 rounded transition-colors"
                              title="Cập nhật kho"
                            >
                              <Edit size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        Kho trống
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
            <button
              disabled={pageIndex === 1}
              onClick={() => setPageIndex((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Trước
            </button>
            <span className="px-3 py-1 text-sm flex items-center">
              Trang {pageIndex}
            </span>
            <button
              disabled={items.length < pageSize} // Hoặc logic totalPages chính xác hơn nếu BE trả về
              onClick={() => setPageIndex((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Content: Orders Link */}
      {activeTab === "orders" && (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800">
            Quản lý Đơn đặt hàng
          </h3>
          <p className="text-gray-500 mb-4">
            Vui lòng truy cập trang Lịch sử mua hàng để quản lý chi tiết.
          </p>
          <Link
            href="/kitchen-staff/purchase-history"
            className="text-orange-600 font-medium hover:underline"
          >
            Đi tới Lịch sử mua hàng &rarr;
          </Link>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Edit size={18} className="text-orange-500" />
                Cập nhật kho
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 mb-2">
                Đang sửa: <strong>{editingItem?.ingredientName}</strong> (ID:{" "}
                {editingItem?.itemId})
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng (Gram)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={editForm.quantityGram}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        quantityGram: parseFloat(e.target.value),
                      })
                    }
                  />
                  <span className="absolute right-3 top-2 text-gray-400 text-sm">
                    g
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ~ {(editForm.quantityGram / 1000).toFixed(3)} kg
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lô (Batch No)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={editForm.batchNo}
                    onChange={(e) =>
                      setEditForm({ ...editForm, batchNo: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xuất xứ
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={editForm.origin}
                    onChange={(e) =>
                      setEditForm({ ...editForm, origin: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạn sử dụng
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  value={editForm.expirationDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, expirationDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                onClick={() => setIsEditModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2 shadow-sm"
                onClick={handleSaveUpdate}
              >
                <Save size={18} /> Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
