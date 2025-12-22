import React from "react";
import { Search, Plus, X, AlertTriangle } from "lucide-react";
import { IngredientDto } from "@/types/kitchen-nutrition";

interface AllergyManagerProps {
  allergies: string[];
  searchTerm: string;
  searchResults: IngredientDto[];
  allergyNote: string;
  onSearchChange: (val: string) => void;
  onAddAllergy: (name: string) => void;
  onRemoveAllergy: (name: string) => void;
  onNoteChange: (val: string) => void;
}

export const AllergyManager = ({
  allergies,
  searchTerm,
  searchResults,
  allergyNote,
  onSearchChange,
  onAddAllergy,
  onRemoveAllergy,
  onNoteChange,
}: AllergyManagerProps) => {
  return (
    <div className="pt-4 border-t border-gray-100">
      <label className="flex items-center gap-2 font-bold text-gray-800 mb-4">
        <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
          <AlertTriangle size={18} />
        </div>
        Thông tin dị ứng
      </label>

      <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {allergies.length > 0 ? (
            allergies.map((allergy, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
              >
                <span>
                  {allergy.startsWith("Khác:")
                    ? allergy.replace("Khác:", "")
                    : allergy}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveAllergy(allergy)}
                  className="hover:bg-orange-600 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">
              Chưa có thông tin dị ứng...
            </p>
          )}
        </div>

        <div className="relative">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm thực phẩm gây dị ứng..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-orange-200 rounded-xl focus:border-orange-500 outline-none"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {searchResults.map((ing) => (
                <button
                  key={ing.ingredientId}
                  type="button"
                  onClick={() => onAddAllergy(ing.ingredientName)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center justify-between group"
                >
                  <span className="font-medium text-gray-700">
                    {ing.ingredientName}
                  </span>
                  <Plus
                    size={16}
                    className="text-gray-300 group-hover:text-orange-500"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <textarea
          value={allergyNote}
          onChange={(e) => onNoteChange(e.target.value)}
          className="w-full p-3 border border-orange-100 rounded-xl focus:border-orange-500 outline-none bg-white/50 text-sm"
          placeholder="Ghi chú thêm về biểu hiện dị ứng..."
          rows={2}
        />
      </div>
    </div>
  );
};
