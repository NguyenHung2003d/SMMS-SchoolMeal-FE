"use client";
import { Label } from "@/components/ui/label";
import { ContactFormData } from "@/types/auth";
import {
  Building,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { useState, useTransition } from "react";

const Contact = () => {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    schoolName: "",
    availableTime: "",
    message: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  const isFormValid =
    formData.name &&
    formData.email &&
    formData.phoneNumber &&
    formData.schoolName &&
    formData.availableTime &&
    formData.message;
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bên trái */}
          <div className="lg:pr-8">
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Chúng tôi luôn sẵn sàng hỗ trợ!
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Quý phụ huynh có thể liên hệ để được tư vấn và hỗ trợ tốt nhất
                về các dịch vụ quản lý bữa ăn học sinh. Vui lòng điền biểu mẫu
                hoặc sử dụng các kênh liên hệ dưới đây.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:bg-white/90 transition-all duration-300 ">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex justify-center items-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hỗ trợ Email</h3>
                  <p className="text-gray-600">Liên hệ qua địa chỉ email</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:bg-white/90 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Hỗ trợ qua điện thoại
                  </h3>
                  <p className="text-gray-600">
                    Tư vấn trực tiếp cho phụ huynh
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:bg-white/90 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Thời gian linh hoạt
                  </h3>
                  <p className="text-gray-600">
                    Sẵn sàng hỗ trợ theo khung giờ của phụ huynh
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bên phải - Form liên hệ */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Liên hệ với chúng tôi
              </h2>
              <p className="text-gray-600">
                Vui lòng điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm
                nhất.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <Label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Họ và tên *
                  </Label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-800 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Nhập họ và tên phụ huynh"
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-800 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="ví dụ: phuhuynh@gmail.com"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-800 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="VD: 090xxxxxxx"
                  />
                </div>

                <div className="group">
                  <label
                    htmlFor="schoolName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <Building className="w-4 h-4 inline mr-2" />
                    Tên trường *
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-800 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Nhập tên trường"
                  />
                </div>
              </div>
              <div className="group">
                <label
                  htmlFor="availableTime"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Thời gian thuận tiện *
                </label>
                <select
                  id="availableTime"
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-800 focus:bg-white transition-all duration-300 text-gray-900"
                >
                  <option value="">Chọn khung giờ phù hợp</option>
                  <option value="morning">Buổi sáng (8:00 - 12:00)</option>
                  <option value="afternoon">Buổi chiều (13:00 - 17:00)</option>
                  <option value="evening">Buổi tối (18:00 - 21:00)</option>
                  <option value="weekend">Cuối tuần</option>
                  <option value="flexible">Linh hoạt</option>
                </select>
              </div>
              <div className="group">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Nội dung
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-800 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 resize-none"
                  placeholder="Quý phụ huynh vui lòng chia sẻ nhu cầu và mong muốn..."
                ></textarea>
              </div>
              {/* Nút gửi */}
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Gửi liên hệ</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
