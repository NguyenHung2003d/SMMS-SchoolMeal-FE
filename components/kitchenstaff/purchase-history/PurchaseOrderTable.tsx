import React from "react";
import { Eye, AlertCircle, Loader2 } from "lucide-react";
import { PurchaseOrderSummaryDto } from "@/types/kitchen-purchaseOrder";
import { formatDate, getStatusBadge } from "@/helpers";

interface Props {
  orders: PurchaseOrderSummaryDto[];
  loading: boolean;
  onViewDetail: (id: number) => void;
}

export const PurchaseOrderTable: React.FC<Props> = ({
  orders,
  loading,
  onViewDetail,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex justify-center items-center text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
            {orders.length > 0 ? (
              orders.map((order) => (
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
                      onClick={() => onViewDetail(order.orderId)}
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
    </div>
  );
};
