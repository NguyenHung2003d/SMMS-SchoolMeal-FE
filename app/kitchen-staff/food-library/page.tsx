"use client";
import React, { useState, useEffect } from "react";
import {
  Utensils,
  Search,
  Filter,
  Plus,
  X,
  Save,
  Upload,
  Check,
  Trash2,
  Edit,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  CreateIngredientRequest,
  FoodItemDto,
  IngredientDto,
} from "@/types/kitchen-nutrition";
import { kitchenNutritionService } from "@/services/kitchenNutrion.service";

interface SelectedIngredientUI {
  id: number;
  name: string;
  quantityGram: number;
}

export default function KitchenStaffFoodLibraryPage() {
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState<FoodItemDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);

  const [editingDishId, setEditingDishId] = useState<number | null>(null);
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
  const [newIngredientForm, setNewIngredientForm] =
    useState<CreateIngredientRequest>({
      ingredientName: "",
      ingredientType: "protein",
      energyKcal: 0,
      proteinG: 0,
      fatG: 0,
      carbG: 0,
    });

  // --- EFFECT ---
  useEffect(() => {
    fetchFoods();
  }, [searchQuery]);

  // Tìm kiếm nguyên liệu khi gõ
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (ingredientSearch.trim()) {
        searchIngredients(ingredientSearch);
      } else {
        setIngredientResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [ingredientSearch]);

  // --- ACTIONS ---
  const fetchFoods = async () => {
    setLoading(true);
    try {
      const data = await kitchenNutritionService.getFoods(searchQuery);
      setFoods(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchIngredients = async (keyword: string) => {
    try {
      const data = await kitchenNutritionService.getIngredients(keyword);
      setIngredientResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const openCreateDishModal = () => {
    setEditingDishId(null);
    setDishForm({
      foodName: "",
      foodType: "Món chính",
      foodDesc: "",
      isMainDish: true,
      imageFile: null,
      imageUrlPreview: "",
    });
    setSelectedIngredients([]);
    setIsDishModalOpen(true);
  };

  const openEditDishModal = (dish: FoodItemDto) => {
    setEditingDishId(dish.foodId);
    setDishForm({
      foodName: dish.foodName,
      foodType: dish.foodType || "Món chính",
      foodDesc: dish.foodDesc || "",
      isMainDish: dish.isMainDish,
      imageFile: null,
      imageUrlPreview: dish.imageUrl || "",
    });
    setSelectedIngredients(
      dish.ingredients.map((i) => ({
        id: i.ingredientId,
        name: i.ingredientName || `Nguyên liệu #${i.ingredientId}`,
        quantityGram: i.quantityGram,
      }))
    );
    setIsDishModalOpen(true);
  };

  const handleSaveDish = async () => {
    if (!dishForm.foodName) return toast.error("Vui lòng nhập tên món");
    if (selectedIngredients.length === 0)
      return toast.error("Vui lòng chọn ít nhất 1 nguyên liệu");

    const payloadIngredients = selectedIngredients.map((i) => ({
      ingredientId: i.id,
      quantityGram: i.quantityGram,
    }));

    try {
      if (editingDishId) {
        await kitchenNutritionService.updateFood(editingDishId, {
          foodId: editingDishId,
          foodName: dishForm.foodName,
          foodType: dishForm.foodType,
          foodDesc: dishForm.foodDesc,
          isMainDish: dishForm.isMainDish,
          imageUrl: dishForm.imageUrlPreview, // Giữ nguyên ảnh cũ nếu không upload mới (logic upload update cần xử lý thêm nếu BE hỗ trợ)
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
      setIsDishModalOpen(false);
      fetchFoods();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDeleteDish = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa món này?")) return;
    try {
      await kitchenNutritionService.deleteFood(id);
      toast.success("Đã xóa món ăn");
      fetchFoods();
    } catch (error) {
      toast.error("Không thể xóa (có thể đang được sử dụng)");
    }
  };

  const handleCreateIngredient = async () => {
    if (!newIngredientForm.ingredientName)
      return toast.error("Nhập tên nguyên liệu");
    try {
      const created = await kitchenNutritionService.createIngredient(
        newIngredientForm
      );
      toast.success("Đã tạo nguyên liệu mới");

      addIngredientToDish({
        ingredientId: created.ingredientId,
        ingredientName: created.ingredientName,
      } as any);

      setIsIngredientModalOpen(false);
      setNewIngredientForm({
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

  const addIngredientToDish = (ing: {
    ingredientId: number;
    ingredientName: string;
  }) => {
    if (selectedIngredients.find((x) => x.id === ing.ingredientId)) {
      return toast.error("Nguyên liệu này đã có trong món");
    }
    setSelectedIngredients([
      ...selectedIngredients,
      {
        id: ing.ingredientId,
        name: ing.ingredientName,
        quantityGram: 100,
      },
    ]);
    setIngredientSearch("");
    setIngredientResults([]);
  };

  const removeIngredientFromDish = (id: number) => {
    setSelectedIngredients(selectedIngredients.filter((x) => x.id !== id));
  };

  const updateIngredientQuantity = (id: number, qty: number) => {
    setSelectedIngredients(
      selectedIngredients.map((x) =>
        x.id === id ? { ...x, quantityGram: qty } : x
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thư viện món ăn</h1>
          <p className="text-gray-600 text-sm">
            Quản lý danh sách món ăn và công thức dinh dưỡng
          </p>
        </div>
        <button
          onClick={openCreateDishModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Tạo món mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="all">Tất cả loại</option>
            <option value="Món chính">Món chính</option>
            <option value="Tráng miệng">Tráng miệng</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <div
              key={food.foodId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="h-40 bg-gray-100 relative">
                {food.imageUrl ? (
                  <img
                    src={food.imageUrl}
                    alt={food.foodName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Utensils size={32} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditDishModal(food)}
                    className="p-2 bg-white rounded-full shadow text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteDish(food.foodId)}
                    className="p-2 bg-white rounded-full shadow text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="font-bold text-gray-800 line-clamp-1"
                    title={food.foodName}
                  >
                    {food.foodName}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      food.isMainDish
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {food.isMainDish ? "Món chính" : "Phụ/Khác"}
                  </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 h-10 mb-3">
                  {food.foodDesc || "Chưa có mô tả"}
                </p>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                  <span>{food.ingredients?.length || 0} nguyên liệu</span>
                  <span>#{food.foodId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDishModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingDishId ? "Cập nhật món ăn" : "Tạo món ăn mới"}
              </h3>
              <button onClick={() => setIsDishModalOpen(false)}>
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
                            imageUrlPreview: URL.createObjectURL(
                              e.target.files[0]
                            ),
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
                          <div className="text-xs text-gray-400">
                            ID: {item.id}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            className="w-16 border rounded p-1 text-sm text-right focus:border-orange-500 outline-none"
                            value={item.quantityGram}
                            onChange={(e) =>
                              updateIngredientQuantity(
                                item.id,
                                parseFloat(e.target.value)
                              )
                            }
                          />
                          <span className="text-xs text-gray-500 w-6">
                            gram
                          </span>
                          <button
                            onClick={() => removeIngredientFromDish(item.id)}
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
                onClick={() => setIsDishModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveDish}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
              >
                Lưu món ăn
              </button>
            </div>
          </div>
        </div>
      )}

      {isIngredientModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
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
                  value={newIngredientForm.ingredientName}
                  onChange={(e) =>
                    setNewIngredientForm({
                      ...newIngredientForm,
                      ingredientName: e.target.value,
                    })
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
                  value={newIngredientForm.ingredientType}
                  onChange={(e) =>
                    setNewIngredientForm({
                      ...newIngredientForm,
                      ingredientType: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Energy (Kcal)</label>
                  <input
                    type="number"
                    className="w-full border rounded p-1.5"
                    value={newIngredientForm.energyKcal}
                    onChange={(e) =>
                      setNewIngredientForm({
                        ...newIngredientForm,
                        energyKcal: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Protein (g)</label>
                  <input
                    type="number"
                    className="w-full border rounded p-1.5"
                    value={newIngredientForm.proteinG}
                    onChange={(e) =>
                      setNewIngredientForm({
                        ...newIngredientForm,
                        proteinG: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Fat (g)</label>
                  <input
                    type="number"
                    className="w-full border rounded p-1.5"
                    value={newIngredientForm.fatG}
                    onChange={(e) =>
                      setNewIngredientForm({
                        ...newIngredientForm,
                        fatG: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Carb (g)</label>
                  <input
                    type="number"
                    className="w-full border rounded p-1.5"
                    value={newIngredientForm.carbG}
                    onChange={(e) =>
                      setNewIngredientForm({
                        ...newIngredientForm,
                        carbG: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsIngredientModalOpen(false)}
                className="px-3 py-1.5 border rounded text-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateIngredient}
                className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Tạo & Chọn ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
