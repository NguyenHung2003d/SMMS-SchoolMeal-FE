import {
  Home,
  Utensils,
  Package,
  Library,
  ShoppingCart,
  History,
  MessageCircle,
} from "lucide-react";

export const KITCHEN_MENU_ITEMS = [
  {
    category: "TỔNG QUAN",
    items: [
      { name: "Trang chủ", href: "/kitchen-staff/dashboard", icon: Home },
    ],
  },
  {
    category: "QUẢN LÝ",
    items: [
      { name: "Thực đơn", href: "/kitchen-staff/menu", icon: Utensils },
      {
        name: "Kho nguyên liệu",
        href: "/kitchen-staff/inventory",
        icon: Package,
      },
      {
        name: "Thư viện món ăn",
        href: "/kitchen-staff/food-library",
        icon: Library,
      },
      {
        name: "Kế hoạch mua sắm",
        href: "/kitchen-staff/purchase-plan",
        icon: ShoppingCart,
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
