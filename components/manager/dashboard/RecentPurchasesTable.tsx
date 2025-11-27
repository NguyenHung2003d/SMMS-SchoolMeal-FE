import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ShoppingCart,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecentPurchaseDto } from "@/types/manager";
import { formatCurrency } from "@/helpers";

interface RecentPurchasesTableProps {
  purchases: RecentPurchaseDto[];
  totalFinance: number;
}

const ITEMS_PER_PAGE = 5;

export default function RecentPurchasesTable({
  purchases,
  totalFinance,
}: RecentPurchasesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(purchases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPurchases = purchases.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    setCurrentPage((pre) => Math.max(pre - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((pre) => Math.min(pre + 1, totalPages));
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Báo cáo thu mua bếp</h2>
        <Link
          href="/manager/kitchen-purchases"
          className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
        >
          Xem tất cả
          <ArrowUpRight size={14} className="ml-1" />
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-medium flex items-center">
            <ShoppingCart className="mr-2" size={18} />
            Các khoản thu mua gần đây
          </h3>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download size={14} className="mr-1" />
            Xuất báo cáo
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhà cung cấp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Chưa có dữ liệu mua hàng gần đây.
                  </td>
                </tr>
              ) : (
                currentPurchases.map((purchase) => (
                  <tr key={purchase.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(purchase.orderDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {purchase.supplierName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {formatCurrency(purchase.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            purchase.status === "Completed" ||
                            purchase.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : purchase.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {purchase.status === "Completed" ||
                        purchase.status === "Paid"
                          ? "Hoàn thành"
                          : purchase.status === "Pending"
                          ? "Chờ xử lý"
                          : purchase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/manager/kitchen-purchases/${purchase.orderId}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {purchases.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
            <div className="text-xs text-gray-300">
              Hiển thị: {startIndex + 1} -{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, purchases.length)} trong{" "}
              {purchases.length} đơn hàng
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-center">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Tổng chi phí tháng này:</span>{" "}
            {formatCurrency(totalFinance)}
          </div>
        </div>
      </div>
    </div>
  );
}
