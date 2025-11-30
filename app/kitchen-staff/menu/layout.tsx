"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Download, Search, Filter } from "lucide-react";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/kitchen-staff/menu/upcoming",
      label: "Thực đơn sắp tới",
    },
    {
      href: "/kitchen-staff/menu/desserts",
      label: "Tráng miệng",
    },
    {
      href: "/kitchen-staff/menu/past",
      label: "Thực đơn đã qua",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thực đơn</h1>
        <div className="flex space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
            <Download size={18} className="mr-2" />
            <span>Xuất Excel</span>
          </button>

          <Link
            href="/kitchen-staff/menu/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            <span>Tạo thực đơn mới</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? "border-orange-500 text-orange-600 bg-orange-50/50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 bg-gray-50/30">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm món ăn, thực đơn..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white transition-all"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 flex-grow md:flex-grow-0">
              <option value="all">Tất cả danh mục</option>
              <option value="main">Món chính</option>
              <option value="dessert">Tráng miệng</option>
            </select>

            <button className="p-2.5 text-gray-500 bg-white border border-gray-300 hover:text-orange-500 hover:border-orange-500 rounded-lg transition-all shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-[500px]">{children}</div>
    </div>
  );
}
