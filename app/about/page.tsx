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
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ".hero-image",
          {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        );

      gsap.from(".mission-item", {
        scrollTrigger: {
          trigger: ".mission-section",
          start: "top 80%",
        },
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
          scrollTrigger: {
            trigger: stat,
            start: "top 85%",
          },
          onUpdate: function () {
            stat.innerHTML = Math.ceil(stat.textContent).toLocaleString() + "+";
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const coreValues = [
    {
      icon: <ShieldCheck size={40} className="text-orange-500" />,
      title: "An toàn tuyệt đối",
      desc: "Quy trình chế biến đạt chuẩn vệ sinh an toàn thực phẩm nghiêm ngặt nhất.",
    },
    {
      icon: <ChefHat size={40} className="text-red-500" />,
      title: "Dinh dưỡng cân bằng",
      desc: "Thực đơn được tư vấn bởi các chuyên gia dinh dưỡng hàng đầu cho trẻ em.",
    },
    {
      icon: <Heart size={40} className="text-pink-500" />,
      title: "Yêu thương trọn vẹn",
      desc: "Mỗi bữa ăn đều được chuẩn bị với tình yêu thương như người mẹ nấu cho con.",
    },
  ];

  return (
    <div className="overflow-hidden">
      <Navbar />

      <main ref={containerRef} className="bg-white pt-20">
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-orange-50/50">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-multiply" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 mix-blend-multiply" />

          <div className="container max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-sm uppercase tracking-wider hero-desc">
                <Sparkles size={16} />
                <span>Câu chuyện của chúng tôi</span>
              </div>

              <h1 className="hero-title text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                Gieo mầm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
                  Sức khỏe
                </span>{" "}
                cho tương lai.
              </h1>

              <p className="hero-desc text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                EduMeal ra đời với sứ mệnh đồng hành cùng phụ huynh và nhà
                trường, mang đến những bữa ăn học đường không chỉ ngon miệng mà
                còn đầy đủ dưỡng chất, giúp trẻ phát triển toàn diện.
              </p>

              <div className="hero-desc pt-4 flex gap-4 justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  Liên hệ ngay <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            <div className="hero-image relative">
              <div className="relative aspect-square w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-pink-100 rounded-[3rem] rotate-3 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
                  <span className="text-9xl">🥗</span>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce duration-[3000ms]">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <Target size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        Mục tiêu
                      </p>
                      <p className="font-bold text-gray-800">
                        1 Triệu bữa ăn ngon
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
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Tại sao chọn <span className="text-orange-500">EduMeal?</span>
              </h2>
              <p className="text-gray-500 text-lg">
                Chúng tôi không chỉ nấu ăn, chúng tôi gửi gắm sự quan tâm vào
                từng khay cơm để mỗi ngày đến trường của bé là một ngày vui
                khỏe.
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

        <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <p className="stat-number text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-yellow-200">
                  50
                </p>
                <p className="text-gray-400 font-medium">Trường học đối tác</p>
              </div>
              <div className="space-y-2">
                <p className="stat-number text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-pink-200">
                  5000
                </p>
                <p className="text-gray-400 font-medium">Suất ăn mỗi ngày</p>
              </div>
              <div className="space-y-2">
                <p className="stat-number text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-teal-200">
                  100
                </p>
                <p className="text-gray-400 font-medium">Đối tác nông trại</p>
              </div>
              <div className="space-y-2">
                <p className="stat-number text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-200">
                  99
                </p>
                <p className="text-gray-400 font-medium">
                  % Phụ huynh hài lòng
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="bg-orange-50 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="relative h-96 w-full rounded-[2rem] overflow-hidden shadow-xl bg-gray-200 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20 text-white">
                    <p className="font-bold text-xl">Đội ngũ EduMeal</p>
                    <p className="text-sm opacity-80">
                      Tận tâm vì sức khỏe trẻ thơ
                    </p>
                  </div>
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-white">
                    👨‍🍳👩‍⚕️
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 space-y-6">
                <div className="flex items-center gap-2 text-orange-600 font-bold">
                  <Users /> <span>Đội ngũ của chúng tôi</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Kết hợp giữa <br />
                  <span className="italic text-gray-500">
                    Kinh nghiệm & Tình yêu
                  </span>
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Đội ngũ của EduMeal bao gồm các chuyên gia dinh dưỡng, đầu bếp
                  lành nghề và những nhà giáo dục tâm huyết. Chúng tôi làm việc
                  không ngừng nghỉ để đảm bảo mỗi bữa ăn đến tay các em học sinh
                  đều là một tác phẩm của sự cân bằng dinh dưỡng và hương vị
                  tuyệt vời.
                </p>
                <ul className="space-y-3">
                  {[
                    "Nguyên liệu tươi sạch 100%",
                    "Menu thay đổi theo tuần",
                    "Kiểm soát calo chuẩn xác",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-700 font-medium"
                    >
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
