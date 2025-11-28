import React, { useMemo } from "react";
import { X } from "lucide-react";
import { formatCurrency, getStatusInfo } from "@/helpers";
import { InvoiceDetailDto } from "@/types/manager-finance";

interface InvoiceModalProps {
  invoice: InvoiceDetailDto | null;
  onClose: () => void;
}

export const InvoiceDetailModal = ({ invoice, onClose }: InvoiceModalProps) => {
  if (!invoice) return null;

  const totalInvoiceAmount = useMemo(() => {
    if (!invoice.payments) return 0;
    return invoice.payments.reduce(
      (sum, p) => sum + (p.expectedAmount || 0),
      0
    );
  }, [invoice.payments]);

  const totalPaidAmount = useMemo(() => {
    if (!invoice.payments) return 0;
    return invoice.payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  }, [invoice.payments]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">
            Chi tiết hóa đơn #{invoice.invoiceId}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between mb-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <div>
              <p className="text-xs text-blue-500 font-semibold uppercase mb-1">
                Học sinh
              </p>
              <p className="font-bold text-gray-800 text-lg">
                {invoice.studentName}
              </p>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <span className="bg-white px-2 py-0.5 rounded border border-blue-100 text-xs">
                  Lớp {invoice.className}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-500 font-semibold uppercase mb-1">
                Kỳ thu
              </p>
              <p className="font-medium text-gray-800">
                Tháng {invoice.monthNo}
                <span className="text-gray-400 text-sm mx-1">|</span>
                <span className="text-sm">
                  {new Date(invoice.dateFrom).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(invoice.dateTo).toLocaleDateString("vi-VN")}
                </span>
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
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-semibold text-gray-700 text-sm uppercase">
                Chi tiết các khoản thu & Thanh toán
              </h4>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium w-1/4">Ngày đóng</th>
                  <th className="px-4 py-3 font-medium w-1/4">Phương thức</th>
                  <th className="px-4 py-3 font-medium text-right">Phải thu</th>
                  <th className="px-4 py-3 font-medium text-right">
                    Thực đóng
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.payments?.length > 0 ? (
                  invoice.payments.map((payment, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {payment.paidAt ? (
                          new Date(payment.paidAt).toLocaleDateString("vi-VN")
                        ) : (
                          <span className="text-gray-400 italic">
                            Chưa thanh toán
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {payment.method || "---"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-600">
                        {formatCurrency(payment.expectedAmount)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${
                          payment.paidAmount >= payment.expectedAmount
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {formatCurrency(payment.paidAmount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-gray-500 italic"
                    >
                      Không có thông tin thanh toán.
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
                    Tổng cộng:
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-800">
                    {formatCurrency(totalInvoiceAmount)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600 text-base">
                    {formatCurrency(totalPaidAmount)}
                  </td>
                </tr>
                {totalInvoiceAmount > totalPaidAmount && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 font-bold text-red-500 text-right text-xs uppercase tracking-wide"
                    >
                      Còn nợ:
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-red-500">
                      {formatCurrency(totalInvoiceAmount - totalPaidAmount)}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
