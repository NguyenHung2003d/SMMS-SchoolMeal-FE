"use client";
import React, { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/helpers";
import { billService } from "@/services/bill.service";
import { Invoice } from "@/types/invoices";
import {
  Loader2,
  Calendar,
  CreditCard,
  CheckCircle2,
  Wallet,
  UserCircle,
  Receipt,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelectedStudent } from "@/context/SelectedChildContext";

export default function RegisterMeal() {
  const router = useRouter();
  const { selectedStudent } = useSelectedStudent();

  const isOpen = false;

  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStudent?.studentId) {
      fetchInvoices(selectedStudent.studentId);
    } else {
      setUnpaidInvoices([]);
      setSelectedInvoice(null);
    }
  }, [selectedStudent]);

  const fetchInvoices = async (studentId: string) => {
    setIsLoadingInvoice(true);
    setError(null);
    try {
      const invoices = await billService.getUnpaidInvoices(studentId);
      if (invoices && invoices.length > 0) {
        setUnpaidInvoices(invoices);
        setSelectedInvoice(invoices[0]);
      } else {
        setUnpaidInvoices([]);
        setSelectedInvoice(null);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setUnpaidInvoices([]);
        setSelectedInvoice(null);
      } else {
        console.error(err);
        setError("Không thể tải thông tin hóa đơn. Vui lòng thử lại sau.");
        toast.error("Lỗi kết nối server.");
      }
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  const handleViewDetail = () => {
    if (!selectedInvoice || !selectedStudent) return;
    router.push(
      `/parent/invoices/${selectedInvoice.invoiceId}?studentId=${selectedStudent.studentId}`
    );
  };

  return (
    <div
      className={`
        mx-auto space-y-6 pb-10 transition-all duration-300 ease-in-out
        ${isOpen ? "max-w-4xl" : "max-w-6xl"} 
      `}
    >
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Thanh toán tiền ăn trưa
          </h2>
          <p className="text-sm text-gray-500">
            Xem và thanh toán các khoản phí chưa đóng
          </p>
        </div>
      </div>

      {!selectedStudent ? (
        <div className="flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center shadow-sm min-h-[300px]">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <UserCircle size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            Chưa chọn học sinh
          </h3>
          <p className="text-gray-500 max-w-md mt-2">
            Vui lòng chọn một học sinh từ danh sách bên trái để xem các khoản
            phí cần thanh toán.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full shadow-sm border-2 border-white ring-1 ring-blue-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                <UserCircle size={32} className="text-blue-200" />

                {selectedStudent.avatarUrl && (
                  <img
                    src={selectedStudent.avatarUrl}
                    alt={selectedStudent.fullName}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                  Học sinh
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {selectedStudent.fullName}
                </p>
              </div>
            </div>
            {unpaidInvoices.length > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                {unpaidInvoices.length} khoản phí
              </span>
            )}
          </div>

          {isLoadingInvoice ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
              <p className="text-gray-500 font-medium">Đang tìm hóa đơn...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center text-center">
              <AlertCircle className="text-red-500 mb-2" size={32} />
              <p className="text-red-700 font-medium">{error}</p>
              <button
                onClick={() => fetchInvoices(selectedStudent.studentId)}
                className="mt-3 text-sm text-red-600 underline hover:text-red-800"
              >
                Thử lại
              </button>
            </div>
          ) : unpaidInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Không có khoản phí nào!
              </h3>
              <p className="text-gray-500 mt-1">
                Tuyệt vời, phụ huynh đã hoàn thành tất cả nghĩa vụ thanh toán.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Receipt size={18} /> Danh sách hóa đơn
                </h3>

                <div className="space-y-3">
                  {unpaidInvoices.map((inv) => {
                    const isSelected =
                      selectedInvoice?.invoiceId === inv.invoiceId;
                    return (
                      <div
                        key={inv.invoiceId}
                        onClick={() => setSelectedInvoice(inv)}
                        className={`
                          relative group flex flex-col sm:flex-row sm:items-center justify-between 
                          p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/50 shadow-md scale-[1.01]"
                              : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-md"
                          }
                        `}
                      >
                        <div
                          className={`absolute top-4 right-4 sm:static sm:mr-4 transition-colors ${
                            isSelected
                              ? "text-blue-600"
                              : "text-gray-300 group-hover:text-blue-300"
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle2
                              size={24}
                              fill="currentColor"
                              className="text-white"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-current"></div>
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                              Tháng {inv.monthNo}
                            </span>
                            <span className="text-gray-400 text-xs">
                              #{inv.invoiceId}
                            </span>
                          </div>

                          <p className="font-bold text-gray-800 text-lg">
                            Học phí bán trú
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>
                                {new Date(inv.dateFrom).toLocaleDateString(
                                  "vi-VN",
                                  { day: "2-digit", month: "2-digit" }
                                )}{" "}
                                -{" "}
                                {new Date(inv.dateTo).toLocaleDateString(
                                  "vi-VN",
                                  { day: "2-digit", month: "2-digit" }
                                )}
                              </span>
                            </div>
                            {inv.absentDay > 0 && (
                              <span className="text-orange-600 text-xs bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                - {inv.absentDay} ngày nghỉ
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-0 text-right">
                          <p className="text-xs text-gray-500 mb-1">
                            Tổng thanh toán
                          </p>
                          <p className="text-xl font-bold text-blue-600">
                            {formatCurrency(inv.amountToPay)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                  <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
                    Thông tin thanh toán
                  </h3>

                  {selectedInvoice ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Mã hóa đơn:</span>
                        <span className="font-medium text-gray-900">
                          #{selectedInvoice.invoiceId}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tháng:</span>
                        <span className="font-medium text-gray-900">
                          {selectedInvoice.monthNo}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Số ngày nghỉ:</span>
                        <span className="font-medium text-gray-900">
                          {selectedInvoice.absentDay}
                        </span>
                      </div>

                      <div className="border-t border-dashed my-2 pt-2">
                        <div className="flex justify-between items-end">
                          <span className="text-gray-800 font-semibold">
                            Tổng cộng:
                          </span>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(selectedInvoice.amountToPay)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleViewDetail}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
                      >
                        <CreditCard
                          size={20}
                          className="group-hover:scale-110 transition-transform"
                        />
                        Thanh toán ngay
                      </button>
                      <p className="text-xs text-center text-gray-400 mt-2">
                        Thanh toán an toàn qua cổng PayOS
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <p>Vui lòng chọn một hóa đơn để tiếp tục</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
