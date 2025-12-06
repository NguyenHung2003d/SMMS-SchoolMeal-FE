import React from "react";
import { Invoice } from "@/types/invoices";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/helpers";

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
                "Student ID",
                "Tháng",
                "Thời gian",
                "Nghỉ",
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
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium">#{inv.invoiceId}</td>
                <td className="px-6 py-4">{inv.studentId}</td>
                <td className="px-6 py-4">Tháng {inv.monthNo}</td>
                <td className="px-6 py-4 text-xs">
                  {formatDate(inv.dateFrom)} - {formatDate(inv.dateTo)}
                </td>
                <td className="px-6 py-4 text-red-600 font-medium">
                  {inv.absentDay}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      inv.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {inv.status === "Paid"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(inv)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(inv.invoiceId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
