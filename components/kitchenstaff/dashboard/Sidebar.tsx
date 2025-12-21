import { ChefHat, X } from "lucide-react";
import { NavItem } from "./NavItem";
import { KITCHEN_MENU_ITEMS } from "@/constants/menu";

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, isMobile }: any) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-all duration-300 border-r border-gray-100 
        ${
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-20 -translate-x-full lg:translate-x-0"
        }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <div
          className={`flex items-center gap-3 ${
            !isSidebarOpen && "lg:justify-center w-full"
          }`}
        >
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl shadow-md shrink-0">
            <ChefHat size={20} className="text-white" />
          </div>
          <h1
            className={`font-bold text-xl text-gray-800 ${
              !isSidebarOpen && "lg:hidden"
            }`}
          >
            EduMeal
          </h1>
        </div>
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {KITCHEN_MENU_ITEMS.map((group, idx) => (
          <div key={idx}>
            <p
              className={`text-[11px] font-bold text-gray-400 uppercase mb-3 px-2 ${
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
  );
}
