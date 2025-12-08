import React from "react";
import { Search, X, Carrot } from "lucide-react";
import { IngredientDto } from "@/types/kitchen-inventory";

interface IngredientSelectorProps {
  label: string;
  type: "main" | "side";
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selected: IngredientDto[];
  suggestions: IngredientDto[];
  onAdd: (type: "main" | "side", ing: IngredientDto) => void;
  onRemove: (type: "main" | "side", id: number) => void;
}

export default function IngredientSelector({
  label,
  type,
  searchTerm,
  setSearchTerm,
  selected,
  suggestions,
  onAdd,
  onRemove,
}: IngredientSelectorProps) {
  const filteredSuggestions = suggestions.filter(
    (s) => !selected.find((sel) => sel.ingredientId === s.ingredientId)
  );

  return (
    <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm relative">
      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <Carrot
          size={16}
          className={type === "main" ? "text-orange-500" : "text-blue-500"}
        />
        {label}
      </label>

      <div className="flex flex-wrap gap-2 mb-2 min-h-[24px]">
        {selected.map((ing) => (
          <span
            key={ing.ingredientId}
            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
              type === "main"
                ? "bg-orange-100 text-orange-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {ing.ingredientName}
            <button
              onClick={() => onRemove(type, ing.ingredientId)}
              className="hover:text-red-500"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Input tìm kiếm */}
      <div className="relative group">
        <input
          type="text"
          placeholder="Tìm & thêm nguyên liệu..."
          className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-purple-300 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />

        {/* Dropdown gợi ý */}
        {searchTerm && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.map((ing) => (
              <div
                key={ing.ingredientId}
                onClick={() => onAdd(type, ing)}
                className="px-3 py-2 text-sm hover:bg-purple-50 cursor-pointer text-gray-700"
              >
                {ing.ingredientName}
              </div>
            ))}
          </div>
        )}
        {searchTerm && filteredSuggestions.length === 0 && (
          <div className="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg p-2 text-xs text-gray-500 text-center">
            Không tìm thấy...
          </div>
        )}
      </div>
    </div>
  );
}
