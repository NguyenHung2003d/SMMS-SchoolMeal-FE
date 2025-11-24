import React from "react";
import { Search, Filter } from "lucide-react";

interface StaffToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
}

export default function StaffToolbar({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
}: StaffToolbarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center cursor-pointer hover:bg-gray-50">
            <Filter size={16} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">Lọc vai trò: </span>
          </div>
          <select
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="Teacher">Giáo viên</option>
            <option value="Warden">Quản sinh</option>
            <option value="KitchenStaff">Nhân viên bếp</option>
          </select>
        </div>
      </div>
    </div>
  );
}
