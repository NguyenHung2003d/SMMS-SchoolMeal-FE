import React from "react";
import { AlertCircle } from "lucide-react";

interface EmptyPlanStateProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export default function EmptyPlanState({
  selectedDate,
  setSelectedDate,
}: EmptyPlanStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md border border-gray-100">
        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="text-orange-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Không tìm thấy kế hoạch
        </h3>
        <p className="text-gray-500 mb-6 text-sm">
          Chưa có kế hoạch mua sắm nào cho ngày{" "}
          <strong>{new Date(selectedDate).toLocaleDateString("vi-VN")}</strong>.
          <br />
          Vui lòng tạo kế hoạch từ Lịch Ăn (Schedule) trước.
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
