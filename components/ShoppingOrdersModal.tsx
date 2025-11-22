import { formatCurrency } from "@/helpers";
import {
  OrderLine,
  ShoppingOrder,
  ShoppingOrdersModalProps,
  StatusInfo,
} from "@/types";
import React, { useState } from "react";

export default function ShoppingOrdersModal({
  isOpen,
  onClose,
  orders = [],
  orderDetails = {},
  selectedMonth,
  selectedYear,
}: ShoppingOrdersModalProps): React.ReactElement | null {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const getOrderStatusInfo = (status: string): StatusInfo => {
    switch (status) {
      case "Confirmed":
        return {
          text: "Đã xác nhận",
          className: "bg-green-100 text-green-800",
        };
      case "Pending":
        return {
          text: "Chờ xác nhận",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "Cancelled":
        return { text: "Đã hủy", className: "bg-red-100 text-red-800" };
      default:
        return { text: status, className: "bg-gray-100 text-gray-800" };
    }
  };

  const handleExpandOrder = (orderId: number): void => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const totalShoppingExpenses = orders.reduce(
    (sum: number, order: ShoppingOrder) => sum + order.totalAmount,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4">
          <h2 className="text-xl font-bold">
            🛒 Chi tiết mua sắm - Tháng {selectedMonth}/{selectedYear}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-600">
            Tổng chi phí đi chợ:{" "}
            <span className="font-bold text-lg">
              {formatCurrency(totalShoppingExpenses)}
            </span>
          </p>
          <p className="text-xs text-orange-500 mt-1">
            {orders.length} đơn hàng
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map((order: ShoppingOrder) => {
            const details = orderDetails[order.orderId];
            const statusInfo = getOrderStatusInfo(order.purchaseOrderStatus);
            const isExpanded = expandedOrderId === order.orderId;

            return (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => handleExpandOrder(order.orderId)}
                        className="text-lg"
                      >
                        {isExpanded ? "▼" : "▶"}
                      </button>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Đơn #{order.orderId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.supplierName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                {isExpanded && details && (
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Ngày đặt:</strong>{" "}
                        {new Date(order.orderDate).toLocaleString("vi-VN")}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Ghi chú:</strong> {order.note}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 text-gray-800">
                        Chi tiết items:
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs md:text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 text-left text-gray-600">
                              <th className="pb-2 px-2">Nguyên liệu</th>
                              <th className="pb-2 px-2">SL (g)</th>
                              <th className="pb-2 px-2">Đơn giá</th>
                              <th className="pb-2 px-2">Lô</th>
                              <th className="pb-2 px-2">Xuất xứ</th>
                              <th className="pb-2 px-2">HSD</th>
                              <th className="pb-2 px-2 text-right">
                                Thành tiền
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {details.lines.map(
                              (line: OrderLine, idx: number) => (
                                <tr
                                  key={idx}
                                  className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                  <td className="py-2 px-2">
                                    NL {line.ingredientId}
                                  </td>
                                  <td className="py-2 px-2">
                                    {line.quantityGram.toFixed(2)}
                                  </td>
                                  <td className="py-2 px-2">
                                    {formatCurrency(line.unitPrice)}
                                  </td>
                                  <td className="py-2 px-2 text-xs bg-blue-50 rounded">
                                    {line.batchNo}
                                  </td>
                                  <td className="py-2 px-2 text-xs">
                                    {line.origin}
                                  </td>
                                  <td className="py-2 px-2 text-xs">
                                    {line.expiryDate}
                                  </td>
                                  <td className="py-2 px-2 text-right font-medium">
                                    {formatCurrency(line.totalPrice)}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tổng cộng:</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {formatCurrency(
                              details.lines.reduce(
                                (sum: number, line: OrderLine) =>
                                  sum + line.totalPrice,
                                0
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
