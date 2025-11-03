"use client";
import { Plus, ArrowRight } from "lucide-react";

export default function ReplacementModal({
  selectedItem,
  replacementSuggestions,
  setIsReplacementModalOpen,
  setIsAddItemModalOpen,
  handleReplacement,
}: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Đề xuất thay thế</h3>
          <p className="text-sm text-gray-600">
            Mặt hàng <span className="font-medium">{selectedItem.name}</span>{" "}
            hiện đang hết hàng
          </p>
        </div>
        <div className="p-6 space-y-4">
          {replacementSuggestions.map((s: any) => (
            <div
              key={s.id}
              onClick={() => handleReplacement(selectedItem.id, s.id)}
              className="p-4 border rounded hover:bg-orange-50 cursor-pointer flex justify-between"
            >
              <div>
                <h5 className="font-medium">{s.name}</h5>
                <p className="text-sm text-gray-600">
                  Nhà cung cấp: {s.supplier}
                </p>
              </div>
              <button className="text-orange-500 flex items-center">
                Chọn <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={() => setIsReplacementModalOpen(false)}
            className="border px-4 py-2 rounded"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              setIsReplacementModalOpen(false);
              setIsAddItemModalOpen(true);
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={18} className="mr-1" /> Thêm mặt hàng mới
          </button>
        </div>
      </div>
    </div>
  );
}
