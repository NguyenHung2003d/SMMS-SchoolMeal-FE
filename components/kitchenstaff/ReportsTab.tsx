"use client";

import { FileText } from "lucide-react";

export default function ReportsTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Báo cáo</h2>
      <p className="text-gray-500 mb-4">
        Tạo và xem các báo cáo về bữa ăn, nguyên liệu và hoạt động của bếp.
      </p>
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Báo cáo hàng ngày</h3>
          <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            <FileText size={18} className="mr-1" />
            Xuất báo cáo
          </button>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="font-medium">Các loại báo cáo có sẵn:</p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>Báo cáo số lượng bữa ăn theo ngày/tuần/tháng</li>
            <li>Báo cáo sử dụng nguyên liệu</li>
            <li>Báo cáo học sinh có yêu cầu đặc biệt</li>
            <li>Báo cáo đánh giá và phản hồi từ học sinh/phụ huynh</li>
          </ul>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-3">Báo cáo nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium">In danh sách bữa ăn hôm nay</h4>
            <p className="text-gray-500 text-sm">
              Danh sách chi tiết các bữa ăn và số lượng
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium">In danh sách học sinh có dị ứng</h4>
            <p className="text-gray-500 text-sm">
              Thông tin chi tiết về dị ứng của từng học sinh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
