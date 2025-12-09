import React from "react";
import { Search } from "lucide-react";

interface FeedbackFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const FeedbackFilterBar = ({
  searchTerm,
  setSearchTerm,
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
      </div>
    </div>
  );
};
