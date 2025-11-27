import { DollarSign, Users, Activity } from "lucide-react";

export function UserSummaryCard({
  totalUsers,
  activeUsers,
}: {
  totalUsers: number;
  activeUsers: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Tổng người dùng</p>
          <h4 className="text-2xl font-bold text-gray-800">
            {totalUsers.toLocaleString()}
          </h4>
        </div>
      </div>
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-lg text-green-600">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Đang hoạt động</p>
          <h4 className="text-2xl font-bold text-gray-800">
            {activeUsers.toLocaleString()}
          </h4>
        </div>
      </div>
    </div>
  );
}

export function FinanceSummaryCard({
  totalRevenue,
  transactionCount,
}: {
  totalRevenue: number;
  transactionCount: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-4">
        <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Tổng doanh thu</p>
          <h4 className="text-2xl font-bold text-gray-800">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalRevenue)}
          </h4>
        </div>
      </div>
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center gap-4">
        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
          <FileText size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Số lượng giao dịch</p>
          <h4 className="text-2xl font-bold text-gray-800">
            {transactionCount.toLocaleString()}
          </h4>
        </div>
      </div>
    </div>
  );
}

import { FileText } from "lucide-react";
