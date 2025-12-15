"use client";
import React, { useState } from "react";
import { Calendar, Download, Filter, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FinanceStats } from "@/components/manager/finance/FinanceStats";

import { FinanceCharts } from "@/components/manager/finance/FinanceCharts";
import { InvoicesTable } from "@/components/manager/finance/InvoicesTable";
import { InvoiceDetailModal } from "@/components/manager/finance/FinanceModals";
import { ShoppingOrdersModal } from "@/components/manager/finance/ShoppingOrdersModal";

import { managerFinanceService } from "@/services/manager/managerFinance.service";

import { InvoiceDetailDto } from "@/types/manager-finance";

import { useFinanceData } from "@/hooks/manager/useFinanceData";

export default function ManagerFinance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [isYearlyView, setIsYearlyView] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] =
    useState<InvoiceDetailDto | null>(null);
  const [showShoppingModal, setShowShoppingModal] = useState(false);

  const { summary, purchaseOrders, invoices, loadingInvoices, loadingStats } =
    useFinanceData(selectedMonth, selectedYear, searchQuery, selectedStatus);

  const handleViewInvoice = async (id: number) => {
    setSelectedInvoiceId(id);
    try {
      const details = await managerFinanceService.getInvoiceDetail(id);
      setSelectedInvoiceDetail(details);
    } catch {
      toast.error("Không thể tải chi tiết hóa đơn");
      setSelectedInvoiceId(null); // Đóng nếu lỗi
    }
  };

  const handleCloseInvoiceModal = () => {
    setSelectedInvoiceId(null);
    setSelectedInvoiceDetail(null);
  };

  const handleExportReport = async () => {
    try {
      const blob = await managerFinanceService.exportFinanceReport(
        selectedMonth,
        selectedYear,
        isYearlyView
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const fileName = isYearlyView
        ? `BaoCaoTaiChinh_Nam_${selectedYear}.xlsx`
        : `BaoCaoTaiChinh_Thang_${selectedMonth}_${selectedYear}.xlsx`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      toast.error("Lỗi xuất báo cáo");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý hóa đơn & Tài chính
          </h1>
          <p className="text-gray-600">
            Theo dõi thu nhập, chi phí, và chi tiết hóa đơn
          </p>
        </div>

        <div className="flex flex-wrap space-x-2">
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
            <Filter size={16} className="text-gray-500" />
            <select
              className="bg-transparent text-sm outline-none cursor-pointer font-medium text-gray-700"
              value={isYearlyView ? "year" : "month"}
              onChange={(e) => setIsYearlyView(e.target.value === "year")}
            >
              <option value="month">Xem theo Tháng</option>
              <option value="year">Xem theo Năm</option>
            </select>
          </div>
          {!isYearlyView && (
            <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
              <span className="text-sm text-gray-500 mr-1">Tháng</span>
              <select
                className="bg-transparent text-sm outline-none cursor-pointer"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
            <Calendar size={16} className="text-gray-500" />
            <select
              className="bg-transparent text-sm outline-none cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleExportReport}
            className="flex items-center bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
          >
            <Download size={16} className="mr-2" /> Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {loadingStats && !summary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <FinanceStats
            summary={summary}
            onOpenShopping={() => setShowShoppingModal(true)}
            selectedMonth={selectedMonth}
          />
        )}

        <FinanceCharts summary={summary} />

        <InvoicesTable
          invoices={invoices}
          loading={loadingInvoices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onViewInvoice={handleViewInvoice}
        />
      </div>

      {selectedInvoiceId !== null && (
        <InvoiceDetailModal
          invoice={selectedInvoiceDetail}
          onClose={handleCloseInvoiceModal}
          isLoading={!selectedInvoiceDetail}
        />
      )}

      {showShoppingModal && (
        <ShoppingOrdersModal
          orders={purchaseOrders}
          onClose={() => setShowShoppingModal(false)}
          month={selectedMonth}
          year={selectedYear}
        />
      )}
    </div>
  );
}
