"use client";

import { X, AlertTriangle } from "lucide-react";

export default function AddAllergyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Thêm dị ứng mới</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* ...các input select, radio, textarea giống code gốc */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <AlertTriangle size={18} className="text-yellow-500 inline mr-2" />
            <span className="text-sm text-yellow-700">
              Thông tin dị ứng sẽ được thông báo tự động khi thực đơn có món ăn
              liên quan.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Hủy
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Lưu thông tin
          </button>
        </div>
      </div>
    </div>
  );
}
