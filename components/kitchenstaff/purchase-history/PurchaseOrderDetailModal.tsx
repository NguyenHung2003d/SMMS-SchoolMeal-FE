import React from "react";
import { X, Clock, Loader2, ShoppingCart, Download } from "lucide-react";
import { PurchaseOrderDetailDto } from "@/types/kitchen-purchaseOrder";
import { formatCurrency, formatDate } from "@/helpers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrderDetailDto | null;
  loading: boolean;
}

export const PurchaseOrderDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  order,
  loading,
}) => {
  if (!isOpen) return null;

  const calculateOrderTotal = (lines: any[]) =>
    lines.reduce((sum, line) => sum + (line.unitPrice ?? 0), 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pt-10">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              Chi tiết đơn hàng{" "}
              <span className="text-orange-600">#{order?.orderId}</span>
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Clock size={14} /> Ngày tạo:{" "}
              {order ? formatDate(order.orderDate) : "..."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 p-6 bg-white custom-scrollbar">
          {loading || !order ? (
            <div className="flex flex-col justify-center items-center h-40 text-gray-500">
              <Loader2 className="animate-spin mb-2 w-8 h-8 text-orange-500" />
              <span>Đang tải thông tin chi tiết...</span>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Nhà cung cấp
                  </label>
                  <p className="font-semibold text-gray-800 text-lg">
                    {order.supplierName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Người phụ trách
                  </label>
                  <p className="font-medium text-gray-800 text-sm mt-1">
                    ID:{" "}
                    <span className="font-mono text-xs">
                      {order.staffInCharged}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Từ Kế hoạch
                  </label>
                  <p className="font-medium text-gray-800 text-lg">
                    Plan #{order.planId}
                  </p>
                </div>
              </div>

              {order.note && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                    Ghi chú đơn hàng
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 italic">
                    "{order.note}"
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-end mb-3">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-orange-500" /> Danh
                    sách hàng hóa
                  </h4>
                  <span className="text-sm font-medium text-gray-500">
                    {order.lines.length} mặt hàng
                  </span>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                      <tr>
                        <th className="py-3 px-4 text-left">Tên hàng</th>
                        <th className="py-3 px-4 text-center">Số lượng</th>
                        <th className="py-3 px-4 text-right">Đơn giá</th>
                        <th className="py-3 px-4 text-left pl-6">
                          Thông tin lô / Xuất xứ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {order.lines.map((line, idx) => (
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
                          <td className="py-3 px-4 pl-6 text-xs text-gray-500 space-y-1">
                            {line.origin || line.batchNo ? (
                              <div className="flex flex-col gap-1">
                                {line.batchNo && (
                                  <span>
                                    Batch:{" "}
                                    <span className="font-mono text-gray-700">
                                      {line.batchNo}
                                    </span>
                                  </span>
                                )}
                                {line.origin && (
                                  <span>Origin: {line.origin}</span>
                                )}
                              </div>
                            ) : (
                              <span className="italic text-gray-300">N/A</span>
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
                          {formatCurrency(calculateOrderTotal(order.lines))}
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
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 shadow-sm"
          >
            Đóng
          </button>
          {order && (
            <button className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 shadow-sm flex items-center gap-2">
              <Download size={18} /> In Hóa Đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
