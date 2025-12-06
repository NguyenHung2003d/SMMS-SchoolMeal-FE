"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Search,
  Loader2,
  FileText,
  PackageCheck,
} from "lucide-react";
import { toast } from "react-hot-toast"; // Hoặc library toast bạn dùng
import { managerAcceptPurchaseService } from "@/services/kitchenStaff/managerAcceptPurchase.service";
import {
  PurchaseOrderDetail,
  PurchaseOrderSummary,
} from "@/types/manager-purchaseOrder";
import { getStatusBadge } from "@/helpers";

export default function PurchaseOrderApproval() {
  // State
  const [orders, setOrders] = useState<PurchaseOrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });

  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrderDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchOrders = async () => {
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
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handlers
  const handleViewDetail = async (id: number) => {
    setIsDetailLoading(true);
    setShowModal(true);
    try {
      const detail = await managerAcceptPurchaseService.getById(id);
      setSelectedOrder(detail);
    } catch (error) {
      toast.error("Không thể tải chi tiết đơn hàng");
      setShowModal(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedOrder) return;
    if (!confirm("Bạn có chắc chắn muốn xác nhận đơn hàng này và nhập kho?"))
      return;

    setProcessingId(selectedOrder.orderId);
    try {
      await managerAcceptPurchaseService.confirm(selectedOrder.orderId);
      toast.success("Xác nhận nhập kho thành công!");
      setShowModal(false);
      fetchOrders(); // Refresh list
    } catch (error) {
      toast.error("Lỗi khi xác nhận đơn hàng");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;
    if (!confirm("Bạn có chắc chắn muốn từ chối đơn hàng này?")) return;

    setProcessingId(selectedOrder.orderId);
    try {
      await managerAcceptPurchaseService.reject(selectedOrder.orderId);
      toast.success("Đã từ chối đơn hàng!");
      setShowModal(false);
      fetchOrders(); // Refresh list
    } catch (error) {
      toast.error("Lỗi khi từ chối đơn hàng");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PackageCheck className="text-orange-600" />
            Duyệt Đơn Mua Hàng
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý và nhập kho nguyên liệu từ kế hoạch mua sắm
          </p>
        </div>

        <div className="flex gap-2 items-center bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 px-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Từ:</span>
            <input
              type="date"
              className="text-sm border rounded px-2 py-1 outline-none focus:border-orange-500"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2 px-2 border-l border-gray-200">
            <span className="text-sm text-gray-600">Đến:</span>
            <input
              type="date"
              className="text-sm border rounded px-2 py-1 outline-none focus:border-orange-500"
              value={filters.toDate}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
            />
          </div>
          <button
            onClick={fetchOrders}
            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-md transition-colors"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase font-medium border-b">
              <tr>
                <th className="px-6 py-4">Mã Đơn</th>
                <th className="px-6 py-4">Ngày Tạo</th>
                <th className="px-6 py-4">Nhà Cung Cấp</th>
                <th className="px-6 py-4 text-center">Số Món</th>
                <th className="px-6 py-4 text-right">Tổng Lượng (g)</th>
                <th className="px-6 py-4 text-center">Trạng Thái</th>
                <th className="px-6 py-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" /> Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 italic"
                  >
                    Không tìm thấy đơn hàng nào trong khoảng thời gian này.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      PO-{order.orderId}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {format(new Date(order.orderDate), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {order.supplierName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {order.linesCount}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-orange-600">
                      {order.totalQuantityGram.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(order.purchaseOrderStatus)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetail(order.orderId)}
                        className="text-gray-500 hover:text-orange-600 transition-colors p-1 rounded-full hover:bg-orange-50"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="text-orange-600" />
                  Chi Tiết Đơn Hàng #{selectedOrder?.orderId}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Kế hoạch gốc: Plan-{selectedOrder?.planId || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              {isDetailLoading || !selectedOrder ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin text-orange-600 w-8 h-8" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Info Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Nhà Cung Cấp
                      </p>
                      <p className="font-medium text-gray-900 mt-1">
                        {selectedOrder.supplierName}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Ngày Đặt
                      </p>
                      <p className="font-medium text-gray-900 mt-1">
                        {format(
                          new Date(selectedOrder.orderDate),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Trạng Thái
                      </p>
                      <div className="mt-1">
                        {getStatusBadge(selectedOrder.purchaseOrderStatus)}
                      </div>
                    </div>
                  </div>

                  {/* Note */}
                  {selectedOrder.note && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                      <strong>Ghi chú:</strong> {selectedOrder.note}
                    </div>
                  )}

                  {/* Table Details */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 text-gray-700 font-medium">
                        <tr>
                          <th className="px-4 py-3 text-left">
                            Tên Nguyên Liệu
                          </th>
                          <th className="px-4 py-3 text-left">Xuất Xứ</th>
                          <th className="px-4 py-3 text-center">Lô Hàng</th>
                          <th className="px-4 py-3 text-center">Hạn Dùng</th>
                          <th className="px-4 py-3 text-right">Số Lượng (g)</th>
                          <th className="px-4 py-3 text-right">Đơn Giá</th>
                          <th className="px-4 py-3 text-right">Thành Tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedOrder.lines.map((line) => (
                          <tr key={line.linesId}>
                            <td className="px-4 py-3 font-medium">
                              {line.ingredientName}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {line.origin || "-"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600 font-mono text-xs">
                              {line.batchNo || "-"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                              {line.expiryDate
                                ? format(
                                    new Date(line.expiryDate),
                                    "dd/MM/yyyy"
                                  )
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-right font-mono">
                              {line.quantityGram.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600">
                              {line.unitPrice.toLocaleString()} ₫
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                              {(
                                line.quantityGram * line.unitPrice
                              ).toLocaleString()}{" "}
                              ₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 font-semibold text-gray-900 border-t">
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-right">
                            Tổng Tiền Dự Kiến:
                          </td>
                          <td className="px-4 py-3 text-right text-orange-600 text-base">
                            {selectedOrder.lines
                              .reduce(
                                (acc, curr) =>
                                  acc + curr.quantityGram * curr.unitPrice,
                                0
                              )
                              .toLocaleString()}{" "}
                            ₫
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Actions) */}
            {selectedOrder && selectedOrder.purchaseOrderStatus === "Draft" && (
              <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={handleReject}
                  disabled={!!processingId}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
                >
                  {processingId === selectedOrder.orderId ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                  Từ Chối / Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!!processingId}
                  className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all flex items-center gap-2 font-medium disabled:opacity-50"
                >
                  {processingId === selectedOrder.orderId ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  Xác Nhận Nhập Kho
                </button>
              </div>
            )}
            {selectedOrder && selectedOrder.purchaseOrderStatus !== "Draft" && (
              <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
