"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  Loader2,
  Receipt,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import { formatCurrency } from "@/helpers";
import { billService } from "@/services/bill.service";
import { useSelectedChild } from "@/context/SelectedChildContext";
import { Invoice } from "@/types/invoices";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedChild } = useSelectedChild();

  const invoiceId = Number(params.id);  

  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!invoiceId || isNaN(invoiceId)) {
        setError("Mã hóa đơn không hợp lệ.");
        setIsLoading(false);
        return;
      }

      if (!selectedChild?.studentId) {
        setError("Vui lòng chọn học sinh trước khi xem chi tiết.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await billService.getInvoiceDetail(
          invoiceId,
          selectedChild.studentId
        );
        setInvoiceData(data);
      } catch (err: any) {
        console.error(err);
        setError("Không tìm thấy hóa đơn hoặc bạn không có quyền truy cập.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [invoiceId, selectedChild]);

  const handlePayNow = () => {
    router.push("/parent/register-meal");
    toast("Vui lòng thực hiện thanh toán tại đây.");
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600 font-medium">Đang tải hóa đơn...</span>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-red-50 p-6 rounded-full mb-4">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Không thể tải hóa đơn
        </h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link
          href="/parent/register-meal"
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
        >
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const isPaid =
    invoiceData.status === "Paid" || invoiceData.status === "Đã thanh toán";

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href="/parent/register-meal"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium group"
        >
          <ArrowLeft
            size={20}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Quay lại
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-90 text-sm font-semibold uppercase tracking-wider">
              <Receipt size={18} /> Chi tiết hóa đơn
            </div>
            <h1 className="text-3xl font-bold">#{invoiceData.invoiceId}</h1>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold border shadow-sm backdrop-blur-md
            ${
              isPaid
                ? "bg-green-500/20 border-green-400/30 text-green-50"
                : "bg-yellow-500/20 border-yellow-400/30 text-yellow-50"
            }`}
          >
            {isPaid ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {isPaid ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}
          </div>
        </div>

        <div className="p-6 md:p-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <h2 className="font-bold text-blue-900 flex items-center gap-2 mb-4">
                <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
                  <User size={18} />
                </div>
                Học sinh
              </h2>
              <div className="space-y-3 pl-1">
                <InfoRow
                  label="Họ tên"
                  value={invoiceData.studentName}
                  valueClass="font-bold text-lg text-blue-800"
                />
                <InfoRow label="Lớp" value={invoiceData.className} />
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <div className="bg-gray-200 p-1.5 rounded-lg text-gray-700">
                  <Building2 size={18} />
                </div>
                Đơn vị thụ hưởng
              </h2>
              <div className="space-y-3 pl-1">
                <InfoRow label="Trường" value={invoiceData.schoolName} />
                <div className="border-t border-gray-200 my-2 pt-2">
                  <InfoRow
                    label="Ngân hàng"
                    value={invoiceData.settlementBankCode}
                  />
                  <InfoRow
                    label="Số tài khoản"
                    value={invoiceData.settlementAccountNo}
                    valueClass="font-mono font-bold tracking-wide"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100">
              <h2 className="font-bold text-amber-900 flex items-center gap-2 mb-4">
                <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
                  <Calendar size={18} />
                </div>
                Kỳ thu tháng {invoiceData.monthNo}
              </h2>
              <div className="space-y-3 pl-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(invoiceData.dateFrom).toLocaleDateString("vi-VN")}{" "}
                    - {new Date(invoiceData.dateTo).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số ngày nghỉ (đã trừ):</span>
                  <span className="font-bold text-amber-700">
                    {invoiceData.absentDay} ngày
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`p-6 rounded-xl shadow-lg text-white flex flex-col gap-4
                ${
                  isPaid
                    ? "bg-gradient-to-br from-green-600 to-teal-700"
                    : "bg-gradient-to-br from-blue-600 to-indigo-700"
                }`}
            >
              <div>
                <span className="text-blue-100 font-medium text-sm">
                  Tổng tiền phải đóng
                </span>
                <div className="text-4xl font-bold mt-1 tracking-tight">
                  {formatCurrency(invoiceData.amountToPay)}
                </div>
              </div>

              {!isPaid && (
                <button
                  onClick={handlePayNow}
                  className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center active:scale-95 group"
                >
                  <CreditCard
                    size={20}
                    className="mr-2 group-hover:scale-110 transition-transform"
                  />
                  Thanh toán ngay
                </button>
              )}

              {isPaid && (
                <div className="bg-white/20 py-2 px-4 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Giao dịch hoàn tất
                </div>
              )}
            </div>
          </div>
        </div>

        {!isPaid && (
          <div className="bg-yellow-50 px-8 py-4 text-sm text-yellow-800 border-t border-yellow-100 flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>
              Vui lòng kiểm tra kỹ thông tin trước khi thanh toán. Nếu có sai
              sót, vui lòng liên hệ nhà trường để được hỗ trợ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const InfoRow = ({
  label,
  value,
  valueClass = "font-medium text-gray-900",
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-gray-500 text-sm shrink-0">{label}</span>
    <span className={`${valueClass} text-right break-words`}>{value}</span>
  </div>
);
