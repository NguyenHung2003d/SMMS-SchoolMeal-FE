"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { XCircle, RefreshCw, Home } from "lucide-react";
import { useSearchParams } from "next/navigation";

function CancelContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-in zoom-in-95 duration-300">
      <div className="flex justify-center mb-6">
        <div className="bg-red-100 p-4 rounded-full">
          <XCircle className="w-16 h-16 text-red-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Thanh toán bị hủy
      </h1>
      <p className="text-gray-500 mb-8">
        Bạn đã hủy giao dịch hoặc quá trình thanh toán gặp sự cố. Hóa đơn #
        {invoiceId} vẫn chưa được thanh toán.
      </p>

      <div className="space-y-3">
        <Link
          href="/parent/register-meal"
          className="flex items-center justify-center w-full py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Thử thanh toán lại
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

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <CancelContent />
      </Suspense>
    </div>
  );
}
