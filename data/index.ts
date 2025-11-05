import {
  FoodMenuItem,
  NavigationMenuItem,
  ParentFeedback,
} from "@/types";
import {
  Calendar,
  User,
  Activity,
  FileText,
  MessageSquare,
  Receipt,
  FileEdit,
} from "lucide-react";

export const images = [
  {
    image: "/hero_section.png",
  },
];

export const ParentFeedbackData: ParentFeedback[] = [
  {
    id: 1,
    rating: 9.9,
    stars: 5,
    text: "EduMeal giúp tôi theo dõi chi tiết các bữa ăn của con tại trường. Tôi đặc biệt yêu thích tính năng xem trước thực đơn và thông tin dinh dưỡng, giúp tôi biết được con mình ăn món gì ngay.",
    author: {
      name: "Chị Nguyễn Thị Hương",
      role: "Phụ huynh học sinh lớp 2A",
      avatar: "N",
    },
    feedback: "Con tôi rất thích món cơm gà rau củ và luôn xin thêm!",
  },
  {
    id: 2,
    rating: 9.9,
    stars: 5,
    text: "Tôi đánh giá cao việc nhà trường cập nhật hình ảnh hoạt động của các con. Thực đơn đa dạng và đầy đủ dinh dưỡng, con tôi đã tăng cân đều đặn từ khi sử dụng dịch vụ bán trú của trường.",
    author: {
      name: "Anh Trần Văn Minh",
      role: "Phụ huynh học sinh lớp 4C",
      avatar: "A",
    },
    feedback: "Con tôi thích nhất bữa phở với các loại trái cây tươi.",
  },
  {
    id: 3,
    rating: 9.9,
    stars: 5,
    text: "EduMeal không chỉ giúp tôi theo dõi bữa ăn mà còn giúp tôi nắm bắt hoạt động của con tại trường. Giao diện dễ sử dụng và thông tin cập nhật liên tục. Tôi đặc biệt thích chức năng đánh giá món ăn.",
    author: {
      name: "Chị Lê Thị Mai",
      role: "Phụ huynh học sinh lớp 1B",
      avatar: "L",
    },
    feedback: "Con tôi đã bớt kén ăn hơn khi ở trường!",
  },
];

export const solutions = [
  {
    icon: "💻",
    title: "Quản lý trực tuyến",
    description:
      "Tất cả thông tin bữa ăn, học sinh, lớp học được quản lý tập trung trên hệ thống web.",
  },
  {
    icon: "🥗",
    title: "Thực đơn minh bạch",
    description:
      "Phụ huynh và giáo viên xem trước thực đơn hàng tuần, kèm thông tin dinh dưỡng.",
  },
  {
    icon: "🏦",
    title: "Thanh toán trực tuyến",
    description:
      "Hỗ trợ tích hợp cổng thanh toán, lưu vết hóa đơn rõ ràng, tiện lợi và minh bạch.",
  },
  {
    icon: "📈",
    title: "Thống kê & báo cáo",
    description:
      "Tự động tổng hợp số suất ăn, chi phí và tình hình sử dụng, giảm lãng phí cho nhà trường.",
  },
];

export const problems = [
  {
    icon: "📋",
    title: "Quản lý thủ công",
    description:
      "Nhà trường và phụ huynh vẫn ghi chép suất ăn bằng giấy tờ, dễ sai sót và khó tổng hợp.",
  },
  {
    icon: "🍲",
    title: "Không nắm rõ thực đơn",
    description:
      "Phụ huynh không biết con mình hôm nay ăn gì, dinh dưỡng có đủ hay không.",
  },
  {
    icon: "💰",
    title: "Thanh toán rườm rà",
    description:
      "Thu tiền trực tiếp gây mất thời gian, dễ thất lạc và khó minh bạch.",
  },
  {
    icon: "♻️",
    title: "Lãng phí suất ăn",
    description:
      "Số lượng bữa ăn không khớp thực tế, dẫn đến thừa hoặc thiếu, gây lãng phí.",
  },
];

/** ================== Constants ================== */
// Ô đen – danh sách mặc định theo yêu cầu

export const foodData: FoodMenuItem[] = [
  {
    id: "pho-bo",
    name: "Phở Bò",
    image: "/images/pho-bo.jpg",
    ingredients: ["Bánh phở", "Thịt bò", "Hành lá", "Nước hầm xương"],
    allergies: [], // Bắt buộc phải có, dù là mảng rỗng
    date: "2025-10-24",
    prepared: 120,
    needed: 150,
  },
  {
    id: "com-ga",
    name: "Cơm Gà Xối Mỡ",
    image: "/images/com-ga.jpg",
    ingredients: ["Cơm", "Thịt gà", "Dưa leo", "Nước mắm"],
    allergies: ["Hải sản"], // Ví dụ có dị ứng
    date: "2025-10-24",
    prepared: 145,
    needed: 150,
  },
];

export const menuItems: NavigationMenuItem[] = [
  {
    id: "register",
    icon: Calendar,
    label: "Đăng ký suất ăn",
    color: "text-blue-600",
  },
  {
    id: "profile",
    icon: User,
    label: "Cập nhật hồ sơ",
    color: "text-green-600",
  },
  {
    id: "health",
    icon: Activity,
    label: "Theo dõi sức khỏe",
    color: "text-red-600",
  },
  {
    id: "menu_and_feedback",
    icon: FileText,
    label: "Xem thực đơn và đánh giá",
    color: "text-orange-600",
  },
  {
    id: "invoice",
    icon: Receipt,
    label: "Xem hóa đơn",
    color: "text-yellow-600",
  },
  {
    id: "leave",
    icon: FileEdit,
    label: "Đơn xin nghỉ",
    color: "text-pink-600",
  },
];

export const recentUpdates = [
  {
    time: "08:15",
    message: "Đã hoàn thành chuẩn bị bữa sáng",
    user: "Nguyễn Văn An",
  },
  {
    time: "07:45",
    message: "Cập nhật số lượng bánh mì trứng: 100/118",
    user: "Trần Thị Bình",
  },
  {
    time: "07:30",
    message: "Phụ huynh hủy 3 suất ăn bữa trưa",
    user: "Hệ thống",
  },
];

export const staffMembers = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    email: "nguyenthilan@gmail.com",
    phone: "0912345678",
    role: "teacher",
    subject: "Toán",
    status: "active",
    joinDate: "15/08/2022",
    avatar: "https://i.imgur.com/6YQ9Z3z.jpg",
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    email: "tranvanminh@gmail.com",
    phone: "0923456789",
    role: "teacher",
    subject: "Tiếng Việt",
    status: "active",
    joinDate: "10/09/2022",
    avatar: "https://i.imgur.com/F8QXfXh.jpg",
  },
  {
    id: 3,
    name: "Lê Thị Hương",
    email: "lethihuong@gmail.com",
    phone: "0934567890",
    role: "teacher",
    subject: "Tiếng Anh",
    status: "active",
    joinDate: "05/10/2022",
    avatar: "https://i.imgur.com/KWaVOLR.jpg",
  },
  {
    id: 4,
    name: "Phạm Văn Đức",
    email: "phamvanduc@gmail.com",
    phone: "0945678901",
    role: "teacher",
    subject: "Khoa học",
    status: "active",
    joinDate: "20/07/2022",
    avatar: "",
  },
  {
    id: 5,
    name: "Nguyễn Thị Thảo",
    email: "nguyenthithao@gmail.com",
    phone: "0956789012",
    role: "kitchen",
    subject: "",
    status: "banned",
    joinDate: "15/08/2022",
    avatar: "",
    banReason: "Vi phạm quy định vệ sinh an toàn thực phẩm",
    banExpiry: "15/12/2023",
  },
  {
    id: 6,
    name: "Trần Văn Hùng",
    email: "tranvanhung@gmail.com",
    phone: "0967890123",
    role: "support",
    subject: "",
    status: "active",
    joinDate: "01/09/2022",
    avatar: "",
  },
  {
    id: 7,
    name: "Lê Minh Tuấn",
    email: "leminhtuan@gmail.com",
    phone: "0978901234",
    role: "teacher",
    subject: "Thể dục",
    status: "pending",
    joinDate: "10/11/2023",
    avatar: "",
  },
];

export const mealSchedule = [
  {
    time: "11:30 - 12:00",
    class: "1A",
    students: 25,
  },
  {
    time: "12:00 - 12:30",
    class: "2B",
    students: 24,
  },
  {
    time: "12:30 - 13:00",
    class: "3A",
    students: 19,
  },
];

export const studentAllergies = [
  {
    id: 1,
    student: "Nguyễn Minh Anh",
    class: "3A",
    allergies: ["Sữa"],
    severity: "Cao",
    notes:
      "Không được dùng sữa bò, sữa chua, phô mai, thay thế bằng sữa đậu nành",
    image: "https://i.imgur.com/6YQ9Z3z.jpg",
  },
  {
    id: 2,
    student: "Trần Hoàng Nam",
    class: "2B",
    allergies: ["Đậu phộng"],
    severity: "Trung bình",
    notes: "Tránh các món có đậu phộng và dầu đậu phộng",
    image: "https://i.imgur.com/wgJDypg.jpg",
  },
  {
    id: 3,
    student: "Phạm Tuấn Kiệt",
    class: "3A",
    allergies: ["Hải sản"],
    severity: "Cao",
    notes: "Dị ứng nặng với tôm, cua, ghẹ và các loại hải sản",
    image: "https://i.imgur.com/F8QXfXh.jpg",
  },
  {
    id: 4,
    student: "Lê Thu Hà",
    class: "1A",
    allergies: ["Gluten"],
    severity: "Trung bình",
    notes: "Không dùng các món có bột mì, bánh mì",
    image: "https://i.imgur.com/KWaVOLR.jpg",
  },
];

export const dietaryRestrictions = [
  {
    id: 1,
    student: "Lê Thu Hà",
    class: "1A",
    restriction: "Ăn kiêng đường",
    notes: "Hạn chế đồ ngọt và đường tinh luyện",
    image: "https://i.imgur.com/KWaVOLR.jpg",
  },
  {
    id: 2,
    student: "Vũ Hoàng Long",
    class: "2B",
    restriction: "Ăn chay",
    notes: "Không ăn thịt, cá và các sản phẩm từ động vật",
    image: "https://i.imgur.com/wgJDypg.jpg",
  },
];

export const commonAllergens = [
  {
    name: "Sữa",
    count: 1,
  },
  {
    name: "Đậu phộng",
    count: 1,
  },
  {
    name: "Hải sản",
    count: 1,
  },
  {
    name: "Gluten",
    count: 1,
  },
  {
    name: "Trứng",
    count: 0,
  },
  {
    name: "Đậu nành",
    count: 0,
  },
];

export const menuLibrary = [
  {
    id: 1,
    name: "Thực đơn tuần 42/2023",
    description: "Thực đơn cân bằng dinh dưỡng với các món ăn phổ biến",
    dishes: 10,
    rating: 4.8,
    lastUsed: "10/10/2023",
  },
  {
    id: 2,
    name: "Thực đơn mùa hè",
    description: "Thực đơn nhẹ nhàng, tươi mát cho mùa hè",
    dishes: 12,
    rating: 4.5,
    lastUsed: "15/07/2023",
  },
  {
    id: 3,
    name: "Thực đơn đặc biệt",
    description: "Thực đơn cho các dịp lễ đặc biệt",
    dishes: 8,
    rating: 4.7,
    lastUsed: "02/09/2023",
  },
];

export const statsData = [
  { value: 50, label: "Trường học", suffix: "+" },
  { value: 5000, label: "Phụ huynh", suffix: "+" },
  { value: 10000, label: "Bữa ăn/ngày", suffix: "+" },
  { value: 99, label: "Hài lòng", suffix: "%" },
];