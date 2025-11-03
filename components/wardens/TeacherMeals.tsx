import React, { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sun,
  Coffee,
  Edit,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
export function TeacherMeals() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Generate dates for the week
  const getDatesForWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(date);
    monday.setDate(diff);
    const dates = [];
    for (let i = 0; i < 5; i++) {
      // Monday to Friday
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  const weekDates = getDatesForWeek(selectedDate);
  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };
  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };
  // Format day for display
  const formatDay = (date: Date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };
  // Mock meal data
  const meals = [
    {
      name: "Cơm gà rau củ",
      description: "Cơm gạo lứt, thịt gà luộc, cà rốt và bông cải xanh",
      allergens: [],
      type: "lunch",
      image: "https://i.imgur.com/wgJDypg.jpg",
    },
    {
      name: "Sữa chua & hoa quả",
      description: "Sữa chua không đường và hoa quả tươi theo mùa",
      allergens: ["Sữa"],
      type: "dessert",
      image: "https://i.imgur.com/K8gDgTf.jpg",
    },
  ];
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Lịch bữa ăn</h1>
      <div className="flex space-x-2">
        <Button variant="outline">Xem thực đơn tháng</Button>
        <Button>Tạo thực đơn mới</Button>
      </div>
      {/* Week selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium flex items-center">
            <Calendar className="mr-2" size={20} />
            Thực đơn tuần
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={previousWeek}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium">
              {formatDate(weekDates[0])} - {formatDate(weekDates[4])}
            </span>
            <button
              onClick={nextWeek}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        {/* Week days */}
        <div className="grid grid-cols-5 gap-4">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`text-center p-2 rounded-lg cursor-pointer ${
                date.toDateString() === new Date().toDateString()
                  ? "bg-orange-100 border border-orange-300"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-medium">{formatDay(date)}</p>
              <p>{formatDate(date)}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Daily menu */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Thực đơn ngày {formatDate(selectedDate)}
          </h2>
          <Button variant="outline" className="flex items-center">
            <Edit size={16} className="mr-2" />
            Chỉnh sửa
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lunch */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-orange-500 text-white px-4 py-2 flex justify-between items-center">
              <div className="flex items-center">
                <Sun size={18} className="mr-2" />
                <span className="font-medium">Bữa trưa</span>
              </div>
              <span className="text-sm">11:30 - 12:30</span>
            </div>
            <div className="p-4">
              <div className="mb-4 rounded-xl overflow-hidden h-48">
                <img
                  src={meals[0].image}
                  alt={meals[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{meals[0].name}</h3>
              <p className="text-gray-600 mb-4">{meals[0].description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {meals[0].allergens.length > 0 ? (
                    <div className="flex items-center text-orange-500">
                      <AlertCircle size={16} className="mr-1" />
                      <span className="text-sm">
                        Dị ứng: {meals[0].allergens.join(", ")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-green-600">
                      Không có dị ứng
                    </span>
                  )}
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  75 học sinh
                </div>
              </div>
            </div>
          </div>
          {/* Dessert */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-orange-500 text-white px-4 py-2 flex justify-between items-center">
              <div className="flex items-center">
                <Coffee size={18} className="mr-2" />
                <span className="font-medium">Tráng miệng</span>
              </div>
              <span className="text-sm">12:30 - 13:00</span>
            </div>
            <div className="p-4">
              <div className="mb-4 rounded-xl overflow-hidden h-48">
                <img
                  src={meals[1].image}
                  alt={meals[1].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{meals[1].name}</h3>
              <p className="text-gray-600 mb-4">{meals[1].description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-orange-500">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">
                    Dị ứng: {meals[1].allergens.join(", ")}
                  </span>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  68 học sinh
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <h3 className="font-medium mb-2 flex items-center">
            <AlertCircle size={18} className="mr-2 text-yellow-500" />
            Lưu ý đặc biệt
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              • Học sinh Nguyễn Minh Anh (lớp 3A) bị dị ứng với sữa - cần chuẩn
              bị thay thế
            </li>
            <li>• Học sinh Trần Hoàng Nam (lớp 2B) bị dị ứng với đậu phộng</li>
            <li>• Có 7 học sinh vắng mặt trong ngày hôm nay</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
