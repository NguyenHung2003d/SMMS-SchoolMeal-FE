"use client";
import { dessertItems } from "@/data";
import { AlertCircle, Eye, Pencil, Trash2 } from "lucide-react";

export default function DessertMenu() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dessertItems.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className="bg-white/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                {item.date}
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {item.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Thành phần: {item.ingredients.join(", ")}
            </p>
            {item.allergies.length > 0 && (
              <div className="flex items-center mb-3">
                <AlertCircle size={14} className="text-red-500 mr-1" />
                <span className="text-xs text-red-600">
                  Dị ứng: {item.allergies.join(", ")}
                </span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Calories: {item.nutritionalInfo.calories}</span>
                <span>Protein: {item.nutritionalInfo.protein}g</span>
                <span>Carbs: {item.nutritionalInfo.carbs}g</span>
              </div>
            </div>
            <div className="flex justify-end space-x-1 mt-3">
              <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                <Eye size={18} />
              </button>
              <button className="p-1 text-orange-500 hover:bg-orange-50 rounded">
                <Pencil size={18} />
              </button>
              <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
