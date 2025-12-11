"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import StatsGrid from "@/components/manager/dashboard/StatsGrid";
import QuickAccessGrid from "@/components/manager/dashboard/QuickAccessGrid";
import ReportsGrid from "@/components/manager/dashboard/ReportsGrid";
import RecentPurchasesTable from "@/components/manager/dashboard/RecentPurchasesTable";

import { managerDashboardService } from "@/services/manager/managerDashboard.service";
import { managerPurchasesService } from "@/services/manager/managerPurchases.service";

const fetchDashboardData = async () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [overview, purchases, finance] = await Promise.all([
    managerDashboardService.getOverview(),
    managerPurchasesService.getRecentPurchases(8),
    managerPurchasesService.getFinanceSummary(currentMonth, currentYear),
  ]);

  const totalMonthExpense =
    finance?.totalExpense ||
    finance?.totalAmount ||
    overview?.financeThisMonth ||
    0;

  return { overview, purchases, totalMonthExpense };
};

export default function ManagerDashboardPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  if (isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        Đang tải hoá đơn
      </div>
    );
  }

  if (isError) {
    console.error("Dashboard Error:", error);
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[50vh] text-red-500">
        <p className="text-lg font-semibold">
          Không thể tải dữ liệu bảng điều khiển.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 rounded hover:bg-red-200 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const { overview, purchases, totalMonthExpense } = data || {
    overview: null,
    purchases: [],
    totalMonthExpense: 0,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý trường học
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tổng quan hoạt động và tài chính
          </p>
        </div>
      </div>

      <StatsGrid overview={overview} />

      <QuickAccessGrid />

      <ReportsGrid />

      <div className="mt-8">
        <RecentPurchasesTable
          purchases={purchases}
          totalFinance={totalMonthExpense}
        />
      </div>
    </div>
  );
}
