"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  ShieldCheck,
  ChefHat,
  Target,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(
          ".hero-desc",
          { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .from(
          ".hero-image",
          { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)" },
          "-=0.5"
        );

      gsap.from(".mission-item", {
        scrollTrigger: { trigger: ".mission-section", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.utils.toArray(".stat-number").forEach((stat: any) => {
        gsap.from(stat, {
          textContent: 0,
          duration: 2,
          ease: "power1.out",
          snap: { textContent: 1 },
          stagger: 1,
          scrollTrigger: { trigger: stat, start: "top 85%" },
          onUpdate: function () {
            stat.innerHTML = Math.ceil(stat.textContent).toLocaleString() + "+";
          },
        });
      });

      gsap.from(".process-step", {
        scrollTrigger: { trigger: ".process-section", start: "top 75%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const coreValues = [
    {
      icon: <ShieldCheck size={40} className="text-orange-500" />,
      title: "An toàn tuyệt đối",
      desc: "Quy trình chế biến đạt chuẩn vệ sinh an toàn thực phẩm nghiêm ngặt nhất (HACCP/ISO).",
    },
    {
      icon: <ChefHat size={40} className="text-red-500" />,
      title: "Dinh dưỡng cân bằng",
      desc: "Thực đơn được tư vấn bởi các chuyên gia dinh dưỡng từ Viện Dinh Dưỡng Quốc Gia.",
    },
    {
      icon: <Heart size={40} className="text-pink-500" />,
      title: "Yêu thương trọn vẹn",
      desc: "Mỗi bữa ăn đều được chuẩn bị với tình yêu thương như người mẹ nấu cho con.",
    },
  ];

  return (
    <div className="overflow-hidden bg-white">
      <Navbar />

      <main ref={containerRef} className="pt-20">
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-orange-50/50">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-multiply" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 mix-blend-multiply" />

          <div className="container max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-sm uppercase tracking-wider hero-desc">
                <Sparkles size={16} />
                <span>Câu chuyện của EduMeal</span>
              </div>

              <h1 className="hero-title text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                Gieo mầm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
                  Sức khỏe
                </span>{" "}
                cho tương lai Việt.
              </h1>

              <p className="hero-desc text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Chúng tôi không chỉ cung cấp bữa ăn, EduMeal mang đến giải pháp
                dinh dưỡng học đường toàn diện, giúp trẻ phát triển tối đa về
                thể chất và trí tuệ.
              </p>

              <div className="hero-desc pt-4 flex gap-4 justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  Liên hệ ngay <ArrowRight size={20} />
                </Link>
                <Link
                  href="/menu"
                  className="px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                >
                  Xem thực đơn
                </Link>
              </div>
            </div>

            <div className="hero-image relative">
              <div className="relative aspect-square w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-pink-100 rounded-[3rem] rotate-3 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center group">
                  <Image
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop"
                    alt="Bữa ăn dinh dưỡng"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce duration-[3000ms] z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <Target size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        Mục tiêu 2025
                      </p>
                      <p className="font-bold text-gray-800">
                        1 Triệu suất ăn ngon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 mission-section">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-2 block">
                Giá trị cốt lõi
              </span>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Tại sao chọn <span className="text-orange-500">EduMeal?</span>
              </h2>
              <p className="text-gray-500 text-lg">
                Chúng tôi cam kết mang đến sự an tâm tuyệt đối cho nhà trường và
                phụ huynh thông qua 3 trụ cột chính.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {coreValues.map((item, index) => (
                <div
                  key={index}
                  className="mission-item group bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-pink-50 rounded-bl-[100%] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
