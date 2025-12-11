import { DollarSign, FileText, School, Users } from "lucide-react";
import { StatCard } from "./StatCard";

export const DashboardStats = ({ data }: any) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Tổng trường học"
        value={data.totalSchools || "0"}
        growth={data.schoolGrowth || 0}
        icon={<School size={24} />}
      />
      <StatCard
        label="Tổng học sinh"
        value={(data.totalStudents || 0).toLocaleString()}
        growth={data.studentGrowth || 0}
        icon={<Users size={24} />}
      />
      <StatCard
        label="Doanh thu tháng này"
        value={`${(data.currentMonthRevenue || 0).toLocaleString()} đ`}
        growth={data.revenueGrowth || 0}
        icon={<DollarSign size={24} />}
      />
      <StatCard
        label="Doanh thu tháng trước"
        value={`${(data.previousMonthRevenue || 0).toLocaleString()} đ`}
        growth={null}
        subValue={`${(data.previousMonthRevenue || 0).toLocaleString()} đ`}
        icon={<FileText size={24} />}
      />
    </div>
  );
};
