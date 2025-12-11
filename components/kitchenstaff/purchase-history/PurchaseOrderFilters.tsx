import React from "react";
import { Search, Filter } from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
}

export const PurchaseOrderFilters: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Tìm theo mã đơn, nhà cung cấp..."
            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>

        <div className="flex items-center space-x-3">
          <select
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Draft">Nháp (Draft)</option>
            <option value="Confirmed">Hoàn thành (Confirmed)</option>
          </select>
          <button className="p-2.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-gray-200">
            <Filter size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
