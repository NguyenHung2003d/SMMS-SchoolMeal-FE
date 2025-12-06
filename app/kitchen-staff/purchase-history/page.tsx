"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Eye,
  X,
  Check,
  Clock,
  FileText,
  Loader2,
  Calendar,
  AlertCircle,
  Package,
} from "lucide-react";
import { kitchenPurchaseOrderService } from "@/services/kitchenStaff/kitchenPurchaseOrder.service";
import {
  PurchaseOrderDetailDto,
  PurchaseOrderSummaryDto,
} from "@/types/kitchen-purchaseOrder";

export default function KitchenStaffPurchaseHistoryPage() {
  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<PurchaseOrderSummaryDto[]>([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Detail Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrderDetailDto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // --- EFFECT ---
  useEffect(() => {
    fetchOrders();
  }, [fromDate, toDate]);

  // --- API CALLS ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Backend cho phép lọc theo ngày, nếu rỗng thì lấy hết hoặc mặc định
      const data = await kitchenPurchaseOrderService.getList(
        fromDate || undefined,
        toDate || undefined
      );
      // Sắp xếp đơn mới nhất lên đầu
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

  // --- HELPER FUNCTIONS ---

  // Filter logic frontend
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Tính tổng tiền cho Modal Chi Tiết (Vì API Summary không trả về tiền)
  const calculateOrderTotal = (lines: any[]) => {
    return lines.reduce(
      (sum, line) => sum + (line.unitPrice || 0) * line.quantityGram,
      0
    );
  };

  // Mapping trạng thái sang màu sắc
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "draft")
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
          Nháp (Draft)
        </span>
      );
    if (s === "confirmed" || s === "completed")
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
          Đã hoàn thành
        </span>
      );
    return (
      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử mua hàng</h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý các đơn nhập kho (Purchase Orders)
          </p>
        </div>
        <div className="flex gap-2">
          {/* Bộ lọc ngày */}
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

      {/* Stats Cards (Tính toán Client-side dựa trên data tải về) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Tổng đơn hàng
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {orders.length}
            </h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl">
            <ShoppingCart size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Hoàn thành</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {orders.filter((o) => o.purchaseOrderStatus === "Draft").length}
              <span className="text-sm text-gray-400 font-normal ml-1">
                đơn nháp
              </span>
            </h3>
          </div>
          <div className="bg-green-50 p-3 rounded-xl">
            <Check size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Tổng khối lượng
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {new Intl.NumberFormat("vi-VN").format(
                orders.reduce((sum, o) => sum + o.totalQuantityGram, 0) / 1000
              )}
              <span className="text-sm font-normal text-gray-500 ml-1">kg</span>
            </h3>
          </div>
          <div className="bg-orange-50 p-3 rounded-xl">
            <Package size={24} className="text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm theo mã đơn, nhà cung cấp..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>

          <div className="flex items-center space-x-3">
            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Draft">Nháp (Draft)</option>
              <option value="Confirmed">Hoàn thành (Confirmed)</option>
            </select>
            <button className="p-2.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-gray-200">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-left">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Mã đơn #
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nhà cung cấp
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Plan ID
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    KL (Kg)
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Trạng thái
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="hover:bg-orange-50/30 transition-colors group"
                    >
                      <td className="py-4 px-6 text-sm font-bold text-gray-700">
                        #{order.orderId}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-800">
                        {order.supplierName}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 text-center">
                        #{order.planId}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 text-center font-mono">
                        {(order.totalQuantityGram / 1000).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(order.purchaseOrderStatus)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleViewDetail(order.orderId)}
                          className="text-gray-400 hover:text-orange-600 hover:bg-orange-100 p-2 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-10 h-10 text-gray-300 mb-3" />
                        <p>Không tìm thấy đơn hàng nào.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL CHI TIẾT ================= */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Chi tiết đơn hàng{" "}
                  <span className="text-orange-600">
                    #{selectedOrder?.orderId}
                  </span>
                </h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Clock size={14} /> Ngày tạo:{" "}
                  {selectedOrder ? formatDate(selectedOrder.orderDate) : "..."}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6 bg-white">
              {loadingDetail || !selectedOrder ? (
                <div className="flex flex-col justify-center items-center h-40 text-gray-500">
                  <Loader2 className="animate-spin mb-2 w-8 h-8 text-orange-500" />
                  <span>Đang tải thông tin chi tiết...</span>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Thông tin chung */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Nhà cung cấp
                      </label>
                      <p className="font-semibold text-gray-800 text-lg">
                        {selectedOrder.supplierName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Người phụ trách
                      </label>
                      <p className="font-medium text-gray-800 text-sm mt-1">
                        ID:{" "}
                        <span className="font-mono text-xs">
                          {selectedOrder.staffInCharged}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Từ Kế hoạch
                      </label>
                      <p className="font-medium text-gray-800 text-lg">
                        Plan #{selectedOrder.planId}
                      </p>
                    </div>
                  </div>

                  {/* Ghi chú */}
                  {selectedOrder.note && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                        Ghi chú đơn hàng
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 italic">
                        "{selectedOrder.note}"
                      </div>
                    </div>
                  )}

                  {/* Bảng chi tiết Items */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingCart size={20} className="text-orange-500" />{" "}
                        Danh sách hàng hóa
                      </h4>
                      <span className="text-sm font-medium text-gray-500">
                        {selectedOrder.lines.length} mặt hàng
                      </span>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                          <tr>
                            <th className="py-3 px-4 text-left">Tên hàng</th>
                            <th className="py-3 px-4 text-center">Số lượng</th>
                            <th className="py-3 px-4 text-right">Đơn giá</th>
                            <th className="py-3 px-4 text-right">Thành tiền</th>
                            <th className="py-3 px-4 text-left pl-6">
                              Thông tin lô / Xuất xứ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {selectedOrder.lines.map((line, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-gray-800">
                                {line.ingredientName}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                                  {line.quantityGram} g
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600">
                                {line.unitPrice
                                  ? formatCurrency(line.unitPrice)
                                  : "-"}
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-gray-800">
                                {line.unitPrice
                                  ? formatCurrency(
                                      line.unitPrice * line.quantityGram
                                    )
                                  : "-"}
                              </td>
                              <td className="py-3 px-4 pl-6 text-xs text-gray-500 space-y-1">
                                {line.batchNo && (
                                  <div className="flex gap-1">
                                    <span className="font-semibold">
                                      Batch:
                                    </span>{" "}
                                    <span className="font-mono text-gray-700">
                                      {line.batchNo}
                                    </span>
                                  </div>
                                )}
                                {line.origin && (
                                  <div className="flex gap-1">
                                    <span className="font-semibold">
                                      Origin:
                                    </span>{" "}
                                    <span>{line.origin}</span>
                                  </div>
                                )}
                                {!line.batchNo && !line.origin && (
                                  <span className="italic text-gray-300">
                                    N/A
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-200">
                          <tr>
                            <td
                              colSpan={3}
                              className="py-4 px-4 text-right font-bold text-gray-600 uppercase text-xs"
                            >
                              Tổng giá trị đơn hàng:
                            </td>
                            <td className="py-4 px-4 text-right font-bold text-xl text-green-600">
                              {formatCurrency(
                                calculateOrderTotal(selectedOrder.lines)
                              )}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                Đóng
              </button>
              {selectedOrder && (
                <button className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors shadow-sm flex items-center gap-2">
                  <Download size={18} /> In Hóa Đơn
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
