import React from "react";
import { Search, Plus, School, RefreshCcw } from "lucide-react";
import { AcademicYearDto } from "@/types/manager-class";
import { Button } from "@/components/ui/button";

interface ClassToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedYear: string;
  setSelectedYear: (val: string) => void;
  academicYears: AcademicYearDto[];
  onAddClick: () => void;
  handleRefresh: () => void;
  isRefreshing: boolean;
  loading: boolean;
}

export default function ClassToolbar({
  searchQuery,
  setSearchQuery,
  selectedYear,
  setSelectedYear,
  academicYears,
  onAddClick,
  handleRefresh,
  isRefreshing,
  loading, 
}: ClassToolbarProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <School className="h-8 w-8 text-orange-600" /> Quản lý lớp học
          </h1>
          <p className="text-gray-600 mt-1">
            Danh sách lớp học và phân công giáo viên
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
            title="Tải lại dữ liệu"
          >
            <RefreshCcw
              size={16}
              className={`${isRefreshing ? "animate-spin text-blue-600" : ""}`}
            />
          </Button>

          <Button
            onClick={onAddClick}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center shadow-md transition-all"
          >
            <Plus size={18} className="mr-2" />
            Tạo lớp mới
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên lớp..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>

          <div className="md:w-56">
            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">Tất cả niên khóa</option>
              {academicYears.map((y) => (
                <option key={y.yearId} value={y.yearId}>
                  {y.yearName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
