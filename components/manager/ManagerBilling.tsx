"use client";
import React, { useState } from "react";
import {
  DollarSign,
  Search,
  Filter,
  Calendar,
  Download,
  CheckCircle,
  FileSpreadsheet,
  ArrowRight,
  Clock,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Eye,
  X,
  Info,
  FileText,
  Printer,
  Mail,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { shoppingExpenses } from "@/data/kitchen/expenses";
import { Button } from "../ui/button";
import { bills } from "@/data";
import { invoices } from "@/data/billing/invoices";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ManagerBilling() {
  /** ========== State ========== */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("11");
  const [selectedYear, setSelectedYear] = useState("2023");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  /** ========== Helper functions ========== */
  const formatCurrency = (amount: number) =>
    amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return {
          text: "Đã thanh toán",
          className: "bg-green-100 text-green-800",
        };
      case "pending":
        return {
          text: "Chờ thanh toán",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "overdue":
        return { text: "Quá hạn", className: "bg-red-100 text-red-800" };
      default:
        return { text: status, className: "bg-gray-100 text-gray-800" };
    }
  };

  const getInvoiceTypeInfo = (type: string) => {
    switch (type) {
      case "meal":
        return { text: "Tiền ăn", className: "bg-green-100 text-green-800" };
      default:
        return { text: type, className: "bg-gray-100 text-gray-800" };
    }
  };

  /** ========== Thống kê tổng quan ========== */
  const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidAmount = bills
    .filter((b) => b.status === "paid")
    .reduce((s, b) => s + b.amount, 0);
  const pendingAmount = bills
    .filter((b) => b.status !== "paid")
    .reduce((s, b) => s + b.amount, 0);
  const totalShoppingExpenses = shoppingExpenses.reduce(
    (s, e) => s + e.amount,
    0
  );

  /** ========== Biểu đồ thu nhập / chi phí ========== */
  const incomeChartData: ChartData<"bar"> = {
    labels: ["Tiền ăn"],
    datasets: [
      {
        label: "Thu nhập (triệu VND)",
        data: [
          bills
            .filter((b) => b.type === "tuition")
            .reduce((s, b) => s + b.amount, 0) / 1_000_000,
          bills
            .filter((b) => b.type === "meal")
            .reduce((s, b) => s + b.amount, 0) / 1_000_000,
          bills
            .filter((b) => b.type === "activity")
            .reduce((s, b) => s + b.amount, 0) / 1_000_000,
        ],
        backgroundColor: ["#60a5fa", "#4ade80", "#a78bfa"],
        borderColor: ["#3b82f6", "#22c55e", "#8b5cf6"],
        borderWidth: 1,
      },
    ],
  };

  const incomeChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  const expensesChartData: ChartData<"pie"> = {
    labels: shoppingExpenses.map((e) => e.vendor),
    datasets: [
      {
        data: shoppingExpenses.map((e) => e.amount / 1_000_000),
        backgroundColor: ["#fbbf24", "#34d399", "#60a5fa", "#f87171"],
      },
    ],
  };

  /** ========== Lọc hóa đơn ========== */
  const filteredInvoices = invoices.filter(
    (inv) =>
      (inv.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.parent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedStatus === "all" || inv.status === selectedStatus)
  );

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  /** ========== JSX ========== */
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
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
              className="bg-transparent text-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <select
              className="bg-transparent text-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <Button className="flex items-center">
            <Download size={16} className="mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold mb-3 flex items-center">
            <TrendingUp size={18} className="text-green-500 mr-2" />
            Thu nhập từ phụ huynh
          </h2>
          <div className="h-64">
            <Bar data={incomeChartData} options={incomeChartOptions} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold mb-3 flex items-center">
            <ShoppingCart size={18} className="text-red-500 mr-2" />
            Chi phí đi chợ
          </h2>
          <div className="h-64">
            <Pie data={expensesChartData} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Tổng hóa đơn</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalAmount)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Đã thanh toán</p>
          <h3 className="text-2xl font-bold text-green-600">
            {formatCurrency(paidAmount)}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Chưa thanh toán</p>
          <h3 className="text-2xl font-bold text-yellow-600">
            {formatCurrency(pendingAmount)}
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between gap-4">
        <div className="relative max-w-md flex-grow">
          <input
            type="text"
            placeholder="Tìm kiếm hóa đơn..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="paid">Đã thanh toán</option>
          <option value="pending">Chờ thanh toán</option>
          <option value="overdue">Quá hạn</option>
        </select>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
            <tr>
              <th className="py-3 px-4">Mã</th>
              <th className="py-3 px-4">Loại</th>
              <th className="py-3 px-4">Học sinh</th>
              <th className="py-3 px-4">Phụ huynh</th>
              <th className="py-3 px-4">Số tiền</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => {
              const statusInfo = getStatusInfo(invoice.status);
              const typeInfo = getInvoiceTypeInfo(invoice.type);
              return (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{invoice.id}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.className}`}
                    >
                      {typeInfo.text}
                    </span>
                  </td>
                  <td className="py-3 px-4">{invoice.student}</td>
                  <td className="py-3 px-4">{invoice.parent}</td>
                  <td className="py-3 px-4 font-medium">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
                    >
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Chi tiết hóa đơn */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chi tiết hóa đơn</h2>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-semibold">{selectedInvoice.id}</h3>
              <p className="text-sm text-gray-500">
                Ngày tạo: {selectedInvoice.dueDate}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">Chi tiết thanh toán</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th>Mô tả</th>
                    <th className="text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.description}</td>
                      <td className="text-right">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 border rounded-lg flex items-center text-gray-700 hover:bg-gray-50">
                <Printer size={16} className="mr-2" /> In
              </button>
              <button className="px-4 py-2 border rounded-lg flex items-center text-gray-700 hover:bg-gray-50">
                <Mail size={16} className="mr-2" /> Gửi email
              </button>
              <Button className="flex items-center">
                <Download size={16} className="mr-2" /> Xuất PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
