import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ButtonRedirect from "@/components/ui/ButtonRedirect";

const inter = Inter({ subsets: ["latin"] });

export default function NotFound() {
  return (
    <html lang="vi" className={inter.className}>
      <body
        suppressHydrationWarning={true}
        className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4"
      >
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <div className="relative mb-12">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-pulse select-none">
              404
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl lg:text-[12rem] font-black text-gray-200 -z-10 blur-sm">
              404
            </div>
          </div>

          <div className="mb-12 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Ôi! Trang không tồn tại
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
              Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc URL
              không chính xác.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-full font-semibold"
            >
              <Link href="/">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                Về trang chủ
              </Link>
            </Button>

            <ButtonRedirect />
          </div>
        </div>
      </body>
    </html>
  );
}
