"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isCreatePage = pathname === "/kitchen-staff/menu/create";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thực đơn</h1>
        <div className="flex space-x-2">
          {isCreatePage ? (
            <Link
              href="/kitchen-staff/menu"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm border border-gray-300"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span>Quay trở lại</span>
            </Link>
          ) : (
            <Link
              href="/kitchen-staff/menu/create"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              <span>Tạo thực đơn mới</span>
            </Link>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
