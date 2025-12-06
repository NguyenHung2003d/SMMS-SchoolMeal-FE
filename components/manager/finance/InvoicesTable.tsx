import React from "react";
import { Search, Loader2, Eye } from "lucide-react";
import { InvoiceDto } from "@/types/manager-finance";
import { getStatusInfo } from "@/helpers";

interface InvoicesTableProps {
  invoices: InvoiceDto[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  onViewInvoice: (id: number) => void;
}

const InvoiceRow = React.memo(
  ({
    invoice,
    onView,
  }: {
    invoice: InvoiceDto;
    onView: (id: number) => void;
  }) => {
    const statusInfo = getStatusInfo(invoice.status);

    return (
      <tr className="hover:bg-blue-50/50 transition-colors group">
        <td className="py-3 px-4 text-gray-600">#{invoice.invoiceId}</td>
        <td className="py-3 px-4 font-medium text-gray-800">
          {invoice.className}
        </td>
        <td className="py-3 px-4">{invoice.studentName}</td>
        <td className="py-3 px-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
          >
            {statusInfo.text}
          </span>
        </td>
        <td className="py-3 px-4 text-right">
          <button
            className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-100 rounded transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={() => onView(invoice.invoiceId)}
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </button>
        </td>
      </tr>
    );
  }
);

export const InvoicesTable = React.memo(
  ({
    invoices,
    loading,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    onViewInvoice,
  }: InvoicesTableProps) => {
    return (
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4 bg-gray-50/50">
          <div className="relative max-w-md grow">
            <input
              type="text"
              placeholder="Tìm kiếm: tên HS, mã hóa đơn..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Paid">Đã thanh toán</option>
            <option value="Pending">Chờ thanh toán</option>
            <option value="Overdue">Quá hạn</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Mã HĐ</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4">Học sinh</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin text-blue-500" /> Đang
                      tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Không tìm thấy hóa đơn nào phù hợp.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.invoiceId}
                    invoice={invoice}
                    onView={onViewInvoice}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);
