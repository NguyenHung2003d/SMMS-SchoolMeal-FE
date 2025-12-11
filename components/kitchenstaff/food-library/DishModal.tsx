import React, { useState, useEffect } from "react";
import { X, Search, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { FoodItemDto, IngredientDto } from "@/types/kitchen-nutrition";
import { kitchenNutritionService } from "@/services/kitchenStaff/kitchenNutrion.service";
import { IngredientCreateModal } from "./IngredientCreateModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: FoodItemDto | null; // Nếu null là tạo mới, có data là edit
}

interface SelectedIngredientUI {
  id: number;
  name: string;
  quantityGram: number;
}

export const DishModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);

  const [dishForm, setDishForm] = useState({
    foodName: "",
    foodType: "Món chính",
    foodDesc: "",
    isMainDish: true,
    imageFile: null as File | null,
    imageUrlPreview: "",
  });

  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredientUI[]
  >([]);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [ingredientResults, setIngredientResults] = useState<IngredientDto[]>(
    []
  );

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDishForm({
          foodName: initialData.foodName,
          foodType: initialData.foodType || "Món chính",
          foodDesc: initialData.foodDesc || "",
          isMainDish: initialData.isMainDish,
          imageFile: null,
          imageUrlPreview: initialData.imageUrl || "",
        });
        setSelectedIngredients(
          initialData.ingredients.map((i) => ({
            id: i.ingredientId,
            name: i.ingredientName || `Nguyên liệu #${i.ingredientId}`,
            quantityGram: i.quantityGram,
          }))
        );
      } else {
        setDishForm({
          foodName: "",
          foodType: "Món chính",
          foodDesc: "",
          isMainDish: true,
          imageFile: null,
          imageUrlPreview: "",
        });
        setSelectedIngredients([]);
      }
      setIngredientSearch("");
      setIngredientResults([]);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (ingredientSearch.trim()) {
        try {
          const data = await kitchenNutritionService.getIngredients(
            ingredientSearch
          );
          setIngredientResults(data);
        } catch (e) {
          console.error(e);
        }
      } else {
        setIngredientResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [ingredientSearch]);

  const handleSave = async () => {
    if (!dishForm.foodName) return toast.error("Vui lòng nhập tên món");
    if (selectedIngredients.length === 0)
      return toast.error("Vui lòng chọn ít nhất 1 nguyên liệu");

    const payloadIngredients = selectedIngredients.map((i) => ({
      ingredientId: i.id,
      quantityGram: i.quantityGram,
    }));

    try {
      if (initialData) {
        await kitchenNutritionService.updateFood(initialData.foodId, {
          foodId: initialData.foodId,
          foodName: dishForm.foodName,
          foodType: dishForm.foodType,
          foodDesc: dishForm.foodDesc,
          isMainDish: dishForm.isMainDish,
          imageUrl: dishForm.imageUrlPreview,
          ingredients: payloadIngredients,
        });
        toast.success("Cập nhật món ăn thành công");
      } else {
        await kitchenNutritionService.createFood({
          foodName: dishForm.foodName,
          foodType: dishForm.foodType,
          foodDesc: dishForm.foodDesc,
          isMainDish: dishForm.isMainDish,
          imageFile: dishForm.imageFile,
          ingredients: payloadIngredients,
        });
        toast.success("Tạo món ăn thành công");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const addIngredientToDish = (ing: {
    ingredientId: number;
    ingredientName: string;
  }) => {
    if (selectedIngredients.find((x) => x.id === ing.ingredientId)) {
      return toast.error("Nguyên liệu này đã có trong món");
    }
    setSelectedIngredients([
      ...selectedIngredients,
      { id: ing.ingredientId, name: ing.ingredientName, quantityGram: 100 },
    ]);
    setIngredientSearch("");
    setIngredientResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            {initialData ? "Cập nhật món ăn" : "Tạo món ăn mới"}
          </h3>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên món ăn *
              </label>
              <input
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                value={dishForm.foodName}
                onChange={(e) =>
                  setDishForm({ ...dishForm, foodName: e.target.value })
                }
                placeholder="VD: Cơm chiên dương châu"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại món
                </label>
                <select
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                  value={dishForm.foodType}
                  onChange={(e) =>
                    setDishForm({ ...dishForm, foodType: e.target.value })
                  }
                >
                  <option value="Món chính">Món chính</option>
                  <option value="Món phụ">Món phụ</option>
                  <option value="Tráng miệng">Tráng miệng</option>
                  <option value="Canh/Súp">Canh/Súp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phân loại
                </label>
                <div className="flex items-center h-10 gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-orange-600"
                    checked={dishForm.isMainDish}
                    onChange={(e) =>
                      setDishForm({
                        ...dishForm,
                        isMainDish: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm">Là món chính</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none"
                value={dishForm.foodDesc}
                onChange={(e) =>
                  setDishForm({ ...dishForm, foodDesc: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setDishForm({
                        ...dishForm,
                        imageFile: e.target.files[0],
                        imageUrlPreview: URL.createObjectURL(e.target.files[0]),
                      });
                    }
                  }}
                />
                {dishForm.imageUrlPreview ? (
                  <img
                    src={dishForm.imageUrlPreview}
                    alt="Preview"
                    className="h-32 mx-auto object-contain rounded"
                  />
                ) : (
                  <div className="text-gray-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">
                      Kéo thả hoặc click để upload
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Công thức (Ingredients)
              </label>
              <button
                onClick={() => setIsIngredientModalOpen(true)}
                className="text-xs text-orange-600 font-medium hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Tạo nguyên liệu mới
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                className="w-full border rounded-lg pl-9 pr-2 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Tìm và thêm nguyên liệu..."
                value={ingredientSearch}
                onChange={(e) => setIngredientSearch(e.target.value)}
              />
              {ingredientResults.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {ingredientResults.map((ing) => (
                    <div
                      key={ing.ingredientId}
                      className="p-2 hover:bg-orange-50 cursor-pointer text-sm flex justify-between"
                      onClick={() => addIngredientToDish(ing)}
                    >
                      <span>{ing.ingredientName}</span>
                      <span className="text-gray-400 text-xs">
                        #{ing.ingredientId}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-y-auto space-y-2">
              {selectedIngredients.length === 0 ? (
                <div className="text-center text-gray-400 text-sm mt-10">
                  Chưa có nguyên liệu nào.
                </div>
              ) : (
                selectedIngredients.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-2 rounded border border-gray-200 flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-800">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400">ID: {item.id}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-16 border rounded p-1 text-sm text-right focus:border-orange-500 outline-none"
                        value={item.quantityGram}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSelectedIngredients((prev) =>
                            prev.map((x) =>
                              x.id === item.id ? { ...x, quantityGram: val } : x
                            )
                          );
                        }}
                      />
                      <span className="text-xs text-gray-500 w-6">gram</span>
                      <button
                        onClick={() =>
                          setSelectedIngredients((prev) =>
                            prev.filter((x) => x.id !== item.id)
                          )
                        }
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            Lưu món ăn
          </button>
        </div>
      </div>

      <IngredientCreateModal
        isOpen={isIngredientModalOpen}
        onClose={() => setIsIngredientModalOpen(false)}
        onSuccess={(ing) =>
          addIngredientToDish({
            ingredientId: ing.ingredientId,
            ingredientName: ing.ingredientName,
          })
        }
      />
    </div>
  );
};
