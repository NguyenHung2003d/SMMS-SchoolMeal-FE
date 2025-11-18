import {
  FoodMenuItem,
  ParentFeedback,
} from "@/types";
import {
  Calendar,
  User,
  Activity,
  FileText,
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

export const menuItems = [
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