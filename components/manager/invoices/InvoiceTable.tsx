import React from "react";
import { Invoice } from "@/types/invoices";
import { Edit, Trash2, Loader2, CalendarDays } from "lucide-react";
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
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-orange-500 h-10 w-10" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        Không tìm thấy hóa đơn nào trong hệ thống.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left font-bold text-gray-700">ID</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700">
              Học sinh
            </th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 whitespace-nowrap">
              Khoảng thời gian
            </th>
            <th className="px-6 py-4 text-center font-bold text-gray-700 whitespace-nowrap italic text-xs">
              Nghỉ tháng trước
            </th>
            <th className="px-6 py-4 text-right font-bold text-gray-700">
              Tổng tiền
            </th>
            <th className="px-6 py-4 text-center font-bold text-gray-700">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-right font-bold text-gray-700">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invoices.map((inv) => (
            <tr
              key={inv.invoiceId}
              className="hover:bg-orange-50/30 transition-colors group"
            >
              <td className="px-6 py-4 font-semibold text-gray-600">
                #{inv.invoiceId}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900">
                {inv.studentName}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-700 h-10 w-10 rounded-lg border border-blue-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase leading-none font-bold">
                      Tháng
                    </span>
                    <span className="text-base font-black leading-none">
                      {inv.monthNo}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 flex flex-col leading-tight whitespace-nowrap">
                    <span>
                      Từ:{" "}
                      <b className="text-gray-700">
                        {formatDate(inv.dateFrom)}
                      </b>
                    </span>
                    <span>
                      Đến:{" "}
                      <b className="text-gray-700">{formatDate(inv.dateTo)}</b>
                    </span>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-center">
                {inv.absentDay > 0 ? (
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 font-bold border border-red-100">
                    {inv.absentDay}
                  </span>
                ) : (
                  <span className="text-gray-300 italic">0</span>
                )}
              </td>

              {/* Total Price */}
              <td className="px-6 py-4 text-right">
                <span className="font-bold text-gray-900 text-base whitespace-nowrap">
                  {formatCurrency(inv.totalPrice)}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                    inv.status === "Paid"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      inv.status === "Paid" ? "bg-green-500" : "bg-amber-500"
                    }`}
                  />
                  {inv.status === "Paid" ? "Đã trả" : "Chờ thu"}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1 overflow-hidden">
                  <button
                    onClick={() => onEdit(inv)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(inv.invoiceId)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
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
  );
};
