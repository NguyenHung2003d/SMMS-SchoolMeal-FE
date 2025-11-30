"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManagerOverviewDto, RecentPurchaseDto } from "@/types/manager";
import StatsGrid from "@/components/manager/dashboard/StatsGrid";
import QuickAccessGrid from "@/components/manager/dashboard/QuickAccessGrid";
import ReportsGrid from "@/components/manager/dashboard/ReportsGrid";
import { managerDashboardService } from "@/services/managerDashboard.service";
import { managerPurchasesService } from "@/services/managerPurchases.service";
import RecentPurchasesTable from "@/components/manager/dashboard/RecentPurchasesTable";

export default function ManagerDashboardPage() {
  const [overview, setOverview] = useState<ManagerOverviewDto | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchaseDto[]>(
    []
  );
  const [totalMonthExpense, setTotalMonthExpense] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        const [overviewData, purchasesData, financeData] = await Promise.all([
          managerDashboardService.getOverview(),
          managerPurchasesService.getRecentPurchases(8),
          managerPurchasesService.getFinanceSummary(currentMonth, currentYear),
        ]);

        setOverview(overviewData);
        setRecentPurchases(purchasesData);

        const total =
          financeData?.totalExpense ||
          financeData?.totalAmount ||
          overviewData?.financeThisMonth ||
          0;
        setTotalMonthExpense(total);
      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
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
          purchases={recentPurchases}
          totalFinance={totalMonthExpense}
        />
      </div>
    </div>
  );
}
