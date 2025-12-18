import React from "react";
import { Invoice } from "@/types/invoices";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/helpers";

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: number) => void;
}

export const InvoiceTable = ({
  invoices,
  loading,
  onEdit,
  onDelete,
}: InvoiceTableProps) => {
  if (loading && invoices.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-lg border border-gray-200">
        <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-500">
        Không tìm thấy hóa đơn nào.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                "ID",
                "Học sinh",
                "Thời gian",
                "Nghỉ",
                "Tổng tiền",
                "Trạng thái",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left font-semibold text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((inv) => (
              <tr
                key={inv.invoiceId}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4 font-medium">#{inv.invoiceId}</td>
                <td className="px-6 py-4">{inv.studentName}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-700 p-2 rounded-lg border border-blue-100 text-center min-w-[50px]">
                      <span className="block text-xs uppercase font-semibold">
                        Tháng
                      </span>
                      <span className="block text-lg font-bold leading-none">
                        {inv.monthNo}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex flex-col gap-0.5">
                      <span className="flex items-center gap-1">
                        Từ:{" "}
                        <span className="text-gray-900 font-medium">
                          {formatDate(inv.dateFrom)}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        Đến:{" "}
                        <span className="text-gray-900 font-medium">
                          {formatDate(inv.dateTo)}
                        </span>
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {inv.absentDay > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {inv.absentDay}
                    </span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-gray-900 text-base">
                    {formatCurrency(inv.totalPrice)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      inv.status === "Paid"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        inv.status === "Paid" ? "bg-green-500" : "bg-amber-500"
                      }`}
                    ></span>
                    {inv.status === "Paid"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 transition-opacity">
                    <button
                      onClick={() => onEdit(inv)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(inv.invoiceId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
