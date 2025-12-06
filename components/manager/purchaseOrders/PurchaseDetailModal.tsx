import React from "react";
import { format } from "date-fns";
import { XCircle, FileText, Loader2, CheckCircle } from "lucide-react";
import { PurchaseOrderDetail } from "@/types/manager-purchaseOrder";
import { getStatusBadge } from "@/helpers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrderDetail | null;
  isLoading: boolean;
  isProcessing: boolean;
  onConfirm: () => void;
  onReject: () => void;
}

export const PurchaseDetailModal = ({
  isOpen,
  onClose,
  order,
  isLoading,
  isProcessing,
  onConfirm,
  onReject,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-orange-600" />
              Chi Tiết Đơn Hàng #{order?.orderId}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Kế hoạch gốc: Plan-{order?.planId || "N/A"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          {isLoading || !order ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-orange-600 w-8 h-8" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard label="Nhà Cung Cấp" value={order.supplierName} />
                <InfoCard
                  label="Ngày Đặt"
                  value={format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")}
                />
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Trạng Thái
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(order.purchaseOrderStatus)}
                  </div>
                </div>
              </div>

              {order.note && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                  <strong>Ghi chú:</strong> {order.note}
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-medium">
                    <tr>
                      <th className="px-4 py-3 text-left">Tên Nguyên Liệu</th>
                      <th className="px-4 py-3 text-left">Xuất Xứ</th>
                      <th className="px-4 py-3 text-center">Lô Hàng</th>
                      <th className="px-4 py-3 text-center">Hạn Dùng</th>
                      <th className="px-4 py-3 text-right">Số Lượng (g)</th>
                      <th className="px-4 py-3 text-right">Đơn Giá</th>
                      <th className="px-4 py-3 text-right">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.lines.map((line) => (
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
                            ? format(new Date(line.expiryDate), "dd/MM/yyyy")
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
                        {order.lines
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

        {order && (
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            {order.purchaseOrderStatus === "Draft" ? (
              <>
                <button
                  onClick={onReject}
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                  Từ Chối / Hủy
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all flex items-center gap-2 font-medium disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  Xác Nhận Nhập Kho
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Đóng
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
    <p className="font-medium text-gray-900 mt-1">{value}</p>
  </div>
);
