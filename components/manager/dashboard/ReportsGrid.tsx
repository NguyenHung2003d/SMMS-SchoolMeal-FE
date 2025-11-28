import React from "react";
import Link from "next/link";
import { BarChart3, CreditCard, ArrowUpRight } from "lucide-react";

export default function ReportsGrid() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Báo cáo và thống kê</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/manager/invoices"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <CreditCard size={24} className="text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Báo cáo hóa đơn</h3>
              <p className="text-xs text-gray-500">
                Xem tất cả hóa đơn và thanh toán
              </p>
            </div>
          </div>
          <button className="w-full py-2 text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center">
            <span>Xem hóa đơn</span>
            <ArrowUpRight size={16} className="ml-1" />
          </button>
        </Link>
      </div>
    </div>
  );
}
