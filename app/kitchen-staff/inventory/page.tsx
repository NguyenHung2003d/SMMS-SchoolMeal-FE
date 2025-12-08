"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { kitchenInventoryService } from "@/services/kitchenStaff/kitchenInventory.service";
import { InventoryItemDto } from "@/types/kitchen-inventory";
import StatsOverview from "@/components/kitchenstaff/inventory/StatsOverview";
import InventoryControlBar from "@/components/kitchenstaff/inventory/InventoryControlBar";
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
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý kho nguyên liệu
        </h1>
      </div>

      <StatsOverview totalCount={totalCount} items={items} />

      <InventoryControlBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "inventory" && (
        <InventoryTable
          loading={loading}
          items={items}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          onEdit={handleEditClick}
        />
      )}

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

      <EditInventoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editingItem}
        onSave={handleSaveData}
      />
    </div>
  );
}
