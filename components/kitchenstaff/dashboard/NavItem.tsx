"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({ item, isSidebarOpen, onClick }: any) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname?.startsWith(`${item.href}/`);

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        className={`group flex items-center py-2.5 px-3 rounded-xl transition-all relative overflow-hidden
          ${
            isActive
              ? "bg-orange-50 text-orange-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-50"
          }
          ${!isSidebarOpen ? "lg:justify-center" : ""}`}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
        )}
        <item.icon
          size={20}
          className={`shrink-0 ${
            isActive ? "text-orange-500" : "text-gray-400"
          }`}
        />
        <span
          className={`ml-3 font-medium text-sm transition-all duration-300 ${
            !isSidebarOpen ? "lg:hidden opacity-0 w-0" : "opacity-100"
          }`}
        >
          {item.name}
        </span>
      </Link>
    </li>
  );
}
