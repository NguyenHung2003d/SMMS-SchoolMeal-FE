import React from "react";
import Image from "next/image";
import { ChevronRight, CalendarCheck, Utensils } from "lucide-react";
import { formatDate, getDayName } from "@/helpers";
import { DailyMenuCardProps } from "@/types/parent";

export default function DailyMenuCard({
  date,
  meal,
  onOpenModal,
}: DailyMenuCardProps) {
  const foodsList = meal?.items || meal?.foods || [];
  const hasFood = meal && foodsList.length > 0;

  const isToday = new Date().toISOString().split('T')[0] === date;

  return (
    <div className={`
        group relative flex flex-col rounded-2xl border transition-all duration-300 h-full overflow-hidden
        ${isToday
        ? "bg-white border-orange-400 shadow-lg ring-2 ring-orange-100 scale-[1.02]"
        : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200"
      }
    `}>
      <div className={`
        p-4 border-b flex justify-between items-center
        ${isToday ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-700"}
      `}>
        <div>
          <p className={`font-bold text-lg capitalize ${isToday ? "text-white" : "text-gray-800"}`}>
            {getDayName(date)}
          </p>
          <p className={`text-xs ${isToday ? "text-orange-100" : "text-gray-500"}`}>
            {formatDate(date)}
          </p>
        </div>
        {isToday && (
          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm" title="Hôm nay">
            <CalendarCheck size={20} className="text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {hasFood ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-100 text-orange-700 p-1.5 rounded-md">
                <Utensils size={14} />
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Thực đơn trưa
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {foodsList.slice(0, 3).map((food: any) => (
                <div key={food.foodId || food.FoodId} className="flex gap-3 items-center group/item">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100 relative shadow-sm">
                    <Image
                      src={food.imageUrl || food.ImageUrl || "/placeholder.png"}
                      alt={food.foodName || food.FoodName}
                      fill
                      className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 line-clamp-2 group-hover/item:text-orange-600 transition-colors">
                      {food.foodName || food.FoodName}
                    </p>
                  </div>
                </div>
              ))}

              {foodsList.length > 3 && (
                <div className="text-xs text-gray-400 font-medium pl-14 pt-1">
                  + {foodsList.length - 3} món phụ khác...
                </div>
              )}
            </div>

            <button
              onClick={() => meal && onOpenModal(meal)}
              className="w-full mt-auto bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 border border-gray-200 hover:border-orange-200 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all group-hover:translate-y-0"
            >
              Xem chi tiết <ChevronRight size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-300">
            <Utensils size={32} className="mb-2 opacity-20" />
            <p className="text-sm font-medium">Chưa cập nhật</p>
          </div>
        )}
      </div>
    </div>
  );
}