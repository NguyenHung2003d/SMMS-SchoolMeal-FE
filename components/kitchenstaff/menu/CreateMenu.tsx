"use client";
import { useState } from "react";
import { Plus, Trash2, Save, Eye, X, Search, Check } from "lucide-react";
import { foodLibrary } from "@/data";
import { WeeklyMenu, MenuDay, Meal } from "@/types";
import { useRouter } from "next/navigation";

export function MenuCreationPage() {
  const router = useRouter();
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Weekly menu chỉ có bữa trưa
  const [newMenu, setNewMenu] = useState<WeeklyMenu>({
    weekId: "current",
    period: "Tuần này (16/10 - 20/10)",
    days: [
      { date: "", dayOfWeek: "Thứ Hai", meals: {} },
      { date: "", dayOfWeek: "Thứ Ba", meals: {} },
      { date: "", dayOfWeek: "Thứ Tư", meals: {} },
      { date: "", dayOfWeek: "Thứ Năm", meals: {} },
      { date: "", dayOfWeek: "Thứ Sáu", meals: {} },
    ],
  });

  // Hàm mở modal để chọn món
  const openAddMealModal = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setIsAddDishModalOpen(true);
  };

  // Hàm chọn món
  const handleSelectDish = (foodId: number) => {
    if (selectedDayIndex === null) return;

    const food = foodLibrary.find((f) => f.id === foodId);
    if (!food) return;

    const updatedDays = [...newMenu.days];
    updatedDays[selectedDayIndex].meals.lunch = {
      name: food.name,
      dishes: [food.name],
      calories: food.nutritionalInfo?.calories || undefined,
    };

    setNewMenu({ ...newMenu, days: updatedDays });
    setIsAddDishModalOpen(false);
  };

  // Xóa món ăn
  const removeMeal = (dayIndex: number) => {
    const updatedDays = [...newMenu.days];
    updatedDays[dayIndex].meals.lunch = undefined;
    setNewMenu({ ...newMenu, days: updatedDays });
  };

  // Render từng ngày
  const renderDayCard = (day: MenuDay, index: number) => (
    <div key={index} className="mb-6 pb-6 border-b">
      <h3 className="font-bold text-lg mb-4">{day.dayOfWeek}</h3>
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-2">Bữa trưa</h4>
        {day.meals.lunch ? (
          <div className="relative p-3 bg-orange-50 rounded-lg">
            <p className="font-medium text-orange-700">
              {day.meals.lunch.name}
            </p>
            <div className="flex gap-2 absolute top-2 right-2">
              <button
                className="p-1 bg-white rounded-full shadow"
                onClick={() => removeMeal(index)}
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          </div>
        ) : (
          <button
            className="border-2 border-dashed border-gray-300 rounded-lg h-20 w-full flex items-center justify-center hover:bg-orange-50"
            onClick={() => openAddMealModal(index)}
          >
            <Plus size={20} className="text-gray-500 mr-2" />
            <span className="text-gray-600">Thêm món chính</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo thực đơn mới</h1>

      {/* Render các ngày */}
      <div className="bg-white shadow rounded-lg p-6">
        {newMenu.days.map((day, index) => renderDayCard(day, index))}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          className="px-4 py-2 border rounded-lg"
          onClick={() => router.push("/kitchen-staff/menu")}
        >
          Hủy
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center">
          <Save size={18} className="mr-2" /> Xuất bản thực đơn
        </button>
      </div>

      {/* Modal chọn món */}
      {isAddDishModalOpen && selectedDayIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-3/4 overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Chọn món ăn</h3>
              <button onClick={() => setIsAddDishModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 grid grid-cols-2 gap-4">
              {foodLibrary.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleSelectDish(food.id)}
                  className="border rounded-lg p-3 flex items-center justify-between hover:border-orange-500 cursor-pointer"
                >
                  <span>{food.name}</span>
                  <Check className="text-orange-500" size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
