import React from "react";
import { Plus } from "lucide-react";
import { AiDishDto } from "@/types/kitchen-menu-create";

interface AiDishCardProps {
  dish: AiDishDto;
  onSelect: (d: AiDishDto) => void;
}

export default function AiDishCard({ dish, onSelect }: AiDishCardProps) {
  return (
    <div
      onClick={() => onSelect(dish)}
      className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group relative"
    >
      <div className="flex justify-between items-start">
        <span className="font-semibold text-gray-800 group-hover:text-purple-700 line-clamp-2">
          {dish.food_name}
        </span>
        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0 ml-2">
          {Math.round(dish.score * 100)}%
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        🔥 {dish.total_kcal} Kcal
      </div>
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-100 text-purple-700 p-1 rounded-full">
        <Plus size={16} />
      </div>
    </div>
  );
}
