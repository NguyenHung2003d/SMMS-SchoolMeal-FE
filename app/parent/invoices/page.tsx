"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Receipt, CreditCard, ExternalLink } from "lucide-react"; // Thêm icon
import toast from "react-hot-toast";

import { axiosInstance } from "@/lib/axiosInstance";
import { billService } from "@/services/bill.service"; // Import service thanh toán
import { Invoice, InvoiceDetails } from "@/types/invoices";
import { useSelectedStudent } from "@/context/SelectedChildContext";
import { InvoiceDetail } from "@/components/parents/invoice/InvoiceDetail";
import { invoiceService } from "@/services/parent/invoice.service";

export default function InvoicePage() {
  const { selectedStudent } = useSelectedStudent();

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<
    number | string | null
  >(null);
  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetails | null>(
    null
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (!selectedStudent?.studentId) {
      setInvoicesList([]);
      setSelectedInvoiceId(null);
      setInvoiceDetail(null);
      return;
    }

    const fetchInvoicesList = async () => {
      try {
        setIsListLoading(true);
        const data = await invoiceService.getMyInvoices(
          selectedStudent.studentId
        );
        setInvoicesList(data);
        if (data && data.length > 0) {
          setSelectedInvoiceId(data[0].invoiceId);
        } else {
          setSelectedInvoiceId(null);
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          toast.error("Không thể tải danh sách hóa đơn.");
        }
      } finally {
        setIsListLoading(false);
      }
    };

    fetchInvoicesList();
  }, [selectedStudent?.studentId]);

  useEffect(() => {
    if (!selectedInvoiceId || !selectedStudent?.studentId) return;

    const fetchDetail = async () => {
      try {
        setIsDetailLoading(true);
        const data = await invoiceService.getInvoiceDetail(
          selectedInvoiceId,
          selectedStudent.studentId
        );
        setInvoiceDetail(data);
      } catch (error: any) {
        if (error.response?.status !== 404) {
          toast.error("Lỗi tải chi tiết hóa đơn.");
        } else {
          setInvoiceDetail(null);
        }
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedInvoiceId, selectedStudent?.studentId]);

  const handlePayNow = async () => {
    if (!invoiceDetail) return;

    setIsProcessingPayment(true);
    const loadingToastId = toast.loading("Đang khởi tạo giao dịch...");

    try {
      const description = `Thanh toan HD ${invoiceDetail.invoiceId}`;

      const response = await billService.createPaymentLink(
        invoiceDetail.invoiceId,
        invoiceDetail.amountToPay,
        description
      );

      if (response && response.checkoutUrl) {
        toast.success("Đang chuyển hướng đến trang thanh toán...", {
          id: loadingToastId,
        });
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error("Không nhận được link thanh toán");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Lỗi khi tạo giao dịch";
      toast.error(msg, { id: loadingToastId });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (!selectedStudent) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Tra cứu hóa đơn</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vui lòng chọn học sinh từ danh sách bên trái
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Receipt /> Tra cứu hóa đơn
      </h2>

      {isListLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : invoicesList.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
          Chưa có hóa đơn nào cho bé <strong>{selectedStudent.fullName}</strong>
          .
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Chọn kỳ thanh toán
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 font-medium"
              value={selectedInvoiceId || ""}
              onChange={(e) => setSelectedInvoiceId((e.target.value))}
            >
              {invoicesList.map((inv) => (
                <option key={inv.invoiceId} value={inv.invoiceId}>
                  Tháng {inv.monthNo} - (Mã hoá đơn: #{inv.invoiceId}) -
                  {inv.status === "Paid" ? "✅ Đã xong" : "❌ Chưa thanh toán"}{" "}
                </option>
              ))}
            </select>
          </div>

          {isDetailLoading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-dashed">
              <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
              <span className="text-gray-400 text-sm">
                Đang tải chi tiết...
              </span>
            </div>
          ) : invoiceDetail ? (
            <div className="space-y-4">
              <InvoiceDetail invoice={invoiceDetail} />

              {invoiceDetail.status !== "Paid" && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <p className="text-blue-700 font-semibold text-lg">
                      Hóa đơn này chưa được thanh toán
                    </p>
                    <p className="text-blue-600/80 text-sm">
                      Vui lòng hoàn tất thanh toán để đảm bảo quyền lợi cho học
                      sinh.
                    </p>
                  </div>

                  <button
                    onClick={handlePayNow}
                    disabled={isProcessingPayment}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Thanh toán ngay
                        <ExternalLink size={16} className="opacity-70" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed text-gray-500">
              <Receipt className="w-10 h-10 mb-2 opacity-20" />
              <p>Không tìm thấy nội dung chi tiết cho hóa đơn này.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
