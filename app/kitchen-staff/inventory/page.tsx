"use client";
import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ShoppingCart,
  RefreshCw,
  BarChart2,
  Clock,
  AlertCircle,
} from "lucide-react";
export default function KitchenStaffInventoryPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý kho nguyên liệu
        </h1>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} className="mr-2" />
          <span>Thêm nguyên liệu</span>
        </button>
      </div>
      {/* Inventory stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Tổng số nguyên liệu
              </p>
              <h3 className="text-3xl font-bold text-gray-800">6</h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUp size={14} className="mr-0.5" /> 2
                </span>
                <span className="text-gray-500">từ tháng trước</span>
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Nguyên liệu sắp hết
              </p>
              <h3 className="text-3xl font-bold text-gray-800">3</h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-red-500 flex items-center mr-1">
                  <ArrowUp size={14} className="mr-0.5" /> 1
                </span>
                <span className="text-gray-500">cần đặt hàng</span>
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Sắp hết hạn
              </p>
              <h3 className="text-3xl font-bold text-gray-800">3</h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-orange-500 flex items-center mr-1">
                  <Clock size={14} className="mr-0.5" /> 3-4
                </span>
                <span className="text-gray-500">ngày còn lại</span>
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertCircle size={24} className="text-orange-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Đơn đặt hàng
              </p>
              <h3 className="text-3xl font-bold text-gray-800">2</h3>
              <p className="mt-2 text-sm flex items-center">
                <span className="text-blue-500 flex items-center mr-1">
                  <RefreshCw size={14} className="mr-0.5" /> Đang xử lý
                </span>
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingCart size={24} className="text-green-500" />
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
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
        {/* Search and filter */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm nguyên liệu..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="all">Tất cả danh mục</option>
              <option value="staples">Nguyên liệu chính</option>
              <option value="meat">Thịt & Hải sản</option>
              <option value="vegetables">Rau củ</option>
              <option value="dairy">Sữa & Trứng</option>
            </select>
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="all">Tất cả trạng thái</option>
              <option value="sufficient">Đầy đủ</option>
              <option value="low">Thấp</option>
              <option value="out">Hết hàng</option>
            </select>
            <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>
      {/* Inventory table */}
      {activeTab === "inventory" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tên nguyên liệu
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Danh mục
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Số lượng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hạn sử dụng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cập nhật cuối
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200"></tbody>
            </table>
          </div>
        </div>
      )}
      {/* Orders table */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Đơn đặt hàng</h2>
            <button className="flex items-center text-sm text-orange-500 hover:text-orange-600">
              <ShoppingCart size={16} className="mr-1" />
              Tạo đơn đặt hàng mới
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nhà cung cấp
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Các mặt hàng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày đặt
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày giao dự kiến
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tổng tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200"></tbody>
            </table>
          </div>
        </div>
      )}
      {/* Expiry alerts */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium flex items-center">
            <AlertCircle className="mr-2 text-orange-500" size={20} />
            Cảnh báo hạn sử dụng
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-4"></div>
        </div>
      </div>
      {/* Add inventory modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Thêm nguyên liệu mới
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên nguyên liệu
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập tên nguyên liệu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Chọn danh mục</option>
                  <option value="staples">Nguyên liệu chính</option>
                  <option value="meat">Thịt & Hải sản</option>
                  <option value="vegetables">Rau củ</option>
                  <option value="dairy">Sữa & Trứng</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">lít</option>
                    <option value="ml">ml</option>
                    <option value="piece">cái/quả</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mức tối thiểu
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập mức tối thiểu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạn sử dụng
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsAddModalOpen(false)}
              >
                Hủy
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Thêm nguyên liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
