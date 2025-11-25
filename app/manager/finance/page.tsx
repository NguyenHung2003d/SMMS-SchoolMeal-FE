"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Download } from "lucide-react";
import toast from "react-hot-toast";
import {
  FinanceSummaryDto,
  InvoiceDetailDto,
  InvoiceDto,
  PurchaseOrderDto,
} from "@/types/manager-finance";
import { managerFinanceService } from "@/services/managerFinanceService";
import { Button } from "@/components/ui/button";
import { FinanceStats } from "@/components/manager/finance/FinanceStats";
import { FinanceCharts } from "@/components/manager/finance/FinanceCharts";
import { InvoicesTable } from "@/components/manager/finance/InvoicesTable";
import {
  InvoiceDetailModal,
  ShoppingOrdersModal,
} from "@/components/manager/finance/FinanceModals";

export default function ManagerFinance() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [summary, setSummary] = useState<FinanceSummaryDto | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderDto[]>([]);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceDetailDto | null>(null);
  const [showShoppingModal, setShowShoppingModal] = useState(false);

  const fetchPeriodicData = useCallback(async () => {
    try {
      console.log(
        `🚀 [START] Gọi API Summary cho Tháng ${selectedMonth}/${selectedYear}...`
      );
      const summaryRes = await managerFinanceService.getSummary(
        selectedMonth,
        selectedYear
      );
      console.log("📊 [DATA BE] Summary Response:", summaryRes);

      if (summaryRes) {
        console.log("   - Total Income:", summaryRes.totalIncome);
        console.log("   - Net Income:", summaryRes.netIncome);
        console.log(
          "   - Income By Date Length:",
          summaryRes.incomeByDate?.length
        );
      }
      setSummary(summaryRes);
      try {
        const ordersRes = await managerFinanceService.getPurchaseOrders(
          selectedMonth,
          selectedYear
        );
        setPurchaseOrders(ordersRes || []);
      } catch (err) {
        console.error("❌ Lỗi lấy Orders:", err);
        setPurchaseOrders([]);
      }
    } catch(error) {
      console.error("❌ Lỗi lấy Summary:", error);
      toast.error("Không thể tải dữ liệu tài chính.");
    }
  }, [selectedMonth, selectedYear]);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      console.log("🚀 [START] Gọi API Invoices...");
      let data: InvoiceDto[] = [];
      if (searchQuery.trim())
        data = await managerFinanceService.searchInvoices(searchQuery);
      else if (selectedStatus !== "all")
        data = await managerFinanceService.filterInvoices(selectedStatus);
      else data = await managerFinanceService.getAllInvoices();
      console.log("🧾 [DATA BE] Invoices List:", data);
      
      if (data.length > 0) {
        console.log("   - Sample Invoice #1:", data[0]);
        console.log("   - ParentName:", data[0].parentName); // Check cái này
        console.log("   - Amount:", data[0].amount);         // Check cái này
      } else {
        console.warn("⚠️ Không có hóa đơn nào được trả về!");
      }
      setInvoices(data || []);
    } catch (e) {
      console.error("❌ Lỗi lấy Invoices:", e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    fetchPeriodicData();
  }, [fetchPeriodicData]);
  useEffect(() => {
    const timer = setTimeout(() => fetchInvoices(), 500);
    return () => clearTimeout(timer);
  }, [fetchInvoices]);

  const handleViewInvoice = async (id: number) => {
    try {
      const details = await managerFinanceService.getInvoiceDetail(id);
      setSelectedInvoice(details);
      setShowInvoiceModal(true);
    } catch {
      toast.error("Không thể tải chi tiết hóa đơn");
    }
  };

  const handleExportReport = async () => {
    try {
      const blob = await managerFinanceService.exportFinanceReport(
        selectedMonth,
        selectedYear
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BaoCaoTaiChinh_${selectedMonth}_${selectedYear}.xlsx`;
      a.click();
    } catch {
      toast.error("Lỗi xuất báo cáo");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý hóa đơn & Tài chính
          </h1>
          <p className="text-gray-600">
            Theo dõi thu nhập, chi phí, và chi tiết hóa đơn
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-gray-500" />
            <select
              className="bg-transparent text-sm outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <span className="text-gray-400">/</span>
            <select
              className="bg-transparent text-sm outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <Button
            onClick={handleExportReport}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            <Download size={16} className="mr-2" /> Xuất báo cáo
          </Button>
        </div>
      </div>

      <FinanceStats
        summary={summary}
        onOpenShopping={() => setShowShoppingModal(true)}
        selectedMonth={selectedMonth}
      />
      <FinanceCharts summary={summary} />
      <InvoicesTable
        invoices={invoices}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onViewInvoice={handleViewInvoice}
      />

      {showInvoiceModal && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setShowInvoiceModal(false)}
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
