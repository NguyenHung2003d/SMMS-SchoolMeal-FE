"use client";
import React, { useEffect, useState } from "react";
import {
  Loader2,
  Receipt,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { billService } from "@/services/bill.service";
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
    const isValidInvoice = invoicesList.some(
      (inv) => inv.invoiceId === selectedInvoiceId
    );
    if (!selectedInvoiceId || !selectedStudent?.studentId || !isValidInvoice) {
      setInvoiceDetail(null);
      return;
    }
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
        }
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedInvoiceId, selectedStudent?.studentId, invoicesList]);

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

      if (response?.checkoutUrl) {
        toast.success("Đang chuyển hướng...", { id: loadingToastId });
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
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Tra cứu hóa đơn</h2>
        <p className="text-gray-500 max-w-xs">
          Vui lòng chọn học sinh từ danh sách bên trái để xem thông tin học phí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Receipt size={24} />
          </div>
          Học phí & Hóa đơn
        </h2>
      </div>

      {isListLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : invoicesList.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Receipt className="mx-auto text-gray-200" size={64} />
          <p className="text-gray-500 font-medium">
            Chưa có hóa đơn nào cho bé{" "}
            <strong>{selectedStudent.fullName}</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1 tracking-widest">
                Chọn kỳ hóa đơn
              </label>
              <select
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 outline-none bg-gray-50 font-bold text-gray-700 transition-all appearance-none cursor-pointer"
                value={selectedInvoiceId || ""}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
              >
                {invoicesList.map((inv) => (
                  <option key={inv.invoiceId} value={inv.invoiceId}>
                    Tháng {inv.monthNo} — #{inv.invoiceId} (
                    {inv.status === "Paid" ? "Đã xong" : "Chưa đóng"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isDetailLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <Loader2 className="animate-spin text-blue-500 mb-3" size={32} />
              <span className="text-gray-400 font-medium italic">
                Đang trích xuất dữ liệu...
              </span>
            </div>
          ) : invoiceDetail ? (
            <div className="space-y-6">
              <InvoiceDetail
                invoice={invoiceDetail}
                onPayNow={handlePayNow}
                isProcessingPayment={isProcessingPayment}
              />
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 italic">
              Không thể hiển thị chi tiết hóa đơn.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
