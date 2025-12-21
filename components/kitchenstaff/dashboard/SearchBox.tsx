"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, Utensils, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { axiosInstance } from "@/lib/axiosInstance";

export function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<{
    ingredients: any[];
    foodItems: any[];
  }>({ ingredients: [], foodItems: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (keyword.trim().length > 1) {
        setIsLoading(true);
        setShowResults(true);
        try {
          const [ingRes, foodRes] = await Promise.all([
            axiosInstance.get(`/nutrition/Ingredients?keyword=${keyword}`),
            axiosInstance.get(`/nutrition/FoodItems?keyword=${keyword}`),
          ]);
          setResults({
            ingredients: ingRes.data.slice(0, 5),
            foodItems: foodRes.data.slice(0, 5),
          });
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setShowResults(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  return (
    <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 size={18} className="text-orange-500 animate-spin" />
          ) : (
            <Search size={18} className="text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm món ăn, nguyên liệu..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all"
        />
        {keyword && (
          <button
            className="absolute right-3 top-2.5 text-gray-400"
            onClick={() => setKeyword("")}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.foodItems.length > 0 && (
              <div className="mb-4">
                <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Utensils size={12} /> Món ăn
                </p>
                {results.foodItems.map((item: any) => (
                  <Link
                    key={item.foodId}
                    href={`/kitchen-staff/food-library?id=${item.foodId}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.foodName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Utensils size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-orange-600">
                        {item.foodName}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.foodType}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {results.ingredients.length > 0 && (
              <div>
                <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Package size={12} /> Nguyên liệu
                </p>
                {results.ingredients.map((ing: any) => (
                  <Link
                    key={ing.ingredientId}
                    href={`/kitchen-staff/inventory?search=${ing.ingredientName}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Package size={14} />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {ing.ingredientName}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {results.foodItems.length === 0 &&
              results.ingredients.length === 0 &&
              !isLoading && (
                <div className="p-6 text-center text-sm text-gray-500">
                  Không tìm thấy kết quả cho "{keyword}"
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
