import React from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

interface FeedbackFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}

export const FeedbackFilterBar = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
}: FeedbackFilterBarProps) => {
  return (
    <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-4">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Tìm kiếm báo cáo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-300"
          />
          <Search
            className="absolute left-4 top-3.5 text-gray-400 group-hover:text-orange-500 transition-colors duration-300"
            size={20}
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-white border-2 border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300 hover:shadow-md cursor-pointer"
            >
              <option value="all">Tất cả phân loại</option>
              <option value="food">🍽️ Thức ăn</option>
              <option value="facility">🏫 Cơ sở vật chất</option>
              <option value="health">❤️ Sức khỏe</option>
              <option value="activity">🎨 Hoạt động</option>
              <option value="other">📋 Khác</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
          <button className="p-3 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-orange-300 hover:shadow-md">
            <Filter size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
