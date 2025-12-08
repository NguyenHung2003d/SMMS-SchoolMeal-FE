import React from "react";
import { Search, Filter } from "lucide-react";

interface InventoryControlBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function InventoryControlBar({
  activeTab,
  setActiveTab,
}: InventoryControlBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "inventory"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Kho nguyên liệu
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "orders"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Đơn đặt hàng
          </button>
        </nav>
      </div>

      <div className="p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm nguyên liệu..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex items-center space-x-2">
          <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="all">Tất cả trạng thái</option>
            <option value="low">Sắp hết</option>
            <option value="expired">Hết hạn</option>
          </select>
          <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
