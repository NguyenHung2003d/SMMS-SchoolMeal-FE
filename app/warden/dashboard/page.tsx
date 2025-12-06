"use client";

import React from "react";
import {
  Users,
  Activity,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { StatsCard } from "@/components/warden/StatsCard";
import { ClassOverview } from "@/components/warden/class/ClassOverview";
import { QuickAccessCard } from "@/components/warden/QuickAccessCard";
import { wardenDashboardService } from "@/services/wardens/wardenDashborad.service";
import { useQuery } from "@tanstack/react-query";

export default function WardenDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["wardenDashboard"],
    queryFn: async () => {
      const [dashboardData, classesData, notificationsData] = await Promise.all(
        [
          wardenDashboardService.getDashboardStats(),
          wardenDashboardService.getClasses(),
          wardenDashboardService.getNotifications(),
        ]
      );

      return {
        classes: classesData,
        stats: {
          totalClasses: dashboardData.totalClasses,
          totalStudents: dashboardData.totalStudents,
          totalPresent: dashboardData.presentToday,
          issuesCount: notificationsData.length,
        },
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] justify-center items-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-[50vh] justify-center items-center text-red-500">
        <p>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const { stats, classes } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard value={stats.totalClasses} label="Lớp học đang quản lý" />
        <StatsCard value={stats.totalStudents} label="Tổng số học sinh" />
        <StatsCard value={stats.totalPresent} label="Có mặt hôm nay" />
        <StatsCard
          value={stats.issuesCount}
          label="Thông báo / Vấn đề"
          colorClass="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickAccessCard
          href="/warden/classView"
          icon={<Users size={32} className="text-blue-600" />}
          bgClass="bg-blue-100"
          title="Xem lớp học"
          desc="Danh sách lớp & học sinh"
        />
        <QuickAccessCard
          href="/warden/health"
          icon={<Activity size={32} className="text-green-600" />}
          bgClass="bg-green-100"
          title="Sức khỏe"
          desc="Chỉ số BMI & Y tế"
        />
        <QuickAccessCard
          href="/warden/gallery"
          icon={<ImageIcon size={32} className="text-purple-600" />}
          bgClass="bg-purple-100"
          title="Thư viện ảnh"
          desc="Hoạt động lớp học"
        />
        <QuickAccessCard
          href="/warden/issues"
          icon={<AlertCircle size={32} className="text-red-600" />}
          bgClass="bg-red-100"
          title="Báo cáo"
          desc="Gửi vấn đề phát sinh"
        />
      </div>

      <ClassOverview classes={classes} />
    </div>
  );
}
