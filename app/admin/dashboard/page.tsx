"use client";
import DashboardCharts from "@/components/admin/dashboard/DashboardCharts";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { useAuth } from "@/hooks/auth/useAuth";
import { adminDashboardService } from "@/services/adminDashboard.service";
import { AdminDashboardOverview } from "@/types/admin-dashboard"; // Import type
import { AlertCircle, FilePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] =
    useState<AdminDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await adminDashboardService.getOverview();
        setDashboardData(data);
      } catch (err) {
        toast.error("Không thể tải dữ liệu hệ thống. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-2" />
        <p className="text-gray-500 text-sm animate-pulse">
          Đang tải dữ liệu tổng quan...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center text-red-500">
        <AlertCircle className="h-12 w-12 mb-2" />
        <h2 className="text-xl font-bold">Đã xảy ra lỗi</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Tổng quan hệ thống
            </h1>
            <p className="text-gray-600 text-sm">
              Chào mừng quay trở lại, Admin {user?.fullName || "Admin"}! 👋
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md">
              📅 Lọc thời gian
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
              <FilePlus size={18} />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </div>

        {dashboardData && <DashboardStats data={dashboardData} />}

        {dashboardData && <DashboardCharts data={dashboardData} />}
      </div>
    </div>
  );
}
