import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { formatDateForInput, getDayName } from "@/helpers";
import { DailyMenuCardProps } from "@/types/parent";

export default function DailyMenuCard({
  date,
  meal,
  onOpenModal,
}: DailyMenuCardProps) {
  const foodsList = meal?.items || meal?.foods || [];
  const hasFood = meal && foodsList.length > 0;

  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all h-fit">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 border-b border-orange-200">
        <p className="font-bold text-orange-700 text-base">
          {getDayName(date)}
        </p>
        <p className="text-sm text-gray-600">{formatDateForInput(date)}</p>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {hasFood ? (
          <>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              🍽️ Bữa Trưa
            </p>
            <div className="space-y-2 mb-4">
              {foodsList.slice(0, 3).map((food: any) => (
                <div key={food.foodId || food.FoodId} className="flex gap-2">
                  <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300 relative">
                    <Image
                      src={food.imageUrl || food.ImageUrl || "/placeholder.png"}
                      alt={food.foodName || food.FoodName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 line-clamp-2">
                      {food.foodName || food.FoodName}
                    </p>
                  </div>
                </div>
              ))}
              {foodsList.length > 3 && (
                <p className="text-xs text-gray-500 italic pl-2">
                  +{foodsList.length - 3} món khác
                </p>
              )}
            </div>
            <button
              onClick={() => meal && onOpenModal(meal)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 rounded-lg font-medium mt-auto flex items-center justify-center gap-2 transition-all"
            >
              Xem chi tiết <ChevronRight size={16} />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400 text-center">
            <p className="text-sm">Chưa cập nhật</p>
          </div>
        )}
      </div>
    </div>
  );
}
