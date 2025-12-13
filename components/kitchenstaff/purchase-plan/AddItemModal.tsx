import React, { useState, useEffect, useRef } from "react";
import { X, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { kitchenNutritionService } from "@/services/kitchenStaff/kitchenNutrion.service";
import { IngredientDto } from "@/types/kitchen-nutrition";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    ingredientId: number;
    name: string;
    quantity: number;
    type?: string; // Truyền thêm type ra ngoài nếu cần
  }) => void;
}

export default function AddItemModal({
  isOpen,
  onClose,
  onAdd,
}: AddItemModalProps) {
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientDto | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IngredientDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setQuantity(0);
      setSelectedIngredient(null);
      setSearchResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 0 && !selectedIngredient) {
        setIsSearching(true);
        setShowDropdown(true);

        try {
          const data = await kitchenNutritionService.getIngredients(searchTerm);
          setSearchResults(data);
        } catch (error) {
          console.error("Lỗi khi gọi API", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else if (searchTerm.trim() === "") {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedIngredient]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: IngredientDto) => {
    setSelectedIngredient(item);
    setSearchTerm(item.ingredientName);
    setShowDropdown(false);
  };

  const handleAdd = () => {
    if (!selectedIngredient) {
      toast.error("Vui lòng chọn một nguyên liệu từ danh sách");
      return;
    }
    if (quantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }

    onAdd({
      ingredientId: selectedIngredient.ingredientId,
      name: selectedIngredient.ingredientName,
      quantity: quantity,
      type: selectedIngredient.ingredientType,
    });

    setSearchTerm("");
    setSelectedIngredient(null);
    setQuantity(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 relative overflow-visible">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Thêm nguyên liệu bổ sung
        </h3>

        <div className="space-y-4">
          <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên nguyên liệu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="Gõ để tìm kiếm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (selectedIngredient) setSelectedIngredient(null);
                }}
                autoFocus
              />
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={16}
              />

              {isSearching && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="animate-spin text-orange-500" size={16} />
                </div>
              )}
            </div>

            {showDropdown && searchResults.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                  <li
                    key={item.ingredientId}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex justify-between items-center text-sm text-gray-700 border-b border-gray-50 last:border-0"
                  >
                    <span>{item.ingredientName}</span>
                    {item.ingredientType && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded ml-2">
                        {item.ingredientType}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {showDropdown &&
              !isSearching &&
              searchTerm.length > 1 &&
              searchResults.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-center text-sm text-gray-500">
                  Không tìm thấy "{searchTerm}"
                </div>
              )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0"
                min="0"
                step="0.1"
                value={quantity || ""}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
              />
            </div>

            <div className="w-28">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại
              </label>
              <input
                type="text"
                disabled
                className="w-full border border-gray-200 bg-gray-100 rounded-lg p-2.5 text-center text-gray-500 font-medium"
                value={selectedIngredient?.ingredientType || "---"}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedIngredient || quantity <= 0}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
              !selectedIngredient || quantity <= 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
