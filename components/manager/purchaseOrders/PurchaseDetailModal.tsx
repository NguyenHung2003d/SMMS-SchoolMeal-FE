import React from "react";
import { format } from "date-fns";
import {
  XCircle,
  FileText,
  Loader2,
  CheckCircle,
  Package,
  CalendarDays,
  MapPin,
} from "lucide-react";
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

  const totalAmount =
    order?.lines?.reduce(
      (acc, curr) => acc + (curr.quantityGram / 1000) * curr.unitPrice,
      0
    ) || 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <FileText size={24} />
              </div>
              Chi Tiết Đơn Hàng #{order?.orderId || "N/A"}
            </h2>
            <div className="flex items-center gap-3 mt-1.5 ml-1">
              <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                Kế hoạch gốc: Plan-{order?.planId || "N/A"}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                Nhân viên: {order?.staffInCharged || "Chưa phân công"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all"
          >
            <XCircle size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          {isLoading || !order ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 className="animate-spin text-orange-600 w-10 h-10" />
              <p className="text-gray-500 font-medium">
                Đang tải thông tin đơn hàng...
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard
                  icon={<Package size={20} className="text-blue-600" />}
                  label="Nhà Cung Cấp"
                  value={order.supplierName}
                  bgColor="bg-blue-50"
                  borderColor="border-blue-100"
                />
                <InfoCard
                  icon={<CalendarDays size={20} className="text-purple-600" />}
                  label="Ngày Đặt Hàng"
                  value={
                    order.orderDate
                      ? format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")
                      : "N/A"
                  }
                  bgColor="bg-purple-50"
                  borderColor="border-purple-100"
                />
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
                    Trạng Thái
                  </p>
                  <div>{getStatusBadge(order.purchaseOrderStatus)}</div>
                </div>
              </div>

              {order.note && (
                <div className="bg-amber-50 px-6 py-4 rounded-xl border border-amber-200/60 flex gap-3 items-start shadow-sm">
                  <div className="mt-0.5 text-amber-600 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-amber-800 text-sm block mb-0.5">
                      Ghi chú đơn hàng:
                    </span>
                    <p className="text-sm text-amber-800/90 leading-relaxed">
                      {order.note}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left">Tên Nguyên Liệu</th>
                        <th className="px-6 py-4 text-left">Xuất Xứ</th>
                        <th className="px-6 py-4 text-left">Lô Hàng</th>
                        <th className="px-6 py-4 text-center">Hạn Dùng</th>
                        <th className="px-6 py-4 text-right">Số Lượng (g)</th>
                        <th className="px-6 py-4 text-right">Đơn Giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.lines.map((line) => (
                        <tr
                          key={line.linesId}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-bold text-gray-800">
                            {line.ingredientName}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            <div className="flex items-center gap-1.5">
                              {line.origin && (
                                <MapPin size={14} className="text-gray-400" />
                              )}
                              {line.origin || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {line.batchNo ? (
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                                {line.batchNo}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-600">
                            {line.expiryDate
                              ? format(new Date(line.expiryDate), "dd/MM/yyyy")
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-800">
                            {line.quantityGram.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            {line.unitPrice.toLocaleString()} ₫
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-right font-bold text-gray-600 uppercase text-xs tracking-wider"
                        >
                          Tổng Tiền Dự Kiến
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xl font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 whitespace-nowrap">
                            {totalAmount.toLocaleString()} ₫
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {order && (
          <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
            {order.purchaseOrderStatus === "Draft" ||
              order.purchaseOrderStatus === "Pending" ? (
              <>
                <button
                  onClick={onReject}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center gap-2 font-bold shadow-sm disabled:opacity-50 active:scale-95"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  Từ Chối
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center gap-2 font-bold disabled:opacity-50 active:scale-95 hover:-translate-y-0.5"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <CheckCircle size={20} />
                  )}
                  Xác Nhận & Nhập Kho
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-colors shadow-sm active:scale-95"
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

const InfoCard = ({
  icon,
  label,
  value,
  bgColor,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  borderColor: string;
}) => (
  <div
    className={`p-5 rounded-xl border shadow-sm flex items-start gap-4 ${bgColor} ${borderColor} bg-white`}
  >
    <div
      className={`p-2.5 rounded-lg bg-white shadow-sm border border-gray-100`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
        {label}
      </p>
      <p className="font-bold text-gray-800 text-lg line-clamp-1" title={value}>
        {value}
      </p>
    </div>
  </div>
);
