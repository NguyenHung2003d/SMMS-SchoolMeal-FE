"use client";
import { FinanceReportDto, UserReportDto } from "@/types/admin-report";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function UserStatsChart({ data }: { data: UserReportDto[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Thống kê người dùng theo Vai trò
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="roleName" />
            <YAxis />
            <Tooltip
              formatter={(value) => [value, "Người dùng"]}
              contentStyle={{ borderRadius: "8px" }}
            />
            <Legend />
            <Bar
              dataKey="activeUsers"
              name="Đang hoạt động"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="inactiveUsers"
              name="Ngừng hoạt động"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FinanceStatsChart({ data }: { data: FinanceReportDto[] }) {
  const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Doanh thu theo Trường học
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="schoolName" />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", { notation: "compact" }).format(
                  value
                )
              }
            />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)
              }
              contentStyle={{ borderRadius: "8px" }}
            />
            <Legend />
            <Bar
              dataKey="totalRevenue"
              name="Tổng doanh thu"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
