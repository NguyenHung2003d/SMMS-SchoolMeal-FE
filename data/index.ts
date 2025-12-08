import {
  Calendar,
  User,
  Activity,
  FileText,
  Receipt,
  FileEdit,
  Image,
} from "lucide-react";

export const images = [
  {
    image: "/hero_section.png",
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

export const ALLERGY_LIST: string[] = [
  "Sữa bò",
  "Trứng",
  "Đậu phộng (lạc)",
  "Hải sản",
  "Cá",
  "Đậu nành",
  "Mè / Vừng",
  "Lúa mì (gluten)",
  "Hạt điều",
  "Hạnh nhân",
];


export const features = [
  {
    id: 1,
    icon: "utensils",
    title: "Đặt Món Online",
    subtitle: "Chọn thực đơn nhanh chóng, không lo xếp hàng",
    color: "from-blue-500 to-blue-600",
    bgClass: "bg-blue-50/80 hover:bg-blue-100",
    accentColor: "text-blue-600",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop",
    details: {
      title: "Đặt Món Thông Minh",
      description: "Hệ thống giúp phụ huynh và học sinh xem và chọn trước bữa trưa yêu thích cho cả tuần.",
      benefits: [
        "Menu đa dạng cập nhật hàng tuần",
        "Đặt trước để giữ suất yêu thích",
        "Lưu món tủ để đặt lại nhanh",
        "Hủy món linh hoạt trước giờ chốt",
      ],
      mockupFeatures: [
        "Giao diện lịch trực quan",
        "Hình ảnh món ăn thực tế",
        "Thông tin nguyên liệu",
        "Lên lịch ăn cả tuần",
      ],
    },
  },
  {
    id: 2,
    icon: "activity",
    title: "Dinh Dưỡng & AI",
    subtitle: "Phân tích calo, cân bằng dưỡng chất",
    color: "from-green-500 to-green-600",
    bgClass: "bg-green-50/80 hover:bg-green-100",
    accentColor: "text-green-600",
    // Ảnh: Đĩa ăn dinh dưỡng cân bằng
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop",
    details: {
      title: "Theo Dõi Dinh Dưỡng",
      description: "Hệ thống tự động tính toán khẩu phần ăn để đảm bảo học sinh phát triển thể chất toàn diện.",
      benefits: [
        "Công khai bảng thành phần dinh dưỡng",
        "Cảnh báo thực phẩm gây dị ứng",
        "Gợi ý menu cân bằng rau/thịt",
        "Báo cáo dinh dưỡng hàng tháng",
      ],
      mockupFeatures: [
        "Biểu đồ Kcal tiêu thụ",
        "Nhãn cảnh báo dị ứng",
        "Lịch sử dinh dưỡng",
        "Khuyến nghị từ chuyên gia",
      ],
    },
  },
  {
    id: 3,
    icon: "receipt",
    title: "Lịch Sử & Chi Phí",
    subtitle: "Minh bạch hóa đơn, đối soát dễ dàng",
    color: "from-purple-500 to-purple-600",
    bgClass: "bg-purple-50/80 hover:bg-purple-100",
    accentColor: "text-purple-600",
    // Ảnh: Phụ huynh xem điện thoại (kiểm tra app)
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1470&auto=format&fit=crop",
    details: {
      title: "Quản Lý Chi Tiêu Minh Bạch",
      description: "Phụ huynh dễ dàng theo dõi lịch sử ăn uống của con và tổng hợp chi phí để thanh toán chính xác.",
      benefits: [
        "Xem lịch sử điểm danh ăn trưa",
        "Báo cáo tổng tiền theo tháng",
        "Thông báo nhắc đóng phí tự động",
        "Xuất hóa đơn đối soát chi tiết",
      ],
      mockupFeatures: [
        "Lịch sử giao dịch",
        "Trạng thái thanh toán",
        "Thống kê suất ăn đã hủy",
        "Tích hợp QR chuyển khoản",
      ],
    },
  },
  {
    id: 4,
    icon: "message",
    title: "Phản Hồi Bữa Ăn",
    subtitle: "Đánh giá món ăn, kết nối nhà trường",
    color: "from-orange-500 to-orange-600",
    bgClass: "bg-orange-50/80 hover:bg-orange-100",
    accentColor: "text-orange-600",
    // Ảnh: Trẻ em vui vẻ ăn uống (thể hiện sự hài lòng)
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1470&auto=format&fit=crop",
    details: {
      title: "Lắng Nghe & Cải Thiện",
      description: "Cầu nối giúp nhà trường lắng nghe ý kiến của học sinh và phụ huynh để nâng cao chất lượng bếp ăn.",
      benefits: [
        "Chấm điểm món ăn sau khi ăn",
        "Gửi góp ý trực tiếp đến nhà bếp",
        "Khảo sát món ăn được yêu thích",
        "Theo dõi phản hồi từ nhà trường",
      ],
      mockupFeatures: [
        "Hệ thống chấm sao (Rating)",
        "Form góp ý nhanh",
        "Thông báo thực đơn mới",
        "Tin tức từ bếp ăn",
      ],
    },
  },
];

export const menuItems = [
  {
    id: "register",
    icon: Calendar,
    label: "Đăng ký suất ăn",
    color: "text-blue-600",
    path: "/parent/register-meal",
  },
  {
    id: "profile",
    icon: User,
    label: "Cập nhật hồ sơ",
    color: "text-green-600",
    path: "/parent/update-profile",
  },
  {
    id: "health",
    icon: Activity,
    label: "Theo dõi sức khỏe",
    color: "text-red-600",
    path: "/parent/health",
  },
  {
    id: "menu_and_feedback",
    icon: FileText,
    label: "Xem thực đơn và đánh giá",
    color: "text-orange-600",
    path: "/parent/menu_and_feedback",
  },
  {
    id: "invoice",
    icon: Receipt,
    label: "Xem hóa đơn",
    color: "text-yellow-600",
    path: "/parent/invoices",
  },
  {
    id: "gallery",
    icon: Image,
    label: "Thư viện ảnh",
    color: "text-purple-600",
    path: "/parent/student_images",
  },

  {
    id: "leave",
    icon: FileEdit,
    label: "Đơn xin nghỉ",
    color: "text-pink-600",
    path: "/parent/leave",
  },
];
