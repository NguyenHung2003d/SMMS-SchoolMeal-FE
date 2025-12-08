"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

gsap.registerPlugin(ScrollTrigger);

const ContactPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-hero-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(".info-card", {
        scrollTrigger: {
          trigger: ".contact-content",
          start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.5)",
      });

      gsap.from(".contact-form-wrapper", {
        scrollTrigger: {
          trigger: ".contact-content",
          start: "top 80%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: "Văn phòng chính",
      content: "123 Đường Sức Khỏe, Quận Cam, TP. Hồ Chí Minh",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: <Phone size={24} />,
      title: "Hotline hỗ trợ",
      content: "1900 123 456",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <Mail size={24} />,
      title: "Email liên hệ",
      content: "hotro@edumeal.vn",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: <Clock size={24} />,
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 6: 08:00 - 17:30",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="overflow-hidden bg-white">
      <Navbar />

      <main ref={containerRef} className="pt-20 min-h-screen">
        {/* --- HERO SECTION --- */}
        <section className="relative py-20 bg-orange-50/50 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

          <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 text-orange-600 font-bold text-sm uppercase tracking-wider mb-6 shadow-sm contact-hero-text">
              <MessageCircle size={16} />
              <span>Chúng tôi luôn lắng nghe</span>
            </div>
            <h1 className="contact-hero-text text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Liên hệ với <span className="text-orange-500">EduMeal</span>
            </h1>
            <p className="contact-hero-text text-lg text-gray-500 max-w-2xl mx-auto">
              Bạn có thắc mắc về thực đơn, quy trình hay muốn hợp tác cùng chúng
              tôi? Đừng ngần ngại để lại lời nhắn nhé!
            </p>
          </div>
        </section>

        {/* --- CONTENT SECTION (Grid) --- */}
        <section className="contact-content py-16 px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12">
              {/* LEFT COLUMN: Contact Info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-orange-100 border border-orange-50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">
                    Thông tin liên hệ
                  </h3>
                  <div className="space-y-6">
                    {contactInfo.map((item, index) => (
                      <div
                        key={index}
                        className="info-card flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-300 group cursor-default"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.color}`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg mb-1">
                            {item.title}
                          </p>
                          <p className="text-gray-500 font-medium">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional: Map Placeholder or Image */}
                <div className="info-card relative h-64 rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 bg-orange-50 group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/city-fields.png')] opacity-20"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <MapPin
                      size={48}
                      className="text-orange-400 mb-2 group-hover:animate-bounce"
                    />
                    <p className="font-bold text-gray-400">
                      Bản đồ đang cập nhật
                    </p>
                    <a
                      href="#"
                      className="mt-4 px-4 py-2 bg-white text-orange-600 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all"
                    >
                      Xem trên Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Form */}
              <div className="lg:col-span-7">
                <div className="contact-form-wrapper bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-orange-500/10 border border-gray-100 relative overflow-hidden">
                  {/* Form Background Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-[100%] -mr-16 -mt-16 z-0" />

                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      Gửi tin nhắn
                    </h3>
                    <p className="text-gray-500 mb-8">
                      Chúng tôi sẽ phản hồi sớm nhất có thể.
                    </p>

                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập tên của bạn"
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-700 placeholder-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            placeholder="090..."
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-700 placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="vidu@email.com"
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-700 placeholder-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">
                          Nội dung nhắn
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Bạn cần hỗ trợ gì..."
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-700 placeholder-gray-400 resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="button"
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        <span>Gửi tin nhắn</span>
                        <Send
                          size={20}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
