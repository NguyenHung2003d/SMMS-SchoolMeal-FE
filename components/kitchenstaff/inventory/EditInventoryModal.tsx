import React, { useState, useEffect } from "react";
import { X, Save, Edit } from "lucide-react";
import { InventoryItemDto } from "@/types/kitchen-inventory";

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItemDto | null;
  onSave: (itemId: number, data: any) => Promise<void>;
}

export default function EditInventoryModal({
  isOpen,
  onClose,
  item,
  onSave,
}: EditInventoryModalProps) {
  const [formData, setFormData] = useState({
    quantityGram: 0,
    expirationDate: "",
    batchNo: "",
    origin: "",
  });

  useEffect(() => {
    if (item) {
      const dateStr = item.expirationDate
        ? new Date(item.expirationDate).toISOString().split("T")[0]
        : "";
      setFormData({
        quantityGram: item.quantityGram,
        expirationDate: dateStr,
        batchNo: item.batchNo || "",
        origin: item.origin || "",
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async () => {
    if (!item) return;
    await onSave(item.itemId, {
      quantityGram: formData.quantityGram,
      expirationDate: formData.expirationDate || undefined,
      batchNo: formData.batchNo,
      origin: formData.origin,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Edit size={18} className="text-orange-500" />
            Cập nhật kho
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 mb-2">
            Đang sửa: <strong>{item?.ingredientName}</strong> (ID:{" "}
            {item?.itemId})
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng (Gram)
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.quantityGram}
                onChange={(e) => {
                  // FIX LỖI NaN TẠI ĐÂY
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    quantityGram: val === "" ? 0 : parseFloat(val),
                  });
                }}
              />
              <span className="absolute right-3 top-2 text-gray-400 text-sm">
                g
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ~ {(formData.quantityGram / 1000).toFixed(3)} kg
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lô (Batch No)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.batchNo}
                onChange={(e) =>
                  setFormData({ ...formData, batchNo: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xuất xứ
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hạn sử dụng
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              value={formData.expirationDate}
              onChange={(e) =>
                setFormData({ ...formData, expirationDate: e.target.value })
              }
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2 shadow-sm"
            onClick={handleSubmit}
          >
            <Save size={18} /> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
