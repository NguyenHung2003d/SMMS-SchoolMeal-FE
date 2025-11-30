"use client";
import { useState, useEffect, useCallback } from "react";
import { KitchenDashboardDto } from "@/types/kitchen-dashboard";
import { kitchenDashboardService } from "@/services/kitchenDashboard.service";

export const useKitchenDashboard = () => {
  const [data, setData] = useState<KitchenDashboardDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await kitchenDashboardService.getKitchenDashboard();
      setData(result);
    } catch (err: any) {
      console.error("Failed to fetch kitchen dashboard", err);

      if (err.response?.status === 401) {
        setError("Phiên đăng nhập hết hạn hoặc không hợp lệ.");
      } else if (err.response?.status === 403) {
        setError("Bạn không có quyền truy cập dữ liệu trường này.");
      } else {
        setError("Không thể tải dữ liệu bảng điều khiển.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refresh: fetchDashboard,
  };
};
