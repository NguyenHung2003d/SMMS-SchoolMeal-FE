"use client";

import { AlertCircle } from "lucide-react";

export default function ExpiryAlerts({ alerts }: { alerts: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <AlertCircle className="mr-2 text-orange-500" size={20} />
        <h2 className="text-lg font-medium">Cảnh báo hạn sử dụng</h2>
      </div>
      <div className="p-4 space-y-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-gray-600">
                Số lượng: {a.quantity} {a.unit}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Hết hạn: {a.expiryDate}
              </div>
              <div className="text-orange-600 font-medium text-sm">
                Còn {a.daysLeft} ngày
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
