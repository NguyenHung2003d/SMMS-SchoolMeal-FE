"use client";
import {
  Calendar,
  AlertCircle,
  Plus,
  Pencil,
  Eye,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

// Organize menu by day
// const getWeeklyMenu = (): WeeklyMenuByDay => {
//   const weekDays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];
//   const weeklyMenu = {} as WeeklyMenuByDay;

//   weekDays.forEach((day) => {
//     weeklyMenu[day] = {
//       main: null,
//       dessert: null,
//       date: "",
//     };
//   });

//   upcomingMenuItems.forEach((item) => {
//     if (item.day && weeklyMenu[item.day]) {
//       weeklyMenu[item.day].main = item;
//       weeklyMenu[item.day].date = item.date;
//     }
//   });

//   dessertItems.forEach((item) => {
//     if (item.day && weeklyMenu[item.day]) {
//       weeklyMenu[item.day].dessert = item;
//     }
//   });

//   return weeklyMenu;
// };

export default function UpcomingMenu() {
  // const weeklyMenu = getWeeklyMenu();

  // Navigate weeks
  const navigateWeek = (direction: "prev" | "next") => {
    alert(
      `Đang tải thực đơn ${direction === "prev" ? "tuần trước" : "tuần sau"}...`
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2" size={20} />
          Thực đơn tuần (23/10 - 27/10/2023)
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateWeek("prev")}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigateWeek("next")}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={20} />
          </button>
          <Link
            href={"/kitchen-staff/menu/create"}
            className="ml-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center"
          >
            <Plus size={18} className="mr-2" />
            <span>Tạo thực đơn mới</span>{" "}
          </Link>
        </div>
      </div>

      {/* Weekly menu table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Ngày
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Món chính
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Tráng miệng
              </th>
            </tr>
          </thead>
          <tbody>
          
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
        <div className="flex items-center text-sm text-orange-700">
          <AlertCircle size={16} className="mr-2" />
          <span>
            Lưu ý: Thực đơn có thể thay đổi dựa trên tình trạng kho nguyên liệu
            và yêu cầu đặc biệt.
          </span>
        </div>
      </div>
    </div>
  );
}
