import React from "react";
import { X, Printer, Download } from "lucide-react";
import { formatCurrency, getStatusInfo } from "@/helpers";
import { InvoiceDetailDto, PurchaseOrderDto } from "@/types/manager-finance";
import { managerFinanceService } from "@/services/managerFinanceService";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface InvoiceModalProps {
  invoice: InvoiceDetailDto | null;
  onClose: () => void;
}

export const InvoiceDetailModal = ({ invoice, onClose }: InvoiceModalProps) => {
  if (!invoice) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">
            Chi tiết hóa đơn #{invoice.invoiceId}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Học sinh</p>
              <p className="font-semibold text-gray-800">
                {invoice.studentName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Lớp: {invoice.className}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Kỳ thu</p>
              {/* Sửa: Dùng DateTo vì BE không trả dueDate, hoặc dùng DateFrom - DateTo */}
              <p className="font-medium text-gray-800">
                Tháng {invoice.monthNo} (đến{" "}
                {new Date(invoice.dateTo).toLocaleDateString("vi-VN")})
              </p>
              <div
                className={`mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  getStatusInfo(invoice.status).className
                }`}
              >
                {getStatusInfo(invoice.status).text}
              </div>
            </div>
          </div>

          {/* Table Lịch sử thanh toán (Thay vì Chi tiết item) */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase">
              Lịch sử thanh toán
            </h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-200">
                  <th className="pb-2 font-medium">Ngày thanh toán</th>
                  <th className="pb-2 font-medium">Phương thức</th>
                  <th className="pb-2 font-medium text-right">Số tiền đóng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.payments?.length > 0 ? (
                  invoice.payments.map((payment, i) => (
                    <tr key={i}>
                      <td className="py-2 text-gray-600">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString("vi-VN")
                          : "---"}
                      </td>
                      <td className="py-2 text-gray-600">
                        {payment.method || "Chưa rõ"}
                      </td>
                      <td className="py-2 text-right font-medium text-gray-800">
                        {formatCurrency(payment.paidAmount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-2 text-center text-gray-500 italic"
                    >
                      Chưa có giao dịch thanh toán nào.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200">
                  <td colSpan={2} className="pt-3 font-bold text-gray-800">
                    Tổng tiền hóa đơn
                  </td>
                  <td className="pt-3 text-right font-bold text-blue-600 text-lg">
                    {formatCurrency(invoice.amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button className="px-4 py-2 border bg-white rounded-lg flex items-center text-gray-700 hover:bg-gray-100 shadow-sm">
            <Printer size={16} className="mr-2" /> In hóa đơn
          </button>
          <Button className="flex items-center">
            <Download size={16} className="mr-2" /> Tải PDF
          </Button>
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
      a.click();
    } catch {
      toast.error("Lỗi xuất file");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Chi phí đi chợ - Tháng {month}/{year}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Không có đơn hàng nào trong tháng này.
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition bg-gray-50"
                >
                  <div>
                    <p className="font-bold text-gray-800">
                      Đơn hàng #{order.orderId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ngày:{" "}
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-sm text-gray-500">
                      NCC: {order.supplierName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    {/* Backend có thể chưa trả itemsCount, check lại DTO */}
                    <p className="text-xs text-gray-400">
                      {order.itemsCount || 0} mặt hàng
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 text-right">
          <Button variant="outline" onClick={handleExport}>
            <Download size={16} className="mr-2" /> Xuất Excel chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};
