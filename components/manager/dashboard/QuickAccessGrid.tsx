import React from "react";
import Link from "next/link";
import { UserPlus, Users, BookOpen, Upload, Bell, Package } from "lucide-react";

export default function QuickAccessGrid() {
  const actions = [
    {
      href: "/manager/staff",
      title: "Tạo tài khoản nhân viên",
      desc: "Thêm giáo viên và nhân viên mới",
      icon: UserPlus,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      href: "/manager/parents",
      title: "Tạo tài khoản phụ huynh",
      desc: "Quản lý tài khoản phụ huynh",
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      href: "/manager/classés",
      title: "Tạo lớp học",
      desc: "Quản lý lớp và phân công giáo viên",
      icon: BookOpen,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      href: "/manager/purchase-orders",
      title: "Quản lý đơn hàng",
      desc: "Theo dõi và xử lý các đơn đặt hàng nguyên liệu",
      icon: Package,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
    {
      href: "/manager/notifications",
      title: "Gửi thông báo",
      desc: "Gửi thông báo tới phụ huynh và giáo viên",
      icon: Bell,
      color: "text-red-500",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Truy cập nhanh</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className={`${action.bg} p-3 rounded-full mb-3`}>
              <action.icon size={24} className={action.color} />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">{action.title}</h3>
            <p className="text-xs text-gray-500">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
