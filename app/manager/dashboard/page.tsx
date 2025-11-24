"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManagerOverviewDto, RecentPurchaseDto } from "@/types/manager";
import { managerService } from "@/services/managerStaffService";
import StatsGrid from "@/components/manager/dashboard/StatsGrid";
import QuickAccessGrid from "@/components/manager/dashboard/QuickAccessGrid";
import ReportsGrid from "@/components/manager/dashboard/ReportsGrid";
import RecentPurchasesTable from "@/components/manager/dashboard/RecentPurchasesTable";

export default function ManagerDashboardPage() {
  const [overview, setOverview] = useState<ManagerOverviewDto | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchaseDto[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [overviewData, purchasesData] = await Promise.all([
          managerService.getOverview(),
          managerService.getRecentPurchases(),
        ]);
        setOverview(overviewData);
        setRecentPurchases(purchasesData);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý trường học
          </h1>
          <p className="text-gray-600">Chào mừng trở lại, Nguyễn Hoàng</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-gray-500" />
            <select
              defaultValue="month"
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
            >
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
          <Button className="flex items-center">
            <Plus size={16} className="mr-2" />
            Tạo mới
          </Button>
        </div>
      </div>

      <StatsGrid overview={overview} />

      <QuickAccessGrid />

      <ReportsGrid />

      <RecentPurchasesTable
        purchases={recentPurchases}
        totalFinance={overview?.financeThisMonth || 0}
      />
    </div>
  );
}
