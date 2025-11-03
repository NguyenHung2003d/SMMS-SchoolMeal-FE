import { Teacher } from "@/types";

export const teachers: Teacher[] = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    email: "lan.nguyen@school.edu.vn",
    phone: "0912345678",
    subject: "Toán",
    classAssigned: "6A",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    status: "active",
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    email: "minh.tran@school.edu.vn",
    phone: "0987654321",
    subject: "Tiếng Anh",
    classAssigned: "7B",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    status: "active",
  },
  {
    id: 3,
    name: "Phạm Thị Hoa",
    email: "hoa.pham@school.edu.vn",
    phone: "0901234567",
    subject: "Văn",
    classAssigned: "8C",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    status: "onLeave",
  },
  {
    id: 4,
    name: "Lê Quốc Hùng",
    email: "hung.le@school.edu.vn",
    phone: "0934567890",
    subject: "Lý",
    classAssigned: "9A",
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
    status: "inactive",
  },
];