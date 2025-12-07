"use client";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/helpers";
import { billService } from "@/services/bill.service";
import { Invoice } from "@/types/invoices";
import { useSelectedChild } from "@/context/SelectedChildContext";
import { LoaderCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { InvoiceDetailModal } from "@/components/parents/billing/InvoiceDetailModal";

export default function RegisterMeal() {
  const { selectedChild } = useSelectedChild();
  const [unpaidInvoice, setUnpaidInvoice] = useState<Invoice | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (selectedChild?.studentId) {
      fetchInvoice(selectedChild.studentId);
    } else {
      setUnpaidInvoice(null);
    }
  }, [selectedChild]);

  const fetchInvoice = async (studentId: string) => {
    setIsLoadingInvoice(true);
    setError(null);
    try {
      const invoices = await billService.getUnpaidInvoices(studentId);
      if (invoices && invoices.length > 0) {
        setUnpaidInvoice(invoices[0]);
      } else {
        setUnpaidInvoice(null);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setUnpaidInvoice(null);
      } else {
        console.error(err);
        setError("Không thể tải thông tin hóa đơn.");
        toast.error("Không thể tải thông tin hóa đơn.");
      }
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  const handleViewDetail = async () => {
    if (!unpaidInvoice || !selectedChild) return;

    setIsDetailLoading(true);
    try {
      const detail = await billService.getInvoiceDetail(
        unpaidInvoice.invoiceId,
        selectedChild.studentId
      );
      setDetailData(detail);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy chi tiết hóa đơn");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!unpaidInvoice) return;

    setIsProcessingPayment(true);
    const loadingToastId = toast.loading("Đang khởi tạo giao dịch...");

    try {
      const response = await billService.createPaymentLink(
        unpaidInvoice.invoiceId,
        unpaidInvoice.amountToPay,
        `Thanh toan HD ${unpaidInvoice.invoiceId}`
      );

      if (response.checkoutUrl) {
        toast.success("Đang chuyển hướng sang PayOS...", {
          id: loadingToastId,
        });

        setTimeout(() => {
          window.location.href = response.checkoutUrl;
        }, 1000);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.message || "Lỗi khi tạo giao dịch";

      toast.error(msg, {
        id: loadingToastId,
      });
      setIsProcessingPayment(false); 
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
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
                <LoaderCircle className="animate-spin" /> Đang kiểm tra hóa đơn...
              </div>
            ) : error ? (
              <div className="text-red-500 p-3 bg-red-50 rounded">{error}</div>
            ) : !unpaidInvoice ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-green-600 font-medium">
                  Học sinh này chưa có khoản phí nào cần đóng.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Khoản phí cần thanh toán
                  </label>

                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                      <input
                        type="radio"
                        name="package"
                        className="mr-3 h-5 w-5 text-blue-600"
                        checked
                        readOnly
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-gray-900">
                            Hóa đơn #{unpaidInvoice.invoiceId} - Tháng{" "}
                            {unpaidInvoice.monthNo}
                          </p>
                          <p className="font-bold text-blue-700 text-lg">
                            {formatCurrency(unpaidInvoice.amountToPay)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Từ:{" "}
                          {new Date(unpaidInvoice.dateFrom).toLocaleDateString(
                            "vi-VN"
                          )}{" "}
                          - Đến:{" "}
                          {new Date(unpaidInvoice.dateTo).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleViewDetail}
                  disabled={isDetailLoading}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all
                    ${
                      isDetailLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                    }`}
                >
                  {isDetailLoading ? (
                    <span className="flex items-center justify-center">
                      <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Đang lấy thông tin...
                    </span>
                  ) : (
                    `Xem chi tiết & Thanh toán qua PayOS`
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 mt-2">
                  Bạn sẽ xem lại chi tiết hóa đơn trước khi chuyển đến cổng thanh toán.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <InvoiceDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmPayment}
        data={detailData}
        isProcessing={isProcessingPayment}
      />
    </div>
  );
}