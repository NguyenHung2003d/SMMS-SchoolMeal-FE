import React from "react";
import { Utensils, Coffee, AlertCircle, ImageOff, Camera } from "lucide-react";
import { DayMenuRow, DisplayFoodItem } from "@/types/kitchen-menu";

interface Props {
  data: DayMenuRow[];
  onOpenEvidence: (id: number) => void;
}

const DishItem = ({
  dish,
  dotColorClass,
}: {
  dish: DisplayFoodItem;
  dotColorClass: string;
}) => {
  const validIngredients =
    dish.ingredientNames?.filter((name) => name && name.trim().length > 0) ||
    [];
  return (
    <div className="flex items-start gap-3 mb-3 last:mb-0 group/item">
      <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 mt-0.5 shadow-sm relative">
        {dish.imageUrl ? (
          <img
            src={dish.imageUrl}
            alt={dish.foodName}
            className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (
                (e.target as HTMLImageElement).nextSibling as HTMLElement
              ).style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-50"
          style={{ display: dish.imageUrl ? "none" : "flex" }}
        >
          <ImageOff size={16} />
        </div>
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center">
          <span
            className={`w-2 h-2 rounded-full ${dotColorClass} mr-2 shrink-0`}
          ></span>
          <span className="font-medium text-gray-800 text-sm leading-tight truncate">
            {dish.foodName}
          </span>
        </div>
        {validIngredients.length > 0 && (
          <span className="text-xs text-gray-400 mt-1 pl-4 leading-snug truncate">
            {validIngredients.slice(0, 3).join(", ")}
            {validIngredients.length > 3 ? ", ..." : ""}
          </span>
        )}
      </div>
    </div>
  );
};
export const WeeklyMenuTable: React.FC<Props> = ({ data, onOpenEvidence }) => {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-50/80 border-b border-orange-100">
            <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-[20%]">
              Ngày trong tuần
            </th>
            <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-[40%]">
              <div className="flex items-center">
                <Utensils size={16} className="mr-2" /> Món Chính
              </div>
            </th>
            <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-[40%]">
              <div className="flex items-center">
                <Coffee size={16} className="mr-2" /> Tráng miệng / Phụ
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="py-12 text-center text-gray-400 italic"
              >
                <div className="flex flex-col items-center justify-center">
                  <Utensils size={48} className="mb-3 text-gray-200" />
                  Chưa có thực đơn cho tuần này.
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.dailyMealId}
                className="hover:bg-orange-50/30 transition-colors group"
              >
                <td className="py-5 px-6 align-top border-r border-dashed border-gray-100">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-lg capitalize group-hover:text-orange-600 transition-colors">
                      {row.dayName}
                    </span>
                    <span className="text-sm text-gray-500 font-medium mt-1">
                      {row.dateStr}
                    </span>
                    <button
                      onClick={() => onOpenEvidence(row.dailyMealId)}
                      className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-orange-200 text-orange-600 rounded-lg text-xs font-semibold hover:bg-orange-600 hover:text-white transition-all shadow-sm w-fit"
                    >
                      <Camera size={14} />
                      Lưu mẫu
                    </button>
                  </div>
                </td>

                <td className="py-5 px-6 align-top">
                  {row.mainDishes.length > 0 ? (
                    <div className="flex flex-col">
                      {row.mainDishes.map((dish, index) => (
                        <DishItem
                          key={index}
                          dish={dish}
                          dotColorClass="bg-orange-500"
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic flex items-center bg-gray-50 px-3 py-1 rounded-full w-fit">
                      <AlertCircle size={14} className="mr-1" /> Chưa cập nhật
                    </span>
                  )}
                </td>
                <td className="py-5 px-6 align-top border-l border-dashed border-gray-100">
                  {row.sideDishes.length > 0 ? (
                    <div className="flex flex-col">
                      {row.sideDishes.map((dish, idx) => (
                        <DishItem
                          key={idx}
                          dish={dish}
                          dotColorClass="bg-blue-400"
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">--</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
