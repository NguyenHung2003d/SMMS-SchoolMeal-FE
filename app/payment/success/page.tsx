"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Home, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-in zoom-in-95 duration-300">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Thanh toán thành công!
      </h1>
      <p className="text-gray-500 mb-8">
        Cảm ơn bạn đã thanh toán hóa đơn #{invoiceId}. Hệ thống đã ghi nhận giao
        dịch của bạn.
      </p>

      <div className="space-y-3">
        <Link
          href={`/parent/invoices/${invoiceId}`}
          className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FileText className="w-5 h-5 mr-2" />
          Xem chi tiết hóa đơn
        </Link>

        <Link
          href="/"
          className="flex items-center justify-center w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          <Home className="w-5 h-5 mr-2" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>Đang tải kết quả...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
