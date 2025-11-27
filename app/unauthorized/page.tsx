"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10 w-10 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>

      {/* Text Content */}
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          403
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Truy cập bị từ chối
        </h2>
        <p className="mt-4 text-base text-gray-500 max-w-lg mx-auto">
          Xin lỗi, bạn không có quyền truy cập vào trang này. <br className="hidden sm:block" />
          Vui lòng liên hệ quản trị viên hoặc quay lại trang chủ.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center w-full sm:w-auto">
        <button
          onClick={() => router.back()}
          className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Quay lại
        </button>
        
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:visible:outline focus:visible:outline-2 focus:visible:outline-offset-2 focus:visible:outline-indigo-600"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}