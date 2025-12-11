import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  CreateIngredientRequest,
  IngredientDto,
} from "@/types/kitchen-nutrition";
import { kitchenNutritionService } from "@/services/kitchenStaff/kitchenNutrion.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newIngredient: IngredientDto) => void;
}

export const IngredientCreateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState<CreateIngredientRequest>({
    ingredientName: "",
    ingredientType: "protein",
    energyKcal: 0,
    proteinG: 0,
    fatG: 0,
    carbG: 0,
  });

  const handleSubmit = async () => {
    if (!form.ingredientName) return toast.error("Nhập tên nguyên liệu");
    try {
      const created = await kitchenNutritionService.createIngredient(form);
      toast.success("Đã tạo nguyên liệu mới");
      onSuccess(created);
      onClose();
      // Reset form
      setForm({
        ingredientName: "",
        ingredientType: "protein",
        energyKcal: 0,
        proteinG: 0,
        fatG: 0,
        carbG: 0,
      });
    } catch (error) {
      toast.error("Lỗi tạo nguyên liệu");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Thêm nguyên liệu mới
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tên nguyên liệu
            </label>
            <input
              className="w-full border rounded p-2 mt-1"
              value={form.ingredientName}
              onChange={(e) =>
                setForm({ ...form, ingredientName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Loại (Type)
            </label>
            <input
              className="w-full border rounded p-2 mt-1"
              placeholder="VD: Thịt, Rau, Gia vị..."
              value={form.ingredientType}
              onChange={(e) =>
                setForm({ ...form, ingredientType: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Energy (Kcal)</label>
              <input
                type="number"
                className="w-full border rounded p-1.5"
                value={form.energyKcal}
                onChange={(e) =>
                  setForm({ ...form, energyKcal: parseFloat(e.target.value) })
                }
              />
            </div>
            {/* Các trường Protein, Fat, Carb tương tự */}
            <div>
              <label className="text-xs text-gray-500">Protein (g)</label>
              <input
                type="number"
                className="w-full border rounded p-1.5"
                value={form.proteinG}
                onChange={(e) =>
                  setForm({ ...form, proteinG: parseFloat(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Fat (g)</label>
              <input
                type="number"
                className="w-full border rounded p-1.5"
                value={form.fatG}
                onChange={(e) =>
                  setForm({ ...form, fatG: parseFloat(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Carb (g)</label>
              <input
                type="number"
                className="w-full border rounded p-1.5"
                value={form.carbG}
                onChange={(e) =>
                  setForm({ ...form, carbG: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border rounded text-sm"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Tạo & Chọn ngay
          </button>
        </div>
      </div>
    </div>
  );
};
