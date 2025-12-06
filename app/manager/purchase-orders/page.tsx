"use client";
import React from "react";
import { Calendar, Search, Loader2, PackageCheck, Eye } from "lucide-react";
import { format } from "date-fns";
import { DateInput, getStatusBadge } from "@/helpers";
import { usePurchaseOrders } from "@/hooks/manager/usePurchaseOrders";
import { PurchaseDetailModal } from "@/components/manager/purchaseOrders/PurchaseDetailModal";

export default function PurchaseOrderApproval() {
  const {
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
    confirmOrder,
    rejectOrder,
  } = usePurchaseOrders();

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PackageCheck className="text-orange-600" /> Duyệt Đơn Mua Hàng
          </h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý và nhập kho nguyên liệu từ kế hoạch mua sắm</p>
        </div>

        <div className="flex gap-2 items-center bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <DateInput 
            label="Từ" 
            value={filters.fromDate} 
            onChange={(val) => setFilters({ ...filters, fromDate: val })} 
          />
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <DateInput 
            label="Đến" 
            value={filters.toDate} 
            onChange={(val) => setFilters({ ...filters, toDate: val })} 
          />
          <button
            onClick={fetchOrders}
            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-md transition-colors shadow-sm"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase font-medium border-b text-xs">
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
                  <td colSpan={7} className="text-center py-16 text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin text-orange-500" /> Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400 italic bg-gray-50/20">
                    Không tìm thấy đơn hàng nào trong khoảng thời gian này.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-orange-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">PO-{order.orderId}</td>
                    <td className="px-6 py-4 text-gray-600">{format(new Date(order.orderDate), "dd/MM/yyyy")}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{order.supplierName}</td>
                    <td className="px-6 py-4 text-center">{order.linesCount}</td>
                    <td className="px-6 py-4 text-right font-mono text-orange-600 font-medium">
                      {order.totalQuantityGram.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-block scale-90">{getStatusBadge(order.purchaseOrderStatus)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openDetailModal(order.orderId)}
                        className="text-gray-400 hover:text-orange-600 transition-colors p-2 rounded-full hover:bg-orange-100 group-hover:text-gray-600"
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

      <PurchaseDetailModal
        isOpen={showDetailModal}
        onClose={closeDetailModal}
        order={selectedOrder}
        isLoading={isDetailLoading}
        isProcessing={!!processingId}
        onConfirm={confirmOrder}
        onReject={rejectOrder}
      />
    </div>
  );
}