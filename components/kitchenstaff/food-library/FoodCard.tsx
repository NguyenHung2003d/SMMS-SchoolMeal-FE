import React from "react";
import { Edit, Trash2, Utensils } from "lucide-react";
import { FoodItemDto } from "@/types/kitchen-nutrition";

interface Props {
  food: FoodItemDto;
  onEdit: (food: FoodItemDto) => void;
  onDelete: (id: number) => void;
}

export const FoodCard: React.FC<Props> = ({ food, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
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
            onClick={() => onEdit(food)}
            className="p-2 bg-white rounded-full shadow text-blue-600 hover:text-blue-800"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(food.foodId)}
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
        <div className="pt-3 border-t border-gray-100 flex justify-end items-center text-xs text-gray-500">
          <span>#{food.foodId}</span>
        </div>
      </div>
    </div>
  );
};
