"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      href: "/kitchen-staff/menu/main-dishes",
      label: "Món chính",
    },
    {
      href: "/kitchen-staff/menu/desserts",
      label: "Món phụ",
    },
    {
      href: "/kitchen-staff/menu/past",
      label: "Thực đơn đã qua",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý thực đơn</h1>
      <nav className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <Link
            href={tab.href}
            key={tab.href}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              pathname === tab.href
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}
