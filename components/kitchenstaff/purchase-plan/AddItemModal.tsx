"use client";
import { Plus } from "lucide-react";

export default function AddItemModal({ setIsAddItemModalOpen }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold">Thêm mặt hàng mới</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* các input giống bản gốc */}
          <input
            type="text"
            placeholder="Tên mặt hàng"
            className="w-full border p-2 rounded"
          />
          <select className="w-full border p-2 rounded">
            <option>Chọn danh mục</option>
          </select>
          {/* ... */}
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            className="px-4 py-2 border rounded-lg"
            onClick={() => setIsAddItemModalOpen(false)}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
            onClick={() => setIsAddItemModalOpen(false)}
          >
            <Plus size={18} className="inline mr-1" /> Thêm mặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}
