import React from "react";
import { AlertCircle, CheckCircle2, Loader2, UserCircle } from "lucide-react";

export const LoadingView = () => (
  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
    <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
    <p className="text-gray-500 font-medium">Đang tìm hóa đơn...</p>
  </div>
);

export const ErrorView = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center text-center">
    <AlertCircle className="text-red-500 mb-2" size={32} />
    <p className="text-red-700 font-medium">{message}</p>
    <button
      onClick={onRetry}
      className="mt-3 text-sm text-red-600 underline hover:text-red-800"
    >
      Thử lại
    </button>
  </div>
);

export const EmptyInvoicesView = () => (
  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
    <div className="bg-green-100 p-4 rounded-full mb-4">
      <CheckCircle2 size={48} className="text-green-600" />
    </div>
    <h3 className="text-lg font-bold text-gray-800">Không có khoản phí nào!</h3>
    <p className="text-gray-500 mt-1">
      Tuyệt vời, phụ huynh đã hoàn thành tất cả nghĩa vụ thanh toán.
    </p>
  </div>
);

export const NoStudentSelectedView = () => (
  <div className="flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center shadow-sm min-h-[300px]">
    <div className="bg-gray-50 p-4 rounded-full mb-4">
      <UserCircle size={48} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700">Chưa chọn học sinh</h3>
    <p className="text-gray-500 max-w-md mt-2">
      Vui lòng chọn một học sinh từ danh sách bên trái để xem các khoản phí cần
      thanh toán.
    </p>
  </div>
);
