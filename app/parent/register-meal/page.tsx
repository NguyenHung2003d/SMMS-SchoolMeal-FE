"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { formatCurrency } from "@/helpers";
import { billService } from "@/services/bill.service";
import { Invoice } from "@/types/invoices";
import { useSelectedChild } from "@/context/SelectedChildContext";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterMeal() {
  const router = useRouter();
  const { selectedChild } = useSelectedChild();

  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedChild?.studentId) {
      fetchInvoices(selectedChild.studentId);
    } else {
      setUnpaidInvoices([]);
      setSelectedInvoice(null);
    }
  }, [selectedChild]);

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
        setError("Không thể tải thông tin hóa đơn.");
        toast.error("Không thể tải thông tin hóa đơn.");
      }
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  const handleViewDetail = () => {
    if (!selectedInvoice || !selectedChild) return;
    router.push(
      `/parent/invoices/${selectedInvoice.invoiceId}?studentId=${selectedChild.studentId}`
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Đăng ký suất ăn & Thanh toán
      </h2>

      {!selectedChild ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vui lòng chọn học sinh từ danh sách bên trái
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 text-lg">
              Học sinh:{" "}
              <span className="text-blue-600">{selectedChild.name}</span>
            </h3>

            {isLoadingInvoice ? (
              <div className="text-center py-4 text-gray-500 flex justify-center items-center gap-2">
                <LoaderCircle className="animate-spin" /> Đang kiểm tra hóa
                đơn...
              </div>
            ) : error ? (
              <div className="text-red-500 p-3 bg-red-50 rounded">{error}</div>
            ) : unpaidInvoices.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-green-600 font-medium">
                  Học sinh này chưa có khoản phí nào cần đóng.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Danh sách khoản phí cần thanh toán:
                  </label>

                  <div className="space-y-3">
                    {unpaidInvoices.map((inv) => (
                      <label
                        key={inv.invoiceId}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedInvoice?.invoiceId === inv.invoiceId
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <input
                          type="radio"
                          name="invoice_selection"
                          className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500"
                          checked={selectedInvoice?.invoiceId === inv.invoiceId}
                          onChange={() => setSelectedInvoice(inv)}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-bold text-gray-900">
                              Hóa đơn #{inv.invoiceId} - Tháng {inv.monthNo}
                            </p>
                            <p className="font-bold text-blue-700 text-lg">
                              {formatCurrency(inv.amountToPay)}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <p>
                              Từ:{" "}
                              {new Date(inv.dateFrom).toLocaleDateString(
                                "vi-VN"
                              )}{" "}
                              - Đến:{" "}
                              {new Date(inv.dateTo).toLocaleDateString("vi-VN")}
                            </p>
                            {inv.absentDay > 0 && (
                              <span className="text-orange-600 font-medium text-xs bg-orange-100 px-2 py-0.5 rounded">
                                Trừ {inv.absentDay} ngày nghỉ
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t mt-4">
                  <button
                    onClick={handleViewDetail}
                    disabled={!selectedInvoice}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md
                        ${
                          !selectedInvoice
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.99]"
                        }`}
                  >
                    Xem chi tiết & Thanh toán qua PayOS
                  </button>

                  <p className="text-xs text-center text-gray-500 mt-3">
                    Bạn đang chọn thanh toán cho hóa đơn:{" "}
                    <span className="font-bold text-gray-700">
                      #{selectedInvoice?.invoiceId}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
