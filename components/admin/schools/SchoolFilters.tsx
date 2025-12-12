import React from "react";
import { Search, Filter } from "lucide-react";

interface SchoolFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const SchoolFilters: React.FC<SchoolFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex-1 min-w-[280px] relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm transition"
        />
      </div>

      <div className="flex items-center space-x-3 w-full md:w-auto">
        <Filter size={18} className="text-gray-400" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none min-w-[180px] cursor-pointer"
        >
          <option value="active">Đang hoạt động</option>
          <option value="all">Tất cả trạng thái</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
      </div>
    </div>
  );
};

export default SchoolFilters;
