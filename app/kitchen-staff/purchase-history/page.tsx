"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { kitchenPurchaseOrderService } from "@/services/kitchenStaff/kitchenPurchaseOrder.service";
import {
  PurchaseOrderDetailDto,
  PurchaseOrderSummaryDto,
} from "@/types/kitchen-purchaseOrder";
import { PurchaseStatsCards } from "@/components/kitchenstaff/purchase-history/PurchaseStatsCards";
import { PurchaseOrderFilters } from "@/components/kitchenstaff/purchase-history/PurchaseOrderFilters";
import { PurchaseOrderTable } from "@/components/kitchenstaff/purchase-history/PurchaseOrderTable";
import { PurchaseOrderDetailModal } from "@/components/kitchenstaff/purchase-history/PurchaseOrderDetailModal";

export default function KitchenStaffPurchaseHistoryPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<PurchaseOrderSummaryDto[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrderDetailDto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fromDate, toDate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await kitchenPurchaseOrderService.getList(
        fromDate || undefined,
        toDate || undefined
      );
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
      setOrders(sortedData);
    } catch (error) {
      console.error("Lỗi tải danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (orderId: number) => {
    setIsDetailModalOpen(true);
    setLoadingDetail(true);
    try {
      const detail = await kitchenPurchaseOrderService.getById(orderId);
      setSelectedOrder(detail);
    } catch (error) {
      console.error("Lỗi tải chi tiết đơn hàng:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      (order.supplierName?.toLowerCase() || "").includes(searchLower) ||
      order.orderId.toString().includes(searchLower);
    const matchStatus =
      selectedStatus === "all" ||
      order.purchaseOrderStatus?.toLowerCase() === selectedStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử mua hàng</h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý các đơn nhập kho (Purchase Orders)
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Calendar size={16} className="text-gray-500" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-sm outline-none text-gray-600 cursor-pointer"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-sm outline-none text-gray-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <PurchaseStatsCards orders={orders} />

      <PurchaseOrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <PurchaseOrderTable
        orders={filteredOrders}
        loading={loading}
        onViewDetail={handleViewDetail}
      />

      <PurchaseOrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
        loading={loadingDetail}
      />
    </div>
  );
}
