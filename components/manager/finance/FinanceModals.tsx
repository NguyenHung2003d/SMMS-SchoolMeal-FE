import React, { useMemo, useState } from "react";
import { X, Printer, Download, Eye } from "lucide-react";
import { formatCurrency, getStatusInfo } from "@/helpers";
import { InvoiceDetailDto, PurchaseOrderDto } from "@/types/manager-finance";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { managerFinanceService } from "@/services/manager/managerFinance.service";
import PurchaseDetailModal from "../dashboard/PurchaseDetailModal";

interface InvoiceModalProps {
  invoice: InvoiceDetailDto | null;
  onClose: () => void;
  isLoading?: boolean; // Thêm prop loading
}

export const InvoiceDetailModal = ({
  invoice,
  onClose,
  isLoading,
}: InvoiceModalProps) => {
  const { totalInvoiceAmount, totalPaidAmount, remaining } = useMemo(() => {
    if (!invoice?.payments)
      return { totalInvoiceAmount: 0, totalPaidAmount: 0, remaining: 0 };

    const total = invoice.payments.reduce(
      (sum, p) => sum + (p.expectedAmount || 0),
      0
    );
    const paid = invoice.payments.reduce(
      (sum, p) => sum + (p.paidAmount || 0),
      0
    );

    return {
      totalInvoiceAmount: total,
      totalPaidAmount: paid,
      remaining: total - paid,
    };
  }, [invoice]);

  if (!invoice && !isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">
            {isLoading
              ? "Đang tải..."
              : `Chi tiết hóa đơn #${invoice?.invoiceId}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading || !invoice ? (
            <div className="h-40 flex items-center justify-center text-gray-400">
              Đang lấy dữ liệu...
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <div>
                  <p className="text-xs text-blue-500 font-semibold uppercase mb-1">
                    Học sinh
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {invoice.studentName}
                  </p>
                  <span className="bg-white px-2 py-0.5 rounded border border-blue-100 text-xs mt-1 inline-block">
                    Lớp {invoice.className}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-500 font-semibold uppercase mb-1">
                    Kỳ thu
                  </p>
                  <p className="font-medium text-gray-800">
                    Tháng {invoice.monthNo}
                  </p>
                  <div
                    className={`mt-2 inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                      getStatusInfo(invoice.status).className
                    }`}
                  >
                    {getStatusInfo(invoice.status).text}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50">
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="px-4 py-3 font-medium">Ngày đóng</th>
                      <th className="px-4 py-3 font-medium">Phương thức</th>
                      <th className="px-4 py-3 font-medium text-right">
                        Thực đóng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.payments?.length > 0 ? (
                      invoice.payments.map((p, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-600">
                            {p.paidAt
                              ? new Date(p.paidAt).toLocaleDateString("vi-VN")
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {p.method || "---"}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-green-600">
                            {formatCurrency(p.paidAmount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-4 text-center text-gray-400 italic"
                        >
                          Chưa có giao dịch thanh toán
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-3 font-bold text-gray-800 text-right"
                      >
                        Tổng phải thu:
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-800">
                        {formatCurrency(totalInvoiceAmount)}
                      </td>
                    </tr>
                    {remaining > 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-2 font-bold text-red-500 text-right text-xs uppercase"
                        >
                          Còn nợ:
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-red-500">
                          {formatCurrency(remaining)}
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
interface ShoppingModalProps {
  orders: PurchaseOrderDto[];
  onClose: () => void;
  month: number;
  year: number;
}

export const ShoppingOrdersModal = ({
  orders,
  onClose,
  month,
  year,
}: ShoppingModalProps) => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const handleExport = async () => {
    try {
      const blob = await managerFinanceService.exportPurchaseReport(
        month,
        year
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BaoCaoChiPhiDiCho_${month}_${year}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Xuất file thành công!");
    } catch {
      toast.error("Lỗi xuất file");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
          <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Chi phí đi chợ
              </h2>
              <p className="text-sm text-gray-500">
                Tháng {month}/{year}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <Printer size={32} className="text-gray-400" />
                </div>
                Không có đơn hàng nào trong tháng này.
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    onClick={() => setSelectedOrderId(order.orderId)}
                    className="cursor-pointer group border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-all bg-white hover:border-blue-200"
                  >
                    <div className="mb-2 sm:mb-0">
                      <p className="font-bold text-gray-800 flex items-center gap-2">
                        Đơn hàng #{order.orderId}
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">
                          {order.purchaseOrderStatus || "Completed"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Ngày:{" "}
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-sm text-gray-500">
                        NCC:{" "}
                        <span className="font-medium text-gray-700">
                          {order.supplierName}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {order.itemsCount
                            ? `${order.itemsCount} mặt hàng`
                            : "Chi tiết..."}
                        </p>
                      </div>
                      <Eye
                        className="text-gray-300 group-hover:text-blue-500 transition-colors"
                        size={20}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50 text-right">
            <Button
              variant="outline"
              onClick={handleExport}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Download size={16} className="mr-2" /> Xuất Excel báo cáo
            </Button>
          </div>
        </div>
      </div>

      <PurchaseDetailModal
        orderId={selectedOrderId}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </>
  );
};
