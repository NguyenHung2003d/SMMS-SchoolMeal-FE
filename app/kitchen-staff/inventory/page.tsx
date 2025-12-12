"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Package } from "lucide-react"; // Thêm icon Package
import { kitchenInventoryService } from "@/services/kitchenStaff/kitchenInventory.service";
import { InventoryItemDto } from "@/types/kitchen-inventory";
import StatsOverview from "@/components/kitchenstaff/inventory/StatsOverview";
import InventoryTable from "@/components/kitchenstaff/inventory/InventoryTable";
import EditInventoryModal from "@/components/kitchenstaff/inventory/EditInventoryModal";

export default function KitchenStaffInventoryPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [items, setItems] = useState<InventoryItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItemDto | null>(null);

  useEffect(() => {
    if (activeTab === "inventory") {
      fetchInventory();
    }
  }, [activeTab, pageIndex]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
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
    setIsEditModalOpen(true);
  };

  const handleSaveData = async (itemId: number, updateData: any) => {
    try {
      await kitchenInventoryService.updateInventoryItem(itemId, updateData);
      toast.success("Cập nhật kho thành công!");
      setIsEditModalOpen(false);
      fetchInventory();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý kho nguyên liệu
        </h1>
      </div>

      <StatsOverview totalCount={totalCount} items={items} />

      <div className="mb-6 border-b border-gray-200">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`
              flex items-center gap-2 pb-3 pt-1 text-sm font-semibold transition-all border-b-2
              ${
                activeTab === "inventory"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <Package size={18} />
            Danh Sách Tồn Kho
          </button>
        </div>
      </div>

      <InventoryTable
        loading={loading}
        items={items}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        onEdit={handleEditClick}
      />

      <EditInventoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editingItem}
        onSave={handleSaveData}
      />
    </div>
  );
}
