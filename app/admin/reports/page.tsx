"use client";
import { useEffect, useState } from "react";
import ReportFilterBar from "@/components/admin/reports/ReportFilterBar";
import {
  FinanceStatsChart,
  UserStatsChart,
} from "@/components/admin/reports/ReportCharts";
import {
  FinanceSummaryCard,
  UserSummaryCard,
} from "@/components/admin/reports/SummaryCards";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { FinanceReportDto, UserReportDto } from "@/types/admin-report";
import { adminReportService } from "@/services/admin/adminReport.service";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"users" | "finance">("users");
  const [loading, setLoading] = useState(true);

  const [userReports, setUserReports] = useState<UserReportDto[]>([]);
  const [financeReports, setFinanceReports] = useState<FinanceReportDto[]>([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [userData, financeData] = await Promise.all([
        adminReportService.getAllUserReports(),
        adminReportService.getAllFinanceReports(),
      ]);
      setUserReports(userData);
      setFinanceReports(financeData);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleFilter = async () => {
    if (!fromDate && !toDate) {
      loadInitialData();
      return;
    }

    try {
      setLoading(true);
      if (activeTab === "users") {
        const data = await adminReportService.getUserReportsByFilter({
          fromDate: fromDate ? new Date(fromDate).toISOString() : null,
          toDate: toDate ? new Date(toDate).toISOString() : null,
          scope: "ToanHeThong",
        });
        setUserReports(data);
      } else {
        const data = await adminReportService.getFinanceReportsByFilter({
          fromDate: fromDate || null,
          toDate: toDate || null,
          scope: "TatCa",
        });
        setFinanceReports(data);
      }
      toast.success("Đã cập nhật dữ liệu báo cáo");
    } catch (error) {
      toast.error("Lỗi khi lọc dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = userReports.reduce(
    (acc, curr) => acc + curr.totalUsers,
    0
  );
  const totalActiveUsers = userReports.reduce(
    (acc, curr) => acc + curr.activeUsers,
    0
  );

  const totalRevenue = financeReports.reduce(
    (acc, curr) => acc + curr.totalRevenue,
    0
  );
  const totalTransactions = financeReports.reduce(
    (acc, curr) => acc + curr.revenueCount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Báo cáo thống kê</h1>
          <p className="text-gray-500 mt-1">
            Tổng hợp số liệu về người dùng và tài chính hệ thống
          </p>
        </div>

        <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 w-fit mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "users"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Người dùng
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "finance"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Tài chính
          </button>
        </div>

        <ReportFilterBar
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onFilter={handleFilter}
          isFinance={activeTab === "finance"}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "users" ? (
              <>
                <UserSummaryCard
                  totalUsers={totalUsers}
                  activeUsers={totalActiveUsers}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <UserStatsChart data={userReports} />
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4">Chi tiết theo vai trò</h3>
                    <ul className="space-y-4">
                      {userReports.map((report, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center border-b pb-2 last:border-0"
                        >
                          <span className="text-gray-600 font-medium">
                            {report.roleName}
                          </span>
                          <span className="font-bold text-gray-800">
                            {report.totalUsers}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <FinanceSummaryCard
                  totalRevenue={totalRevenue}
                  transactionCount={totalTransactions}
                />
                <FinanceStatsChart data={financeReports} />

                <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <h3 className="font-bold mb-4">Chi tiết doanh thu</h3>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-semibold">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Tên trường</th>
                        <th className="px-4 py-3">Số lượng giao dịch</th>
                        <th className="px-4 py-3 text-right rounded-tr-lg">
                          Tổng doanh thu
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {financeReports.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {item.schoolName}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {item.revenueCount}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-orange-600">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.totalRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
