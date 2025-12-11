import React from "react";
import { ShoppingCart, Check, Package } from "lucide-react";
import { PurchaseOrderSummaryDto } from "@/types/kitchen-purchaseOrder";

interface Props {
  orders: PurchaseOrderSummaryDto[];
}

export const PurchaseStatsCards: React.FC<Props> = ({ orders }) => {
  const totalQuantity = orders.reduce((sum, o) => sum + o.totalQuantityGram, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            Tổng đơn hàng
          </p>
          <h3 className="text-3xl font-bold text-gray-800">{orders.length}</h3>
        </div>
        <div className="bg-blue-50 p-3 rounded-xl">
          <ShoppingCart size={24} className="text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Đơn nháp</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {orders.filter((o) => o.purchaseOrderStatus === "Draft").length}
            <span className="text-sm text-gray-400 font-normal ml-1">đơn</span>
          </h3>
        </div>
        <div className="bg-green-50 p-3 rounded-xl">
          <Check size={24} className="text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            Tổng khối lượng
          </p>
          <h3 className="text-2xl font-bold text-gray-800">
            {new Intl.NumberFormat("vi-VN").format(totalQuantity / 1000)}
            <span className="text-sm font-normal text-gray-500 ml-1">kg</span>
          </h3>
        </div>
        <div className="bg-orange-50 p-3 rounded-xl">
          <Package size={24} className="text-orange-600" />
        </div>
      </div>
    </div>
  );
};
