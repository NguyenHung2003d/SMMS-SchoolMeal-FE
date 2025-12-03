"use client";
import React from "react";
import {
  ChefHat,
  Users,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  TriangleAlert,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useKitchenDashboard } from "@/hooks/kitchenStaff/useKitchenDashboard";
import { StatCard } from "@/components/kitchenstaff/dashboard/StatCard";
import { InventoryTable } from "@/components/kitchenstaff/dashboard/InventoryTable";
import { AbsenceList } from "@/components/kitchenstaff/dashboard/AbsenceList";
import { FeedbackList } from "@/components/kitchenstaff/dashboard/FeedbackList";

export default function KitchenStaffDashboard() {
  const { data, loading, refresh, error } = useKitchenDashboard();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-500 font-medium">
            Đang tải dữ liệu nhà bếp...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100 max-w-md">
          <TriangleAlert className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Đã xảy ra lỗi
          </h3>
          <p className="text-gray-500 mb-6">
            {error || "Không có dữ liệu hiển thị."}
          </p>
          <button
            onClick={() => refresh()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center w-full"
          >
            <RefreshCw size={18} className="mr-2" /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  const { todaySummary, absenceRequests, recentFeedbacks, inventoryAlerts } =
    data;

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen font-sans">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ChefHat className="text-orange-600" size={28} />
            </div>
            Bảng Điều Khiển Bếp
          </h1>
          <p className="text-gray-500 mt-2 ml-14">
            Tổng quan hoạt động ngày{" "}
            <span className="font-semibold text-gray-700">
              {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
            </span>
          </p>
        </div>
        <button
          onClick={() => refresh()}
          className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50 text-gray-600 transition-all flex items-center gap-2 text-sm font-medium"
        >
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Suất ăn hôm nay"
          value={todaySummary.totalDailyMealsToday}
          icon={<Utensils size={24} className="text-orange-600" />}
          bgColor="bg-orange-100"
          subText={`${
            todaySummary.totalDishesToday
          } món - TB ${todaySummary.avgDishesPerMealToday.toFixed(1)} món/bữa`}
        />

        <StatCard
          title="Học sinh báo nghỉ"
          value={todaySummary.absenceCountToday}
          icon={<Users size={24} className="text-blue-600" />}
          bgColor="bg-blue-100"
          subText="Đã trừ khỏi suất ăn"
        />

        <StatCard
          title="Cảnh báo kho"
          value={
            todaySummary.lowStockItemCount + todaySummary.nearExpiryItemCount
          }
          icon={<AlertTriangle size={24} className="text-red-600" />}
          bgColor="bg-red-100"
          subText={`${todaySummary.lowStockItemCount} sắp hết, ${todaySummary.nearExpiryItemCount} sắp hết hạn`}
          highlight={
            todaySummary.lowStockItemCount > 0 ||
            todaySummary.nearExpiryItemCount > 0
          }
        />

        <StatCard
          title="Đơn mua đang mở"
          value={todaySummary.openPurchaseOrderCount}
          icon={<ShoppingCart size={24} className="text-purple-600" />}
          bgColor="bg-purple-100"
          subText={`Có ${todaySummary.feedbackCountToday} phản hồi mới`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <InventoryTable items={inventoryAlerts} />

          <AbsenceList requests={absenceRequests} />
        </div>

        <div className="xl:col-span-1">
          <FeedbackList feedbacks={recentFeedbacks} />
        </div>
      </div>
    </div>
  );
}
