"use client";
import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Check,
  X,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Printer,
  Upload,
  FileText,
  Camera,
  Info,
  Calendar,
  Receipt,
  FileSpreadsheet,
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react";

export default function KitchenStaffPurchasePlanPage() {
  const [activeTab, setActiveTab] = useState("current");
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [isPurchaseConfirmModalOpen, setIsPurchaseConfirmModalOpen] =
    useState(false);
  const [isPurchaseDetailsModalOpen, setIsPurchaseDetailsModalOpen] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [purchaseNote, setPurchaseNote] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [exportContent, setExportContent] = useState({
    pendingItems: true,
    purchasedItems: true,
    outOfStockItems: true,
    costInfo: true,
    supplierInfo: true,
  });
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printSettings, setPrintSettings] = useState({
    paperSize: "a4",
    orientation: "portrait",
    copies: 1,
    quality: "normal",
    margins: "normal",
    printHeader: true,
    printFooter: true,
    printDate: true,
    printPageNumbers: true,
    contentToPrint: {
      pendingItems: true,
      purchasedItems: true,
      outOfStockItems: true,
      statistics: true,
      supplierInfo: true,
      notes: true,
    },
  });
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kế hoạch mua sắm</h1>
        <div className="flex space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
            // onClick={handlePrintClick}
          >
            <Printer size={18} className="mr-2" />
            <span>In danh sách</span>
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
            // onClick={handleExportClick}
          >
            <Download size={18} className="mr-2" />
            <span>Xuất Excel</span>
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            onClick={() => setIsAddItemModalOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            <span>Thêm mặt hàng</span>
          </button>
        </div>
      </div>
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Tổng chi phí ước tính
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {/* {new Intl.NumberFormat("vi-VN").format(totalEstimatedCost)} VND */}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Chưa bao gồm thuế và phí vận chuyển
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Chưa mua</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {/* {pendingCount} mặt hàng */}
              </h3>
              <p className="mt-2 text-sm flex items-center">
                <Clock size={14} className="text-orange-500 mr-1" />
                <span className="text-gray-600">Cần mua sớm</span>
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock size={24} className="text-orange-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Đã mua</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {/* {purchasedCount} mặt hàng */}
              </h3>
              <p className="mt-2 text-sm flex items-center">
                <CheckCircle size={14} className="text-green-500 mr-1" />
                <span className="text-gray-600">Hoàn thành</span>
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Hết hàng</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {/* {outOfStockCount} mặt hàng */}
              </h3>
              <p className="mt-2 text-sm flex items-center">
                <AlertTriangle size={14} className="text-red-500 mr-1" />
                <span className="text-gray-600">Cần thay thế</span>
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("current")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "current"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Danh sách hiện tại
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "previous"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Danh sách trước đây
            </button>
          </nav>
        </div>
        {/* Search and filter */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm mặt hàng..."
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
              <option value="pending">Chưa mua</option>
              <option value="purchased">Đã mua</option>
              <option value="outOfStock">Hết hàng</option>
            </select>
            <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>
      {/* Current shopping list */}
      {activeTab === "current" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tên mặt hàng
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
                    Nhà cung cấp
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Chi phí ước tính
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mức độ ưu tiên
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* {shoppingItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 ${
                      item.status === "outOfStock" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>
                      {item.note && (
                        <div className="text-xs text-gray-500">{item.note}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {item.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.quantity} {item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.supplier}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Intl.NumberFormat("vi-VN").format(
                          item.estimatedCost
                        )}{" "}
                        VND
                      </div>
                      {item.actualCost && (
                        <div className="text-xs text-green-600">
                          Thực tế:{" "}
                          {new Intl.NumberFormat("vi-VN").format(
                            item.actualCost
                          )}{" "}
                          VND
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.urgency === "high"
                            ? "bg-red-100 text-red-800"
                            : item.urgency === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.urgency === "high"
                          ? "Cao"
                          : item.urgency === "medium"
                          ? "Trung bình"
                          : "Thấp"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "purchased"
                            ? "bg-green-100 text-green-800"
                            : item.status === "outOfStock"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status === "purchased"
                          ? "Đã mua"
                          : item.status === "outOfStock"
                          ? "Hết hàng"
                          : "Chưa mua"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        {item.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(item.id, "purchased")
                              }
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title="Đánh dấu đã mua"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(item.id, "outOfStock")
                              }
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Đánh dấu hết hàng"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        {item.status === "purchased" && (
                          <button
                            onClick={() => handleViewPurchaseDetails(item)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {item.status === "outOfStock" && (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsReplacementModalOpen(true);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="Tìm thay thế"
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}
                        <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Previous shopping lists */}
      {activeTab === "previous" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
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
                    Ngày tạo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Số mặt hàng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tổng chi phí
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
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
      {/* Add item modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Thêm mặt hàng mới
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên mặt hàng
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập tên mặt hàng"
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
                  Nhà cung cấp
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Chọn nhà cung cấp</option>
                  <option value="supplier1">Công ty Thực phẩm Sạch</option>
                  <option value="supplier2">Nông trại Xanh</option>
                  <option value="supplier3">Công ty Sữa Vinamilk</option>
                  <option value="supplier4">Trang trại Đồng Nai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chi phí ước tính (VND)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập chi phí ước tính"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mức độ ưu tiên
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="high">Cao</option>
                  <option value="medium">Trung bình</option>
                  <option value="low">Thấp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Nhập ghi chú nếu có"
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsAddItemModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                onClick={() => setIsAddItemModalOpen(false)}
              >
                Thêm mặt hàng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Replacement suggestions modal */}
      {isReplacementModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Đề xuất thay thế
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Mặt hàng:{" "}
                <span className="font-medium">{selectedItem.name}</span> hiện
                đang hết hàng
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-medium mb-4">Các lựa chọn thay thế:</h4>
              <div className="space-y-4"></div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  Bạn cũng có thể thêm mặt hàng thay thế mới bằng cách nhấn vào
                  nút "Thêm mặt hàng mới" bên dưới.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsReplacementModalOpen(false)}
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center"
                onClick={() => {
                  setIsReplacementModalOpen(false);
                  setIsAddItemModalOpen(true);
                }}
              >
                <Plus size={18} className="mr-2" />
                Thêm mặt hàng mới
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Purchase confirmation modal */}
      {isPurchaseConfirmModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Xác nhận mua hàng
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Vui lòng cung cấp thông tin chi tiết về việc mua{" "}
                {selectedItem.name}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chi phí thực tế (VND)
                </label>
                <input
                  type="number"
                  value={actualCost}
                  onChange={(e) => setActualCost(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập chi phí thực tế"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày mua
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phương thức thanh toán
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="cash">Tiền mặt</option>
                  <option value="transfer">Chuyển khoản</option>
                  <option value="credit">Thẻ tín dụng</option>
                  <option value="debit">Thẻ ghi nợ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú mua hàng
                </label>
                <textarea
                  value={purchaseNote}
                  onChange={(e) => setPurchaseNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Nhập ghi chú về việc mua hàng (nếu có)"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tải lên minh chứng (hóa đơn, biên lai)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Nhấn để tải lên</span>{" "}
                          hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG hoặc PDF (Tối đa 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        // onChange={handleFileUpload}
                        accept="image/*,application/pdf"
                      />
                    </label>
                  </div>
                  {/* Uploaded files list */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Đã tải lên:
                      </p>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center">
                              <FileText
                                size={16}
                                className="text-blue-500 mr-2"
                              />
                              <span className="text-sm text-gray-700">
                                Minh chứng {index + 1}
                              </span>
                            </div>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newFiles = [...uploadedFiles];
                                newFiles.splice(index, 1);
                                setUploadedFiles(newFiles);
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-center space-x-4">
                    <button className="flex items-center text-gray-600 text-sm hover:text-gray-800">
                      <Upload size={16} className="mr-1" />
                      Tải lên từ thiết bị
                    </button>
                    <button className="flex items-center text-gray-600 text-sm hover:text-gray-800">
                      <Camera size={16} className="mr-1" />
                      Chụp ảnh
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsPurchaseConfirmModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                // onClick={handleConfirmPurchase}
              >
                <CheckCircle size={18} className="mr-2" />
                Xác nhận mua hàng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Purchase details modal */}
      {isPurchaseDetailsModalOpen && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Chi tiết mua hàng
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Thông tin chi tiết về việc mua {selectedPurchase.name}
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  Đã hoàn thành
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Thông tin sản phẩm
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tên mặt hàng:</span>
                        <span className="font-medium">
                          {selectedPurchase.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Danh mục:</span>
                        <span>{selectedPurchase.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số lượng:</span>
                        <span>
                          {selectedPurchase.quantity} {selectedPurchase.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nhà cung cấp:</span>
                        <span>{selectedPurchase.supplier}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Chi phí
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chi phí ước tính:</span>
                        <span>
                          {new Intl.NumberFormat("vi-VN").format(
                            selectedPurchase.estimatedCost
                          )}{" "}
                          VND
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chi phí thực tế:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat("vi-VN").format(
                            selectedPurchase.actualCost
                          )}{" "}
                          VND
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chênh lệch:</span>
                        <span
                          className={`${
                            selectedPurchase.actualCost <
                            selectedPurchase.estimatedCost
                              ? "text-green-600"
                              : selectedPurchase.actualCost >
                                selectedPurchase.estimatedCost
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {new Intl.NumberFormat("vi-VN").format(
                            selectedPurchase.actualCost -
                              selectedPurchase.estimatedCost
                          )}{" "}
                          VND
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Thông tin thanh toán
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày mua:</span>
                        <span>{selectedPurchase.purchaseDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Người mua:</span>
                        <span>{selectedPurchase.purchaseBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Phương thức thanh toán:
                        </span>
                        <span>{selectedPurchase.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  {selectedPurchase.purchaseNote && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Ghi chú
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                          {selectedPurchase.purchaseNote}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Minh chứng thanh toán
                  </h4>
                  {selectedPurchase.evidence &&
                  selectedPurchase.evidence.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-center mt-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                          <Upload size={14} className="mr-1" />
                          Tải thêm minh chứng
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                      <Receipt size={32} className="text-gray-400 mb-2" />
                      <p className="text-gray-500 text-center">
                        Chưa có minh chứng thanh toán
                      </p>
                      <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <Upload size={14} className="mr-1" />
                        Tải lên minh chứng
                      </button>
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                    <div className="flex items-start">
                      <Info
                        size={18}
                        className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <h5 className="font-medium text-blue-800 mb-1">
                          Lưu ý quan trọng
                        </h5>
                        <p className="text-sm text-blue-700">
                          Minh chứng thanh toán (hóa đơn, biên lai) cần được lưu
                          trữ cho mục đích kiểm toán và báo cáo tài chính.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar size={16} className="mr-1" />
                <span>Cập nhật lần cuối: {selectedPurchase.purchaseDate}</span>
              </div>
              <div className="flex space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => setIsPurchaseDetailsModalOpen(false)}
                >
                  <X size={16} className="mr-2" />
                  Đóng
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center">
                  <Printer size={16} className="mr-2" />
                  In báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Export Excel Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <FileSpreadsheet size={24} className="text-green-600 mr-2" />
                  Xuất danh sách mua sắm
                </h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">
                      Xem trước báo cáo
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-2 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-xs text-gray-500 ml-2">
                            {/* DanhSachMuaSam_{getCurrentDate()}.xlsx */}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-4">
                        <div className="border border-gray-200">
                          {/* Excel preview header */}
                          <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
                            {["A", "B", "C", "D", "E", "F", "G"].map((col) => (
                              <div
                                key={col}
                                className="py-1 px-2 text-xs text-center text-gray-600 border-r border-gray-200 last:border-r-0"
                              >
                                {col}
                              </div>
                            ))}
                          </div>
                          {/* Row numbers */}
                          <div className="flex">
                            <div className="w-8 bg-gray-100 border-r border-gray-200">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <div
                                  key={num}
                                  className="h-8 flex items-center justify-center text-xs text-gray-600 border-b border-gray-200 last:border-b-0"
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                            {/* Excel content */}
                            <div className="flex-grow">
                              {/* Title Row */}
                              <div className="grid grid-cols-7 border-b border-gray-200 bg-blue-50">
                                <div className="py-2 px-2 col-span-7 text-sm font-bold text-center">
                                  DANH SÁCH KẾ HOẠCH MUA SẮM
                                </div>
                              </div>
                              {/* Header Row */}
                              <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                                <div className="py-1 px-2 text-xs font-semibold border-r border-gray-200">
                                  Tên mặt hàng
                                </div>
                                <div className="py-1 px-2 text-xs font-semibold border-r border-gray-200">
                                  Danh mục
                                </div>
                                <div className="py-1 px-2 text-xs font-semibold border-r border-gray-200">
                                  Số lượng
                                </div>
                                <div className="py-1 px-2 text-xs font-semibold border-r border-gray-200">
                                  Đơn vị
                                </div>
                                <div className="py-1 px-2 text-xs font-semibold border-r border-gray-200">
                                  Nhà cung cấp
                                </div>
                                <div className="py-1 px-2 text-xs font-semibold border-r border-gray-200">
                                  Chi phí ước tính
                                </div>
                                <div className="py-1 px-2 text-xs font-semibold">
                                  Trạng thái
                                </div>
                              </div>
                              {/* Summary Row */}
                              <div className="grid grid-cols-7 border-b border-gray-200 bg-blue-50">
                                <div className="py-1 px-2 text-xs font-semibold col-span-5 text-right border-r border-gray-200">
                                  Tổng chi phí ước tính:
                                </div>
                                <div className="py-1 px-2 text-xs font-semibold border-r border-gray-200"></div>
                                <div className="py-1 px-2 text-xs"></div>
                              </div>
                              {/* More rows indicator */}
                              <div className="grid grid-cols-7 border-b border-gray-200">
                                <div className="py-1 px-2 text-xs text-gray-400 col-span-7 text-center">
                                  ... (còn nhiều dòng khác)
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start">
                      <Info
                        size={18}
                        className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm text-blue-800 mb-1">
                          File Excel sẽ bao gồm các thông tin sau:
                        </p>
                        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                          <li>Danh sách các mặt hàng cần mua</li>
                          <li>Thông tin về nhà cung cấp và chi phí</li>
                          <li>Trạng thái mua sắm của từng mặt hàng</li>
                          <li>Thống kê chi phí theo danh mục</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Settings size={18} className="mr-2 text-gray-600" />
                      Tùy chọn xuất
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Định dạng
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="format-excel"
                              name="format"
                              className="h-4 w-4 text-green-600"
                              checked={exportFormat === "excel"}
                              onChange={() => setExportFormat("excel")}
                            />
                            <label
                              htmlFor="format-excel"
                              className="ml-2 text-sm text-gray-700 flex items-center"
                            >
                              <FileSpreadsheet
                                size={16}
                                className="mr-1 text-green-600"
                              />
                              Excel (.xlsx)
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="format-csv"
                              name="format"
                              className="h-4 w-4 text-green-600"
                              checked={exportFormat === "csv"}
                              onChange={() => setExportFormat("csv")}
                            />
                            <label
                              htmlFor="format-csv"
                              className="ml-2 text-sm text-gray-700 flex items-center"
                            >
                              <FileText
                                size={16}
                                className="mr-1 text-gray-600"
                              />
                              CSV (.csv)
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nội dung xuất
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="content-pending"
                              className="h-4 w-4 text-green-600 rounded"
                              checked={exportContent.pendingItems}
                            />
                            <label
                              htmlFor="content-pending"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Mặt hàng chưa mua
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="content-purchased"
                              className="h-4 w-4 text-green-600 rounded"
                              checked={exportContent.purchasedItems}
                            />
                            <label
                              htmlFor="content-purchased"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Mặt hàng đã mua
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="content-outOfStock"
                              className="h-4 w-4 text-green-600 rounded"
                              checked={exportContent.outOfStockItems}
                            />
                            <label
                              htmlFor="content-outOfStock"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Mặt hàng hết hàng
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="content-costInfo"
                              className="h-4 w-4 text-green-600 rounded"
                              checked={exportContent.costInfo}
                              // onChange={() => toggleExportContent("costInfo")}
                            />
                            <label
                              htmlFor="content-costInfo"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Thông tin chi phí
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="content-supplierInfo"
                              className="h-4 w-4 text-green-600 rounded"
                              checked={exportContent.supplierInfo}
                            />
                            <label
                              htmlFor="content-supplierInfo"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Thông tin nhà cung cấp
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên file
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                      <Download size={16} className="mr-2" />
                      Xuất báo cáo
                    </button>
                    <button
                      className="w-full mt-2 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      onClick={() => setShowExportModal(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Print Settings Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <Printer size={24} className="text-blue-600 mr-2" />
                  In danh sách mua sắm
                </h2>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">
                      Xem trước bản in
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-2 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-1 text-gray-500 hover:text-gray-700">
                              <Maximize2 size={14} />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-gray-700">
                              <Minimize2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-4">
                        <div
                          className={`border border-gray-200 ${
                            printSettings.orientation === "landscape"
                              ? "aspect-[1.4/1]"
                              : "aspect-[1/1.4]"
                          } overflow-hidden bg-white`}
                        >
                          {/* Print preview header */}
                          {printSettings.printHeader && (
                            <div className="p-4 border-b border-gray-200">
                              <div className="text-center">
                                <h1 className="text-xl font-bold">
                                  DANH SÁCH KẾ HOẠCH MUA SẮM
                                </h1>
                                <p className="text-gray-500 text-sm">
                                  {/* Ngày: {getCurrentDate().replaceAll("_", "/")} */}
                                </p>
                              </div>
                            </div>
                          )}
                          {/* Print preview content */}
                          <div className="p-4 text-sm">
                            {/* Stats summary */}
                            {printSettings.contentToPrint.statistics && (
                              <div className="mb-4 grid grid-cols-3 gap-2">
                                <div className="border border-gray-200 rounded p-2 text-center">
                                  <p className="font-medium">
                                    Tổng chi phí ước tính
                                  </p>
                                  <p className="text-lg">VND</p>
                                </div>
                                <div className="border border-gray-200 rounded p-2 text-center">
                                  <p className="font-medium">Số mặt hàng</p>
                                  <p className="text-lg"></p>
                                </div>
                                <div className="border border-gray-200 rounded p-2 text-center">
                                  <p className="font-medium">Chưa mua</p>
                                </div>
                              </div>
                            )}
                            {/* Shopping items table */}
                            <table className="min-w-full border border-gray-200 mb-4">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="py-2 px-3 border-b border-r border-gray-200 text-left text-xs font-medium text-gray-500">
                                    Tên mặt hàng
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-200 text-left text-xs font-medium text-gray-500">
                                    Danh mục
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-200 text-left text-xs font-medium text-gray-500">
                                    Số lượng
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-200 text-left text-xs font-medium text-gray-500">
                                    Nhà cung cấp
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-200 text-left text-xs font-medium text-gray-500">
                                    Chi phí ước tính
                                  </th>
                                  <th className="py-2 px-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                                    Trạng thái
                                  </th>
                                </tr>
                              </thead>
                            </table>
                            {/* Notes section */}
                            {printSettings.contentToPrint.notes && (
                              <div className="border border-gray-200 rounded p-3 mb-4">
                                <h3 className="font-medium mb-2">Ghi chú</h3>
                                <p className="text-xs text-gray-600">
                                  Các mặt hàng cần mua gấp: Thịt gà, Trứng gà
                                </p>
                                <p className="text-xs text-gray-600">
                                  Cần tìm nhà cung cấp thay thế cho Sữa tươi
                                </p>
                              </div>
                            )}
                          </div>
                          {/* Print preview footer */}
                          {printSettings.printFooter && (
                            <div className="p-4 border-t border-gray-200 mt-auto">
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <div>Người lập: Nguyễn Thị Tâm</div>
                                {printSettings.printPageNumbers && (
                                  <div>Trang 1 / 1</div>
                                )}
                                {printSettings.printDate && (
                                  <div>
                                    In ngày:{" "}
                                    {/* {getCurrentDate().replaceAll("_", "/")} */}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start">
                      <Info
                        size={18}
                        className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm text-blue-800 mb-1">
                          Lưu ý khi in:
                        </p>
                        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                          <li>Kiểm tra kết nối với máy in trước khi in</li>
                          <li>Đảm bảo máy in có đủ giấy</li>
                          <li>
                            Kiểm tra xem định dạng trang có phù hợp với máy in
                            không
                          </li>
                          <li>
                            Nội dung in có thể khác với bản xem trước tùy thuộc
                            vào cài đặt máy in
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Settings size={18} className="mr-2 text-gray-600" />
                      Tùy chọn in
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Khổ giấy
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={printSettings.paperSize}
                        >
                          <option value="a4">A4 (210 x 297 mm)</option>
                          <option value="a5">A5 (148 x 210 mm)</option>
                          <option value="letter">Letter (216 x 279 mm)</option>
                          <option value="legal">Legal (216 x 356 mm)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hướng giấy
                        </label>
                        <div className="flex space-x-4">
                          <div
                            className={`flex flex-col items-center cursor-pointer ${
                              printSettings.orientation === "portrait"
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            <div
                              className={`border-2 w-12 h-16 rounded ${
                                printSettings.orientation === "portrait"
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm mt-1">Dọc</span>
                          </div>
                          <div
                            className={`flex flex-col items-center cursor-pointer ${
                              printSettings.orientation === "landscape"
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            <div
                              className={`border-2 w-16 h-12 rounded ${
                                printSettings.orientation === "landscape"
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm mt-1">Ngang</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số bản sao
                        </label>
                        <div className="flex items-center">
                          <button className="border border-gray-300 rounded-l-lg px-3 py-2 bg-gray-50 hover:bg-gray-100">
                            <span className="text-gray-500">-</span>
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={printSettings.copies}
                            className="w-16 text-center border-y border-gray-300 py-2 focus:outline-none"
                          />
                          <button className="border border-gray-300 rounded-r-lg px-3 py-2 bg-gray-50 hover:bg-gray-100">
                            <span className="text-gray-500">+</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chất lượng in
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={printSettings.quality}
                        >
                          <option value="draft">Nháp</option>
                          <option value="normal">Thường</option>
                          <option value="high">Cao</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lề trang
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={printSettings.margins}
                        >
                          <option value="normal">Thường (2.54 cm)</option>
                          <option value="narrow">Hẹp (1.27 cm)</option>
                          <option value="wide">Rộng (5.08 cm)</option>
                          <option value="none">Không có lề</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tùy chọn trang
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-header"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={printSettings.printHeader}
                            />
                            <label
                              htmlFor="print-header"
                              className="ml-2 text-sm text-gray-700"
                            >
                              In tiêu đề trang
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-footer"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={printSettings.printFooter}
                            />
                            <label
                              htmlFor="print-footer"
                              className="ml-2 text-sm text-gray-700"
                            >
                              In chân trang
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-date"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={printSettings.printDate}
                            />
                            <label
                              htmlFor="print-date"
                              className="ml-2 text-sm text-gray-700"
                            >
                              In ngày tháng
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-page-numbers"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={printSettings.printPageNumbers}
                            />
                            <label
                              htmlFor="print-page-numbers"
                              className="ml-2 text-sm text-gray-700"
                            >
                              In số trang
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nội dung in
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-pending-items"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={
                                printSettings.contentToPrint.pendingItems
                              }
                            />
                            <label
                              htmlFor="print-pending-items"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Mặt hàng chưa mua
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-purchased-items"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={
                                printSettings.contentToPrint.purchasedItems
                              }
                            />
                            <label
                              htmlFor="print-purchased-items"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Mặt hàng đã mua
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-out-of-stock-items"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={
                                printSettings.contentToPrint.outOfStockItems
                              }
                            />
                            <label
                              htmlFor="print-out-of-stock-items"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Mặt hàng hết hàng
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-statistics"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={printSettings.contentToPrint.statistics}
                            />
                            <label
                              htmlFor="print-statistics"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Thống kê tổng quan
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-supplier-info"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={
                                printSettings.contentToPrint.supplierInfo
                              }
                            />
                            <label
                              htmlFor="print-supplier-info"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Thông tin nhà cung cấp
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="print-notes"
                              className="h-4 w-4 text-blue-600 rounded"
                              checked={printSettings.contentToPrint.notes}
                            />
                            <label
                              htmlFor="print-notes"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Ghi chú
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                      <Printer size={16} className="mr-2" />
                      In danh sách
                    </button>
                    <button
                      className="w-full mt-2 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      onClick={() => setShowPrintModal(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
