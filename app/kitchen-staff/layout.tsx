"use client";

import { getInitials } from "@/helpers";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  Bell,
  ChefHat,
  Utensils,
  Package,
  Search,
  Menu,
  Home,
  LogOut,
  ShoppingCart,
  MessageCircle,
  X,
  ChevronRight,
  History,
  Library,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const MENU_ITEMS = [
  {
    category: "TỔNG QUAN",
    items: [
      {
        name: "Trang chủ",
        href: "/kitchen-staff/dashboard",
        icon: Home,
      },
    ],
  },
  {
    category: "QUẢN LÝ",
    items: [
      {
        name: "Thực đơn",
        href: "/kitchen-staff/menu",
        icon: Utensils,
      },
      {
        name: "Kho nguyên liệu",
        href: "/kitchen-staff/inventory",
        icon: Package,
      },
      {
        name: "Kế hoạch mua sắm",
        href: "/kitchen-staff/purchase-plan",
        icon: ShoppingCart,
      },
      {
        name: "Thư viện món ăn",
        href: "/kitchen-staff/food-library",
        icon: Library,
      },
      {
        name: "Lịch sử mua hàng",
        href: "/kitchen-staff/purchase-history",
        icon: History,
      },
      {
        name: "Phản hồi & Đánh giá",
        href: "/kitchen-staff/feedback",
        icon: MessageCircle,
      },
    ],
  },
];

export default function KitchenStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-30 transition-all duration-300 ease-in-out border-r border-gray-100
          ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-20 -translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <div
            className={`flex items-center gap-3 overflow-hidden transition-all ${
              !isSidebarOpen && "lg:justify-center w-full"
            }`}
          >
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl shadow-md shrink-0">
              <ChefHat size={20} className="text-white" />
            </div>
            <h1
              className={`font-bold text-xl text-gray-800 tracking-tight transition-opacity duration-300 ${
                !isSidebarOpen && "lg:hidden"
              }`}
            >
              EduMeal
            </h1>
          </div>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-gray-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
          {MENU_ITEMS.map((group, idx) => (
            <div key={idx}>
              <p
                className={`text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-2 transition-all ${
                  !isSidebarOpen && "lg:text-center lg:text-[10px]"
                }`}
              >
                {isSidebarOpen ? group.category : group.category.slice(0, 3)}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isSidebarOpen={isSidebarOpen}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Header
          user={user}
          logout={logout}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="p-4 md:p-6 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  item,
  isSidebarOpen,
  onClick,
}: {
  item: any;
  isSidebarOpen: boolean;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname?.startsWith(`${item.href}/`);

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        className={`
          group flex items-center py-2.5 px-3 rounded-xl transition-all duration-200 relative overflow-hidden
          ${
            isActive
              ? "bg-orange-50 text-orange-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }
          ${!isSidebarOpen ? "lg:justify-center" : ""}
        `}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
        )}

        <item.icon
          size={20}
          className={`shrink-0 transition-colors ${
            isActive
              ? "text-orange-500"
              : "text-gray-400 group-hover:text-gray-600"
          }`}
        />

        <span
          className={`ml-3 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            !isSidebarOpen ? "lg:hidden lg:opacity-0 lg:w-0" : "opacity-100"
          }`}
        >
          {item.name}
        </span>

        {!isSidebarOpen && (
          <div className="hidden lg:group-hover:block absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
            {item.name}
          </div>
        )}
      </Link>
    </li>
  );
}

function Header({
  user,
  logout,
  toggleSidebar,
}: {
  user: any;
  logout: any;
  toggleSidebar: () => void;
}) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="px-4 md:px-6 py-3 flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:block">
            <div className="flex items-center text-sm text-gray-400 mb-0.5 space-x-1">
              <span>Bếp ăn</span>
              <ChevronRight size={14} />
              <span>Tổng quan</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 leading-none">
              Quản lý bữa trưa
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="hidden sm:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:border-orange-200 focus-within:ring-2 focus-within:ring-orange-100 transition-all w-64">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Tìm món ăn, nguyên liệu..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <button className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-orange-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>

          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center border-2 border-white shadow-sm text-orange-600 font-bold text-sm">
                {getInitials(user?.fullName || "U")}
              </div>
              <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-semibold text-gray-700 leading-tight">
                  {user?.fullName || "Staff"}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                  {user?.role || "Kitchen"}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isAccountMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                  <p className="font-semibold text-gray-800">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
