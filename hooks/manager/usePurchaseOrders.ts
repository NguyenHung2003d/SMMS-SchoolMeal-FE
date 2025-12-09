import { useState, useCallback, useEffect } from "react";
import { managerAcceptPurchaseService } from "@/services/kitchenStaff/managerAcceptPurchase.service";
import {
  PurchaseOrderDetail,
} from "@/types/manager-purchaseOrder";
import toast from "react-hot-toast";
import { PurchaseOrderSummaryDto } from "@/types/kitchen-purchaseOrder";

export const usePurchaseOrders = () => {
  const [orders, setOrders] = useState<PurchaseOrderSummaryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });

  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrderDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await managerAcceptPurchaseService.getList(
        filters.fromDate,
        filters.toDate
      );
      setOrders(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openDetailModal = useCallback(async (id: number) => {
    setIsDetailLoading(true);
    setShowDetailModal(true);
    try {
      const detail = await managerAcceptPurchaseService.getById(id);
      setSelectedOrder(detail);
    } catch (error) {
      toast.error("Không thể tải chi tiết đơn hàng");
      setShowDetailModal(false);
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  }, []);

  // Actions
  const handleAction = async (action: "confirm" | "reject") => {
    if (!selectedOrder) return;
    const isConfirm = action === "confirm";
    const message = isConfirm
      ? "Bạn có chắc chắn muốn xác nhận đơn hàng này và nhập kho?"
      : "Bạn có chắc chắn muốn từ chối đơn hàng này?";

    if (!confirm(message)) return;

    setProcessingId(selectedOrder.orderId);
    try {
      if (isConfirm) {
        await managerAcceptPurchaseService.confirm(selectedOrder.orderId);
        toast.success("Xác nhận nhập kho thành công!");
      } else {
        await managerAcceptPurchaseService.reject(selectedOrder.orderId);
        toast.success("Đã từ chối đơn hàng!");
      }
      closeDetailModal();
      fetchOrders();
    } catch (error) {
      toast.error(isConfirm ? "Lỗi khi xác nhận" : "Lỗi khi từ chối");
    } finally {
      setProcessingId(null);
    }
  };

  return {
    orders,
    loading,
    filters,
    setFilters,
    fetchOrders,
    selectedOrder,
    isDetailLoading,
    showDetailModal,
    processingId,
    openDetailModal,
    closeDetailModal,
    confirmOrder: () => handleAction("confirm"),
    rejectOrder: () => handleAction("reject"),
  };
};
